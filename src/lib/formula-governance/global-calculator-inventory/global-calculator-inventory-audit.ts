/**
 * Global real-calculator inventory — classifies entire SectorCalc calculator ecosystem.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FORMULA_CONTRACTS, getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { BATCH_TRAFFIC_CATALOG_CRITICAL_SLUGS } from "@/lib/formula-governance/contracts/batch-traffic-catalog-critical";
import { isBatchTrafficCatalogOracleSlug } from "@/lib/formula-governance/oracle/batch-traffic-catalog-oracles";
import { hasOracleForTool } from "@/lib/formula-governance/oracle/registry";
import { isFullLoopRuntimeSlug } from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";
import { runDualIntelligenceRuntimeCoverageAudit } from "@/lib/formula-governance/dual-intelligence-runtime-coverage/dual-intelligence-runtime-coverage-audit";
import { PREMIUM_CALCULATOR_SCHEMAS } from "@/lib/premium-schema/schema-registry";
import { revenueTools } from "@/lib/tools/revenue-tools";
import { hasDedicatedTrafficCalculator } from "@/lib/tools/free-traffic-calculators";

export type InventoryRecommendation =
  | "ready"
  | "contract-needed"
  | "bridge-needed"
  | "route-needed"
  | "not-a-calculator";

export type InventoryRisk = "LOW" | "MEDIUM" | "HIGH";

export type GlobalCalculatorInventoryEntry = {
  readonly slug: string;
  readonly toolName: string;
  readonly sourceFile: string;
  readonly routeType: string;
  readonly isRealCalculator: boolean;
  readonly isContentOnly: boolean;
  readonly hasCalculationFunction: boolean;
  readonly calculationFunctionName: string | null;
  readonly hasInputSchema: boolean;
  readonly hasFormulaContract: boolean;
  readonly hasRequiredInputs: boolean;
  readonly hasCriticalInputs: boolean;
  readonly hasCanonicalMapping: boolean;
  readonly hasOracle: boolean;
  readonly hasScenarioPropertyBoundary: boolean;
  readonly runtimeTier: string;
  readonly fullLoopRuntime: boolean;
  readonly auditPipelineOnly: boolean;
  readonly outsideGovernance: boolean;
  readonly resultShape: string;
  readonly routeActive: boolean;
  readonly risk: InventoryRisk;
  readonly recommendation: InventoryRecommendation;
};

export type GlobalCalculatorInventoryResult = {
  readonly totalScanned: number;
  readonly realCalculatorCount: number;
  readonly notACalculatorCount: number;
  readonly contractsBefore: number;
  readonly contractsAfter: number;
  readonly fullLoopBefore: number;
  readonly fullLoopAfter: number;
  readonly outsideGovernanceBefore: number;
  readonly outsideGovernanceAfter: number;
  readonly groupA: readonly string[];
  readonly groupB: readonly string[];
  readonly groupC: readonly string[];
  readonly groupD: readonly string[];
  readonly groupE: readonly string[];
  readonly entries: readonly GlobalCalculatorInventoryEntry[];
};

type CatalogEntry = {
  readonly slug: string;
  readonly title: string;
  readonly inputs?: readonly { readonly key: string }[];
};

const CONTRACT_DEFERRED_SLUGS = new Set([
  "length-converter",
  "weight-converter",
  "area-converter",
  "volume-converter",
  "temperature-converter",
  "ratio-calculator",
]);

const CONTENT_ONLY_SLUGS = new Set<string>();

const BEFORE_CONTRACT_COUNT = 41;
const BEFORE_FULL_LOOP_COUNT = 35;

function loadCatalog(rootDir: string): CatalogEntry[] {
  const basePath = join(rootDir, "src/lib/tools/free-traffic-catalog.generated.json");
  const batch1Path = join(rootDir, "src/lib/tools/roadmap-free-batch1-catalog.generated.json");
  const batch2Path = join(rootDir, "src/lib/tools/roadmap-free-batch2-catalog.generated.json");
  const base = JSON.parse(readFileSync(basePath, "utf8")) as CatalogEntry[];
  const batch1 = JSON.parse(readFileSync(batch1Path, "utf8")) as CatalogEntry[];
  const batch2 = JSON.parse(readFileSync(batch2Path, "utf8")) as CatalogEntry[];
  const merged = new Map<string, CatalogEntry>();
  for (const entry of [...base, ...batch1, ...batch2]) {
    merged.set(entry.slug, entry);
  }
  return [...merged.values()];
}

function catalogBySlug(rootDir: string): Map<string, CatalogEntry> {
  return new Map(loadCatalog(rootDir).map((entry) => [entry.slug, entry]));
}

function resolveRouteType(slug: string, hasTraffic: boolean, hasRevenueFree: boolean, hasRevenuePremium: boolean, hasSchema: boolean): string {
  if (hasSchema) return "premium-schema";
  if (hasRevenuePremium) return "premium";
  if (hasRevenueFree && hasTraffic) return "free+revenue";
  if (hasRevenueFree) return "revenue-free";
  if (hasTraffic) return "free-traffic";
  return "unknown";
}

function classifyRecommendation(entry: GlobalCalculatorInventoryEntry): InventoryRecommendation {
  if (!entry.isRealCalculator) return "not-a-calculator";
  if (CONTRACT_DEFERRED_SLUGS.has(entry.slug)) return "contract-needed";
  if (!entry.hasFormulaContract) return "contract-needed";
  if (entry.fullLoopRuntime) return "ready";
  if (entry.hasFormulaContract && entry.hasOracle && !entry.fullLoopRuntime) return "bridge-needed";
  if (!entry.routeActive) return "route-needed";
  return "contract-needed";
}

function classifyRisk(entry: GlobalCalculatorInventoryEntry): InventoryRisk {
  if (CONTRACT_DEFERRED_SLUGS.has(entry.slug)) return "HIGH";
  if (!entry.isRealCalculator) return "LOW";
  if (!entry.hasFormulaContract) return "MEDIUM";
  if (!entry.fullLoopRuntime && entry.auditPipelineOnly) return "MEDIUM";
  return "LOW";
}

export function runGlobalCalculatorInventoryAudit(rootDir: string = process.cwd()): GlobalCalculatorInventoryResult {
  const catalog = catalogBySlug(rootDir);
  const coverage = runDualIntelligenceRuntimeCoverageAudit();
  const contractSlugs = new Set(FORMULA_CONTRACTS.map((c) => c.slug));

  const slugSet = new Set<string>();
  for (const entry of catalog.values()) slugSet.add(entry.slug);
  for (const tool of revenueTools) {
    slugSet.add(tool.freeSlug);
    slugSet.add(tool.paidSlug);
  }
  for (const schema of PREMIUM_CALCULATOR_SCHEMAS) slugSet.add(schema.id);

  const entries: GlobalCalculatorInventoryEntry[] = [...slugSet]
    .sort((a, b) => a.localeCompare(b))
    .map((slug) => {
      const catalogEntry = catalog.get(slug);
      const revenueTool = revenueTools.find((t) => t.freeSlug === slug || t.paidSlug === slug);
      const schema = PREMIUM_CALCULATOR_SCHEMAS.find((s) => s.id === slug);
      const contract = getFormulaContractBySlug(slug);
      const coverageEntry = coverage.entries.find((e) => e.slug === slug);

      const hasTraffic = hasDedicatedTrafficCalculator(slug);
      const hasRevenueFree = revenueTool?.freeSlug === slug;
      const hasRevenuePremium = revenueTool?.paidSlug === slug;
      const hasSchema = Boolean(schema);
      const isRealCalculator = hasTraffic || hasRevenueFree || hasRevenuePremium || hasSchema;
      const isContentOnly = CONTENT_ONLY_SLUGS.has(slug);

      const sourceFile = hasTraffic
        ? "src/lib/tools/free-traffic-calculators.ts"
        : hasSchema
          ? `src/lib/premium-schema/schemas/${slug}.ts`
          : hasRevenuePremium
            ? "src/lib/tools/premium-decision-engine.ts"
            : hasRevenueFree
              ? "src/lib/tools/free-sector-calculations.ts"
              : "unknown";

      const routeType = resolveRouteType(slug, hasTraffic, Boolean(hasRevenueFree), Boolean(hasRevenuePremium), hasSchema);
      const toolId = contract?.toolId ?? (hasTraffic ? `free-traffic.${slug}` : undefined);
      const hasOracle = toolId ? hasOracleForTool(toolId, rootDir) : false;

      const base: GlobalCalculatorInventoryEntry = {
        slug,
        toolName: contract?.toolName ?? catalogEntry?.title ?? revenueTool?.freeTitle ?? revenueTool?.paidTitle ?? schema?.name ?? slug,
        sourceFile,
        routeType,
        isRealCalculator,
        isContentOnly,
        hasCalculationFunction: isRealCalculator,
        calculationFunctionName: hasTraffic
          ? `CALCULATORS["${slug}"]`
          : hasSchema
            ? `FORMULA_REGISTRY.${slug}`
            : hasRevenuePremium
              ? "calculatePremiumDecisionReport"
              : hasRevenueFree
                ? "calculateFreeToolResult"
                : null,
        hasInputSchema: Boolean(catalogEntry?.inputs?.length || contract?.requiredInputs.length || schema),
        hasFormulaContract: contractSlugs.has(slug),
        hasRequiredInputs: Boolean(contract?.requiredInputs.length),
        hasCriticalInputs: Boolean(contract?.criticalInputs.length),
        hasCanonicalMapping: Boolean(contract?.requiredInputs.length),
        hasOracle,
        hasScenarioPropertyBoundary: Boolean(contract?.propertyTestsRegistered && contract.scenarioTests.some((s) => s.present)),
        runtimeTier: coverageEntry?.tier ?? (contract ? "audit_pipeline_only" : "no_governance"),
        fullLoopRuntime: isFullLoopRuntimeSlug(slug),
        auditPipelineOnly: coverageEntry?.tier === "audit_pipeline_only",
        outsideGovernance: !contractSlugs.has(slug) && isRealCalculator,
        resultShape: catalogEntry?.inputs ? "FreeTrafficResult" : hasSchema ? "PremiumSchemaResult" : "FreeToolResult|PremiumReport",
        routeActive: hasTraffic || Boolean(revenueTool) || Boolean(schema),
        risk: "LOW",
        recommendation: "contract-needed",
      };

      return {
        ...base,
        risk: classifyRisk(base),
        recommendation: classifyRecommendation(base),
      };
    });

  const realCalculators = entries.filter((e) => e.isRealCalculator);
  const notACalculators = entries.filter((e) => !e.isRealCalculator);

  const groupA = entries.filter((e) => e.recommendation === "contract-needed" && e.isRealCalculator && !CONTRACT_DEFERRED_SLUGS.has(e.slug) && !e.hasFormulaContract).map((e) => e.slug);
  const groupB = entries.filter((e) => e.hasFormulaContract && e.hasOracle && !e.fullLoopRuntime && e.isRealCalculator).map((e) => e.slug);
  const groupC = [...CONTRACT_DEFERRED_SLUGS, ...entries.filter((e) => e.risk === "HIGH" && e.isRealCalculator).map((e) => e.slug)].filter((v, i, a) => a.indexOf(v) === i);
  const groupD = entries.filter((e) => e.recommendation === "bridge-needed").map((e) => e.slug);
  const groupE = notACalculators.map((e) => e.slug);

  const outsideAfter = realCalculators.filter((e) => e.outsideGovernance).length;
  const premiumSchemaOutside = PREMIUM_CALCULATOR_SCHEMAS.filter((s) => !contractSlugs.has(s.id)).length;

  return {
    totalScanned: entries.length,
    realCalculatorCount: realCalculators.length,
    notACalculatorCount: notACalculators.length,
    contractsBefore: BEFORE_CONTRACT_COUNT,
    contractsAfter: FORMULA_CONTRACTS.length,
    fullLoopBefore: BEFORE_FULL_LOOP_COUNT,
    fullLoopAfter: coverage.fullLoopRuntimeCount,
    outsideGovernanceBefore: 104,
    outsideGovernanceAfter: outsideAfter + premiumSchemaOutside,
    groupA,
    groupB,
    groupC: [...groupC],
    groupD,
    groupE,
    entries,
  };
}

export function formatGlobalCalculatorInventoryReport(result: GlobalCalculatorInventoryResult): string {
  return [
    "Global Calculator Inventory",
    `Total scanned: ${result.totalScanned}`,
    `Real calculators: ${result.realCalculatorCount}`,
    `Not-a-calculator: ${result.notACalculatorCount}`,
    `FormulaContract: ${result.contractsBefore} → ${result.contractsAfter}`,
    `full_loop_runtime: ${result.fullLoopBefore} → ${result.fullLoopAfter}`,
    `Outside governance (real calc): ${result.outsideGovernanceBefore} → ${result.outsideGovernanceAfter}`,
    "",
    `Group A (ready for contract): ${result.groupA.length}`,
    `Group B (ready for full-loop): ${result.groupB.length}`,
    `Group C (contract risky): ${result.groupC.length}`,
    `Group D (bridge needed): ${result.groupD.length}`,
    `Group E (not calculator): ${result.groupE.length}`,
    "",
    `New traffic batch slugs: ${BATCH_TRAFFIC_CATALOG_CRITICAL_SLUGS.length}`,
    `Traffic oracle wired: ${BATCH_TRAFFIC_CATALOG_CRITICAL_SLUGS.filter((s) => isBatchTrafficCatalogOracleSlug(s)).length}`,
  ].join("\n");
}
