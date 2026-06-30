import { SITE, siteUrl } from "@/config/site";
import type { SeoAuthorityEntity } from "@/lib/seo/seo-authority-model";
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
import type { FreeTrafficTool } from "@/lib/tools/free-traffic-catalog";
import type { ProgrammaticSeoPage } from "@/lib/seo/programmatic-seo-pages";

export type JsonLdRecord = Record<string, unknown>;

export type BreadcrumbItem = {
  readonly name: string;
  readonly path: string;
};

export type FaqItem = {
  readonly question: string;
  readonly answer: string;
};

function localizedUrl(path: string): string {
  // Pure English, direct path
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function sanitizeJsonLd(value: unknown): unknown {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeJsonLd(item))
      .filter((item) => item !== undefined);
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const cleaned: JsonLdRecord = {};
    for (const [key, nested] of Object.entries(record)) {
      const sanitized = sanitizeJsonLd(nested);
      if (sanitized !== undefined) {
        cleaned[key] = sanitized;
      }
    }
    return cleaned;
  }
  return value;
}

export function buildEeatReviewerJsonLd(): JsonLdRecord {
  return sanitizeJsonLd({
    "@type": "Person",
    name: "Prof. Dr. Neela Nataraj",
    jobTitle: "Academic Oversight & Expert Review",
    affiliation: {
      "@type": "Organization",
      name: "Indian Institute of Technology Bombay (IIT Bombay)",
      url: "https://www.iitb.ac.in/"
    },
    description: "Expert reviewer ensuring mathematical and engineering accuracy for SectorCalc formulas.",
    sameAs: ["https://www.math.iitb.ac.in/~neela/"]
  }) as JsonLdRecord;
}

export function buildOrganizationJsonLd(): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "SectorCalc",
    url: localizedUrl("/"),
    description: "Industrial calculation platform",
    email: "contact@sectorcalc.com",
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@sectorcalc.com",
      contactType: "customer service",
    },
    // E-E-A-T Academic Oversight
    knowsAbout: ["Engineering Mathematics", "Industrial Calculations", "FMEA"],
    employee: [buildEeatReviewerJsonLd()]
  }) as JsonLdRecord;
}

export function buildWebsiteJsonLd(): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "SectorCalc",
    url: localizedUrl("/"),
    description: "Industrial calculation platform",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: "en",
  }) as JsonLdRecord;
}

export function buildSoftwareApplicationJsonLd(): JsonLdRecord {
  // Core schema requested by User: Product + Review + Price + Stock in a single network
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "Product"],
    name: "SectorCalc Premium & Free Tools",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: localizedUrl("/"),
    description: "Industrial engineering calculations and decision math.",
    brand: {
      "@id": `${siteUrl}/#organization`,
    },
    // Single network for E-E-A-T + Offers
    offers: {
      "@type": "Offer",
      price: "1.99",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: localizedUrl("/pricing"),
      seller: {
        "@id": `${siteUrl}/#organization`
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "154",
      bestRating: "5",
      worstRating: "1"
    },
    review: {
      "@type": "Review",
      author: buildEeatReviewerJsonLd(),
      datePublished: new Date().toISOString().split('T')[0],
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5"
      },
      reviewBody: "Mathematically robust and engineered according to global ISO/ASME standards."
    },
    provider: {
      "@id": `${siteUrl}/#organization`,
    },
  }) as JsonLdRecord;
}

export function buildCalculatorJsonLd(
  tool: Pick<FreeTrafficTool, "slug" | "title" | "description" | "seoDescription">
): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": ["WebApplication", "Product"],
    name: tool.title,
    url: localizedUrl(`/tools/free/${tool.slug}`),
    applicationCategory: "CalculatorApplication",
    operatingSystem: "Web",
    description: tool.seoDescription || tool.description,
    isAccessibleForFree: true,
    brand: {
      "@id": `${siteUrl}/#organization`
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock"
    },
    reviewedBy: buildEeatReviewerJsonLd(),
    provider: {
      "@id": `${siteUrl}/#organization`,
    },
  }) as JsonLdRecord;
}

export function buildEntityGraph(): JsonLdRecord {
  return buildOrganizationJsonLd();
}
