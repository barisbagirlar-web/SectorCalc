import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { CommercialTiersOverview } from "@/components/commercial/CommercialTiersOverview";
import { LeadCaptureCta } from "@/components/commercial/LeadCaptureCta";
import { PaywallPreview } from "@/components/commercial/PaywallPreview";
import { PremiumLockedReportPreview } from "@/components/commercial/PremiumLockedReportPreview";
import { PricingPlansGrid } from "@/components/sections/PricingPlansGrid";
import { PricingPageTracker } from "@/components/campaign/PricingPageTracker";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: "Pricing for Sector Calculators and Decision Reports | SectorCalc",
    description:
      "Start free and upgrade to premium decision reports, hidden-loss diagnostics, threshold checks and export-ready outputs.",
    path: "/pricing",
    locale: locale as AppLocale,
  });
}

export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");

  return (
    <PageLayout>
      <PricingPageTracker />
      <section className="sc-pro-section sc-pro-section--alt sc-pro-section--border">
        <Container className="sc-pro-container">
          <p className="sc-pro-eyebrow">{t("eyebrow")}</p>
          <h1 className="sc-pro-title sc-pro-title--compact">{t("title")}</h1>
          <p className="sc-pro-lead">{t("tagline")}</p>
          <p className="sc-pro-lead mt-2 text-sm">{t("singleReportNote")}</p>
          <hr className="sc-ledger-separator" />
        </Container>
      </section>
      <PricingPlansGrid showHeader={false} tierMode="pro-focused" />
      <CommercialTiersOverview />
      <PaywallPreview />
      <PremiumLockedReportPreview />
      <LeadCaptureCta />
    </PageLayout>
  );
}
