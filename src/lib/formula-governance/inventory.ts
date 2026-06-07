/**
 * Formula inventory — scans catalog sources without mutating formulas.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { listFormulaContractSlugs } from "@/lib/formula-governance/contracts";
import { suggestRiskLevel } from "@/lib/formula-governance/risk-rules";
import type { FormulaInventoryEntry, RiskLevel } from "@/lib/formula-governance/types";

type CatalogTool = {
  slug: string;
  title: string;
  inputs?: { key: string }[];
};

function loadFreeTrafficCatalog(rootDir: string): CatalogTool[] {
  const path = join(rootDir, "src/lib/tools/free-traffic-catalog.generated.json");
  const raw = JSON.parse(readFileSync(path, "utf8")) as CatalogTool[];
  return raw;
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

export function buildFormulaInventory(rootDir: string = process.cwd()): FormulaInventoryEntry[] {
  const contractSlugs = new Set(listFormulaContractSlugs());
  const catalog = loadFreeTrafficCatalog(rootDir);

  return catalog.map((tool) => {
    const inputKeys = (tool.inputs ?? []).map((i) => i.key);
    return {
      toolId: `free-traffic.${tool.slug}`,
      slug: tool.slug,
      name: tool.title,
      source: "free-traffic" as const,
      inputKeys,
      outputLabels: [],
      formulaFile: "src/lib/tools/free-traffic-calculators.ts",
      suggestedRiskLevel: suggestRiskLevel({
        slug: tool.slug,
        name: tool.title,
        inputKeys,
      }),
      hasContract: contractSlugs.has(tool.slug),
    };
  });
}

export function summarizeInventory(entries: readonly FormulaInventoryEntry[]): {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  missingContracts: FormulaInventoryEntry[];
  criticalMissingContracts: FormulaInventoryEntry[];
} {
  const counts = countByRisk([...entries]);
  const missingContracts = entries.filter((e) => !e.hasContract);
  const criticalMissingContracts = missingContracts.filter(
    (e) => e.suggestedRiskLevel === "critical",
  );

  return {
    total: entries.length,
    critical: counts.critical,
    high: counts.high,
    medium: counts.medium,
    low: counts.low,
    missingContracts,
    criticalMissingContracts,
  };
}

export function getInventoryEntryBySlug(
  entries: readonly FormulaInventoryEntry[],
  slug: string,
): FormulaInventoryEntry | undefined {
  return entries.find((e) => e.slug === slug);
}
