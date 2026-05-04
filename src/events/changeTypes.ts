import type { EventChangeType } from "@/events/types";

export const CHANGE_TYPE_META: Record<
	EventChangeType,
	{ label: string; sectionLabel: string; colorPalette: string }
> = {
	new_product: {
		label: "New",
		sectionLabel: "new products",
		colorPalette: "purple",
	},
	restock: {
		label: "Restocked",
		sectionLabel: "restocked products",
		colorPalette: "green",
	},
	price_decrease: {
		label: "Price ↓",
		sectionLabel: "price decreases",
		colorPalette: "teal",
	},
	price_increase: {
		label: "Price ↑",
		sectionLabel: "price increases",
		colorPalette: "orange",
	},
};

export const CHANGE_TYPE_ORDER: EventChangeType[] = [
	"new_product",
	"restock",
	"price_decrease",
	"price_increase",
];

export const CHANGE_TYPE_PRIORITY: Record<EventChangeType, number> = {
	new_product: 0,
	restock: 1,
	price_decrease: 2,
	price_increase: 3,
};
