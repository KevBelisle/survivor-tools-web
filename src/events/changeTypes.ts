import type { EventChangeType, EventProductChange } from "@/events/types";

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
		label: "Price ↘",
		sectionLabel: "price decreases",
		colorPalette: "teal",
	},
	price_increase: {
		label: "Price ↗",
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

/**
 * Dedupes product changes by `productId + changeType`, keeping the first
 * record per group. For restocks, combines all records of the same product
 * (across variants and repeat changes) so the kept record's oldValue/newValue
 * spans the cumulative quantity restocked during the event.
 */
export function dedupeProductChanges(
	changes: EventProductChange[],
): EventProductChange[] {
	const restockDeltas = new Map<string, number>();
	for (const c of changes) {
		if (c.changeType !== "restock") continue;
		if (c.oldValue === null || c.newValue === null) continue;
		const oldN = Number.parseInt(c.oldValue, 10);
		const newN = Number.parseInt(c.newValue, 10);
		if (!Number.isFinite(oldN) || !Number.isFinite(newN)) continue;
		const delta = newN - oldN;
		if (delta <= 0) continue;
		restockDeltas.set(c.productId, (restockDeltas.get(c.productId) ?? 0) + delta);
	}

	const seen = new Set<string>();
	const out: EventProductChange[] = [];
	for (const c of changes) {
		const key = `${c.productId}-${c.changeType}`;
		if (seen.has(key)) continue;
		seen.add(key);
		if (c.changeType === "restock") {
			const totalDelta = restockDeltas.get(c.productId);
			if (totalDelta !== undefined && totalDelta > 0) {
				out.push({
					...c,
					oldValue: "0",
					newValue: String(totalDelta),
				});
				continue;
			}
		}
		out.push(c);
	}
	return out;
}
