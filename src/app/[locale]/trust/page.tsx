import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ManifestoPageContent } from "@/components/manifesto/ManifestoPageContent";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: "Calculation Governance — SectorCalc",
    description:
      "Calculation summary metadata, validation coverage, and governed export foundations. SectorCalc documents how results were derived — not a substitute for official documents.",
    path: "/trust",
    locale: locale as AppLocale,
  });
}

export default async function TrustPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ManifestoPageContent
      variant="trust"
      headline="Calculation Governance"
      lead="Every governed result can carry a calculation summary: canonical inputs, formula contract reference, validation status, and export-ready decision context."
    />
  );
}
