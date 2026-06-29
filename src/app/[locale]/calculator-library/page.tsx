export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CalculatorLibraryContent } from "@/components/library/CalculatorLibraryContent";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "calculatorLibrary" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/calculator-library",
    locale: locale as AppLocale,
  });
}

export default async function CalculatorLibraryPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("calculatorLibrary");

  return (
    <CalculatorLibraryContent
      title={t("title")}
      lead={t("lead")}
      resourcesTitle={t("resourcesTitle")}
      catalogsTitle={t("catalogsTitle")}
      llmsLabel={t("llmsLabel")}
      indexLabel={t("indexLabel")}
      faqLabel={t("faqLabel")}
      servicesLabel={t("servicesLabel")}
      freeToolsLabel={t("freeToolsLabel")}
      premiumToolsLabel={t("premiumToolsLabel")}
      industriesLabel={t("industriesLabel")}
      generatedToolsLabel={t("generatedToolsLabel")}
    />
  );
}
