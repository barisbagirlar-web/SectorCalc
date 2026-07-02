import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { AuthorAuthorityHeadLinks } from "@/components/seo/AuthorAuthorityHeadLinks";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildSoftwareApplicationJsonLd, buildWebsiteJsonLd } from "@/lib/infrastructure/seo/schema-mesh";
import { buildEntityGraph } from "@/lib/infrastructure/seo/entity-graph";
import { LlmsTxtLink, SeoHeadLinks } from "@/components/seo/SeoHeadLinks";
import { getServerRegion } from "@/lib/features/compliance/server-region";
import { RegionProvider } from "@/lib/features/compliance/region-context";
import { ServiceWorkerRegister } from "@/components/field-mode/ServiceWorkerRegister";
import { AttributionBootstrap } from "@/components/campaign/AttributionBootstrap";
import { THEME_COLOR } from "@/config/organization-trust";
import { metadataRobots } from "@/lib/infrastructure/seo/seo-indexing-control";
import "./globals.css";
import "./site-styles.ts";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  robots: metadataRobots(),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: THEME_COLOR,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = "en";
  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  
  // Strip server-only free tool inputs dictionary to prevent massive client payload injection
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { freeToolInputs, ...clientMessages } = messages as any;
  
  const { region, source } = await getServerRegion(locale);

  return (
    <html
      lang={locale}
      dir="ltr"
      className={`${inter.variable} ${jetbrainsMono.variable}`.trim()}
      data-region={region}
      data-locale={locale}
    >
      <head>
        <link rel="dns-prefetch" href="https://www.sectorcalc.com" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        <link rel="dns-prefetch" href="https://identitytoolkit.googleapis.com" />
        <link rel="dns-prefetch" href="https://securetoken.googleapis.com" />
        <link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://identitytoolkit.googleapis.com" crossOrigin="anonymous" />

        <SeoHeadLinks />
        <LlmsTxtLink />
        <AuthorAuthorityHeadLinks />

        <link rel="hub" href="https://pubsubhubbub.appspot.com/" />
        <link rel="alternate" type="application/rss+xml" href="/guides/rss.xml" title="SectorCalc Guides" />
        <link rel="manifest" href="/manifest.webmanifest" />

        <meta name="theme-color" content={THEME_COLOR} />
        <meta name="color-scheme" content="light dark" />

        <meta name="google-site-verification" content="YC4-K4Q1XVrErVW2UE9eNe4Tni2hhFFmBhF8dZjcVoY" />
        <meta name="msvalidate.01" content="C97289CA0F699D6B9053113A5E8FAD2A" />

        <link rel="apple-touch-icon" href="/img/brand/sectorcalc-mark.png" sizes="180x180" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SectorCalc" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-w-0 overflow-x-hidden bg-industrial-matte font-sans text-[17px] leading-[1.47059] text-premium-velvet antialiased">
        <JsonLd
          data={[
            buildEntityGraph(locale as any),
            buildWebsiteJsonLd(locale as any),
            buildSoftwareApplicationJsonLd(locale as any),
          ]}
        />
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <RegionProvider region={region} source={source}>
            <AttributionBootstrap />
            <ServiceWorkerRegister />
            {children}
          </RegionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
