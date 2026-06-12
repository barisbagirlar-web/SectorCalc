import { Link } from "@/i18n/routing";
import { getCategoryIcon } from "@/lib/catalog/category-icon-map";

export type PremiumSectorCardProps = {
  readonly href: string;
  readonly title: string;
  readonly countLabel: string;
  readonly categorySlug: string;
};

export function PremiumSectorCard({
  href,
  title,
  countLabel,
  categorySlug,
}: PremiumSectorCardProps) {
  const Icon = getCategoryIcon(categorySlug);

  return (
    <Link href={href} prefetch={false} className="sc-premium-category-card">
      <Icon aria-hidden="true" className="sc-premium-category-icon" strokeWidth={1.9} />
      <h3 className="sc-premium-category-title">{title}</h3>
      <p className="sc-premium-category-count">{countLabel}</p>
    </Link>
  );
}
