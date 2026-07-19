type AppLocale = "en";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { FmeaRpnPageContent } from "./FmeaRpnPageContent";

/**
 * Static metadata for FMEA RPN — robots + canonical must appear in the DOM
 * <head> (not only as X-Robots-Tag). force-dynamic removed so Next.js emits
 * the Metadata API tags into the SSR HTML head consistently.
 */
export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata({
    title: "FMEA RPN Calculator for Severity Occurrence Detection Scoring",
    description:
      "Calculate traditional FMEA RPN from Severity, Occurrence and Detection. Includes PFMEA example, template, validation cases and academic citation formats.",
    path: "/calculators/fmea-rpn",
    locale: "en" as AppLocale,
  });
}

export default function FmeaRpnPage() {
  return <FmeaRpnPageContent />;
}
