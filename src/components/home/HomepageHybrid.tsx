import { Link } from "@/i18n/routing";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { HomepageCatalogSearch } from "@/components/home/HomepageCatalogSearch";
import {
  buildSearchEntriesFromGroups,
  mergeSearchEntries,
} from "@/lib/catalog/catalog-search";
import {
  getCachedFreeTrafficCatalogGroups,
  getCachedIndustryCatalogGroups,
  getCachedPremiumSchemaCatalogGroups,
} from "@/lib/catalog/cached-catalog-groups";
import type { FreeTrafficCategoryMeta } from "@/lib/tools/free-traffic-categories";
import {
  HOMEPAGE_CATEGORY_HREFS,
  HOMEPAGE_CATEGORY_IDS,
  HOMEPAGE_SECTOR_HREFS,
  HOMEPAGE_SECTOR_IDS,
  getHomepageCategoryCounts,
  getHomepageToolTotalCount,
  resolveHomepagePopularTools,
  type HomepageCategoryId,
} from "@/lib/home/homepage-omni-data";

const WHY_CARD_IDS = ["unify", "discover", "upgrade"] as const;
const FREE_ITEM_IDS = ["fast", "formula", "daily", "discover"] as const;
const PREMIUM_ITEM_IDS = ["inputs", "scenario", "summary", "export"] as const;

const CATEGORY_ICON: Record<HomepageCategoryId, string> = {
  costMargin: "₺",
  scrapOee: "◫",
  energyCarbon: "⚡",
  routingLogistics: "→",
  constructionField: "▣",
  financeBusiness: "∑",
  dailyPractical: "☰",
  premium: "★",
};

type HomepageTranslator = (key: string, values?: Record<string, string | number>) => string;

