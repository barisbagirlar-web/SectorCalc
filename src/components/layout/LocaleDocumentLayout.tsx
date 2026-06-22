import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { AuthorAuthorityHeadLinks } from "@/components/seo/AuthorAuthorityHeadLinks";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildSoftwareApplicationJsonLd, buildWebsiteJsonLd } from "@/lib/seo/schema-mesh";
import { buildEntityGraph } from "@/lib/seo/entity-graph";
import { LlmsTxtLink, SeoHeadLinks } from "@/components/seo/SeoHeadLinks";
import type { AppLocale } from "@/i18n/routing";
import { getLocaleTextDirection } from "@/lib/i18n/locale-config";
import { getServerRegion } from "@/lib/compliance/server-region";
import { RegionProvider } from "@/lib/compliance/region-context";
import { ServiceWorkerRegister } from "@/components/field-mode/ServiceWorkerRegister";
import { AttributionBootstrap } from "@/components/campaign/AttributionBootstrap";
import { GeoLocaleBootstrapScript } from "@/components/i18n/GeoLocaleBootstrapScript";
import { THEME_COLOR } from "@/config/organization-trust";
import { notoSansArabic } from "@/lib/fonts/noto-sans-arabic";

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

type LocaleDocumentLayoutProps = Readonly<{
  locale: AppLocale;
  children: React.ReactNode;
}>;

export async function LocaleDocumentLayout({ locale, children }: LocaleDocumentLayoutProps) {
  setRequestLocale(locale);
  const messages = await getMessages();
  const { region, source } = await getServerRegion(locale);
  const direction = getLocaleTextDirection(locale);

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${inter.variable} ${jetbrainsMono.variable} ${locale === "ar" ? notoSansArabic.variable : ""}`.trim()}
      data-region={region}
      data-locale={locale}
    >
      <head>
        {locale === "en" ? <GeoLocaleBootstrapScript /> : null}

        {/* === DNS PREFETCH & PRECONNECT (Predictive Preconnect) === */}
        <link rel="dns-prefetch" href="https://www.sectorcalc.com" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        <link rel="dns-prefetch" href="https://identitytoolkit.googleapis.com" />
        <link rel="dns-prefetch" href="https://securetoken.googleapis.com" />
        <link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://identitytoolkit.googleapis.com" crossOrigin="anonymous" />

        {/* === ORIGIN TRIALS & PRELOAD HINTS === */}
        <link rel="preload" href="/manifest.webmanifest" as="fetch" crossOrigin="anonymous" />

        {/* === SEO HEAD LINKS (AI txt, LLMs, etc.) === */}
        <SeoHeadLinks />
        <LlmsTxtLink />
        <AuthorAuthorityHeadLinks />

        {/* === PUBSUBHUBBUB (Instant indexing notifications) === */}
        <link rel="hub" href="https://pubsubhubbub.appspot.com/" />
        <link rel="alternate" type="application/rss+xml" href="/guides/rss.xml" title="SectorCalc Guides — Calculation guides, industry insights and decision tool walkthroughs" />

        {/* === PWA MANIFEST === */}
        <link rel="manifest" href="/manifest.webmanifest" />

        {/* === THEME COLOR === */}
        <meta name="theme-color" content={THEME_COLOR} />
        <meta name="color-scheme" content="light dark" />

        {/* === SEARCH ENGINE VERIFICATION === */}
        <meta name="google-site-verification" content="YC4-K4Q1XVrErVW2UE9eNe4Tni2hhFFmBhF8dZjcVoY" />
        <meta name="msvalidate.01" content="C97289CA0F699D6B9053113A5E8FAD2A" />

        {/* === MOBILE & APP METADATA === */}
        <link
          rel="apple-touch-icon"
          href="/img/brand/sectorcalc-favicon-180.png"
          sizes="180x180"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SectorCalc" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* === AI & CRAWLER METADATA === */}
        <meta name="robots" content="index, follow, max-snippet:160, max-image-preview:large" />
        <meta name="googlebot" content="index, follow, max-snippet:160, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-snippet:160, max-image-preview:large" />
      </head>
      <body className="min-w-0 overflow-x-hidden bg-industrial-matte font-sans text-[17px] leading-[1.47059] text-premium-velvet antialiased">
        {/* === GLOBAL JSON-LD SCHEMA (Entity Graph + WebSite + Software) === */}
        <JsonLd
          data={[
            buildEntityGraph(locale),
            buildWebsiteJsonLd(locale),
            buildSoftwareApplicationJsonLd(locale),
          ]}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
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
