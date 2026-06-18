import { ORGANIZATION_TRUST, organizationDescriptionForLocale } from "@/config/organization-trust";
import { buildFounderSameAs } from "@/config/knowledge-graph";
import { SITE, siteUrl } from "@/config/site";
import { absoluteImageUrl } from "@/lib/semantic/site-url";
import { isSupportedLocale, type SupportedLocale } from "@/lib/i18n/locale-routing";
import { buildLocalizedUrl } from "@/lib/seo/sitemap-manifest";
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
  const normalizedLocale: SupportedLocale = isSupportedLocale(locale) ? locale : "en";
  return buildLocalizedUrl(path, normalizedLocale, siteUrl);
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

function organizationDescription(locale: string): string {
  return organizationDescriptionForLocale(locale);
}

export function buildOrganizationJsonLd(locale = "en"): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: ORGANIZATION_TRUST.displayName,
    url: localizedUrl(locale, "/"),
    logo: absoluteImageUrl(ORGANIZATION_TRUST.logoPath),
    description: organizationDescription(locale),
    email: ORGANIZATION_TRUST.email,
    founder: {
      "@type": "Person",
      "@id": `${siteUrl}/#founder-baris-bagirlar`,
      name: ORGANIZATION_TRUST.founder.name,
      email: ORGANIZATION_TRUST.founder.email,
      sameAs: buildFounderSameAs(),
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: ORGANIZATION_TRUST.address.streetAddress,
      addressLocality: ORGANIZATION_TRUST.address.addressLocality,
      addressCountry: ORGANIZATION_TRUST.address.addressCountry,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: ORGANIZATION_TRUST.phone,
      email: ORGANIZATION_TRUST.email,
      contactType: ORGANIZATION_TRUST.contactType,
    },
    sameAs: ORGANIZATION_TRUST.sameAs,
  }) as JsonLdRecord;
}

export function buildWebsiteJsonLd(locale = "en"): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: SITE.siteName,
    url: localizedUrl(locale, "/"),
    description: organizationDescription(locale),
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: locale,
    sameAs: ORGANIZATION_TRUST.sameAs,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: localizedUrl(locale, "/free-tools?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  }) as JsonLdRecord;
}

export function buildSoftwareApplicationJsonLd(locale = "en"): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#software-application`,
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
    // Speakable specification for voice/AI assistants
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".tool-description", ".result-summary"],
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
    // Speakable specification for voice/AI
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".tool-description", ".verdict-summary"],
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

export function buildArticleJsonLd(
  article: {
    readonly slug: string;
    readonly title: string;
    readonly description: string;
    readonly headline: string;
  },
  locale = "en",
): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    name: article.title,
    description: article.description,
    url: localizedUrl(locale, `/guides/${article.slug}`),
    author: {
      "@id": `${siteUrl}/#organization`,
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: locale,
    mainEntityOfPage: localizedUrl(locale, `/guides/${article.slug}`),
  }) as JsonLdRecord;
}

/**
 * Build a HowTo schema for featured snippet eligibility.
 * Use on guide pages and tutorial-style content to win
 * "how-to" featured snippets in search results.
 */
export function buildHowToJsonLd(
  howTo: {
    readonly name: string;
    readonly description: string;
    readonly steps: ReadonlyArray<{
      readonly name: string;
      readonly text: string;
      readonly image?: string;
    }>;
    readonly totalTime?: string;
    readonly tool?: string;
  },
  locale = "en"
): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howTo.name,
    description: howTo.description,
    inLanguage: locale,
    step: howTo.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image ? { image: step.image } : {}),
    })),
    ...(howTo.totalTime ? { totalTime: howTo.totalTime } : {}),
    ...(howTo.tool ? { tool: { "@type": "HowToTool", name: howTo.tool } } : {}),
  }) as JsonLdRecord;
}

/**
 * Build a SpeakableSpecification schema for voice/AI search optimization.
 * This tells Google Assistant, Siri, Alexa which parts of the page
 * are optimized for voice playback.
 */
export function buildSpeakableJsonLd(
  cssSelectors: readonly string[],
  locale = "en"
): JsonLdRecord {
  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/#speakable`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors,
    },
    inLanguage: locale,
  }) as JsonLdRecord;
}

export function buildHomepageJsonLd(locale = "en"): JsonLdRecord[] {
  return [
    buildOrganizationJsonLd(locale),
    buildWebsiteJsonLd(locale),
    buildSoftwareApplicationJsonLd(locale),
  ];
}
