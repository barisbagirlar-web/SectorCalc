type AppLocale = "en";
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { FmeaRpnPageContent } from "./FmeaRpnPageContent";

type PageProps = { params: Promise<{  }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  return createPageMetadata({
    title: "FMEA RPN Calculator for Severity Occurrence Detection Scoring",
    description: "Calculate traditional FMEA RPN from Severity, Occurrence and Detection. Includes PFMEA example, template, validation cases and academic citation formats.",
    path: "/calculators/fmea-rpn",
    locale: locale as AppLocale,
  });
}

export default function FmeaRpnPage() {
  return <FmeaRpnPageContent />;
}
