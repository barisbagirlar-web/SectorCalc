import { HomepageCredibilitySection } from "@/components/home/HomepageCredibilitySection";
import { HomeAboutSection } from "@/components/about/HomeAboutSection";
import { HomepageCampaignStrip } from "@/components/campaign/HomepageCampaignStrip";
import { TrackedCtaLink } from "@/components/campaign/TrackedCtaLink";
import { HomepageCatalogSearch } from "@/components/home/HomepageCatalogSearch";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { ProductScreenMockup } from "@/components/ui/ProductScreenMockup";
import { Container } from "@/components/ui/Container";
import { getHomepageSectorAreaCount } from "@/lib/home/homepage-stats";
import type { CatalogSearchEntry } from "@/lib/catalog/catalog-search";

const SCENARIO_IDS = ["cnc", "route", "energy", "food"] as const;
const MEASURE_IDS = ["money", "material", "time", "energy"] as const;
const COMPARISON_ROW_IDS = [
  "setup",
  "cost",
  "sectorLogic",
  "mobile",
  "assumptions",
  "updates",
] as const;
const COMPARISON_COL_IDS = ["excel", "notebook", "erp", "sectorcalc"] as const;
const PRICING_PLAN_IDS = ["free", "pro", "team"] as const;

const SCENARIO_TOOL_HREFS: Record<(typeof SCENARIO_IDS)[number], string> = {
  cnc: "/tools/free/scrap-rate-calculator",
  route: "/tools/free/route-cost-calculator",
  energy: "/tools/free/energy-consumption-check",
  food: "/tools/free/food-cost-calculator",
};

const PLATFORM_CATEGORY_HREFS = [
  { id: "manufacturing", href: "/industries/cnc-manufacturing" },
  { id: "logistics", href: "/industries/logistics-transport" },
  { id: "construction", href: "/industries/construction" },
  { id: "energy", href: "/industries/energy-carbon" },
  { id: "food", href: "/industries/restaurant" },
  { id: "textile", href: "/industries/welding-fabrication" },
  { id: "automotive", href: "/industries/auto-repair-shop" },
  { id: "healthcare", href: "/categories" },
] as const;

type HomepageHybridProps = {
  catalogSearchEntries?: readonly CatalogSearchEntry[];
};

