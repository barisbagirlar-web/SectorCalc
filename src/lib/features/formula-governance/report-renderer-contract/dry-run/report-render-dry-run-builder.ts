/**
 * Report render dry-run builder - Phase 5I-I synthetic deterministic data.
 */

import type { ReportRendererContract } from "@/lib/features/formula-governance/report-renderer-contract/report-renderer-types";
import type { ReportRenderDryRun } from "@/lib/features/formula-governance/report-renderer-contract/dry-run/report-render-dry-run-types";

function hashSlug(slug: string): number {
  let hash = 0;
  for (let index = 0; index < slug.length; index += 1) {
    hash = (hash * 31 + slug.charCodeAt(index)) % 1000;
  }
  return hash;
}

export function buildSyntheticRows(
  slug: string,
  requiredFields: readonly string[],
): Record<string, string | number>[] {
  const seed = hashSlug(slug);
  const row: Record<string, string | number> = {};

  for (const field of requiredFields) {
    if (field.includes("score") || field.includes("Score")) {
      row[field] = 70 + (seed % 30);
    } else if (field.includes("slug")) {
      row[field] = slug;
    } else if (field.includes("title") || field.includes("Title")) {
      row[field] = `Report: ${slug}`;
    } else {
      row[field] = `sample-${seed % 100}`;
    }
  }

  return [row];
}

export function estimatePageCount(sectionCount: number, rowCount: number): number {
  const rowsPerPage = 25;
  return Math.max(1, Math.ceil(sectionCount / 3) + Math.ceil(rowCount / rowsPerPage));
}

export function estimateSheetCount(slug: string, sectionCount: number): number {
  const base = 3;
  return base + (hashSlug(slug) % 2) + Math.floor(sectionCount / 4);
}

export function estimateWordSections(sectionCount: number): number {
  return sectionCount + 2;
}

export function buildReportRenderDryRun(
  contract: ReportRendererContract,
  format: ReportRendererContract["supportedFormats"][number] = "pdf",
): ReportRenderDryRun {
  const missingFields = contract.status === "needs_trace_data" ? ["trace_data"] : [];

  const syntheticRows = buildSyntheticRows(contract.slug, contract.dataContract.requiredFields);
  const sectionCount = contract.sections.length;

  return {
    slug: contract.slug,
    sourceRendererContract: { slug: contract.slug, status: contract.status },
    format,
    sections: [...contract.sections],
    syntheticRows,
    missingFields,
    redactedFields: [...contract.dataContract.redactedFields],
    prohibitedFieldViolations: [],
    estimatedPageCount: estimatePageCount(sectionCount, syntheticRows.length),
    estimatedSheetCount: estimateSheetCount(contract.slug, sectionCount),
    estimatedWordSections: estimateWordSections(sectionCount),
    canRenderWithoutFileOutput: contract.status === "renderer_contract_ready",
    fileOutputGenerated: false,
    status: "dry_run_ready",
    blockers: [],
    warnings: [],
  };
}
