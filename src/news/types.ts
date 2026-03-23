export type NewsSource = "kickstarter" | "newsletter";

export interface NewsItemSummary {
	id: number;
	source: NewsSource;
	sourceLabel: string;
	sourceUrl: string | null;
	title: string;
	publishedAt: string;
	bodyText: string | null;
}

export interface NewsItemDetail extends NewsItemSummary {
	bodyHtml: string;
}

export interface NewsItemsResponse {
	items: NewsItemSummary[];
}
