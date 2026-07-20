import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Barlow, Barlow_Semi_Condensed, Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "@/lib/i18n-stub";
import { getMessages, setRequestLocale } from "@/lib/i18n-stub";
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
import { SITE } from "@/config/site";
import { metadataRobots } from "@/lib/infrastructure/seo/seo-indexing-control";
import { RootShell } from "@/components/layout/RootShell";
import { getFreeToolCount, getPremiumToolCount } from "@/lib/features/tools/tool-counts";
import "./globals.css";
import "./site-styles";
/* Eager CSS for client components — prevents lazy preload chunks */
import "../lib/ui-shared/auth/auth-status.css";
import "../sectorcalc/pro-form/universal-industrial-decision-form.css";
import "../styles/mobile-navigation.css";

const ROOT_METADATA_BASE = new URL(SITE.url);
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

/** Heading font for .pro-title - preload for free-tool LCP (Constraint 1). */
const barlowSemiCondensed = Barlow_Semi_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  variable: "--font-barlow-semi-condensed",
  display: "swap",
  preload: true,
});

const barlow = Barlow({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

/**
 * Host-aware robots: preview/web.app get DOM noindex so header (middleware)
 * and <meta name="robots"> stay consistent. Middleware sets x-sc-robots-policy.
 * Prefer production host if any host signal is sectorcalc.com (Firebase rewrite
 * Host is often *.run.app / *.web.app even for the custom domain).
 */
export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const policy = h.get("x-sc-robots-policy");
  if (policy === "index") {
    return { metadataBase: ROOT_METADATA_BASE, robots: metadataRobots() };
  }
  if (policy === "noindex") {
    return {
      metadataBase: ROOT_METADATA_BASE,
      robots: {
        index: false,
        follow: true,
        googleBot: { index: false, follow: true },
      },
    };
  }

  const hosts = [
    h.get("x-fh-requested-host"),
    h.get("x-forwarded-host")?.split(",")[0]?.trim(),
    h.get("host"),
  ]
    .map((v) => (v ?? "").trim().toLowerCase().split(":")[0] ?? "")
    .filter((v) => v.length > 0);

  const isPublic = hosts.some(
    (host) => host === "sectorcalc.com" || host === "www.sectorcalc.com",
  );
  if (isPublic) {
    return { metadataBase: ROOT_METADATA_BASE, robots: metadataRobots() };
  }

  const isPreviewHost = hosts.some(
    (host) =>
      host.endsWith(".web.app") ||
      host.endsWith(".firebaseapp.com") ||
      host.endsWith(".run.app") ||
      host === "0.0.0.0" ||
      host === "localhost" ||
      host === "127.0.0.1",
  );

  if (isPreviewHost) {
    return {
      metadataBase: ROOT_METADATA_BASE,
      robots: {
        index: false,
        follow: true,
        googleBot: { index: false, follow: true },
      },
    };
  }

  return {
    metadataBase: ROOT_METADATA_BASE,
    robots: metadataRobots(),
  };
}

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
  const { freeToolInputs, ...clientMessages } = messages as any;

  const { region, source } = await getServerRegion(locale);
  const freeToolsCount = getFreeToolCount();
  const proToolsCount = getPremiumToolCount();

  return (
    <html
      lang={locale}
      dir="ltr"
      className={`${inter.variable} ${barlowSemiCondensed.variable} ${barlow.variable} ${jetbrainsMono.variable}`.trim()}
      data-region={region}
      data-locale={locale}
    >
      <head>
        <link rel="dns-prefetch" href="https://sectorcalc.com" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        <link rel="dns-prefetch" href="https://identitytoolkit.googleapis.com" />
        <link rel="dns-prefetch" href="https://securetoken.googleapis.com" />
        <link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://identitytoolkit.googleapis.com" crossOrigin="anonymous" />

        <SeoHeadLinks />
        <LlmsTxtLink />
        <AuthorAuthorityHeadLinks />

        <link rel="hub" href="https://pubsubhubbub.appspot.com/" />
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
            <RootShell freeToolsCount={freeToolsCount} proToolsCount={proToolsCount}>
              {children}
            </RootShell>
          </RegionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
