import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchProduct, fetchProductSnapshot } from "@/shop/api";
import { Container, Flex } from "@chakra-ui/react";
import { ProductDescription } from "@/shop/components/productPage/ProductDescription";
import { ProductImages } from "@/shop/components/productPage/ProductImages";
import { ProductVariants } from "@/shop/components/productPage/ProductVariants";

type ProductDetailSearch = {
  snapshotId?: string;
};

export const Route = createFileRoute("/shop/$productId")({
  validateSearch: (search: Record<string, unknown>): ProductDetailSearch => {
    return {
      snapshotId: search.snapshotId ? (search.snapshotId as string) : undefined,
    };
  },
  loaderDeps: ({ search: { snapshotId } }) => ({ snapshotId }),
  loader: ({ context: { queryClient }, params, deps: { snapshotId } }) => {
    const productPromise = queryClient.ensureQueryData({
      queryKey: ["product", params.productId],
      queryFn: () => fetchProduct(params.productId),
    });

    if (snapshotId) {
      const snapshotPromise = queryClient.ensureQueryData({
        queryKey: ["snapshot", snapshotId],
        queryFn: () => fetchProductSnapshot(snapshotId!),
      });
      return Promise.all([productPromise, snapshotPromise]);
    }

    return productPromise;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { productId } = Route.useParams();
  const { snapshotId }: ProductDetailSearch = Route.useSearch();

  const { data: productData } = useSuspenseQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
  });

  const { data: snapshotData } = useSuspenseQuery({
    queryKey: ["snapshot", snapshotId!],
    queryFn: () => (snapshotId ? fetchProductSnapshot(snapshotId!) : null),
  });

  // Use snapshot data if available, otherwise use product's current snapshot
  const displayData =
    snapshotId && snapshotData ? snapshotData : productData.snapshot;

  return (
    <Container maxW="container.lg" py={8}>
      <Flex direction="column" gap={8}>
        <ProductDescription
          productData={productData}
          displayData={displayData}
          snapshotId={snapshotId}
        />

        <ProductImages images={productData.images} />

        <ProductVariants variants={productData.variants} />
      </Flex>
    </Container>
  );
}
