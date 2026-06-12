import { PremiumToolCard } from "@/components/catalog/PremiumToolCard";
import type { CategorizedToolItem } from "@/lib/catalog/build-categorized-tool-index";

export type PremiumToolGridProps = {
  readonly tools: readonly CategorizedToolItem[];
  readonly locale: string;
  readonly openLabel: string;
  readonly preparingLabel: string;
};

export function PremiumToolGrid({
  tools,
  locale,
  openLabel,
  preparingLabel,
}: PremiumToolGridProps) {
  if (tools.length === 0) {
    return null;
  }

  return (
    <div className="sc-premium-tool-grid">
      {tools.map((tool) => (
        <PremiumToolCard
          key={`${tool.source}-${tool.slug}`}
          tool={tool}
          locale={locale}
          openLabel={openLabel}
          preparingLabel={preparingLabel}
        />
      ))}
    </div>
  );
}
