import { Barlow, Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { JsonLd, buildHomepageJsonLd } from "@/components/seo/JsonLd";
import { LlmsTxtLink, SeoHeadLinks } from "@/components/seo/SeoHeadLinks";
import type { AppLocale } from "@/i18n/routing";
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

type LocaleDocumentLayoutProps = Readonly<{
  locale: AppLocale;
  children: React.ReactNode;
}>;

export async function LocaleDocumentLayout({ locale, children }: LocaleDocumentLayoutProps) {
  setRequestLocale(locale);
  const messages = await getMessages();
  const region = await getServerRegion(locale);

  return (
    <html
      lang={locale}
      dir="ltr"
      className={`${inter.variable} ${barlow.variable} ${jetbrainsMono.variable}`}
      data-region={region}
    >
      <head>
        <SeoHeadLinks />
        <LlmsTxtLink />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-w-0 overflow-x-hidden bg-industrial-matte font-sans text-[17px] leading-[1.47059] text-premium-velvet antialiased">
        <JsonLd data={buildHomepageJsonLd(locale)} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RegionProvider region={region}>{children}</RegionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
