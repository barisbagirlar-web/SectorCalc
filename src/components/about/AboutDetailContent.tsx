import { getTranslations } from "@/lib/i18n-stub";
import { Container } from "@/components/ui/Container";
import { PageLayout } from "@/components/layout/PageLayout";
import { DecisionToolLegalDisclaimer } from "@/components/tools/DecisionToolLegalDisclaimer";

const SECTION_IDS = [
  "why",
  "what",
  "problem",
  "how",
  "different",
  "who",
  "building",
] as const;

export async function AboutDetailContent({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "aboutPage" });

  return (
    <PageLayout>
      <div data-about-detail-page="true">
        <section
          className="sc-craft-section sc-craft-section--white sc-craft-section--border"
          data-about-hero="true"
          aria-labelledby="about-detail-title"
        >
          <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
            <p className="sc-craft-eyebrow">{t("hero.eyebrow")}</p>
            <h1 id="about-detail-title" className="sc-craft-headline">
              {t("hero.title")}
            </h1>
            <p className="sc-craft-lead max-w-3xl">{t("hero.lead")}</p>
          </Container>
        </section>

        <section className="sc-craft-section overflow-x-hidden">
          <Container
            size="wide"
            className="sc-craft-container sc-craft-container--wide min-w-0 space-y-8"
          >
            {SECTION_IDS.map((id) => (
              <article
                key={id}
                id={id}
                className="sc-industrial-panel sc-ledger-panel p-4 sm:p-6 min-w-0"
              >
                <h2 className="text-lg font-semibold text-navy sm:text-xl">
                  {t(`${id}.title`)}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-body-charcoal sm:text-base">
                  {t(`${id}.body`)}
                </p>
              </article>
            ))}

            <p className="sc-about-detail-manifesto">
              <span className="sc-about-detail-manifesto-primary">
                {t("manifesto.primary")}
              </span>{" "}
              <span className="sc-about-detail-manifesto-secondary">
                {t("manifesto.secondary")}
              </span>
            </p>

            <DecisionToolLegalDisclaimer />
          </Container>
        </section>
      </div>
    </PageLayout>
  );
}
