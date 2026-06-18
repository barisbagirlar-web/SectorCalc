import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CncQuoteRiskLanding } from "@/components/launch/CncQuoteRiskLanding";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cncQuoteRiskPage" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/cnc-quote-risk",
    locale: locale as AppLocale,
  });
}

export default async function CncQuoteRiskPage({ params }: PageProps) {
  const { locale } = await params;
  return <CncQuoteRiskLanding />;
}
