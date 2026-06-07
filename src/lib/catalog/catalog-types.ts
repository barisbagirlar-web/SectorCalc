export type CatalogRelatedPremiumItem = {
  readonly title: string;
  readonly href: string;
  readonly description?: string;
};

export type CatalogItemKind = "free-calculator" | "premium-analyzer";

export type CatalogItem = {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly meta?: string;
  readonly badge?: string;
  readonly ctaLabel?: string;
  readonly itemKind?: CatalogItemKind;
  readonly promise?: string;
  readonly reportSections?: readonly string[];
  readonly priceHint?: string;
  readonly primaryOutputLabel?: string;
  readonly relatedPremium?: readonly CatalogRelatedPremiumItem[];
};

export type CatalogGroup = {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly items: readonly CatalogItem[];
};

export type CategoryExplorerVariant =
  | "categories"
  | "free-tools"
  | "premium-tools"
  | "industries";

export type CategoryExplorerLabels = {
  readonly navLabel: string;
  readonly countLabel: (count: number) => string;
  readonly viewCategory: string;
  readonly viewCategoryOpen: string;
  readonly openItem: string;
};
