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
      <section className="sc-craft-section sc-craft-section--white sc-craft-section--border" id="featured">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide">
          <h2 className="sc-craft-headline text-xl sm:text-2xl">{t("featuredTitle")}</h2>
          <p className="sc-craft-lead text-sm">{t("featuredLead")}</p>
          <ul className="sc-craft-grid sc-craft-grid--4 mt-5">
            {FEATURED_TRAFFIC_SLUGS.map((slug) => {
              const tool = FREE_TRAFFIC_TOOLS.find((entry) => entry.slug === slug);
              if (!tool) {
                return null;
              }
              return (
                <li key={slug}>
                  <article className="sc-craft-card">
                    <p className="sc-craft-eyebrow">{t(`categories.${tool.category}`)}</p>
                    <h3 className="sc-craft-card__title mt-2">{tool.title}</h3>
                    <p className="sc-craft-card__body">{tool.description}</p>
                    <Link href={resolveToolHref(slug)} className="sc-craft-card__cta">
                      {t("openCalculator")}
                    </Link>
                  </article>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {FREE_TRAFFIC_CATEGORIES.map((category: FreeTrafficCategory, index) => {
        const tools = listFreeTrafficToolsByCategory(category);
        const anchor = category;
        return (
          <section
            key={category}
            id={anchor}
            className={`sc-craft-section sc-craft-section--border ${index % 2 === 1 ? "sc-craft-section--alt" : ""}`}
          >
            <Container size="wide" className="sc-craft-container sc-craft-container--wide">
              <h2 className="sc-craft-headline text-xl sm:text-2xl">
                {t(getFreeTrafficCategoryLabelKey(category))}
              </h2>
              <p className="sc-craft-lead text-sm">{t("categoryCount", { count: tools.length })}</p>
              <ul className="sc-craft-grid sc-craft-grid--3 mt-5">
                {tools.map((tool) => (
                  <li key={tool.slug}>
                    <article className="sc-craft-card">
                      <h3 className="sc-craft-card__title">{tool.title}</h3>
                      <p className="sc-craft-card__body">{tool.description}</p>
                      <Link href={resolveToolHref(tool.slug)} className="sc-craft-card__cta">
                        {t("openCalculator")}
                      </Link>
                    </article>
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