export async function HomepageHybrid({ catalogSearchEntries = [] }: HomepageHybridProps) {
  const t = await getTranslations("homepageHybrid");
  const sectorAreaCount = getHomepageSectorAreaCount();

  return (
    <div className="sc-home-hybrid">
      {/* 1. Hero */}
      <section className="sc-home-hybrid__hero" aria-labelledby="home-hero-heading">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <div className="sc-pro-hero-compact">
            <div className="sc-pro-hero-compact__copy">
              <p className="sc-pro-eyebrow">{t("hero.eyebrow")}</p>
              <h1 id="home-hero-heading" className="sc-home-hybrid__headline">
                {t("hero.headline")}
              </h1>
              <p className="sc-pro-lead sc-home-hybrid__subtitle-line">
                {t("hero.subtitleLine1")}
              </p>
              <p className="sc-pro-lead sc-home-hybrid__subtitle-line">
                {t("hero.subtitleLine2")}
              </p>
              <p className="sc-home-hybrid__supporting">{t("hero.supporting")}</p>
              {catalogSearchEntries.length > 0 ? (
                <HomepageCatalogSearch entries={catalogSearchEntries} />
              ) : null}
              <div className="sc-pro-hero-compact__actions">
                <Link href="/categories" className="sc-cta-primary">
                  {t("hero.ctaPrimary")}
                </Link>
                <Link href="/free-tools" className="sc-cta-secondary">
                  {t("hero.ctaSecondary")}
                </Link>
              </div>
            </div>
            <ProductScreenMockup className="sc-pro-hero-compact__mockup" />
          </div>
        </Container>
      </section>

      <hr className="sc-ledger-separator" />

      {/* 2. Positioning */}
      <section className="sc-home-hybrid__section" aria-labelledby="positioning-heading">
        <Container className="sc-pro-container">
          <h2 id="positioning-heading" className="sc-home-hybrid__section-title">
            {t("positioning.title")}
          </h2>
          <p className="sc-home-hybrid__section-lead">{t("positioning.text")}</p>
        </Container>
      </section>

      <hr className="sc-ledger-separator" />

      {/* 3. Sample scenarios */}
      <section className="sc-home-hybrid__section" aria-labelledby="scenarios-heading">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <h2 id="scenarios-heading" className="sc-pro-eyebrow">
            {t("scenarios.eyebrow")}
          </h2>
          <ul className="sc-home-hybrid__scenario-grid">
            {SCENARIO_IDS.map((id) => (
              <li key={id} className="sc-home-hybrid__scenario-item">
                <article className="sc-home-hybrid__scenario-card">
                  <p className="sc-home-hybrid__scenario-label">
                    {t(`scenarios.${id}.label`)}
                  </p>
                  <h3 className="sc-home-hybrid__scenario-title">
                    {t(`scenarios.${id}.title`)}
                  </h3>
                  <p className="sc-home-hybrid__scenario-text">
                    {t(`scenarios.${id}.text`)}
                  </p>
                  <p className="sc-home-hybrid__scenario-metric">
                    {t(`scenarios.${id}.metric`)}
                  </p>
                  <p className="sc-home-hybrid__scenario-action">
                    {t(`scenarios.${id}.action`)}
                  </p>
                  <Link
                    href={SCENARIO_TOOL_HREFS[id]}
                    className="sc-home-hybrid__scenario-cta"
                  >
                    {t(`scenarios.${id}.cta`)}
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <hr className="sc-ledger-separator" />

      {/* 4. What you can measure */}
      <section
        className="sc-home-hybrid__section sc-home-hybrid__section--alt"
        aria-labelledby="measure-heading"
      >
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <h2 id="measure-heading" className="sc-home-hybrid__section-title">
            {t("measure.title")}
          </h2>
          <ul className="sc-home-hybrid__measure-grid">
            {MEASURE_IDS.map((id) => (
              <li key={id}>
                <article className="sc-home-hybrid__measure-card">
                  <h3 className="sc-home-hybrid__measure-title">
                    {t(`measure.${id}.title`)}
                  </h3>
                  <ul className="sc-home-hybrid__measure-list">
                    <li>{t(`measure.${id}.bullet1`)}</li>
                    <li>{t(`measure.${id}.bullet2`)}</li>
                    <li>{t(`measure.${id}.bullet3`)}</li>
                  </ul>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <hr className="sc-ledger-separator" />

      {/* 5. Platform approach */}
      <section className="sc-home-hybrid__section" aria-labelledby="platform-heading">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <h2 id="platform-heading" className="sc-home-hybrid__section-title">
            {t("platform.title")}
          </h2>
          <p className="sc-home-hybrid__platform-stat">
            {t("platform.stat", { sectorCount: sectorAreaCount })}
          </p>
          <p className="sc-home-hybrid__section-lead">{t("platform.text")}</p>
          <ul className="sc-home-hybrid__platform-categories">
            {PLATFORM_CATEGORY_HREFS.map(({ id, href }) => (
              <li key={id}>
                <Link href={href} className="sc-home-hybrid__platform-chip">
                  {t(`platform.categories.${id}`)}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/industries" className="sc-home-hybrid__platform-cta">
            {t("platform.cta")}
          </Link>
        </Container>
      </section>

      <hr className="sc-ledger-separator" />

      {/* 6. Comparison table */}
      <section
        className="sc-home-hybrid__section sc-home-hybrid__section--alt"
        aria-labelledby="comparison-heading"
      >
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <h2 id="comparison-heading" className="sc-home-hybrid__section-title">
            {t("comparison.title")}
          </h2>
          <div className="sc-home-hybrid__comparison">
            <table className="sc-home-hybrid__comparison-table">
              <thead>
                <tr>
                  <th scope="col" className="sc-home-hybrid__comparison-corner">
                    <span className="sr-only">{t("comparison.rowLabel")}</span>
                  </th>
                  {COMPARISON_COL_IDS.map((col) => (
                    <th key={col} scope="col">
                      {t(`comparison.columns.${col}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROW_IDS.map((row) => (
                  <tr key={row}>
                    <th scope="row">{t(`comparison.rows.${row}.label`)}</th>
                    {COMPARISON_COL_IDS.map((col) => (
                      <td
                        key={col}
                        data-label={t(`comparison.columns.${col}`)}
                        className={
                          col === "sectorcalc"
                            ? "sc-home-hybrid__comparison-cell--highlight"
                            : undefined
                        }
                      >
                        {t(`comparison.rows.${row}.${col}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <hr className="sc-ledger-separator" />

      <HomepageCampaignStrip />

      <hr className="sc-ledger-separator" />

      {/* 6b. Beta partner */}
      <section className="sc-home-hybrid__section" aria-labelledby="beta-partner-heading">
        <Container className="sc-pro-container">
          <div className="sc-home-hybrid__beta-block rounded-lg border border-professional-blue/25 bg-white p-6 md:p-8">
            <h2 id="beta-partner-heading" className="sc-home-hybrid__section-title">
              {t("betaPartner.title")}
            </h2>
            <p className="sc-home-hybrid__section-lead">{t("betaPartner.text")}</p>
            <TrackedCtaLink
              href="/beta-partner"
              eventName="homepage_cta_click"
              ctaId="homepage_beta_partner"
              source="homepage"
              medium="beta_partner"
              className="sc-cta-secondary sc-home-hybrid__beta-cta mt-4 inline-flex min-h-[44px] items-center"
            >
              {t("betaPartner.cta")}
            </TrackedCtaLink>
          </div>
        </Container>
      </section>

      <hr className="sc-ledger-separator" />

      {/* 7. Pricing preview */}
      <section className="sc-home-hybrid__section" aria-labelledby="pricing-heading">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <h2 id="pricing-heading" className="sc-home-hybrid__section-title">
            {t("pricing.title")}
          </h2>
          <ul className="sc-home-hybrid__pricing-grid">
            {PRICING_PLAN_IDS.map((plan) => (
              <li key={plan}>
                <article
                  className={`sc-home-hybrid__pricing-card${
                    plan === "pro" ? " sc-home-hybrid__pricing-card--pro" : ""
                  }`}
                >
                  <h3 className="sc-home-hybrid__pricing-name">
                    {t(`pricing.plans.${plan}.name`)}
                  </h3>
                  {t(`pricing.plans.${plan}.price`) ? (
                    <p className="sc-home-hybrid__pricing-price">
                      {t(`pricing.plans.${plan}.price`)}
                    </p>
                  ) : null}
                  <ul className="sc-home-hybrid__pricing-features">
                    <li>{t(`pricing.plans.${plan}.feature1`)}</li>
                    <li>{t(`pricing.plans.${plan}.feature2`)}</li>
                    <li>{t(`pricing.plans.${plan}.feature3`)}</li>
                  </ul>
                  {plan === "pro" ? (
                    <Link href="/pricing" className="sc-cta-primary sc-home-hybrid__pricing-card-cta">
                      {t("pricing.plans.pro.cta")}
                    </Link>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
          <p className="sc-home-hybrid__pricing-single">{t("pricing.singleReport")}</p>
          <div className="sc-home-hybrid__pricing-actions">
            <Link href="/free-tools" className="sc-cta-secondary sc-home-hybrid__pricing-start">
              {t("pricing.cta")}
            </Link>
            <Link href="/pricing" className="sc-home-hybrid__pricing-link">
              {t("pricing.viewPlans")}
            </Link>
          </div>
        </Container>
      </section>

      <hr className="sc-ledger-separator" />

      <HomepageCredibilitySection />

      <HomeAboutSection />

      {/* 8. Final CTA */}
      <section className="sc-home-hybrid__final" aria-labelledby="final-cta-heading">
        <Container className="sc-pro-container">
          <h2 id="final-cta-heading" className="sc-home-hybrid__final-title">
            {t("final.title")}
          </h2>
          <ul className="sc-home-hybrid__final-bullets">
            <li>{t("final.bullet1", { sectorCount: sectorAreaCount })}</li>
            <li>{t("final.bullet2")}</li>
            <li>{t("final.bullet3")}</li>
            <li>{t("final.bullet4")}</li>
          </ul>
          <Link href="/categories" className="sc-cta-primary sc-home-hybrid__final-cta">
            {t("final.cta")}
          </Link>
        </Container>
      </section>
    </div>
  );
}
