type AppLocale = "en";
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations } from "@/lib/i18n-stub";
import { CncQuoteRiskLanding } from "@/components/launch/CncQuoteRiskLanding";
import { createPageMetadata } from "@/lib/infrastructure/metadata";


type PageProps = {
  params: Promise<{  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "cncQuoteRiskPage" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/cnc-quote-risk",
    locale: locale as AppLocale,
  });
}

export default async function CncQuoteRiskPage({ params }: PageProps) {
  const locale = "en";
  return <CncQuoteRiskLanding />;
}
