import { useMemo } from "react";
import { createFileRoute, retainSearchParams } from "@tanstack/react-router";
import { fetchProducts } from "@/shop/api";
import { ProductMasonry } from "@/shop/components/MasonryLayout";
import {
  SkeletonProductMasonry,
  SkeletonSearchBar,
} from "@/shop/components/Skeletons";
import { useSuspenseQuery } from "@tanstack/react-query";
import useFuse from "@/hooks/useFuse";
import { SearchBar } from "@/shop/components/SearchBar";

type ProductSearch = {
  query: string;
  sort: string;
  states: string[];
  tags: string[];
  types: string[];
};

function parseArrayParam(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v) => typeof v === "string");
  }
  if (typeof value === "string" && value) {
    return value.split(",");
  }
  return [];
}

export const Route = createFileRoute("/shop/")({
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData({
      queryKey: ["products"],
      queryFn: fetchProducts,
    });
  },
  validateSearch: (search: Record<string, unknown>): ProductSearch => {
    // validate and parse the search params into a typed state
    return {
      query: (search.query as string) || "",
      sort: (search.sort as string) || "state",
      states: parseArrayParam(search.states),
      tags: parseArrayParam(search.tags),
      types: parseArrayParam(search.types),
    };
  },
  search: {
    middlewares: [retainSearchParams(true)],
  },
  pendingMs: 500,
  pendingMinMs: 350,
  pendingComponent: () => (
    <>
      <SkeletonSearchBar />
      <SkeletonProductMasonry />
    </>
  ),
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const {
    query,
    sort,
    states,
    tags: selectedTags,
    types: selectedTypes,
  }: ProductSearch = Route.useSearch();

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    data.products.forEach((product) => {
      product.currentTags.forEach((tag) => tag && tags.add(tag));
      product.previousTags.forEach((tag) => tag && tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [data.products]);

  const allTypes = useMemo(() => {
    const types = new Set<string>();
    data.products.forEach((product) => {
      if (product.type) types.add(product.type);
    });
    return Array.from(types).sort();
  }, [data.products]);

  // Apply text search with Fuse.js first (on stable data.products to avoid rebuilding index)
  const fuseResults = useFuse(data.products, query, {
    keys: ["title"],
    minMatchCharLength: 3,
    threshold: 0.3,
  });

  const searchedProducts = useMemo(() => {
    if (query.length >= 3) {
      return fuseResults
        .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
        .map((a) => a.item);
    }
    return data.products;
  }, [fuseResults, query, data.products]);

  // Map URL filter values to API state values
  const stateMap: Record<string, string> = {
    instock: "inStock",
    outofstock: "outOfStock",
    unlisted: "unlisted",
  };

  // Filter products by states, tags, and types
  const filteredProducts = useMemo(() => {
    return searchedProducts.filter((product) => {
      // Filter by state
      if (states.length > 0) {
        const mappedStates = states.map((s) => stateMap[s]);
        if (!mappedStates.includes(product.state)) {
          return false;
        }
      }

      // Filter by tags (product must have at least one of the selected tags)
      if (selectedTags.length > 0) {
        const productTags = [...product.currentTags, ...product.previousTags];
        if (!selectedTags.some((tag) => productTags.includes(tag))) {
          return false;
        }
      }

      // Filter by types
      if (selectedTypes.length > 0) {
        if (!selectedTypes.includes(product.type)) {
          return false;
        }
      }

      return true;
    });
  }, [searchedProducts, states, selectedTags, selectedTypes]);

  // Sort products
  const products = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sort) {
      case "name":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "firstSeenAtAsc":
        sorted.sort(
          (a, b) =>
            new Date(a.firstSeenAt).getTime() -
            new Date(b.firstSeenAt).getTime(),
        );
        break;
      case "firstSeenAtDesc":
        sorted.sort(
          (a, b) =>
            new Date(b.firstSeenAt).getTime() -
            new Date(a.firstSeenAt).getTime(),
        );
        break;
      case "state":
      default:
        // Sort by state: inStock first, then outOfStock, then unlisted
        const stateOrder = { inStock: 0, outOfStock: 1, unlisted: 2 };
        sorted.sort((a, b) => stateOrder[a.state] - stateOrder[b.state]);
        break;
    }
    return sorted;
  }, [filteredProducts, sort]);

  return (
    <>
      <SearchBar tags={allTags} types={allTypes} />
      <ProductMasonry products={products} />
    </>
  );
}
