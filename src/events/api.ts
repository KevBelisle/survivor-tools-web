import apiClient from "@/lib/axios";
import type { EventsResponse, SalesEvent } from "@/events/types";

export async function fetchEvents(): Promise<EventsResponse> {
	const response = await apiClient.get<EventsResponse>("/events");
	return response.data;
}

export async function fetchEvent(id: number): Promise<SalesEvent> {
	const response = await apiClient.get<SalesEvent>(`/events/${id}`);
	return response.data;
}
