export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "@/lib/i18n-stub";
import { PageLayout } from "@/components/layout/PageLayout";
import { InvestorDemoPageContent } from "@/components/investor-demo/InvestorDemoPageContent";
import { loadInvestorPageMetrics } from "@/lib/features/commercial/investor-metrics-bridge";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

type PageProps = { params: Promise<{  }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "investorDemoPage" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/investor-demo",
    locale: locale as AppLocale,
  });
}

export default async function InvestorDemoPage({ params }: PageProps) {
  const locale = "en";
  setRequestLocale(locale);
  const metrics = loadInvestorPageMetrics();

  return (
    <PageLayout>
      <InvestorDemoPageContent metrics={metrics} />
    </PageLayout>
  );
}
