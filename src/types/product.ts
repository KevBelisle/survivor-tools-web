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
