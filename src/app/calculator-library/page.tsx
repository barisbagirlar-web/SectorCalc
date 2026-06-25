import { getTranslations } from "next-intl/server";
// @ts-nocheck
import type { Metadata } from "next";
import { CalculatorLibraryContent } from "@/components/library/CalculatorLibraryContent";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations();
  return createPageMetadata({
    title: "Hesaplayıcı Kütüphanesi | SectorCalc",
    description: "Tüm hesaplama araçları kategori kütüphanesi.",
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
