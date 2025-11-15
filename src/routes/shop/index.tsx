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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Shop</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm">
            <img
              src={product.image.uri}
              alt={product.image.alt || product.title}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <p className="text-gray-600 mb-2">{product.type}</p>
            <div className="flex flex-wrap gap-2">
              {product.currentTags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 px-2 py-1 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
