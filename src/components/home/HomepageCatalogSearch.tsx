import type { CatalogSearchEntry } from "@/lib/catalog/catalog-search";
import { CatalogGroupedSearch } from "@/components/catalog/CatalogGroupedSearch";

type HomepageCatalogSearchProps = {
  entries: readonly CatalogSearchEntry[];
};

export function HomepageCatalogSearch({ entries }: HomepageCatalogSearchProps) {
  return (
    <CatalogGroupedSearch
      entries={entries}
      scope="homepage"
      className="sc-home-hybrid__catalog-search"
    />
  );
}
