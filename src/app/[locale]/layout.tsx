import type { Metadata } from "next";
import { Barlow, Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import "../globals.css";
import { OrganizationJsonLd, WebApplicationJsonLd } from "@/components/seo/JsonLd";
import { LlmsTxtLink, SeoHeadLinks } from "@/components/seo/SeoHeadLinks";
import { createPageMetadata } from "@/lib/metadata";
import { routing, type AppLocale } from "@/i18n/routing";
import { getServerRegion } from "@/lib/compliance/server-region";
import { RegionProvider } from "@/lib/compliance/region-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

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

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const region = await getServerRegion(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${barlow.variable} ${jetbrainsMono.variable}`}
      data-region={region}
    >
      <head>
        <SeoHeadLinks />
        <LlmsTxtLink />
      </head>
      <body className="min-w-0 overflow-x-hidden bg-industrial-matte font-sans text-[17px] leading-[1.47059] text-premium-velvet antialiased">
        <OrganizationJsonLd />
        <WebApplicationJsonLd />
        <NextIntlClientProvider locale={locale as AppLocale} messages={messages}>
          <RegionProvider region={region}>{children}</RegionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
