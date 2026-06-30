export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { FmeaRpnPageContent } from "./FmeaRpnPageContent";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: "Free FMEA RPN Calculator + Template | Severity Occurrence Detection Guide",
    description:
      "Calculate FMEA RPN from Severity, Occurrence and Detection. Download a free FMEA template, review a PFMEA example, and cite the calculator.",
    path: "/calculators/fmea-rpn",
    locale: locale as AppLocale,
  });
}

export default function FmeaRpnPage() {
  return <FmeaRpnPageContent />;
}
