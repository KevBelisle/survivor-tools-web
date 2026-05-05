export interface ProductImage {
	imageId: string | null;
	alt: string;
	width: number;
	height: number;
	uri: string;
	previewUri: string | null;
	thumbnailUri: string | null;
}

export interface Product {
	id: string;
	title: string;
	state: "inStock" | "outOfStock" | "unlisted";
	firstSeenAt: string;
	image: ProductImage;
	type: string;
	currentTags: string[];
	previousTags: string[];
}

export interface ProductsResponse {
	products: Product[];
}

export interface Snapshot {
	id: string;
	snapshotAt: string;
	unlistedAt: string;
}

export interface SnapshotDetails extends Snapshot {
	handle: string;
	title: string;
	description: string;
	type: string;
	tags: string[];
}

export interface ProductVariantDetails {
	id: string;
	title: string;
	sku: string;
	fulfillmentService: string;
	grams: number;
}

export interface StockHistoryItem {
	timestamp: string;
	stock: number;
}

export interface PriceHistoryItem {
	timestamp: string;
	price: number;
}

export interface ProductVariant {
	details: ProductVariantDetails;
	stockHistory: StockHistoryItem[];
	priceHistory: PriceHistoryItem[];
}

export type ProductEventChangeType =
	| "new_product"
	| "restock"
	| "price_increase"
	| "price_decrease";

export interface ProductEventChange {
	changeType: ProductEventChangeType;
	oldValue: string | null;
	newValue: string | null;
	productId: string;
	variantId: string;
	recordedAt: string;
}

export interface ProductEventNewsItem {
	id: number;
	title: string;
	publishedAt: string;
	source: string;
	sourceLabel: string;
}

export interface ProductEvent {
	id: number;
	startedAt: string;
	endedAt: string;
	productChanges: ProductEventChange[];
	newsItems: ProductEventNewsItem[];
}

export interface ProductDetailResponse {
	id: string;
	handle: string;
	state: "inStock" | "outOfStock" | "unlisted";
	snapshot: SnapshotDetails;
	snapshots: Snapshot[];
	variants: ProductVariant[];
	images: ProductImage[];
	events: ProductEvent[];
}

export interface SnapshotDetailResponse extends SnapshotDetails {}
