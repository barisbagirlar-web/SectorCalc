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

function localizedUrl(locale: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") {
    return `${siteUrl}/${locale}`;
  }
  return `${siteUrl}/${locale}${normalized}`;
}

/** Strip undefined/null recursively for safe JSON-LD output. */
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

export function buildOrganizationJsonLd(locale = "en"): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: SITE.siteName,
    url: localizedUrl(locale, "/"),
    description: SITE.defaultDescription,
    email: SITE.contactEmail,
    contactPoint: {
      "@type": "ContactPoint",
      email: SITE.contactEmail,
      contactType: "customer service",
    },
  }) as JsonLdRecord;
}

export function buildWebsiteJsonLd(locale = "en"): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: SITE.siteName,
    url: localizedUrl(locale, "/"),
    description: SITE.defaultDescription,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: locale,
  }) as JsonLdRecord;
}

export function buildSoftwareApplicationJsonLd(locale = "en"): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.siteName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: localizedUrl(locale, "/"),
    description: SITE.defaultDescription,
    offers: [
      {
        "@type": "Offer",
        name: "Free calculators",
        price: "0",
        priceCurrency: "USD",
        url: localizedUrl(locale, "/free-tools"),
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "19",
        priceCurrency: "USD",
        url: localizedUrl(locale, "/pricing"),
      },
    ],
    provider: {
      "@id": `${siteUrl}/#organization`,
    },
  }) as JsonLdRecord;
}

export function buildCalculatorJsonLd(
  tool: Pick<FreeTrafficTool, "slug" | "title" | "description" | "seoDescription">,
  locale = "en"
): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    url: localizedUrl(locale, `/tools/free/${tool.slug}`),
    applicationCategory: "CalculatorApplication",
    operatingSystem: "Web",
    description: tool.seoDescription || tool.description,
    isAccessibleForFree: true,
    provider: {
      "@id": `${siteUrl}/#organization`,
    },
  }) as JsonLdRecord;
}

export function buildPremiumAnalyzerJsonLd(
  schema: PremiumCalculatorSchema,
  locale = "en"
): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: schema.name,
    url: localizedUrl(locale, `/tools/premium-schema/${schema.id}`),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: schema.painStatement,
    provider: {
      "@id": `${siteUrl}/#organization`,
    },
    offers: {
      "@type": "Offer",
      url: localizedUrl(locale, "/pricing"),
      priceCurrency: "USD",
      description: "Single decision reports from $9 or Pro access from $19/mo.",
    },
  }) as JsonLdRecord;
}

export function buildBreadcrumbJsonLd(
  items: readonly BreadcrumbItem[],
  locale = "en"
): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: localizedUrl(locale, item.path),
    })),
  }) as JsonLdRecord;
}

export function buildFAQJsonLd(faq: readonly FaqItem[]): JsonLdRecord | null {
  const valid = faq.filter(
    (item) => item.question.trim().length > 0 && item.answer.trim().length > 0
  );
  if (valid.length === 0) {
    return null;
  }

  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: valid.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }) as JsonLdRecord;
}

export function buildItemListJsonLd(
  items: readonly { name: string; path: string }[],
  listName: string,
  locale = "en"
): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: localizedUrl(locale, item.path),
    })),
  }) as JsonLdRecord;
}

export function buildSeoHubJsonLd(page: ProgrammaticSeoPage, locale = "en"): JsonLdRecord[] {
  const graphs: JsonLdRecord[] = [
    buildBreadcrumbJsonLd(
      [
        { name: "Home", path: "/" },
        { name: page.title, path: `/seo/${page.slug}` },
      ],
      locale
    ),
    buildItemListJsonLd(
      [...page.freeToolLinks, ...page.premiumAnalyzerLinks].map((link) => ({
        name: link.label,
        path: link.href,
      })),
      page.title,
      locale
    ),
  ];

  const faq = buildFAQJsonLd(page.faq);
  if (faq) {
    graphs.push(faq);
  }

  return graphs;
}

export function buildEntityJsonLd(entity: SeoAuthorityEntity): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": entity.type,
    name: entity.name,
    description: entity.description,
    url: entity.url,
    keywords: entity.keywords.join(", "),
  }) as JsonLdRecord;
}

export function buildHomepageJsonLd(locale = "en"): JsonLdRecord[] {
  return [
    buildOrganizationJsonLd(locale),
    buildWebsiteJsonLd(locale),
    buildSoftwareApplicationJsonLd(locale),
  ];
}
