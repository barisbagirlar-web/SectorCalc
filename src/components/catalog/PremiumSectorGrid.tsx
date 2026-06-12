import { PremiumSectorCard, type PremiumSectorCardProps } from "@/components/catalog/PremiumSectorCard";

export type PremiumSectorGridProps = {
  readonly categories: readonly PremiumSectorCardProps[];
};

export function PremiumSectorGrid({ categories }: PremiumSectorGridProps) {
  return (
    <div className="sc-premium-sector-grid">
      {categories.map((category) => (
        <PremiumSectorCard key={category.slug} {...category} />
      ))}
    </div>
  );
}
