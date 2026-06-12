import { Link } from "@/i18n/routing";
import { resolvePremiumCategoryIcon } from "@/lib/catalog/premium-category-icons";

export type PremiumSectorCardProps = {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly iconKey: string;
  readonly premiumToolCount: number;
  readonly relatedFreeToolCount: number;
  readonly premiumCountLabel: string;
  readonly relatedFreeCountLabel: string;
  readonly viewCategoryLabel: string;
};

export function PremiumSectorCard({
  slug,
  title,
  summary,
  iconKey,
  premiumToolCount,
  relatedFreeToolCount,
  premiumCountLabel,
  relatedFreeCountLabel,
  viewCategoryLabel,
}: PremiumSectorCardProps) {
  const Icon = resolvePremiumCategoryIcon(iconKey);

  return (
    <article className="sc-premium-sector-card">
      <div className="sc-premium-sector-card__icon" aria-hidden="true">
        <Icon className="h-6 w-6 text-sky-700" />
      </div>
      <h2 className="sc-premium-sector-card__title">{title}</h2>
      <p className="sc-premium-sector-card__summary">{summary}</p>
      <dl className="sc-premium-sector-card__counts">
        <div>
          <dt className="sr-only">{premiumCountLabel}</dt>
          <dd>{premiumCountLabel}</dd>
        </div>
        <div>
          <dt className="sr-only">{relatedFreeCountLabel}</dt>
          <dd>{relatedFreeCountLabel}</dd>
        </div>
      </dl>
      <Link href={`/premium-tools/${slug}`} prefetch={false} className="sc-premium-sector-card__cta">
        {viewCategoryLabel}
      </Link>
    </article>
  );
}
