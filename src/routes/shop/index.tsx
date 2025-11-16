import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/shop/api";
import { Container, Grid } from "@chakra-ui/react";
import { ProductCard } from "@/shop/components/ProductCard";

export const Route = createFileRoute("/shop/")({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData({
      queryKey: ["products"],
      queryFn: fetchProducts,
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return (
    <Container>
      <Grid
        templateColumns={{
          base: "repeat(1, 320px)",
          sm: "repeat(2, 320px)",
          md: "repeat(3, 320px)",
          lg: "repeat(4, 320px)",
          xl: "repeat(5, 320px)",
          "2xl": "repeat(6, 320px)",
        }}
        gap="20px"
      >
        {data.products
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((product) => (
            <Link key={product.id} to={`/shop/${product.id}`}>
              <ProductCard product={product} />
            </Link>
          ))}
      </Grid>
    </Container>
  );
}
