import { buildCalculateActionSchema } from "@/lib/semantic/build-calculate-action-schema";
import { buildHomeJsonLd } from "@/lib/semantic/build-home-jsonld";
import {
  shouldUseFinancialService,
} from "@/lib/semantic/build-financial-service-schema";
import { buildToolJsonLd } from "@/lib/semantic/build-tool-jsonld";
import { SITE_URL } from "@/lib/semantic/site-url";
import {
  getSemanticToolContract,
  listSemanticToolContracts,
} from "@/lib/semantic/semantic-tool-reader";
import { SEMANTIC_LOCALES } from "@/lib/semantic/tool-semantic-types";
import { listAllFreeToolSlugs } from "@/lib/tools/free-traffic-routes";
import {
  isFreeToolMigratedToPremium,
  listMigratedPremiumRouteSlugs,
} from "@/lib/freemium/resolve-free-to-premium-migration";
import { getPremiumRevenueRouteSlugs } from "@/lib/tools/revenue-tools";
import { listPremiumSchemaSlugs } from "@/lib/premium-schema/schemas/index";

const FORBIDDEN_TOKENS = ["example.com", "localhost", "127.0.0.1", "vercel.app", "your-domain", "TODO"];

export type SemanticJsonLdAuditResult = {
  readonly issues: readonly string[];
  readonly stats: {
    readonly totalPublicTools: number;
    readonly financialServiceTools: number;
    readonly localesChecked: number;
  };
};

function collectPublicRouteSlugs(): Array<{ slug: string; tier: "free" | "premium" | "premium-schema" }> {
  return [
    ...listAllFreeToolSlugs()
      .filter((slug) => !isFreeToolMigratedToPremium(slug))
      .map((slug) => ({ slug, tier: "free" as const })),
    ...getPremiumRevenueRouteSlugs().map((slug) => ({ slug, tier: "premium" as const })),
    ...listMigratedPremiumRouteSlugs().map((slug) => ({ slug, tier: "premium" as const })),
    ...listPremiumSchemaSlugs().map((slug) => ({ slug, tier: "premium-schema" as const })),
  ];
}

function scanForbiddenTokens(value: unknown, path = "root"): string[] {
  const issues: string[] = [];
  if (value === null || value === undefined) {
    issues.push(`${path} contains forbidden null/undefined`);
    return issues;
  }
  if (typeof value === "string") {
    for (const token of FORBIDDEN_TOKENS) {
      if (value.includes(token)) {
        issues.push(`${path} contains forbidden token "${token}"`);
      }
    }
    return issues;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      issues.push(...scanForbiddenTokens(item, `${path}[${index}]`));
    });
    return issues;
  }
  if (typeof value === "object") {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      issues.push(...scanForbiddenTokens(nested, `${path}.${key}`));
    }
  }
  return issues;
}

function assertJsonParseable(value: unknown, label: string): string[] {
  try {
    JSON.parse(JSON.stringify(value));
    return [];
  } catch {
    return [`${label} is not JSON serializable`];
  }
}

