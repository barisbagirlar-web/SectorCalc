import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ManifestoPageContent } from "@/components/manifesto/ManifestoPageContent";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: "SectorCalc Manifesto — Industrial Micro-SaaS App Store",
    description:
      "SectorCalc is not a generic calculator site. We measure, detect loss, validate, and report with trust trace — for operators who need decision tools without ERP complexity.",
    path: "/manifesto",
    locale: locale as AppLocale,
  });
}

export default async function ManifestoPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ManifestoPageContent
      variant="manifesto"
      headline="SectorCalc Manifesto"
      lead="We are an Industrial Micro-SaaS App Store — not a quote template shop, not an ERP, and not a replacement for licensed professional sign-off."
    />
  );
}
