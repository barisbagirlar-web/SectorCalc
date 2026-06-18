import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SectorMarginLanding } from "@/components/launch/SectorMarginLanding";
import { CONSTRUCTION_BID_MARGIN_LANDING } from "@/data/sector-landing-pages";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "constructionBidMarginPage" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/construction-bid-margin",
    locale: locale as AppLocale,
  });
}

export default async function ConstructionBidMarginPage({ params }: PageProps) {
  const { locale } = await params;
  return <SectorMarginLanding config={CONSTRUCTION_BID_MARGIN_LANDING} />;
}
