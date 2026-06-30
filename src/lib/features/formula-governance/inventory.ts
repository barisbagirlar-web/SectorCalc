/**
 * Formula inventory — scans all calculator/analyzer sources (Phase 2).
 * Read-only; does not mutate formulas or routes.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { listFormulaContractSlugs } from "@/lib/features/formula-governance/contracts";
import { PREMIUM_CALCULATOR_SCHEMAS } from "@/lib/features/premium-schema/schema-registry";
import { revenueTools } from "@/lib/features/tools/revenue-tools";
import {
  detectRiskFlags,
  hasVisibleDecisionWording,
  missingCriticalContractReason,
  suggestDecisionImpact,
  suggestRiskLevel,
} from "@/lib/features/formula-governance/risk-scoring";
import type {
  FormulaInventoryEntry,
  FormulaToolTier,
  RiskLevel,
} from "@/lib/features/formula-governance/types";

type CatalogTool = {
  slug: string;
  title: string;
  category?: string;
  relatedPremiumSlug?: string;
  inputs?: { key: string; unit?: string; type?: string }[];
};

function loadFreeTrafficCatalog(rootDir: string): CatalogTool[] {
  const basePath = join(rootDir, "src/lib/tools/free-traffic-catalog.generated.json");
  const batch1Path = join(rootDir, "src/lib/tools/roadmap-free-batch1-catalog.generated.json");
  const batch2Path = join(rootDir, "src/lib/tools/roadmap-free-batch2-catalog.generated.json");
  const base = JSON.parse(readFileSync(basePath, "utf8")) as CatalogTool[];
  const batch1 = JSON.parse(readFileSync(batch1Path, "utf8")) as CatalogTool[];
  const batch2 = JSON.parse(readFileSync(batch2Path, "utf8")) as CatalogTool[];
  const merged = new Map<string, CatalogTool>();
  for (const entry of [...base, ...batch1, ...batch2]) {
    merged.set(entry.slug, entry);
  }
  return [...merged.values()];
}

function countByRisk(entries: FormulaInventoryEntry[]): Record<RiskLevel, number> {
  return entries.reduce(
    (acc, entry) => {
      acc[entry.suggestedRiskLevel] += 1;
      return acc;
    },
    { critical: 0, high: 0, medium: 0, low: 0 } as Record<RiskLevel, number>,
  );
}

function countByTier(entries: FormulaInventoryEntry[]): Record<FormulaToolTier, number> {
  return entries.reduce(
    (acc, entry) => {
      acc[entry.tier] += 1;
      return acc;
    },
    {
      free: 0,
      premium: 0,
      "premium-schema": 0,
      "revenue-free": 0,
      "revenue-premium": 0,
      other: 0,
    } as Record<FormulaToolTier, number>,
  );
}

function buildEntryBase(input: {
  toolId: string;
  slug: string;
  name: string;
  tier: FormulaToolTier;
  source: FormulaInventoryEntry["source"];
  category?: string;
  sector?: string;
  filePath: string;
  inputKeys: readonly string[];
  outputLabels: readonly string[];
  formulaFile?: string;
  schemaFile?: string;
  extraText?: readonly string[];
  hasPdfOrReportOutput: boolean;
  isPaidFlowLinked: boolean;
  contractSlugs: ReadonlySet<string>;
}): FormulaInventoryEntry {
  const hasContract = input.contractSlugs.has(input.slug);
  const decisionWording = hasVisibleDecisionWording({
    slug: input.slug,
    name: input.name,
    extraText: input.extraText,
  });
  const suggestedRiskLevel = suggestRiskLevel({
    slug: input.slug,
    name: input.name,
    inputKeys: input.inputKeys,
    extraText: input.extraText,
  });
  const suggestedDecisionImpact = suggestDecisionImpact({
    slug: input.slug,
    name: input.name,
    inputKeys: input.inputKeys,
    extraText: input.extraText,
  });
  const riskFlags = detectRiskFlags({
    slug: input.slug,
    name: input.name,
    inputKeys: input.inputKeys,
    extraText: input.extraText,
    hasContract,
    suggestedRiskLevel,
    hasVisibleDecisionWording: decisionWording,
  });
  const missingReason = missingCriticalContractReason({
    hasContract,
    suggestedRiskLevel,
    slug: input.slug,
  });

  return {
    toolId: input.toolId,
    slug: input.slug,
    name: input.name,
    tier: input.tier,
    source: input.source,
    category: input.category,
    sector: input.sector,
    filePath: input.filePath,
    inputKeys: input.inputKeys,
    outputLabels: input.outputLabels,
    formulaFile: input.formulaFile,
    schemaFile: input.schemaFile,
    hasVisibleDecisionWording: decisionWording,
    hasPdfOrReportOutput: input.hasPdfOrReportOutput,
    isPaidFlowLinked: input.isPaidFlowLinked,
    hasContract,
    suggestedRiskLevel,
    suggestedDecisionImpact,
    missingCriticalContractReason: missingReason,
    riskFlags,
  };
}

function scanFreeTraffic(
  rootDir: string,
  contractSlugs: ReadonlySet<string>,
): FormulaInventoryEntry[] {
  const catalog = loadFreeTrafficCatalog(rootDir);

  return catalog.map((tool) => {
    const inputKeys = (tool.inputs ?? []).map((i) => i.key);
    return buildEntryBase({
      toolId: `free-traffic.${tool.slug}`,
      slug: tool.slug,
      name: tool.title,
      tier: "free",
      source: "free-traffic",
      category: tool.category,
      filePath: "src/lib/tools/free-traffic-calculators.ts",
      inputKeys,
      outputLabels: [],
      formulaFile: "src/lib/tools/free-traffic-calculators.ts",
      hasPdfOrReportOutput: false,
      isPaidFlowLinked: Boolean(tool.relatedPremiumSlug),
      contractSlugs,
    });
  });
}

function scanRevenueTools(contractSlugs: ReadonlySet<string>): FormulaInventoryEntry[] {
  const entries: FormulaInventoryEntry[] = [];

  for (const tool of revenueTools) {
    const freeInputKeys = tool.freeInputs.map((i) => i.key);
    const paidInputKeys = tool.paidInputs.map((i) => i.key);
    const freeExtra = [
      tool.freeResultPromise,
      tool.painStatement,
      tool.freeValue,
      ...tool.verdictLabels,
    ];
    const paidExtra = [
      tool.paidResultPromise,
      tool.painStatement,
      tool.paidValue,
      tool.premiumTeaserTitle,
      tool.premiumTeaserText,
      ...tool.verdictLabels,
    ];

    entries.push(
      buildEntryBase({
        toolId: `revenue-free.${tool.freeSlug}`,
        slug: tool.freeSlug,
        name: tool.freeTitle,
        tier: "revenue-free",
        source: "revenue",
        sector: tool.sector,
        filePath: "src/lib/tools/revenue-tools.ts",
        inputKeys: freeInputKeys,
        outputLabels: [...tool.freeResultIds],
        formulaFile: "src/lib/tools/sectors/sector-calculators.ts",
        extraText: freeExtra,
        hasPdfOrReportOutput: false,
        isPaidFlowLinked: true,
        contractSlugs,
      }),
      buildEntryBase({
        toolId: `revenue-premium.${tool.paidSlug}`,
        slug: tool.paidSlug,
        name: tool.paidTitle,
        tier: "revenue-premium",
        source: "revenue",
        sector: tool.sector,
        filePath: "src/lib/tools/revenue-tools.ts",
        inputKeys: paidInputKeys,
        outputLabels: tool.verdictLabels,
        formulaFile: "src/lib/tools/risk-engine.ts",
        extraText: paidExtra,
        hasPdfOrReportOutput: true,
        isPaidFlowLinked: true,
        contractSlugs,
      }),
    );
  }

  return entries;
}

function scanPremiumSchemas(contractSlugs: ReadonlySet<string>): FormulaInventoryEntry[] {
  return PREMIUM_CALCULATOR_SCHEMAS.map((schema) => {
    const inputKeys = schema.inputs.map((i) => i.id);
    const outputLabels = schema.outputs.map((o) => o.label);
    const paidSlug = schema.legacyPaidSlug;
    const extraText = [
      schema.painStatement,
      schema.reportTemplate.title,
      ...schema.reportTemplate.sections,
    ];

    return buildEntryBase({
      toolId: `premium-schema.${schema.id}`,
      slug: paidSlug ?? schema.id,
      name: schema.name,
      tier: "premium-schema",
      source: "premium-schema",
      category: schema.category,
      sector: schema.sectorSlug,
      filePath: `src/lib/premium-schema/schemas/${schema.id}.ts`,
      inputKeys,
      outputLabels,
      formulaFile: "src/lib/premium-schema/formula-registry.ts",
      schemaFile: `src/lib/premium-schema/schemas/${schema.id}.ts`,
      extraText,
      hasPdfOrReportOutput: schema.reportTemplate.exportFormats.includes("pdf"),
      isPaidFlowLinked: true,
      contractSlugs,
    });
  });
}

function scanEngineModules(contractSlugs: ReadonlySet<string>): FormulaInventoryEntry[] {
  const modules: Array<{
    toolId: string;
    slug: string;
    name: string;
    source: FormulaInventoryEntry["source"];
    filePath: string;
    formulaFile: string;
    inputKeys: readonly string[];
    outputLabels: readonly string[];
    extraText: readonly string[];
    isPaidFlowLinked: boolean;
    hasPdfOrReportOutput: boolean;
  }> = [
    {
      toolId: "engine.risk-engine",
      slug: "margincore-risk-engine",
      name: "MarginCore Risk Engine",
      source: "risk-engine",
      filePath: "src/lib/tools/risk-engine.ts",
      formulaFile: "src/lib/tools/risk-engine.ts",
      inputKeys: ["expectedCost", "variance", "emissionFactor", "carbonPrice"],
      outputLabels: ["safePrice", "verdict", "cbamLiability", "sensitivity"],
      extraText: ["P90 safe price", "premium verdict", "margin leak"],
      isPaidFlowLinked: true,
      hasPdfOrReportOutput: true,
    },
    {
      toolId: "engine.sector-calculators",
      slug: "sector-margin-calculators",
      name: "Sector Margin Calculators",
      source: "sector-calculator",
      filePath: "src/lib/tools/sectors/sector-calculators.ts",
      formulaFile: "src/lib/tools/sectors/sector-calculators.ts",
      inputKeys: ["naiveCost", "marginLeak", "verdict"],
      outputLabels: ["naiveCost", "marginLeakItems", "verdictLabels"],
      extraText: ["naive cost", "margin leak detector", "quote risk"],
      isPaidFlowLinked: true,
      hasPdfOrReportOutput: false,
    },
    {
      toolId: "engine.verdict-report",
      slug: "premium-verdict-report",
      name: "Premium Verdict Report",
      source: "report",
      filePath: "src/lib/reports/verdict-report.ts",
      formulaFile: "src/lib/reports/verdict-report.ts",
      inputKeys: ["verdict", "metrics", "riskDrivers"],
      outputLabels: ["executiveSummary", "pdfExport"],
      extraText: ["verdict report", "PDF export", "safe price"],
      isPaidFlowLinked: true,
      hasPdfOrReportOutput: true,
    },
  ];

  return modules.map((mod) =>
    buildEntryBase({
      ...mod,
      tier: "other",
      contractSlugs,
    }),
  );
}

export function buildFormulaInventory(rootDir: string = process.cwd()): FormulaInventoryEntry[] {
  const contractSlugs = new Set(listFormulaContractSlugs());
  return [
    ...scanFreeTraffic(rootDir, contractSlugs),
    ...scanRevenueTools(contractSlugs),
    ...scanPremiumSchemas(contractSlugs),
    ...scanEngineModules(contractSlugs),
  ];
}

export type InventorySummary = {
  total: number;
  free: number;
  premium: number;
  premiumSchema: number;
  revenueFree: number;
  revenuePremium: number;
  other: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  missingContracts: FormulaInventoryEntry[];
  criticalMissingContracts: FormulaInventoryEntry[];
  highMissingContracts: FormulaInventoryEntry[];
};

export function summarizeInventory(entries: readonly FormulaInventoryEntry[]): InventorySummary {
  const counts = countByRisk([...entries]);
  const tierCounts = countByTier([...entries]);
  const missingContracts = entries.filter((e) => !e.hasContract);
  const criticalMissingContracts = missingContracts.filter(
    (e) => e.suggestedRiskLevel === "critical",
  );
  const highMissingContracts = missingContracts.filter((e) => e.suggestedRiskLevel === "high");

  return {
    total: entries.length,
    free: tierCounts.free + tierCounts["revenue-free"],
    premium: tierCounts["revenue-premium"],
    premiumSchema: tierCounts["premium-schema"],
    revenueFree: tierCounts["revenue-free"],
    revenuePremium: tierCounts["revenue-premium"],
    other: tierCounts.other,
    critical: counts.critical,
    high: counts.high,
    medium: counts.medium,
    low: counts.low,
    missingContracts: [...missingContracts],
    criticalMissingContracts: [...criticalMissingContracts],
    highMissingContracts: [...highMissingContracts],
  };
}

const SOURCE_PRIORITY: Record<FormulaInventoryEntry["source"], number> = {
  "free-traffic": 0,
  revenue: 1,
  "premium-schema": 2,
  legacy: 3,
  "risk-engine": 4,
  "sector-calculator": 5,
  report: 6,
};

export function getInventoryEntryBySlug(
  entries: readonly FormulaInventoryEntry[],
  slug: string,
): FormulaInventoryEntry | undefined {
  const matches = entries.filter((e) => e.slug === slug);
  if (matches.length === 0) {
    return undefined;
  }
  return [...matches].sort((a, b) => SOURCE_PRIORITY[a.source] - SOURCE_PRIORITY[b.source])[0];
}

export function getInventoryEntriesByTier(
  entries: readonly FormulaInventoryEntry[],
  tier: FormulaToolTier,
): FormulaInventoryEntry[] {
  return entries.filter((e) => e.tier === tier);
}
