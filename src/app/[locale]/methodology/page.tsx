import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ManifestoPageContent } from "@/components/manifesto/ManifestoPageContent";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: "SectorCalc Methodology — Dual-Intelligence & Calculation Governance",
    description:
      "How SectorCalc uses contract-driven requirements, deterministic calculation, validation oracles, and calculation summary metadata — LLM is interface-only, never the math engine.",
    path: "/methodology",
    locale: locale as AppLocale,
  });
}

export default async function MethodologyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ManifestoPageContent
      variant="methodology"
      headline="Methodology"
      lead="Dual-Intelligence governance: requirement resolution before calculation, validation and oracle coverage after — with a calculation summary on every full-loop result."
    />
  );
}
