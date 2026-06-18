import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SectorMarginLanding } from "@/components/launch/SectorMarginLanding";
import { CLEANING_CONTRACT_MARGIN_LANDING } from "@/data/sector-landing-pages";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cleaningContractMarginPage" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/cleaning-contract-margin",
    locale: locale as AppLocale,
  });
}

export default async function CleaningContractMarginPage({ params }: PageProps) {
  const { locale } = await params;
  return <SectorMarginLanding config={CLEANING_CONTRACT_MARGIN_LANDING} />;
}
