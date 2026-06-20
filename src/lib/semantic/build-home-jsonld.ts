import { organizationDescriptionForLocale, ORGANIZATION_TRUST } from "@/config/organization-trust";
import { buildOrganizationJsonLd } from "@/lib/seo/schema-mesh";
import { buildPlatformFinancialServiceSchema } from "@/lib/semantic/build-financial-service-schema";
import { buildHomeSoftwareApplicationSchema } from "@/lib/semantic/build-software-application-schema";
import { absoluteLocalizedUrl, absoluteUrl, SITE_URL } from "@/lib/semantic/site-url";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";

const CATALOG_NAMES: Record<string, Record<string, string>> = {
  en: {
    main: "SectorCalc calculator catalog",
    free: "Free calculators",
    premium: "Premium analyzers",
    showcase: "Developer showcase",
    llm: "LLM index",
    sitemap: "Sitemap",
  },
  tr: {
    main: "SectorCalc hesap makinesi kataloğu",
    free: "Ücretsiz hesap makineleri",
    premium: "Premium analiz araçları",
    showcase: "Geliştirici vitrini",
    llm: "LLM dizini",
    sitemap: "Site haritası",
  },
  de: {
    main: "SectorCalc-Rechner-Katalog",
    free: "Kostenlose Rechner",
    premium: "Premium-Analysatoren",
    showcase: "Entwickler-Schaufenster",
    llm: "LLM-Index",
    sitemap: "Sitemap",
  },
  fr: {
    main: "Catalogue de calculatrices SectorCalc",
    free: "Calculatrices gratuites",
    premium: "Analyseurs premium",
    showcase: "Vitrine développeur",
    llm: "Index LLM",
    sitemap: "Plan du site",
  },
  es: {
    main: "Catálogo de calculadoras SectorCalc",
    free: "Calculadoras gratuitas",
    premium: "Analizadores premium",
    showcase: "Escaparate de desarrolladores",
    llm: "Índice LLM",
    sitemap: "Mapa del sitio",
  },
  ar: {
    main: "كتالوج آلات حاسبة SectorCalc",
    free: "آلات حاسبة مجانية",
    premium: "محللات مميزة",
    showcase: "واجهة المطورين",
    llm: "فهرس LLM",
    sitemap: "خريطة الموقع",
  },
};

function catalogLabel(locale: string, key: string): string {
  const base = locale.split("-")[0];
  return CATALOG_NAMES[base]?.[key] ?? CATALOG_NAMES.en[key];
}

export function buildWebsiteSchema(locale: string): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "SectorCalc",
    url: absoluteLocalizedUrl(locale, "/"),
    description: organizationDescriptionForLocale(locale),
    inLanguage: locale,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    sameAs: ORGANIZATION_TRUST.sameAs,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteLocalizedUrl(locale, "/free-tools?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  }) as JsonLdRecord;
}

export function buildHomeOfferCatalogSchema(locale: string): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: catalogLabel(locale, "main"),
    url: absoluteLocalizedUrl(locale, "/calculator-library"),
    itemListElement: [
      {
        "@type": "Offer",
        name: catalogLabel(locale, "free"),
        url: absoluteLocalizedUrl(locale, "/free-tools"),
      },
      {
        "@type": "Offer",
        name: catalogLabel(locale, "premium"),
        url: absoluteLocalizedUrl(locale, "/pro-tools"),
      },
      {
        "@type": "Offer",
        name: catalogLabel(locale, "showcase"),
        url: absoluteLocalizedUrl(locale, "/developer-showcase"),
      },
      {
        "@type": "Offer",
        name: catalogLabel(locale, "llm"),
        url: absoluteUrl("/llms.txt"),
      },
      {
        "@type": "Offer",
        name: catalogLabel(locale, "sitemap"),
        url: absoluteUrl("/sitemap.xml"),
      },
    ],
  }) as JsonLdRecord;
}

export function buildHomeJsonLd(locale: string): readonly JsonLdRecord[] {
  return [
    buildWebsiteSchema(locale),
    buildOrganizationJsonLd(locale),
    buildHomeSoftwareApplicationSchema(locale),
    buildHomeOfferCatalogSchema(locale),
    buildPlatformFinancialServiceSchema(locale),
  ];
}
