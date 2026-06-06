import { Link } from "@/i18n/routing";
import { getLocale, getTranslations } from "next-intl/server";
import {
  FEATURED_INDUSTRY_SLUGS,
  industryRegistry,
  type IndustryCategory,
  type IndustryIcon,
  type IndustrySlug,
} from "@/lib/tools/industry-registry";
import { INDUSTRY_CATEGORY_DISPLAY } from "@/data/industry-category-labels";
import { getIndustryBySlug } from "@/data/industries";
import { getRevenueToolBySector } from "@/lib/tools/revenue-tools";
import { getFreeToolHref, getPremiumToolHref } from "@/lib/tools/tool-links";
import { SectorIcon } from "@/components/icons/SectorIcon";
import { ScIcon } from "@/components/icons/ScIcon";
import { STATUS_ICON, STATUS_COLOR_CLASS } from "@/lib/icons/icon-registry";

const SECTOR_COUNT = industryRegistry.length;
const CATEGORY_ORDER: IndustryCategory[] = [
  "heavy-industry",
  "building-trades",
  "field-services",
  "food-retail",
  "custom-manufacturing",
  "logistics-transport",
  "agriculture-livestock",
  "energy-environment",
  "daily-life",
];

function ToolLine({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant: "free" | "premium";
}) {
  const badgeClass =
    variant === "free"
      ? "border-cyan/25 bg-accent-teal/10 text-accent-teal"
      : "border-amber/25 bg-amber/10 text-amber";
  const TierIcon = variant === "free" ? STATUS_ICON.free : STATUS_ICON.premium;
  const tierColor = variant === "free" ? STATUS_COLOR_CLASS.free : STATUS_COLOR_CLASS.premium;

  return (
    <div className="grid grid-cols-[88px_1fr] items-start gap-3">
      <span
        className={`inline-flex h-7 min-h-[44px] items-center justify-center gap-1 rounded-full border px-2 text-xs font-semibold ${badgeClass}`}
      >
        <ScIcon icon={TierIcon} size="compact" className={tierColor} />
        {label}
      </span>
      <span className="min-w-0 text-sm leading-7 text-slate">{value}</span>
    </div>
  );
}

function SectorCardItem({
  title,
  painStatement,
  freeTool,
  premiumTool,
  freeHref,
  premiumHref,
  freeLabel,
  premiumLabel,
  startFreeLabel,
  viewPremiumLabel,
  icon,
  slug,
}: {
  title: string;
  painStatement: string;
  freeTool: string;
  premiumTool: string;
  freeHref: string;
  premiumHref: string;
  freeLabel: string;
  premiumLabel: string;
  startFreeLabel: string;
  viewPremiumLabel: string;
  icon: IndustryIcon;
  slug: IndustrySlug;
}) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border-subtle bg-white p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:border-accent-teal/25">
      <div className="flex gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan/20 bg-bg-subtle">
          <SectorIcon slug={slug} iconType={icon} />
        </div>

        <div className="min-w-0">
          <h3 className="text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
            {title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate">
            {painStatement}
          </p>
        </div>
      </div>

      <div className="mt-auto space-y-3 border-t border-border-subtle pt-5">
        <ToolLine label={freeLabel} value={freeTool} variant="free" />
        <ToolLine label={premiumLabel} value={premiumTool} variant="premium" />
      </div>

      <div className="mt-6 flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
        <Link
          href={freeHref}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-2xl bg-accent-teal px-5 text-sm font-semibold text-white transition hover:bg-accent-teal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2"
        >
          {startFreeLabel}
        </Link>
        <Link
          href={premiumHref}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-2xl border border-accent-teal/40 bg-white px-5 text-sm font-semibold text-accent-teal transition hover:bg-accent-teal/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-teal focus-visible:ring-offset-2"
        >
          {viewPremiumLabel}
        </Link>
      </div>
    </article>
  );
}

const featuredCards = FEATURED_INDUSTRY_SLUGS.map((slug) => {
  const industry = getIndustryBySlug(slug);
  const tool = getRevenueToolBySector(slug);

  return {
    title: industry?.name ?? slug,
    painStatement: tool?.painStatement ?? industry?.businessPain ?? "",
    freeTool: tool?.freeTitle ?? "",
    premiumTool: tool?.paidTitle ?? "",
    freeHref: tool ? getFreeToolHref(tool) : `/industries/${slug}`,
    premiumHref: tool ? getPremiumToolHref(tool) : `/pricing`,
    icon: industry?.icon ?? "manufacturing",
    slug,
  };
});

const sectorsByCategory = CATEGORY_ORDER.map((category) => ({
  category,
  label: INDUSTRY_CATEGORY_DISPLAY[category],
  sectors: industryRegistry.filter((entry) => entry.category === category),
})).filter((group) => group.sectors.length > 0);

export default async function SectorSelectorSection() {
  const t = await getTranslations("sectors");
  const locale = await getLocale();

  return (
    <section
      id="industries"
      aria-labelledby="sector-selector-heading"
      className="relative overflow-hidden border-t border-border-subtle bg-bg-subtle py-16 sm:py-20 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:22px_22px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="sector-selector-heading"
            className="sc-h2 text-balance lg:leading-tight"
          >
            {t("title", { count: SECTOR_COUNT })}
          </h2>

          <p className="sc-body-muted mx-auto mt-4 max-w-2xl text-pretty sm:mt-5 sm:text-lg sm:leading-8">
            {t("subtitle")}
          </p>
          <p className="mt-4">
            <Link
              href="/industries"
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-accent-teal hover:underline"
            >
              {t("viewAll", { count: SECTOR_COUNT })}
            </Link>
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredCards.map((sector) => (
            <SectorCardItem
              key={sector.slug}
              {...sector}
              freeLabel={t("free")}
              premiumLabel={t("premium")}
              startFreeLabel={t("startFree")}
              viewPremiumLabel={t("viewPremium")}
            />
          ))}
        </div>

        <div className="mt-16">
          <h3 className="sc-h3 text-center">{t("browseByCategory")}</h3>
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {sectorsByCategory.map(({ category, label, sectors }) => (
              <div
                key={category}
                className="rounded-2xl border border-border-subtle bg-white p-5 shadow-card"
              >
                <h4 className="text-sm font-bold uppercase tracking-wide text-accent-teal">
                  {locale === "tr" ? label.tr : label.en}
                </h4>
                {locale === "tr" ? (
                  <p className="mt-0.5 text-xs text-slate">{label.en}</p>
                ) : null}
                <ul className="mt-4 space-y-1">
                  {sectors.map((sector) => {
                    const tool = getRevenueToolBySector(sector.slug);
                    return (
                      <li key={sector.slug}>
                        <Link
                          href={`/industries/${sector.slug}`}
                          className="group flex min-h-[44px] items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm text-text-primary transition hover:bg-accent-teal/10"
                        >
                          <span className="font-medium group-hover:text-accent-teal">
                            {sector.name}
                          </span>
                          {tool ? (
                            <span className="shrink-0 text-xs text-slate">
                              {tool.freeTitle}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
