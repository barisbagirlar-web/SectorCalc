import { Link } from "@/i18n/routing";
import type { CategorizedToolItem } from "@/lib/catalog/build-categorized-tool-index";

export type PremiumToolCardProps = {
  readonly tool: CategorizedToolItem;
  readonly locale: string;
  readonly openLabel: string;
  readonly preparingLabel: string;
};

export function PremiumToolCard({
  tool,
  locale,
  openLabel,
  preparingLabel,
}: PremiumToolCardProps) {
  const title = tool.title[locale] ?? tool.title.en ?? tool.slug;
  const description = tool.description[locale] ?? tool.description.en ?? "";
  const isClickable = Boolean(tool.routePath) && tool.publicStatus === "active";

  const body = (
    <>
      <h3 className="sc-premium-tool-card__title">{title}</h3>
      <p className="sc-premium-tool-card__description">{description}</p>
      <p className="sc-premium-tool-card__meta">
        {isClickable ? openLabel : preparingLabel}
      </p>
    </>
  );

  if (isClickable && tool.routePath) {
    return (
      <article id={`tool-${tool.slug}`} className="sc-premium-tool-card sc-premium-tool-card--active">
        <Link href={tool.routePath} prefetch={false} className="sc-premium-tool-card__link">
          {body}
        </Link>
      </article>
    );
  }

  return (
    <article id={`tool-${tool.slug}`} className="sc-premium-tool-card sc-premium-tool-card--pending" aria-disabled="true">
      {body}
    </article>
  );
}
