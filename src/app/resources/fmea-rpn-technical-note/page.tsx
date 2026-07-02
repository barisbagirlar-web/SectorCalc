export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { TechnicalNoteContent } from "./TechnicalNoteContent";

type PageProps = { params: Promise<{  }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  return createPageMetadata({
    title: "FMEA RPN Calculator Technical Note",
    description: "Technical note documenting traditional RPN calculation for FMEA: formula, validation cases, PFMEA example, limitations, and citation formats.",
    path: "/resources/fmea-rpn-technical-note",
    locale: locale as AppLocale,
  });
}

export default function TechnicalNotePage() { return <TechnicalNoteContent />; }
