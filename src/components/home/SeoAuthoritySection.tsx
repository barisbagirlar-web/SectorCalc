import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";

const AUTHORITY_BLOCK_IDS = [
  "differentiation",
  "audience",
  "problems",
  "whyUs",
  "accuracy",
  "technology",
  "updates",
  "replaces",
] as const;

type FaqEntry = {
  question: string;
  answer: string;
};

export async function SeoAuthoritySection() {
  const t = await getTranslations("homepageAuthority");

  const faqEntries: FaqEntry[] = AUTHORITY_BLOCK_IDS.map((id) => ({
    question: t(`${id}.question`),
    answer: t(`${id}.body`),
  }));

  const faqSchema = buildAuthorityFaqSchema(faqEntries);

  return (
    <>
      <SemanticJsonLd data={faqSchema} />
      <section
        className="sc-home-omni__section"
        aria-labelledby="home-authority-heading"
      >
        <Container size="narrow" className="sc-pro-container min-w-0">
          <header className="sc-home-omni__section-head">
            <h2 id="home-authority-heading" className="sc-home-omni__section-title">
              {t("sectionTitle")}
            </h2>
            <p className="sc-home-omni__section-lead">{t("sectionLead")}</p>
          </header>
          <div className="sc-authority-blocks">
            {AUTHORITY_BLOCK_IDS.map((id, _index) => (
              <article
                key={id}
                className="sc-authority-block"
                aria-labelledby={`authority-h2-${id}`}
              >
                <h3
                  id={`authority-h2-${id}`}
                  className="sc-authority-block__question"
                >
                  {t(`${id}.question`)}
                </h3>
                <p className="sc-authority-block__answer">
                  {t(`${id}.body`)}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

function buildAuthorityFaqSchema(entries: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries
      .filter((e) => e.question.trim().length > 0 && e.answer.trim().length > 0)
      .map((entry) => ({
        "@type": "Question",
        name: entry.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: entry.answer,
        },
      })),
  };
}
