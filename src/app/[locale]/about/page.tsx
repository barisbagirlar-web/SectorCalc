import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ManifestoPageContent } from "@/components/manifesto/ManifestoPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";
import { buildAboutPageAuthorityJsonLd } from "@/lib/semantic/build-entity-authority-jsonld";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: "About SectorCalc",
    description:
      "Who SectorCalc serves, what we build, and what we replace — spreadsheet guesswork and ad-hoc calculators, not enterprise ERP platforms.",
    path: "/about",
    locale: locale as AppLocale,
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const authorityJsonLd = buildAboutPageAuthorityJsonLd(locale as AppLocale);

  return (
    <>
      <JsonLd data={authorityJsonLd} />
      <ManifestoPageContent
        variant="about"
        headline="About SectorCalc"
        lead="Decision tools for sector operators who need visible loss, structured inputs, and export-ready reports without hiring a full pricing desk."
      />
    </>
  );
}
