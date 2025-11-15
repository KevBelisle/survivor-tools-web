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
	state: string;
	image: ProductImage;
	type: string;
	currentTags: string[];
	previousTags: string[];
}

export interface ProductsResponse {
	products: Product[];
}

export interface ProductDetailImage {
	imageId: string;
	alt: string | null;
	width: number;
	height: number;
	uri: string;
	previewUri: string;
	thumbnailUri: string;
}

export interface ProductDetails {
	id: string;
	handle: string;
	title: string;
	description: string;
	type: string;
	tags: string[];
	listed: boolean;
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

export interface ProductDetailResponse {
	details: ProductDetails;
	variants: ProductVariant[];
	images: ProductDetailImage[];
}
