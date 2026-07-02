export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "@/lib/ui-shared/navigation/next-link";
import { PageLayout } from "@/components/layout/PageLayout";
import PageHero from "@/components/shared/PageHero";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/sections/CTASection";
import { ConsultantAccessCta } from "@/components/leads/ConsultantAccessCta";
import { ToolsTileGrid } from "@/components/tools/ToolsTileGrid";
import { getLocalizedAllTools } from "@/data/tools";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import type { AppLocale } from "@/i18n/routing";


type PageProps = { params: Promise<{  }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "forConsultants" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/for-consultants",
    locale: locale as AppLocale,
  });
}

export default async function ForConsultantsPage({ params }: PageProps) {
  const locale = "en";
  setRequestLocale(locale);
  const t = await getTranslations("forConsultants");

  const audienceCount = 6;
  const benefitCount = 3;

  return (
    <PageLayout>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <section className="py-12 md:py-16">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
            {t("builtFor")}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: audienceCount }, (_, i) => (
              <li
                key={i}
                className="rounded-full border border-border-subtle bg-bg-subtle px-3 py-1.5 text-sm text-text-primary"
              >
                {t(`audience.${i}`)}
              </li>
            ))}
          </ul>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {Array.from({ length: benefitCount }, (_, i) => (
              <article
                key={i}
                className="rounded-sm border border-border-subtle bg-white p-6 shadow-card"
              >
                <h2 className="text-lg font-bold text-text-primary">{t(`benefits.${i}.title`)}</h2>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {t(`benefits.${i}.description`)}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-12">
            <h2 className="text-xl font-bold text-text-primary">{t("allCalculators")}</h2>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              {t("allCalculatorsDesc")}
            </p>
            <div className="mt-6">
              <ToolsTileGrid tools={getLocalizedAllTools(locale)} />
            </div>
            <p className="mt-4 text-sm text-text-secondary">
              <Link href="/pricing" className="font-semibold text-deep-navy hover:underline">
                {t("viewPricing")}
              </Link>
            </p>
          </div>
          <div className="mt-12 rounded-sm border border-professional-blue/30 bg-bg-primary p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold text-premium-velvet">{t("consultantProgram")}</h2>
            <p className="mx-auto mt-4 max-w-xl text-body-charcoal">
              {t("consultantProgramDesc")}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ConsultantAccessCta />
              <Link
                href="/reports/sample-decision-report"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-technical-gray px-6 py-2.5 text-base font-semibold text-premium-velvet hover:bg-industrial-matte"
              >
                {t("seeSampleReport")}
              </Link>
            </div>
          </div>
        </Container>
      </section>
      <CTASection
        title={t("ctaTitle")}
        subtitle={t("ctaSubtitle")}
        primaryLabel={t("ctaPrimary")}
        primaryHref="/industries"
        secondaryLabel={t("ctaSecondary")}
        secondaryHref="/pricing"
      />
    </PageLayout>
  );
}
