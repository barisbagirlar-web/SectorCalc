import { Lock } from "lucide-react";
import { Link } from "@/i18n/routing";
import { FormulaGateCatalogMeta } from "@/components/formula/FormulaGateCatalogMeta";
import type { CategorizedToolItem } from "@/lib/catalog/build-categorized-tool-index";

export type PremiumToolCardProps = {
  readonly tool: CategorizedToolItem;
  readonly locale: string;
  readonly openLabel: string;
};

/** Text-based premium tool item — name + description + PRO badge. */
export function PremiumToolCard({
  tool,
  locale,
  openLabel,
}: PremiumToolCardProps) {
  const title = tool.title[locale] ?? tool.title.en ?? tool.slug;
  const description = tool.description[locale] ?? tool.description.en ?? "";
  const isClickable = Boolean(tool.routePath) && tool.publicStatus === "active";

  const body = (
    <>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-semibold leading-tight text-premium-velvet transition-colors group-hover:underline">
          {title}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 font-sans text-[9px] font-semibold uppercase tracking-wider text-sc-copper">
          <Lock className="h-2.5 w-2.5" aria-hidden />
          PRO
        </span>
      </div>
      {description ? (
        <p className="mt-0.5 text-xs leading-relaxed text-body-charcoal line-clamp-2">
          {description}
        </p>
      ) : null}
    </>
  );

  if (isClickable && tool.routePath) {
    return (
      <Link
        href={tool.routePath}
        prefetch={false}
        className="group block text-premium-velvet hover:text-deep-navy"
      >
        {body}
      </Link>
    );
  }

  return (
    <span className="block cursor-default opacity-60">
      {body}
    </span>
  );
}
