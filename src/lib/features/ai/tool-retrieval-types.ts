import type { SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";

export type AiRouteStatus = "active-route" | "category-only" | "redirected";

export type AiToolTier = "free" | "premium" | "premium-schema";

export type AiLocalizedKeywords = Partial<Record<SupportedLocale, readonly string[]>>;

export type AiToolIndexRecord = {
  readonly slug: string;
  readonly title: Record<string, string>;
  readonly description: Record<string, string>;
  readonly localeUrls: Record<string, string>;
  readonly canonicalUrl: string;
  readonly categorySlug: string;
  readonly categoryTitle: Record<string, string>;
  readonly tier: AiToolTier;
  readonly routeStatus: AiRouteStatus;
  readonly keywords: AiLocalizedKeywords;
  readonly intent: readonly string[];
  readonly industries: readonly string[];
  readonly formula?: string;
  readonly pain?: string;
  readonly source?: string;
  readonly isFinanceLike: boolean;
};

export type AiCategoryIndexRecord = {
  readonly slug: string;
  readonly title: Record<string, string>;
  readonly summary: Record<string, string>;
  readonly toolCount: number;
  readonly categoryUrl: Record<string, string>;
};

export type AiToolIndexDocument = {
  readonly site: "SectorCalc";
  readonly baseUrl: "https://sectorcalc.com";
  readonly generatedAt: string;
  readonly totalTools: number;
  readonly totalActiveRoutes: number;
  readonly totalCategoryOnly: number;
  readonly totalRedirected: number;
  readonly locales: readonly SupportedLocale[];
  readonly categories: readonly AiCategoryIndexRecord[];
  readonly tools: readonly AiToolIndexRecord[];
};

export type AiToolRoutesDocument = {
  readonly generatedAt: string;
  readonly activeRoutes: readonly {
    readonly slug: string;
    readonly routePath: string;
    readonly localeUrls: Record<string, string>;
    readonly tier: AiToolTier;
  }[];
  readonly categoryOnly: readonly {
    readonly slug: string;
    readonly categorySlug: string;
    readonly anchorId: string;
    readonly canonicalUrl: Record<string, string>;
  }[];
  readonly redirected: readonly {
    readonly slug: string;
    readonly fromPath: string;
    readonly toPath: string;
    readonly localeUrls: Record<string, string>;
  }[];
};

export type AiSearchManifestDocument = {
  readonly version: "1.0";
  readonly retrievalMode: "metadata-keyword-rag-lite";
  readonly futureEmbeddingReady: true;
  readonly maxRecommendedResults: 8;
  readonly searchFields: readonly string[];
  readonly rankingWeights: Record<string, number>;
  readonly embeddingSimilarity: {
    readonly status: "reserved";
    readonly enabled: false;
    readonly note: string;
  };
};

export type AiToolSearchResult = {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly canonicalUrl: string;
  readonly categorySlug: string;
  readonly categoryTitle: string;
  readonly tier: AiToolTier;
  readonly routeStatus: AiRouteStatus;
  readonly score: number;
  readonly matchReasons: readonly string[];
};

export type AiToolSearchOptions = {
  readonly limit?: number;
  readonly tier?: "free" | "premium" | "all";
  readonly categorySlug?: string;
  readonly routeStatus?: "active-route" | "category-only" | "all";
};
