import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { createPageMetadata } from "@/lib/metadata";
import { redirect, type AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string; hash: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: "Verify Trust Trace — SectorCalc",
    description: "Verify a SectorCalc Trust Trace cryptographic report hash.",
    path: "/verify",
    locale: locale as AppLocale,
  });
}

export default async function VerifyHashPage({ params }: PageProps) {
  const { locale, hash } = await params;
  setRequestLocale(locale);

  if (!/^[a-f0-9]{64}$/.test(hash)) {
    redirect({ href: "/verify", locale: locale as AppLocale });
  }

  redirect({
    href: { pathname: "/verify", query: { hash } },
    locale: locale as AppLocale,
  });
}
