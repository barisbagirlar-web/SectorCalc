import { Link } from "@/i18n/routing";
import { Play, Sparkles } from "lucide-react";
import { getTranslations } from "@/lib/i18n-stub";
import { Container } from "@/components/ui/Container";
import { HomepageStrokeIcon } from "@/components/home/HomepageStrokeIcon";
import { readHomepageMessageList } from "@/lib/ui-shared/home/homepage-component-utils";
import { getHomepageCatalogToolCounts } from "@/lib/ui-shared/home/homepage-stats";

export async function CompareCards() {
  const t = await getTranslations("homepageHybrid");
  const { freeCount, premiumCount } = getHomepageCatalogToolCounts();
  const freeHighlights = readHomepageMessageList(
    t,
    "freePremium.freeHighlights",
    "freePremium.freeItems",
  );
  const premiumHighlights = readHomepageMessageList(
    t,
    "freePremium.premiumHighlights",
    "freePremium.premiumItems",
  );

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
            <HomepageStrokeIcon icon={Play} className="sc-home-omni__split-icon" size={40} />
            <h3 className="sc-home-omni__split-title">
              {t("freePremium.freeTitle", { count: freeCount })}
            </h3>
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
            <HomepageStrokeIcon
              icon={Sparkles}
              className="sc-home-omni__split-icon sc-home-omni__split-icon--premium"
              size={40}
            />
            <h3 className="sc-home-omni__split-title">
              {t("freePremium.premiumTitle", { count: premiumCount })}
            </h3>
            <ul className="sc-home-omni__split-list">
              {premiumHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link href="/pro-tools" className="sc-cta-secondary sc-home-omni__split-cta">
              {t("freePremium.premiumCta")}
            </Link>
          </article>
        </div>
      </Container>
    </section>
  );
}
