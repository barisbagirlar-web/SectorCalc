import { Link } from "@/i18n/routing";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { HomepageCatalogSearch } from "@/components/home/HomepageCatalogSearch";
import { HeroMathematicalSymbols } from "@/components/home/HeroMathematicalSymbols";
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
  HOMEPAGE_AUDIENCE_IDS,
  HOMEPAGE_COVERAGE_IDS,
  HOMEPAGE_CRITICAL_GROUPS,
  HOMEPAGE_DIFFERENTIATION_IDS,
  HOMEPAGE_EXCEL_IDS,
  HOMEPAGE_LOSS_IDS,
  isHomepageCriticalToolLive,
  resolveHomepageCriticalToolHref,
} from "@/lib/home/homepage-positioning-data";

const FREE_ITEM_IDS = ["basic", "fast", "category", "noSignup"] as const;
const PREMIUM_ITEM_IDS = ["inputs", "scenario", "summary", "export"] as const;

/** Keep homepage search focused on industry / business calculators — not daily-life catalog tabs. */
const HOMEPAGE_SEARCH_EXCLUDED_FREE_CATEGORIES = new Set([
  "everyday-life",
  "math-statistics",
  "conversion",
  "health-body",
]);

type HomepageTranslator = (key: string, values?: Record<string, string | number>) => string;

function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <article className="sc-home-omni__info-card">
      <h3 className="sc-home-omni__info-card-title">{title}</h3>
      <p className="sc-home-omni__info-card-text">{text}</p>
    </article>
  );
}

