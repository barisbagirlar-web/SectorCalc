import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getLocale, getTranslations } from "@/lib/i18n-stub";
import {
  FEATURED_INDUSTRY_SLUGS,
  industryRegistry,
  type IndustryCategory,
} from "@/lib/features/tools/industry-registry";
import { INDUSTRY_CATEGORY_DISPLAY } from "@/data/industry-category-labels";
import { getIndustryBySlug } from "@/data/industries";

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

const featuredCards = FEATURED_INDUSTRY_SLUGS.map((slug) => {
  const industry = getIndustryBySlug(slug);

  return {
    title: industry?.name ?? slug,
    href: `/industries/${slug}`,
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
    <section id="industries" aria-labelledby="sector-selector-heading" className="ind-os-page py-8">
      <div className="ind-os-container">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="sector-selector-heading"
            className="font-display text-balance text-2xl font-semibold text-premium-velvet sm:text-3xl"
          >
            {t("title", { count: SECTOR_COUNT })}
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-body-charcoal sm:text-base">
            {t("subtitle")}
          </p>
          <p className="mt-3">
            <Link
              href="/industries"
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-premium-velvet transition-colors hover:text-body-charcoal"
            >
              {t("viewAll", { count: SECTOR_COUNT })}
            </Link>
          </p>
        </div>

        <div className="ind-os-module-grid mt-8">
          {featuredCards.map((sector) => (
            <Link key={sector.slug} href={sector.href} className="ind-os-module">
              <span className="ind-os-module__title">{sector.title}</span>
              <span className="ind-os-module__action">
                {t("startFree")}
                <ChevronRight className="h-3 w-3" aria-hidden />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <h3 className="ind-os-section-title text-center">{t("browseByCategory")}</h3>
          <div className="mt-4 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {sectorsByCategory.map(({ category, label, sectors }) => (
              <div key={category} className="ind-os-list">
                <p className="label-badge border-b border-technical-gray bg-industrial-matte px-3 py-2 text-body-charcoal">
                  {label.en}
                </p>
                <ul>
                  {sectors.map((sector) => (
                    <li key={sector.slug}>
                      <Link href={`/industries/${sector.slug}`} className="ind-os-list-row">
                        <span className="ind-os-list-row__title">{sector.name}</span>
                        <span className="ind-os-list-row__action">
                          {t("startFree")}
                          <ChevronRight className="h-3 w-3" aria-hidden />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
