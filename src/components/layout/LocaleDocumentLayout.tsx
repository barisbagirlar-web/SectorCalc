import { Barlow, Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { JsonLd, buildHomepageJsonLd } from "@/components/seo/JsonLd";
import { LlmsTxtLink, SeoHeadLinks } from "@/components/seo/SeoHeadLinks";
import type { AppLocale } from "@/i18n/routing";
import { getLocaleTextDirection } from "@/lib/i18n/locale-config";
import { getServerRegion } from "@/lib/compliance/server-region";
import { AttributionBootstrap } from "@/components/campaign/AttributionBootstrap";
import { RegionProvider } from "@/lib/compliance/region-context";
import { ServiceWorkerRegister } from "@/components/field-mode/ServiceWorkerRegister";

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
  const direction = getLocaleTextDirection(locale);

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${inter.variable} ${barlow.variable} ${jetbrainsMono.variable}`}
      data-region={region}
    >
      <head>
        <SeoHeadLinks />
        <LlmsTxtLink />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#C2410C" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-w-0 overflow-x-hidden bg-industrial-matte font-sans text-[17px] leading-[1.47059] text-premium-velvet antialiased">
        <JsonLd data={buildHomepageJsonLd(locale)} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RegionProvider region={region}>
            <AttributionBootstrap />
            <ServiceWorkerRegister />
            {children}
          </RegionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
