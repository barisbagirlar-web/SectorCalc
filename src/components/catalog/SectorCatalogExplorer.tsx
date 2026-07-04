import type {
  CatalogGroup,
  CategoryExplorerVariant,
} from "@/lib/catalog/catalog-types";

interface SectorCatalogExplorerProps {
  groups: readonly CatalogGroup[];
  variant: CategoryExplorerVariant;
}

export function SectorCatalogExplorer({
  groups,
  variant,
}: SectorCatalogExplorerProps) {
  if (groups.length === 0) {
    return (
      <section className="py-8">
        <p className="text-sm text-[#1A1915]/50">No categories available.</p>
      </section>
    );
  }

  return (
    <section className="py-8" aria-labelledby="catalog-explorer-heading">
      <h2
        id="catalog-explorer-heading"
        className="text-lg font-bold text-[#1A1915]"
      >
        {variant === "categories" ? "All Categories" : "Tool Catalog"}
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="rounded-lg border border-[#1A1915]/10 bg-[#F0EEE6] p-4"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#BD5D3A]">
              {group.label}
            </h3>
            {group.description && (
              <p className="mt-1 text-xs text-[#1A1915]/50">
                {group.description}
              </p>
            )}
            <ul className="mt-3 space-y-1">
              {group.items.map((item) => (
                <li key={item.href}>
                  <span className="text-sm text-[#1A1915]/70">
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SectorCatalogExplorer;
