import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import "./site-styles";
import "../globals.css";
import { LocaleDocumentLayout } from "@/components/layout/LocaleDocumentLayout";
import { RootLocaleAutoRedirect } from "@/components/i18n/RootLocaleAutoRedirect";
import { createPageMetadata } from "@/lib/metadata";
import { routing, type AppLocale } from "@/i18n/routing";

export const metadata: Metadata = createPageMetadata();

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <LocaleDocumentLayout locale={locale as AppLocale}>
      {locale === "en" ? <RootLocaleAutoRedirect /> : null}
      {children}
    </LocaleDocumentLayout>
  );
}
