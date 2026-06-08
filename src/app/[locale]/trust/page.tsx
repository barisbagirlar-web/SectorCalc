import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ManifestoPageContent } from "@/components/manifesto/ManifestoPageContent";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: "Trust & Verification — SectorCalc",
    description:
      "Trust Trace, validation metadata, and report verification foundations. SectorCalc confirms calculation structure when a matching record exists — not a substitute for official documents.",
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
      headline="Trust & Verification"
      lead="Every governed result can carry a trust trace: canonical inputs, formula contract reference, validation status, and optional verification seal for export lookup."
    />
  );
}
