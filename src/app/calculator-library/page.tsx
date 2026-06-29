/* eslint-disable */
// @ts-nocheck

export const dynamic = "force-dynamic";
import { getTranslations } from "next-intl/server";

import type { Metadata } from "next";
import { CalculatorLibraryContent } from "@/components/library/CalculatorLibraryContent";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations();
  return createPageMetadata({
    title: "Calculator Library | SectorCalc",
    description: "All calculation tools category library.",
    path: "/calculator-library",
    locale: locale as "en",
  });
}

export default async function CalculatorLibraryPage({ params }: PageProps) {
  const locale = "en";
  
  const t = await getTranslations();

  return (
    <CalculatorLibraryContent
      title={"title"}
      lead={"lead"}
      resourcesTitle={"resourcesTitle"}
      catalogsTitle={"catalogsTitle"}
      llmsLabel={"llmsLabel"}
      indexLabel={"indexLabel"}
      faqLabel={"faqLabel"}
      servicesLabel={"servicesLabel"}
      freeToolsLabel={"freeToolsLabel"}
      premiumToolsLabel={"premiumToolsLabel"}
      industriesLabel={"industriesLabel"}
    />
  );
}