function HomepagePositioningLayout({
  t,
  searchEntries,
}: {
  t: HomepageTranslator;
  searchEntries: ReturnType<typeof mergeSearchEntries>;
}) {
  return (
    <div className="sc-home-omni">
      <section className="sc-home-omni__hero" aria-labelledby="home-hero-heading">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <div className="sc-home-omni__hero-grid">
            <div className="sc-home-omni__hero-main">
              <p className="sc-home-omni__hero-highlight">{t("hero.highlight")}</p>
              <h1 id="home-hero-heading" className="sc-home-omni__headline sc-home-omni__headline--wide">
                {t("hero.headline")}
              </h1>
              <p className="sc-home-omni__subtitle">{t("hero.subtitle")}</p>
              <p className="sc-home-omni__supporting">{t("hero.supporting")}</p>
              <div className="sc-home-omni__search">
                <HomepageCatalogSearch entries={searchEntries} />
              </div>
              <div className="sc-home-omni__hero-actions">
                <Link href="/free-tools" className="sc-cta-primary">
                  {t("hero.ctaPrimary")}
                </Link>
                <Link href="/premium-tools" className="sc-cta-secondary">
                  {t("hero.ctaSecondary")}
                </Link>
              </div>
            </div>

            <HeroMathematicalSymbols />
          </div>
        </Container>
      </section>

      <section className="sc-home-omni__section" aria-labelledby="home-coverage-heading">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <header className="sc-home-omni__section-head">
            <h2 id="home-coverage-heading" className="sc-home-omni__section-title">
              {t("coverage.title")}
            </h2>
            <p className="sc-home-omni__section-lead">{t("coverage.subtitle")}</p>
          </header>
          <ul className="sc-home-omni__coverage-grid">
            {HOMEPAGE_COVERAGE_IDS.map((id) => (
              <li key={id}>
                <InfoCard
                  title={t(`coverage.items.${id}.title`)}
                  text={t(`coverage.items.${id}.description`)}
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section
        className="sc-home-omni__section sc-home-omni__section--surface"
        aria-labelledby="home-differentiation-heading"
      >
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <header className="sc-home-omni__section-head">
            <h2 id="home-differentiation-heading" className="sc-home-omni__section-title">
              {t("differentiation.title")}
            </h2>
            <p className="sc-home-omni__section-lead">{t("differentiation.subtitle")}</p>
          </header>
          <ul className="sc-home-omni__why-grid">
            {HOMEPAGE_DIFFERENTIATION_IDS.map((id) => (
              <li key={id}>
                <InfoCard
                  title={t(`differentiation.columns.${id}.title`)}
                  text={t(`differentiation.columns.${id}.text`)}
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="sc-home-omni__section" aria-labelledby="home-losses-heading">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <header className="sc-home-omni__section-head">
            <h2 id="home-losses-heading" className="sc-home-omni__section-title">
              {t("losses.title")}
            </h2>
          </header>
          <ul className="sc-home-omni__loss-grid">
            {HOMEPAGE_LOSS_IDS.map((id) => (
              <li key={id}>
                <InfoCard title={t(`losses.items.${id}.title`)} text={t(`losses.items.${id}.text`)} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section
        className="sc-home-omni__section sc-home-omni__section--surface"
        aria-labelledby="home-free-premium-heading"
      >
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <h2 id="home-free-premium-heading" className="sc-home-omni__section-title sc-home-omni__section-title--center">
            {t("freePremium.title")}
          </h2>
          <div className="sc-home-omni__split">
            <article className="sc-home-omni__split-card">
              <h3 className="sc-home-omni__split-title">{t("freePremium.freeTitle")}</h3>
              <p className="sc-home-omni__split-lead">{t("freePremium.freeText")}</p>
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
              <p className="sc-home-omni__split-lead">{t("freePremium.premiumText")}</p>
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

      <section className="sc-home-omni__section" aria-labelledby="home-critical-heading">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <header className="sc-home-omni__section-head">
            <h2 id="home-critical-heading" className="sc-home-omni__section-title">
              {t("criticalTools.title")}
            </h2>
            <p className="sc-home-omni__section-lead">{t("criticalTools.subtitle")}</p>
          </header>
          <div className="sc-home-omni__critical-groups">
            {HOMEPAGE_CRITICAL_GROUPS.map((group) => (
              <section
                key={group.id}
                className="sc-home-omni__critical-group"
                aria-labelledby={`home-critical-${group.id}`}
              >
                <h3 id={`home-critical-${group.id}`} className="sc-home-omni__critical-group-title">
                  {t(`criticalTools.groups.${group.id}.title`)}
                </h3>
                <ul className="sc-home-omni__critical-list">
                  {group.tools.map((tool) => {
                    const href = resolveHomepageCriticalToolHref(tool);
                    const live = isHomepageCriticalToolLive(tool);
                    const title = t(`criticalTools.groups.${group.id}.items.${tool.id}.title`);

                    if (href && live) {
                      return (
                        <li key={tool.id}>
                          <Link href={href} className="sc-home-omni__critical-link">
                            {title}
                          </Link>
                        </li>
                      );
                    }

                    return (
                      <li key={tool.id}>
                        <span className="sc-home-omni__critical-planned">
                          {title}
                          <span className="sc-home-omni__critical-badge">{t("criticalTools.badgeSoon")}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </section>

      <section
        className="sc-home-omni__section sc-home-omni__section--surface"
        aria-labelledby="home-audiences-heading"
      >
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <header className="sc-home-omni__section-head">
            <h2 id="home-audiences-heading" className="sc-home-omni__section-title">
              {t("audiences.title")}
            </h2>
          </header>
          <ul className="sc-home-omni__audience-grid">
            {HOMEPAGE_AUDIENCE_IDS.map((id) => (
              <li key={id}>
                <InfoCard title={t(`audiences.items.${id}.title`)} text={t(`audiences.items.${id}.text`)} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="sc-home-omni__section" aria-labelledby="home-excel-heading">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <header className="sc-home-omni__section-head">
            <h2 id="home-excel-heading" className="sc-home-omni__section-title">
              {t("whyNotExcel.title")}
            </h2>
          </header>
          <ul className="sc-home-omni__why-grid">
            {HOMEPAGE_EXCEL_IDS.map((id) => (
              <li key={id}>
                <InfoCard
                  title={t(`whyNotExcel.items.${id}.title`)}
                  text={t(`whyNotExcel.items.${id}.text`)}
                />
              </li>
            ))}
          </ul>
          <p className="sc-home-omni__closing">{t("whyNotExcel.closing")}</p>
        </Container>
      </section>

      <section className="sc-home-omni__mission" aria-labelledby="home-final-cta-heading">
        <Container className="sc-pro-container">
          <h2 id="home-final-cta-heading" className="sc-home-omni__mission-title">
            {t("finalCta.title")}
          </h2>
          <p className="sc-home-omni__mission-text">{t("finalCta.subtitle")}</p>
          <div className="sc-home-omni__hero-actions sc-home-omni__hero-actions--center">
            <Link href="/free-tools" className="sc-cta-primary sc-home-omni__mission-cta">
              {t("finalCta.ctaPrimary")}
            </Link>
            <Link href="/premium-tools" className="sc-cta-secondary">
              {t("finalCta.ctaSecondary")}
            </Link>
          </div>
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
    tCatalog("openCalculator"),
    tCatalog("openCalculator")
  );

  const premiumGroups = getCachedPremiumSchemaCatalogGroups(locale);
  const industryGroups = getCachedIndustryCatalogGroups(locale);

  const homepageFreeGroups = freeGroups.filter(
    (group) => !HOMEPAGE_SEARCH_EXCLUDED_FREE_CATEGORIES.has(group.id)
  );

  const searchEntries = mergeSearchEntries(
    buildSearchEntriesFromGroups(homepageFreeGroups, "homepage"),
    buildSearchEntriesFromGroups(premiumGroups, "homepage"),
    buildSearchEntriesFromGroups(industryGroups, "homepage")
  );

  return <HomepagePositioningLayout t={t} searchEntries={searchEntries} />;
}
