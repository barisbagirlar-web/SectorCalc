import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { CommercialTiersOverview } from "@/components/commercial/CommercialTiersOverview";
import { PublicDemoCrossLinks } from "@/components/commercial/PublicDemoCrossLinks";
import { Link } from "@/i18n/routing";
import { LeadCaptureCta } from "@/components/commercial/LeadCaptureCta";
import { PaywallPreview } from "@/components/commercial/PaywallPreview";
import { PremiumLockedReportPreview } from "@/components/commercial/PremiumLockedReportPreview";
import { PricingPlansGrid } from "@/components/sections/PricingPlansGrid";
import { PricingPageTracker } from "@/components/campaign/PricingPageTracker";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

export const revalidate = 3600;
export const dynamic = "force-static";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: "Pricing for Sector Calculators and Decision Reports | SectorCalc",
    description:
      "Free sector checks, premium decision reports, sector packs, and Pro workspace. Paywall preview and early-access CTAs — no live payment wiring in this phase.",
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
      <div className="public-demo-page">
      <PricingPageTracker />
      <section className="sc-pro-section sc-pro-section--alt sc-pro-section--border">
        <Container className="sc-pro-container">
          <p className="sc-pro-eyebrow">{t("eyebrow")}</p>
          <h1 className="sc-pro-title sc-pro-title--compact">{t("title")}</h1>
          <p className="sc-pro-lead">{t("tagline")}</p>
          <p className="sc-pro-lead mt-2 text-sm">{t("singleReportNote")}</p>
          <p className="mt-4 text-sm text-text-secondary">
            <Link href="/investor-demo" className="font-semibold text-deep-navy hover:underline">
              Investor demo pack
            </Link>
            {" · "}
            <Link href="/operating-system" className="font-semibold text-deep-navy hover:underline">
              Operating system
            </Link>
            {" · "}
            <Link href="/reports/sample-decision-report" className="font-semibold text-deep-navy hover:underline">
              Sample report preview
            </Link>
          </p>
          <hr className="sc-ledger-separator" />
        </Container>
      </section>
      <PricingPlansGrid showHeader={false} tierMode="pro-focused" />
      <CommercialTiersOverview />
      <PaywallPreview />
      <PremiumLockedReportPreview />
      <LeadCaptureCta />
      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container pb-10">
          <PublicDemoCrossLinks current="pricing" />
        </Container>
      </section>
      </div>
    </PageLayout>
  );
}
