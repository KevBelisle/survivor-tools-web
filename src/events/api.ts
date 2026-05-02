import apiClient from "@/lib/axios";
import type { EventsResponse } from "@/events/types";

export async function fetchEvents(): Promise<EventsResponse> {
	const response = await apiClient.get<EventsResponse>("/events");
	return response.data;
}