export function auditSemanticJsonLdCoverage(): SemanticJsonLdAuditResult {
  const issues: string[] = [];
  const routes = collectPublicRouteSlugs();
  const contracts = listSemanticToolContracts().filter((tool) => tool.isPublic);

  if (SITE_URL !== "https://www.sectorcalc.com") {
    issues.push(`SITE_URL must be https://www.sectorcalc.com (got ${SITE_URL})`);
  }

  for (const route of routes) {
    const contract = getSemanticToolContract(route);
    if (!contract) {
      issues.push(`Public tool missing semantic contract: ${route.tier}:${route.slug}`);
      continue;
    }
    if (contract.inputParameters.length === 0) {
      issues.push(`Semantic contract missing inputs: ${route.tier}:${route.slug}`);
    }
    if (contract.outputParameters.length === 0) {
      issues.push(`Semantic contract missing outputs: ${route.tier}:${route.slug}`);
    }
    for (const locale of SEMANTIC_LOCALES) {
      if (!contract.title[locale]?.trim()) {
        issues.push(`Missing title locale ${locale} for ${route.tier}:${route.slug}`);
      }
      if (!contract.description[locale]?.trim()) {
        issues.push(`Missing description locale ${locale} for ${route.tier}:${route.slug}`);
      }
    }

    const calculateAction = buildCalculateActionSchema(contract, "en");
    if (calculateAction.additionalType !== "https://www.sectorcalc.com/semantic/CalculateAction") {
      issues.push(`CalculateAction additionalType missing for ${route.tier}:${route.slug}`);
    }

    const toolJsonLd = buildToolJsonLd({ tool: contract, locale: "en" });
    const softwareSchema = toolJsonLd.find((schema) => {
      const type = schema["@type"];
      return type === "SoftwareApplication" || (Array.isArray(type) && type.includes("SoftwareApplication"));
    });
    if (!softwareSchema) {
      issues.push(`Tool JSON-LD missing SoftwareApplication for ${route.tier}:${route.slug}`);
    }
    const potentialAction = softwareSchema?.potentialAction as Record<string, unknown> | undefined;
    const target = potentialAction?.target as Record<string, unknown> | undefined;
    if (!potentialAction || potentialAction["@type"] !== "Action") {
      issues.push(`Tool JSON-LD missing potentialAction for ${route.tier}:${route.slug}`);
    }
    if (!target || target["@type"] !== "EntryPoint" || typeof target.urlTemplate !== "string") {
      issues.push(`Tool JSON-LD missing EntryPoint target for ${route.tier}:${route.slug}`);
    }

    const hasCalculateAction = toolJsonLd.some(
      (schema) =>
        schema["@type"] === "Action" &&
        schema.additionalType === "https://www.sectorcalc.com/semantic/CalculateAction",
    );
    if (!hasCalculateAction) {
      issues.push(`Tool JSON-LD missing CalculateAction for ${route.tier}:${route.slug}`);
    }

    const usesCalculateActionType = toolJsonLd.some((schema) => schema["@type"] === "CalculateAction");
    if (usesCalculateActionType) {
      issues.push(`CalculateAction must not be used as @type for ${route.tier}:${route.slug}`);
    }

    const hasFinancial = toolJsonLd.some((schema) => schema["@type"] === "FinancialService");
    const shouldFinancial = shouldUseFinancialService(contract);
    if (hasFinancial !== shouldFinancial) {
      issues.push(
        `FinancialService mismatch for ${route.tier}:${route.slug} (expected ${shouldFinancial ? "present" : "absent"})`,
      );
    }

    for (const schema of toolJsonLd) {
      issues.push(...assertJsonParseable(schema, `${route.tier}:${route.slug}`));
      issues.push(...scanForbiddenTokens(schema, `${route.tier}:${route.slug}`));
    }
  }

  if (contracts.length < routes.length) {
    issues.push(`Semantic registry count ${contracts.length} is lower than public routes ${routes.length}`);
  }

  const homeSchemas = buildHomeJsonLd("en");
  if (homeSchemas.length < 4) {
    issues.push("Home JSON-LD must include Organization, WebSite, SoftwareApplication, OfferCatalog");
  }
  for (const schema of homeSchemas) {
    issues.push(...assertJsonParseable(schema, "home"));
    issues.push(...scanForbiddenTokens(schema, "home"));
  }

  const financialCount = contracts.filter((tool) => shouldUseFinancialService(tool)).length;

  return {
    issues,
    stats: {
      totalPublicTools: contracts.length,
      financialServiceTools: financialCount,
      localesChecked: SEMANTIC_LOCALES.length,
    },
  };
}

export function auditFinancialServiceSchema(toolSlug: string, tier: "free" | "premium" | "premium-schema"): boolean {
  const contract = getSemanticToolContract({ slug: toolSlug, tier });
  if (!contract) {
    return false;
  }
  return shouldUseFinancialService(contract);
}
