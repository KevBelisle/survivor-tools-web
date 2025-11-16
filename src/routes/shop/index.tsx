import { createFileRoute } from "@tanstack/react-router";
import { fetchProducts } from "@/shop/api";
import { ProductMasonry } from "@/shop/components/MasonryLayout";
import { useSuspenseQuery } from "@tanstack/react-query";
import useFuse from "@/hooks/useFuse";

type ProductSearch = {
  query: string;
};

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
    };
  },
  pendingMs: 500,
  pendingMinMs: 500,
  pendingComponent: () => <div>Pending component</div>,
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const { query }: ProductSearch = Route.useSearch();

  const fuseFilteredProducts = useFuse(data.products, query, {
    keys: ["title"],
    minMatchCharLength: 3,
    threshold: 0.5,
  }).sort((a, b) => (a.score ?? 0) - (b.score ?? 0));

  const products =
    query.length >= 3 ? fuseFilteredProducts.map((a) => a.item) : data.products;

  return <ProductMasonry products={products} />;
}
