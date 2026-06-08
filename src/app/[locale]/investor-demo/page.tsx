import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { InvestorDemoPageContent } from "@/components/investor-demo/InvestorDemoPageContent";
import { loadInvestorPageMetrics } from "@/lib/commercial/investor-metrics-bridge";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: "Investor Demo — SectorCalc Operating System",
    description:
      "Live Smart Form pilots, formula governance proof, dual-core calculation intelligence, and Tool Factory direction for sector margin decisions.",
    path: "/investor-demo",
    locale: locale as AppLocale,
  });
}

export default async function InvestorDemoPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const metrics = loadInvestorPageMetrics();

  return (
    <PageLayout>
      <InvestorDemoPageContent metrics={metrics} />
    </PageLayout>
  );
}
