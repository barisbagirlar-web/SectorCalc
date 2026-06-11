import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

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

const USE_CASE_IDS = [
  "scrap",
  "area",
  "machineTime",
  "labor",
  "route",
  "energy",
  "quoteMargin",
  "oee",
  "carbon",
] as const;

type HomepageTranslator = (key: string, values?: Record<string, string | number>) => string;

function HomepageClean({ t }: { t: HomepageTranslator }) {
  return (
    <div className="sc-home-hybrid">
      <section className="sc-home-hybrid__hero" aria-labelledby="home-hero-heading">
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <div className="sc-pro-hero-compact">
            <div className="sc-pro-hero-compact__copy sc-pro-hero-compact__copy--solo">
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
              <div className="sc-pro-hero-compact__actions">
                <Link href="/free-tools" className="sc-cta-primary">
                  {t("hero.ctaPrimary")}
                </Link>
                <Link href="/premium-tools" className="sc-cta-secondary">
                  {t("hero.ctaSecondary")}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <hr className="sc-ledger-separator" />

      <section className="sc-home-hybrid__section" aria-labelledby="positioning-heading">
        <Container className="sc-pro-container">
          <h2 id="positioning-heading" className="sc-home-hybrid__section-title">
            {t("positioning.title")}
          </h2>
          <p className="sc-home-hybrid__section-lead">{t("positioning.text")}</p>
        </Container>
      </section>

      <hr className="sc-ledger-separator" />

      <section className="sc-home-hybrid__section" aria-labelledby="use-cases-heading">
        <Container className="sc-pro-container">
          <h2 id="use-cases-heading" className="sc-home-hybrid__section-title">
            {t("useCases.title")}
          </h2>
          <ul className="sc-home-hybrid__measure-list">
            {USE_CASE_IDS.map((id) => (
              <li key={id}>{t(`useCases.items.${id}`)}</li>
            ))}
          </ul>
        </Container>
      </section>

      <hr className="sc-ledger-separator" />

      <section className="sc-home-hybrid__section" aria-labelledby="platform-summary-heading">
        <Container className="sc-pro-container">
          <h2 id="platform-summary-heading" className="sc-home-hybrid__section-title">
            {t("platform.title")}
          </h2>
          <p className="sc-home-hybrid__section-lead">{t("platform.text")}</p>
        </Container>
      </section>

      <hr className="sc-ledger-separator" />

      <section className="sc-home-hybrid__section" aria-label={t("platform.cta")}>
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
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

      <section className="sc-home-hybrid__final" aria-labelledby="final-cta-heading">
        <Container className="sc-pro-container">
          <h2 id="final-cta-heading" className="sc-home-hybrid__final-title">
            {t("final.title")}
          </h2>
          <p className="sc-home-hybrid__section-lead">{t("final.text")}</p>
          <Link href="/free-tools" className="sc-cta-primary sc-home-hybrid__final-cta">
            {t("final.cta")}
          </Link>
        </Container>
      </section>
    </div>
  );
}

export async function HomepageHybrid() {
  const t = await getTranslations("homepageHybrid");
  return <HomepageClean t={t} />;
}
