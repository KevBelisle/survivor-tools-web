import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchProduct } from "@/services/shop";

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
    <div>
      <h1>{data.details.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: data.details.description }} />
    </div>
  );
}
