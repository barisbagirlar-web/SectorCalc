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

function buildToolBreadcrumbSchema(tool: SemanticToolContract, locale: string): JsonLdRecord {
  const tierLabel =
    tool.tier === "free"
      ? "Free tools"
      : tool.tier === "premium"
        ? "Premium tools"
        : "Premium analyzers";
  const tierPath =
    tool.tier === "free"
      ? "/free-tools"
      : tool.tier === "premium"
        ? "/premium-tools"
        : "/premium-tools";

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
        name: tierLabel,
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
    buildSoftwareApplicationSchema(tool, locale),
    buildCalculateActionSchema(tool, locale),
    buildToolBreadcrumbSchema(tool, locale),
  ];

  if (shouldUseFinancialService(tool)) {
    schemas.push(buildFinancialServiceSchema(tool, locale));
  }

  return schemas;
}
