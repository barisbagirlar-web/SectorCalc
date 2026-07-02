export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations } from "@/lib/i18n-stub";
import { SectorMarginLanding } from "@/components/launch/SectorMarginLanding";
import { CLEANING_CONTRACT_MARGIN_LANDING } from "@/data/sector-landing-pages";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

type PageProps = {
  params: Promise<{  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "cleaningContractMarginPage" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/cleaning-contract-margin",
    locale: locale as AppLocale,
  });
}

export default async function CleaningContractMarginPage({ params }: PageProps) {
  const locale = "en";
  return <SectorMarginLanding config={CLEANING_CONTRACT_MARGIN_LANDING} />;
}
