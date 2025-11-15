import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/products";

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
    <ul>
      {data.products.map((product) => (
        <li key={product.id}>{product.title}</li>
      ))}
    </ul>
  );
}