function HomepageOmniLayout({
  t,
  searchEntries,
  categoryCounts,
  popularTools,
  totalToolCount,
}: {
  t: HomepageTranslator;
  searchEntries: ReturnType<typeof mergeSearchEntries>;
  categoryCounts: Record<HomepageCategoryId, number>;
  popularTools: ReturnType<typeof resolveHomepagePopularTools>;
  totalToolCount: number;
}) {
  return (
    <div className="sc-home-omni">
      <section className="sc-home-omni__hero" aria-labelledby="home-hero-heading">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <div className="sc-home-omni__hero-inner">
            <p className="sc-home-omni__hero-highlight">{t("hero.highlight")}</p>
            <h1 id="home-hero-heading" className="sc-home-omni__headline">
              {t("hero.headline")}
            </h1>
            <p className="sc-home-omni__subtitle">{t("hero.subtitle")}</p>
            {totalToolCount > 0 ? (
              <p className="sc-home-omni__tool-count">{t("hero.toolCount", { count: totalToolCount })}</p>
            ) : null}
            <HomepageCatalogSearch entries={searchEntries} />
            <div className="sc-home-omni__hero-actions">
              <Link href="/free-tools" className="sc-cta-primary">
                {t("hero.ctaPrimary")}
              </Link>
              <Link href="/premium-tools" className="sc-cta-secondary">
                {t("hero.ctaSecondary")}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="sc-home-omni__section" aria-labelledby="home-categories-heading">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <header className="sc-home-omni__section-head">
            <h2 id="home-categories-heading" className="sc-home-omni__section-title">
              {t("categories.title")}
            </h2>
            <p className="sc-home-omni__section-lead">{t("categories.subtitle")}</p>
          </header>
          <ul className="sc-home-omni__category-grid">
            {HOMEPAGE_CATEGORY_IDS.map((id) => {
              const count = categoryCounts[id];
              return (
                <li key={id}>
                  <Link href={HOMEPAGE_CATEGORY_HREFS[id]} className="sc-home-omni__category-card">
                    <span className="sc-home-omni__category-icon" aria-hidden>
                      {CATEGORY_ICON[id]}
                    </span>
                    <span className="sc-home-omni__category-name">{t(`categories.items.${id}.title`)}</span>
                    <span className="sc-home-omni__category-desc">{t(`categories.items.${id}.description`)}</span>
                    {count > 0 ? (
                      <span className="sc-home-omni__category-count">
                        {t("categories.countLabel", { count })}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {popularTools.length > 0 ? (
        <section className="sc-home-omni__section sc-home-omni__section--surface" aria-labelledby="home-popular-heading">
          <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
            <header className="sc-home-omni__section-head">
              <h2 id="home-popular-heading" className="sc-home-omni__section-title">
                {t("popular.title")}
              </h2>
              <p className="sc-home-omni__section-lead">{t("popular.subtitle")}</p>
            </header>
            <ul className="sc-home-omni__popular-grid">
              {popularTools.map((tool) => (
                <li key={tool.href}>
                  <Link href={tool.href} className="sc-home-omni__popular-card">
                    <span
                      className={`sc-home-omni__popular-badge${
                        tool.tier === "premium" ? " sc-home-omni__popular-badge--premium" : ""
                      }`}
                    >
                      {tool.tier === "premium" ? t("popular.badgePremium") : t("popular.badgeFree")}
                    </span>
                    <span className="sc-home-omni__popular-title">{tool.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <section className="sc-home-omni__section" aria-labelledby="home-free-premium-heading">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <h2 id="home-free-premium-heading" className="sc-home-omni__section-title sc-home-omni__section-title--center">
            {t("freePremium.title")}
          </h2>
          <div className="sc-home-omni__split">
            <article className="sc-home-omni__split-card">
              <h3 className="sc-home-omni__split-title">{t("freePremium.freeTitle")}</h3>
              <ul className="sc-home-omni__split-list">
                {FREE_ITEM_IDS.map((id) => (
                  <li key={id}>{t(`freePremium.freeItems.${id}`)}</li>
                ))}
              </ul>
              <Link href="/free-tools" className="sc-cta-secondary sc-home-omni__split-cta">
                {t("freePremium.freeCta")}
              </Link>
            </article>
            <article className="sc-home-omni__split-card sc-home-omni__split-card--premium">
              <h3 className="sc-home-omni__split-title">{t("freePremium.premiumTitle")}</h3>
              <ul className="sc-home-omni__split-list">
                {PREMIUM_ITEM_IDS.map((id) => (
                  <li key={id}>{t(`freePremium.premiumItems.${id}`)}</li>
                ))}
              </ul>
              <Link href="/premium-tools" className="sc-cta-primary sc-home-omni__split-cta">
                {t("freePremium.premiumCta")}
              </Link>
            </article>
          </div>
        </Container>
      </section>

      <section className="sc-home-omni__section sc-home-omni__section--surface" aria-labelledby="home-why-heading">
        <Container className="sc-pro-container">
          <h2 id="home-why-heading" className="sc-home-omni__section-title">
            {t("why.title")}
          </h2>
          <ul className="sc-home-omni__why-grid">
            {WHY_CARD_IDS.map((id) => (
              <li key={id}>
                <article className="sc-home-omni__why-card">
                  <h3 className="sc-home-omni__why-card-title">{t(`why.cards.${id}.title`)}</h3>
                  <p className="sc-home-omni__why-card-text">{t(`why.cards.${id}.text`)}</p>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="sc-home-omni__section" aria-labelledby="home-sectors-heading">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <header className="sc-home-omni__section-head sc-home-omni__section-head--row">
            <div>
              <h2 id="home-sectors-heading" className="sc-home-omni__section-title">
                {t("sectors.title")}
              </h2>
            </div>
            <Link href="/industries" className="sc-home-omni__inline-cta">
              {t("sectors.cta")}
            </Link>
          </header>
          <ul className="sc-home-omni__sector-grid">
            {HOMEPAGE_SECTOR_IDS.map((id) => (
              <li key={id}>
                <Link href={HOMEPAGE_SECTOR_HREFS[id]} className="sc-home-omni__sector-chip">
                  {t(`sectors.items.${id}`)}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="sc-home-omni__mission" aria-labelledby="home-mission-heading">
        <Container className="sc-pro-container">
          <h2 id="home-mission-heading" className="sc-home-omni__mission-title">
            {t("mission.title")}
          </h2>
          <p className="sc-home-omni__mission-text">{t("mission.text")}</p>
          <Link href="/free-tools" className="sc-cta-primary sc-home-omni__mission-cta">
            {t("mission.cta")}
          </Link>
        </Container>
      </section>
    </div>
  );
}

export async function HomepageHybrid() {
  const locale = await getLocale();
  const t = await getTranslations("homepageHybrid");
  const tCatalog = await getTranslations("freeTrafficCatalog");

  const freeGroups = getCachedFreeTrafficCatalogGroups(
    locale,
    (meta: FreeTrafficCategoryMeta) => ({
      label: tCatalog(meta.labelKey),
      description: tCatalog(meta.descriptionKey),
    }),
    tCatalog("decisionAnalyzerNote"),
    tCatalog("openCalculator")
  );

  const premiumGroups = getCachedPremiumSchemaCatalogGroups(locale);
  const industryGroups = getCachedIndustryCatalogGroups(locale);

  const searchEntries = mergeSearchEntries(
    buildSearchEntriesFromGroups(freeGroups, "homepage"),
    buildSearchEntriesFromGroups(premiumGroups, "homepage"),
    buildSearchEntriesFromGroups(industryGroups, "homepage")
  );

  const categoryCounts = getHomepageCategoryCounts(freeGroups);
  const popularTools = resolveHomepagePopularTools(locale);
  const totalToolCount = getHomepageToolTotalCount();

  return (
    <HomepageOmniLayout
      t={t}
      searchEntries={searchEntries}
      categoryCounts={categoryCounts}
      popularTools={popularTools}
      totalToolCount={totalToolCount}
    />
  );
}
