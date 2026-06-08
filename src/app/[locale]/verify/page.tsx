import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { VerifyPageClient } from "@/components/verification/VerifyPageClient";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: "Verify SectorCalc Report",
    description:
      "Check a SectorCalc verification ID format and view seal metadata. Confirms report structure when a matching record exists.",
    path: "/verify",
    locale: locale as AppLocale,
  });
}

export default async function VerifyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <VerifyPageClient />;
}
