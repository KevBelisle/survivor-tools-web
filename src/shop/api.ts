import apiClient from "@/lib/axios";
import type { ProductsResponse, ProductDetailResponse } from "@/shop/types";

export async function fetchProducts(): Promise<ProductsResponse> {
  const response = await apiClient.get<ProductsResponse>("/products");
  return response.data;
}

export async function fetchProduct(
  productId: string,
): Promise<ProductDetailResponse> {
  const response = await apiClient.get<ProductDetailResponse>(
    `/products/${productId}`,
  );
  return response.data;
}
