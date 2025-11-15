import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/shop";
import { Container, Heading, VStack, Box } from "@chakra-ui/react";

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
    <Container maxW="container.lg" py={8}>
      <Heading as="h1" size="2xl" mb={6}>
        Products
      </Heading>
      <VStack gap={2}>
        {data.products.map((product) => (
          <Link to={`/shop/${product.id}`}>{product.title}</Link>
        ))}
      </VStack>
    </Container>
  );
}
