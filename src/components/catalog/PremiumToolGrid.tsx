import { PremiumToolCard } from "@/components/catalog/PremiumToolCard";
import type { CategorizedToolItem } from "@/lib/catalog/build-categorized-tool-index";

export type PremiumToolGridProps = {
  readonly tools: readonly CategorizedToolItem[];
  readonly locale: string;
  readonly openLabel: string;
};

/** Text-based premium tool grid - 3-4 equal columns, symmetric. */
export function PremiumToolGrid({
  tools,
  locale,
  openLabel,
}: PremiumToolGridProps) {
  if (tools.length === 0) {
    return null;
  }

  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tools.map((tool) => (
        <li key={`${tool.source}-${tool.slug}`} className="min-w-0">
          <PremiumToolCard
            tool={tool}
            locale={locale}
            openLabel={openLabel}
          />
        </li>
      ))}
    </ul>
  );
}
