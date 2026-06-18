import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "@/lib/navigation/next-link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { SampleDecisionReportLayout } from "@/components/reports/SampleDecisionReportLayout";
import { CTASection } from "@/components/sections/CTASection";
import { SAMPLE_REPORT_INCLUDES } from "@/data/sample-report-content";
import { createPageMetadata } from "@/lib/metadata";
import { getFreeToolsHref, getPricingHref } from "@/lib/tools/tool-links";
import { SINGLE_VERDICT_CTA } from "@/lib/pricing/plan-catalog";
import type { AppLocale } from "@/i18n/locales";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sampleReportPage" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/reports/sample-decision-report",
    locale: locale as AppLocale,
  });
}

export default async function SampleDecisionReportPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sampleReportPage");

  return (
    <PageLayout>
      <section className="border-b border-border-subtle bg-white py-10 md:py-12">
        <Container size="narrow">
          <p className="sc-eyebrow">{t("eyebrow")}</p>
          <h1 className="mt-3 sc-h2">{t("title")}</h1>
          <p className="mt-4 max-w-2xl sc-body-muted">{t("description")}</p>
          <p className="mt-6 text-sm font-semibold text-text-secondary">
            {t("sampleReportIncludes")}
          </p>
          <ul className="mt-2 space-y-2 text-sm text-text-secondary">
            {SAMPLE_REPORT_INCLUDES.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="font-semibold text-deep-navy" aria-hidden>
                  —
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-text-secondary">
            <Link href={getPricingHref()} className="font-semibold text-deep-navy hover:underline">
              {SINGLE_VERDICT_CTA}
            </Link>
            {" · "}
            <Link href={getFreeToolsHref()} className="font-semibold text-deep-navy hover:underline">
              {t("startFree")}
            </Link>
          </p>
        </Container>
      </section>
      <SampleDecisionReportLayout />
      <CTASection
        eyebrow={t("ctaEyebrow")}
        title={t("ctaTitle")}
        subtitle={t("ctaSubtitle")}
        primaryLabel={t("ctaPrimary")}
        primaryHref={getFreeToolsHref()}
        secondaryLabel={t("ctaSecondary")}
        secondaryHref={getPricingHref()}
      />
    </PageLayout>
  );
}
