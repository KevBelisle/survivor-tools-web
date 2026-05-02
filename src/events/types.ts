import type { ProductImage } from "@/shop/types";
import type { NewsSource } from "@/news/types";

export type EventChangeType =
	| "new_product"
	| "restock"
	| "price_increase"
	| "price_decrease";

export interface EventProductSummary {
	id: string;
	handle: string;
	title: string;
	primaryImage: ProductImage | null;
}

export interface EventProductChange {
	changeType: EventChangeType;
	oldValue: string | null;
	newValue: string | null;
	productId: string;
	variantId: string;
	recordedAt: string;
	product: EventProductSummary;
}

export interface EventNewsItem {
	id: number;
	title: string;
	publishedAt: string;
	source: NewsSource;
	sourceLabel: string;
}

export interface SalesEvent {
	id: number;
	startedAt: string;
	endedAt: string;
	productChanges: EventProductChange[];
	newsItems: EventNewsItem[];
}

export interface EventsResponse {
	events: SalesEvent[];
}
