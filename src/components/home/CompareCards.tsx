import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

function readStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.filter((item): item is string => typeof item === "string");
}

export async function CompareCards() {
  const t = await getTranslations("homepageHybrid");
  const freeHighlights = readStringArray(t.raw("freePremium.freeHighlights"));
  const premiumHighlights = readStringArray(t.raw("freePremium.premiumHighlights"));

  return (
    <section
      className="sc-home-omni__section sc-home-omni__section--surface"
      aria-labelledby="home-free-premium-heading"
    >
      <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
        <h2 id="home-free-premium-heading" className="sr-only">
          {t("freePremium.title")}
        </h2>
        <div className="sc-home-omni__split">
          <article className="sc-home-omni__split-card">
            <h3 className="sc-home-omni__split-title">{t("freePremium.freeTitle")}</h3>
            <ul className="sc-home-omni__split-list">
              {freeHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link href="/free-tools" className="sc-cta-primary sc-home-omni__split-cta">
              {t("freePremium.freeCta")}
            </Link>
          </article>
          <article className="sc-home-omni__split-card sc-home-omni__split-card--premium">
            <h3 className="sc-home-omni__split-title">{t("freePremium.premiumTitle")}</h3>
            <ul className="sc-home-omni__split-list">
              {premiumHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link href="/premium-tools" className="sc-cta-secondary sc-home-omni__split-cta">
              {t("freePremium.premiumCta")}
            </Link>
          </article>
        </div>
      </Container>
    </section>
  );
}
