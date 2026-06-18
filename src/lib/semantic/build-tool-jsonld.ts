import { buildToolReferenceCreatorPersonJsonLd } from "@/lib/semantic/build-tool-creator-jsonld";
import { buildCalculateActionSchema } from "@/lib/semantic/build-calculate-action-schema";
import {
  buildFinancialServiceSchema,
  shouldUseFinancialService,
} from "@/lib/semantic/build-financial-service-schema";
import { buildSoftwareApplicationSchema } from "@/lib/semantic/build-software-application-schema";
import { absoluteLocalizedUrl } from "@/lib/semantic/site-url";
import { pickLocaleText } from "@/lib/semantic/semantic-locale-utils";
import type { SemanticToolContract } from "@/lib/semantic/tool-semantic-types";
import { sanitizeJsonLd, type JsonLdRecord } from "@/lib/seo/schema-mesh";
import { translateCalculatorPhrase } from "@/lib/i18n/calculator-phrase-translate";

const TIER_LABELS: Record<string, Record<string, string>> = {
  free: {
    en: "Free tools",
    tr: "Ücretsiz araçlar",
    de: "Kostenlose Tools",
    fr: "Outils gratuits",
    es: "Herramientas gratuitas",
    ar: "أدوات مجانية",
  },
  premium: {
    en: "Premium tools",
    tr: "Premium araçlar",
    de: "Premium-Tools",
    fr: "Outils premium",
    es: "Herramientas premium",
    ar: "أدوات مميزة",
  },
};

function tierLabel(tier: string, locale: string): string {
  const base = locale.split("-")[0];
  return TIER_LABELS[tier]?.[base] ?? TIER_LABELS.free.en;
}

function buildToolBreadcrumbSchema(tool: SemanticToolContract, locale: string): JsonLdRecord {
  const tierLabelStr = tierLabel(tool.tier, locale);
  const tierPath = tool.tier === "free" ? "/free-tools" : "/premium-tools";

  return sanitizeJsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "SectorCalc",
        item: absoluteLocalizedUrl(locale, "/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tierLabelStr,
        item: absoluteLocalizedUrl(locale, tierPath),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: pickLocaleText(tool.title, locale),
        item: absoluteLocalizedUrl(locale, tool.urlPath),
      },
    ],
  }) as JsonLdRecord;
}

export function buildToolJsonLd(input: {
  readonly tool: SemanticToolContract;
  readonly locale: string;
}): readonly JsonLdRecord[] {
  const { tool, locale } = input;
  const schemas: JsonLdRecord[] = [
    buildToolReferenceCreatorPersonJsonLd(),
    buildSoftwareApplicationSchema(tool, locale),
    buildCalculateActionSchema(tool, locale),
    buildToolBreadcrumbSchema(tool, locale),
  ];

  if (shouldUseFinancialService(tool)) {
    schemas.push(buildFinancialServiceSchema(tool, locale));
  }

  return schemas;
}
