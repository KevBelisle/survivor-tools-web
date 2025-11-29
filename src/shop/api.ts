import apiClient from "@/lib/axios";
import type {
  ProductsResponse,
  ProductDetailResponse,
  SnapshotDetailResponse,
} from "@/shop/types";

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

export async function fetchProductSnapshot(
  snapshotId: string,
): Promise<SnapshotDetailResponse> {
  const response = await apiClient.get<SnapshotDetailResponse>(
    `/snapshots/${snapshotId}`,
  );
  return response.data;
}
