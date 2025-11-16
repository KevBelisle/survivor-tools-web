import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchProduct } from "@/shop/api";
import { Container, Heading, Box } from "@chakra-ui/react";

export const Route = createFileRoute("/shop/$productId")({
  loader: ({ context: { queryClient }, params }) => {
    return queryClient.ensureQueryData({
      queryKey: ["product", params.productId],
      queryFn: () => fetchProduct(params.productId),
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { productId } = Route.useParams();
  const { data } = useSuspenseQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
  });

  return (
    <Container maxW="container.lg" py={8}>
      <Heading as="h1" size="2xl" mb={6}>
        {data.details.title}
      </Heading>
      <Box
        dangerouslySetInnerHTML={{ __html: data.details.description }}
        css={{
          "& p": { marginBottom: "1rem" },
          "& ul, & ol": { marginLeft: "1.5rem", marginBottom: "1rem" },
          "& h2": {
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginTop: "1.5rem",
            marginBottom: "0.75rem",
          },
          "& h3": {
            fontSize: "1.25rem",
            fontWeight: "bold",
            marginTop: "1.25rem",
            marginBottom: "0.5rem",
          },
        }}
      />
    </Container>
  );
}
