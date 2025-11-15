import apiClient from "@/lib/axios";
import type { ProductsResponse } from "@/types/product";

export async function fetchProducts(): Promise<ProductsResponse> {
	const response = await apiClient.get<ProductsResponse>("/products");
	return response.data;
}
