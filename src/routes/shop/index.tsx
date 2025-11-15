import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/shop";

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
        <li key={product.id}>
          <Link to={`/shop/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  );
}
