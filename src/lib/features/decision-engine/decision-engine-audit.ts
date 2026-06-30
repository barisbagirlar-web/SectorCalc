import { listAllFreeToolSlugs } from "@/lib/features/tools/free-traffic-routes";
import { getAllRevenueToolSpecs } from "@/lib/features/tools/revenue-tools";
import { PREMIUM_CALCULATOR_SCHEMAS } from "@/lib/features/premium-schema/schema-registry";
import { resolveDecisionEngineContext } from "@/lib/features/decision-engine/decision-engine-resolver";

export type DecisionEngineAuditIssue = {
  readonly slug: string;
  readonly issue: string;
};

export type DecisionEngineAuditResult = {
  readonly totalTools: number;
  readonly slugMapped: number;
  readonly categoryMapped: number;
  readonly keywordMapped: number;
  readonly genericFallback: number;
  readonly issues: readonly DecisionEngineAuditIssue[];
};

export function auditDecisionEngineCoverage(locale = "en"): DecisionEngineAuditResult {
  const slugs = new Set<string>();

  for (const slug of listAllFreeToolSlugs()) {
    slugs.add(slug);
  }
  for (const tool of getAllRevenueToolSpecs()) {
    slugs.add(tool.freeSlug);
    slugs.add(tool.paidSlug);
  }
  for (const schema of PREMIUM_CALCULATOR_SCHEMAS) {
    slugs.add(schema.id);
  }

  let slugMapped = 0;
  let categoryMapped = 0;
  let keywordMapped = 0;
  let genericFallback = 0;
  const issues: DecisionEngineAuditIssue[] = [];

  for (const slug of slugs) {
    const ctx = resolveDecisionEngineContext({
      toolSlug: slug,
      locale,
      region: "GLOBAL",
    });

    switch (ctx.mappingSource) {
      case "slug":
        slugMapped += 1;
        break;
      case "category":
        categoryMapped += 1;
        break;
      case "keywords":
        keywordMapped += 1;
        break;
      default:
        genericFallback += 1;
        break;
    }

    if (!ctx.caseState.archetype) {
      issues.push({ slug, issue: "missing archetype" });
    }
    if (!ctx.caseState.decisionLevel) {
      issues.push({ slug, issue: "missing decision level" });
    }
  }

  return {
    totalTools: slugs.size,
    slugMapped,
    categoryMapped,
    keywordMapped,
    genericFallback,
    issues,
  };
}
