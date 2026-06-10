import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";
import { VerifyReportClient } from "@/components/verify/VerifyReportClient";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ reportId?: string; hash?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: "Verify Calculation Report — SectorCalc",
    description:
      "Verify an approved SectorCalc calculation report. Enter a Report ID to check its validity, formula version, and validation stamp.",
    path: "/verify",
    locale: locale as AppLocale,
  });
}

export default async function VerifyPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { reportId, hash } = await searchParams;

  return (
    <main className="px-4 pb-16 sm:px-6 lg:px-8">
      <VerifyReportClient reportId={reportId} hash={hash} />
    </main>
  );
}