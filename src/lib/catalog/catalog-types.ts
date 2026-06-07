export type CatalogItem = {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly meta?: string;
  readonly badge?: string;
  readonly ctaLabel?: string;
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
