export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import Link from "@/lib/ui-shared/navigation/next-link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { DecisionToolLegalDisclaimer } from "@/components/tools/DecisionToolLegalDisclaimer";
import { FreeToolPrivacyNote } from "@/components/tools/FreeToolPrivacyNote";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import {
  getFreeToolsHref,
  getPremiumToolsHref,
  getPricingHref,
  getSampleReportHref,
} from "@/lib/features/tools/tool-links";
import { revenueLegalDisclaimer } from "@/lib/features/tools/revenue-tools";
import { PRICING_REFUND_POLICY } from "@/lib/pricing/plan-catalog";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "howItWorks" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/how-it-works",
    locale: locale as AppLocale,
  });
}

export default async function HowItWorksPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "howItWorks" });
  const sections = t.raw("sections") as Array<{
    id: string;
    title: string;
    body: string;
    bullets: string[];
  }>;
  const freeItems = t.raw("freeItems") as string[];
  const premiumItems = t.raw("premiumItems") as string[];

  return (
    <PageLayout>
      <section className="border-b border-border-subtle bg-bg-subtle py-10 sm:py-12">
        <Container>
          <p className="sc-eyebrow">{t("eyebrow")}</p>
          <h1 className="mt-3 sc-h2">{t("title")}</h1>
          <p className="mt-4 max-w-2xl sc-body-muted">{t("lead")}</p>
          <p className="mt-4 max-w-2xl text-sm font-medium text-text-primary">
            {t("privacyNote")}
          </p>
        </Container>
      </section>

      <section className="border-b border-border-subtle bg-white py-10 sm:py-14">
        <Container size="narrow">
          <div className="space-y-12">
            {sections.map((section) => {
              const body =
                section.id === "disclaimer" ? revenueLegalDisclaimer : section.body;
              return (
                <article key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="text-xl font-bold text-text-primary">{section.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
                    {body}
                  </p>
                  {section.bullets.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                      {section.bullets.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-text-secondary">
                          <span className="text-deep-navy" aria-hidden>
                            —
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-b border-border-subtle bg-bg-subtle py-10 sm:py-12">
        <Container>
          <h2 className="text-xl font-bold text-text-primary">{t("compareTitle")}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <article className="sc-card">
              <p className="sc-eyebrow text-deep-navy">{t("freeTitle")}</p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                {freeItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="sc-card border-amber/30">
              <p className="sc-eyebrow text-amber">{t("premiumTitle")}</p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                {premiumItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
          <div className="mt-8 space-y-4">
            <FreeToolPrivacyNote locale={locale} />
            <DecisionToolLegalDisclaimer variant="paid" />
          </div>
        </Container>
      </section>

      <section className="bg-white py-10 sm:py-12">
        <Container>
          <p className="text-xs leading-relaxed text-text-secondary">{PRICING_REFUND_POLICY}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={getFreeToolsHref()}
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-deep-navy hover:underline"
            >
              {t("linksFree")}
            </Link>
            <Link
              href={getSampleReportHref()}
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-text-secondary hover:text-deep-navy"
            >
              {t("linksSample")}
            </Link>
            <Link
              href={getPremiumToolsHref()}
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-text-secondary hover:text-deep-navy"
            >
              {t("linksPremium")}
            </Link>
            <Link
              href={getPricingHref()}
              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-text-secondary hover:text-deep-navy"
            >
              {t("linksPricing")}
            </Link>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
