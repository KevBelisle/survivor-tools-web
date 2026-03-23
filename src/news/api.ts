import apiClient from "@/lib/axios";
import type {
	NewsItemsResponse,
	NewsItemDetail,
	NewsSource,
} from "@/news/types";

export async function fetchNewsItems(
	source?: NewsSource,
): Promise<NewsItemsResponse> {
	const params = source ? { source } : {};
	const response = await apiClient.get<NewsItemsResponse>("/news/items", {
		params,
	});
	return response.data;
}

export async function fetchNewsItem(id: number): Promise<NewsItemDetail> {
	const response = await apiClient.get<NewsItemDetail>(`/news/items/${id}`);
	return response.data;
}
