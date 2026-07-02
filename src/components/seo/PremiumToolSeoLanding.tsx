import { getTranslations } from "@/lib/i18n-stub";
import { Link } from "@/i18n/routing";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { DecisionToolLegalDisclaimer } from "@/components/tools/DecisionToolLegalDisclaimer";
import { buildBreadcrumbJsonLd, type JsonLdRecord } from "@/lib/infrastructure/seo/schema-mesh";
import { fillPremiumSeoTemplate } from "@/lib/infrastructure/seo/premium-tool-seo-context";
import type { PremiumToolSeoLanding } from "@/lib/infrastructure/seo/premium-tool-seo-landings";
import { getLocalizedRevenueToolTitle } from "@/data/revenue-tools-i18n";
import { getLocalizedPremiumSchema } from "@/data/premium-schema-i18n";

type FaqItem = { readonly q: string; readonly a: string };

const SECTION_KEYS = [
  "howTo",
  "method",
  "mistakes",
  "problem",
  "help",
  "who",
  "inputs",
  "outputs",
  "trust",
] as const;

export async function PremiumToolSeoLandingView({
  landing,
  locale,
}: {
  landing: PremiumToolSeoLanding;
  locale: string;
}) {
  const t = await getTranslations("premiumSeo");
  const localizedToolName =
    landing.source === "revenue"
      ? getLocalizedRevenueToolTitle(landing.slug, "paid", locale, landing.toolName)
      : (getLocalizedPremiumSchema(landing.slug, locale)?.title ?? landing.toolName);

  const tokens = {
    tool: localizedToolName,
    ...landing.context,
  };

  const fill = (key: string) =>
    fillPremiumSeoTemplate(t.raw(key) as string, tokens);

  const faq = ((t.raw("faq") as FaqItem[]) ?? []).map((item) => ({
    q: fillPremiumSeoTemplate(item.q, tokens),
    a: fillPremiumSeoTemplate(item.a, tokens),
  }));

  const jsonLd: JsonLdRecord[] = [
    buildBreadcrumbJsonLd(
      [
        { name: "Home", path: "/" },
        { name: localizedToolName, path: landing.seoHref },
      ],
      locale,
    ),
  ];
  if (faq.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <div data-premium-seo-landing="true">
        <section className="sc-pro-section sc-pro-section--border">
          <Container className="sc-pro-container">
            <p className="sc-pro-eyebrow">{t("eyebrow")}</p>
            <h1 className="sc-pro-title">{fill("h1")}</h1>
            <p className="sc-pro-lead">{fill("intro")}</p>
            <div className="mt-6">
              <Link
                href={landing.premiumHref}
                className="sc-cta-primary inline-flex min-h-[44px] items-center"
                data-seo-tool-cta="true"
              >
                {fill("ctaLabel")}
              </Link>
            </div>
          </Container>
        </section>

        {SECTION_KEYS.map((key, idx) => (
          <section
            key={key}
            className={`sc-pro-section${idx % 2 === 0 ? " sc-pro-section--alt" : ""}`}
          >
            <Container className="sc-pro-container">
              <h2 className="sc-pro-headline text-lg">{fill(`${key}Title`)}</h2>
              <p className="mt-3 text-sm leading-relaxed text-body-charcoal">{fill(key)}</p>
            </Container>
          </section>
        ))}

        {faq.length > 0 ? (
          <section className="sc-pro-section sc-pro-section--border">
            <Container className="sc-pro-container">
              <h2 className="sc-pro-headline text-lg">{t("faqTitle")}</h2>
              <dl className="mt-4 space-y-4">
                {faq.map((item) => (
                  <div key={item.q}>
                    <dt className="font-semibold text-premium-velvet">{item.q}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-body-charcoal">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </Container>
          </section>
        ) : null}

        {landing.related.length > 0 ? (
          <section className="sc-pro-section sc-pro-section--alt">
            <Container className="sc-pro-container">
              <h2 className="sc-pro-headline text-lg">{t("relatedTitle")}</h2>
              <ul className="mt-3 flex flex-wrap gap-3">
                {landing.related.map((related) => (
                  <li key={related.slug}>
                    <Link href={`/seo/${related.slug}`} className="sc-crawl-index__link">
                      {related.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        ) : null}

        <section className="sc-pro-section sc-pro-section--border">
          <Container className="sc-pro-container">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={landing.premiumHref}
                className="sc-cta-primary inline-flex min-h-[44px] items-center"
                data-seo-tool-cta="true"
              >
                {fill("ctaLabel")}
              </Link>
            </div>
            <div className="mt-4">
              <DecisionToolLegalDisclaimer />
            </div>
          </Container>
        </section>
      </div>
    </PageLayout>
  );
}
