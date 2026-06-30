import { getTranslations } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/routing";
import { SITE } from "@/config/site";

type FaqItem = { readonly q: string; readonly a: string };

const PLAN_KEYS = ["businessPlan", "enterprisePlan"] as const;
const PLAN_MARKERS: Record<(typeof PLAN_KEYS)[number], string> = {
  businessPlan: "data-business-plan-card",
  enterprisePlan: "data-enterprise-plan-card",
};

export async function EnterprisePageContent() {
  const t = await getTranslations("enterprise");
  const faqItems = (t.raw("faq.items") as FaqItem[]) ?? [];

  return (
    <PageLayout>
      <div data-enterprise-page="true">
        <section
          className="sc-craft-section sc-craft-section--white sc-craft-section--border"
          aria-labelledby="enterprise-title"
        >
          <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
            <p className="sc-craft-eyebrow">{t("hero.eyebrow")}</p>
            <h1 id="enterprise-title" className="sc-craft-headline">
              {t("title")}
            </h1>
            <p className="sc-craft-lead max-w-3xl">{t("subtitle")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/beta-partner"
                className="sc-cta-primary inline-flex min-h-[44px] items-center"
                data-enterprise-demo-cta="true"
              >
                {t("demoCta")}
              </Link>
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="sc-cta-secondary inline-flex min-h-[44px] items-center"
              >
                {t("contactCta")}
              </a>
            </div>
          </Container>
        </section>

        <section className="sc-craft-section overflow-x-hidden">
          <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
            <div className="grid gap-4 md:grid-cols-2">
              {PLAN_KEYS.map((planKey) => {
                const features = (t.raw(`${planKey}.features`) as string[]) ?? [];
                return (
                  <article
                    key={planKey}
                    {...{ [PLAN_MARKERS[planKey]]: "true" }}
                    className="sc-industrial-panel sc-ledger-panel p-5 sm:p-6 min-w-0"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-premium-velvet">
                      {t(`${planKey}.badge`)}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-navy">
                      {t(`${planKey}.title`)}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-body-charcoal">
                      {t(`${planKey}.body`)}
                    </p>
                    {features.length > 0 ? (
                      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-body-charcoal">
                        {features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    ) : null}
                    <p className="mt-4 text-xs font-medium text-slate-500">
                      {t(`${planKey}.availability`)}
                    </p>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>

        <section className="sc-craft-section sc-craft-section--alt overflow-x-hidden">
          <Container
            size="wide"
            className="sc-craft-container sc-craft-container--wide min-w-0 space-y-4"
          >
            <article className="sc-industrial-panel sc-ledger-panel p-5 sm:p-6 min-w-0">
              <h2 className="text-lg font-semibold text-navy">{t("bundles.title")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-body-charcoal">{t("bundles.body")}</p>
            </article>

            <div className="grid gap-4 md:grid-cols-2">
              <article
                data-approved-reports-value="true"
                className="sc-industrial-panel sc-ledger-panel p-5 sm:p-6 min-w-0"
              >
                <h2 className="text-lg font-semibold text-navy">{t("approvedReports.title")}</h2>
                <p className="mt-2 text-sm leading-relaxed text-body-charcoal">
                  {t("approvedReports.body")}
                </p>
              </article>
              <article
                data-trust-trace-value="true"
                className="sc-industrial-panel sc-ledger-panel p-5 sm:p-6 min-w-0"
              >
                <h2 className="text-lg font-semibold text-navy">{t("trustTrace.title")}</h2>
                <p className="mt-2 text-sm leading-relaxed text-body-charcoal">
                  {t("trustTrace.body")}
                </p>
              </article>
              <article className="sc-industrial-panel sc-ledger-panel p-5 sm:p-6 min-w-0">
                <h2 className="text-lg font-semibold text-navy">{t("team.title")}</h2>
                <p className="mt-2 text-sm leading-relaxed text-body-charcoal">{t("team.body")}</p>
              </article>
              <article className="sc-industrial-panel sc-ledger-panel p-5 sm:p-6 min-w-0">
                <h2 className="text-lg font-semibold text-navy">{t("security.title")}</h2>
                <p className="mt-2 text-sm leading-relaxed text-body-charcoal">
                  {t("security.body")}
                </p>
              </article>
            </div>
          </Container>
        </section>

        {faqItems.length > 0 ? (
          <section className="sc-craft-section sc-craft-section--border">
            <Container className="sc-craft-container">
              <h2 className="sc-craft-headline text-lg">{t("faq.title")}</h2>
              <dl className="mt-4 space-y-4">
                {faqItems.map((item) => (
                  <div key={item.q}>
                    <dt className="font-semibold text-premium-velvet">{item.q}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-body-charcoal">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </Container>
          </section>
        ) : null}

        <section className="sc-craft-section sc-craft-section--alt">
          <Container className="sc-craft-container">
            <h2 className="sc-craft-headline text-lg">{t("demo.title")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-body-charcoal">{t("demo.body")}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/beta-partner"
                className="sc-cta-primary inline-flex min-h-[44px] items-center"
              >
                {t("demo.cta")}
              </Link>
              <Link
                href="/pricing"
                className="sc-cta-secondary inline-flex min-h-[44px] items-center"
              >
                {t("demo.pricingLink")}
              </Link>
            </div>
          </Container>
        </section>
      </div>
    </PageLayout>
  );
}
