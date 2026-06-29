export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { InvestorDemoPageContent } from "@/components/investor-demo/InvestorDemoPageContent";
import { loadInvestorPageMetrics } from "@/lib/commercial/investor-metrics-bridge";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "investorDemoPage" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
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
