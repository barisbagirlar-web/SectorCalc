import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getToolHref } from "@/lib/tools/paths";
import { getRevenueToolByFreeSlug } from "@/lib/tools/revenue-tools";
import {
  FEATURED_TRAFFIC_SLUGS,
  FREE_TRAFFIC_CATEGORIES,
  FREE_TRAFFIC_TOOLS,
  getFreeTrafficCategoryLabelKey,
  listFreeTrafficToolsByCategory,
  type FreeTrafficCategory,
} from "@/lib/tools/free-traffic-catalog";

function resolveToolHref(slug: string): string {
  if (getRevenueToolByFreeSlug(slug)) {
    return getToolHref("free", slug);
  }
  return getToolHref("free", slug);
}

export async function FreeTrafficCatalogSection() {
  const t = await getTranslations("freeTrafficCatalog");

  return (
    <>
      <section className="border-b border-border-subtle bg-white py-4 sm:py-6" id="featured">
        <Container size="wide">
          <h2 className="text-lg font-bold text-text-primary">{t("featuredTitle")}</h2>
          <p className="mt-1 text-sm text-text-secondary">{t("featuredLead")}</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_TRAFFIC_SLUGS.map((slug) => {
              const tool = FREE_TRAFFIC_TOOLS.find((entry) => entry.slug === slug);
              if (!tool) {
                return null;
              }
              return (
                <li key={slug} className="border border-[#D1D1D1] bg-[#FBFBFA] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                    {t(`categories.${tool.category}`)}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-text-primary">{tool.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-text-secondary">{tool.description}</p>
                  {tool.relatedPremiumSlug ? (
                    <p className="mt-2 text-[10px] text-text-secondary">{t("decisionAnalyzerNote")}</p>
                  ) : null}
                  <Link
                    href={resolveToolHref(slug)}
                    className="mt-3 inline-flex min-h-[44px] items-center text-xs font-semibold uppercase tracking-wide text-[#0A0A0A] underline underline-offset-2"
                  >
                    {t("openCalculator")}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {FREE_TRAFFIC_CATEGORIES.map((category: FreeTrafficCategory) => {
        const tools = listFreeTrafficToolsByCategory(category);
        const anchor = category;
        return (
          <section
            key={category}
            id={anchor}
            className="border-b border-border-subtle bg-bg-subtle py-4 sm:py-6"
          >
            <Container size="wide">
              <h2 className="text-lg font-bold text-text-primary">
                {t(getFreeTrafficCategoryLabelKey(category))}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                {t("categoryCount", { count: tools.length })}
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <li key={tool.slug} className="border border-[#D1D1D1] bg-white p-3">
                    <h3 className="text-sm font-semibold text-text-primary">{tool.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-text-secondary">{tool.description}</p>
                    {tool.relatedPremiumSlug ? (
                      <p className="mt-2 text-[10px] text-text-secondary">{t("decisionAnalyzerNote")}</p>
                    ) : null}
                    <Link
                      href={resolveToolHref(tool.slug)}
                      className="mt-3 inline-flex min-h-[44px] items-center text-xs font-semibold uppercase tracking-wide text-[#0A0A0A] underline underline-offset-2"
                    >
                      {t("openCalculator")}
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        );
      })}
    </>
  );
}
