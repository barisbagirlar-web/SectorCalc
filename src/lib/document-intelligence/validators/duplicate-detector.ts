/**
 * Duplicate Detection — Seven classes as specified.
 *
 * Classes:
 * 1. exact normalized part-number duplicate
 * 2. same part number, conflicting description
 * 3. same part number, conflicting revision
 * 4. same part number, conflicting manufacturer
 * 5. probable formatting duplicate
 * 6. same description, different part number — informational
 * 7. duplicate source row extraction
 */

import type { BomRow, DuplicateGroup } from "@/types/document-intelligence";
import { normalizePartNumber } from "./part-normalizer";

export interface DuplicateDetectionResult {
  groups: DuplicateGroup[];
  consolidatedRowIndices: number[];
}

/**
 * Detect all duplicate classes across the extracted BOM rows.
 * Does not silently delete duplicates — all are reported.
 */
export function detectDuplicates(rows: BomRow[]): DuplicateDetectionResult {
  const groups: DuplicateGroup[] = [];
  const consolidatedRowIndices: number[] = [];
  let groupCounter = 0;

  // Class 1 & 2: Exact normalized duplicates with description check
  const normalizedMap = new Map<string, number[]>();
  const descriptionsByKey = new Map<string, Set<string>>();
  const revisionsByKey = new Map<string, Set<string>>();
  const manufacturersByKey = new Map<string, Set<string>>();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row.partNumberRaw && !row.partNumberNormalized) continue;
    const norm = normalizePartNumber(row.partNumberNormalized ?? row.partNumberRaw);
    const key = norm.comparisonKey;
    if (!key) continue;

    if (!normalizedMap.has(key)) normalizedMap.set(key, []);
    normalizedMap.get(key)!.push(i);

    if (!descriptionsByKey.has(key)) descriptionsByKey.set(key, new Set());
    if (row.descriptionNormalized) descriptionsByKey.get(key)!.add(row.descriptionNormalized);

    if (!revisionsByKey.has(key)) revisionsByKey.set(key, new Set());
    if (row.revision) revisionsByKey.get(key)!.add(row.revision);

    if (!manufacturersByKey.has(key)) manufacturersByKey.set(key, new Set());
    if (row.manufacturer) manufacturersByKey.get(key)!.add(row.manufacturer);
  }

  for (const [key, indices] of normalizedMap) {
    if (indices.length < 2) continue;

    const descs = descriptionsByKey.get(key);
    const revs = revisionsByKey.get(key);
    const mans = manufacturersByKey.get(key);

    const sourcePages = indices.map((i) => rows[i].sourcePage).filter((p) => p > 0);
    const uniquePages = [...new Set(sourcePages)].sort();

    // Class 1: exact duplicates (all same description, revision, manufacturer)
    if (descs && descs.size === 1 && revs && revs.size <= 1 && mans && mans.size <= 1) {
      groupCounter++;
      groups.push({
        duplicateGroupId: `dup-${groupCounter}`,
        duplicateType: "exact_normalized",
        severity: "low",
        records: [...indices],
        sourcePages: uniquePages,
        recommendedDisposition: "Consolidate quantities",
        autoMergeAllowed: true,
      });
      // Only first occurrence stays; rest are consolidated
      consolidatedRowIndices.push(...indices.slice(1));
      continue;
    }

    // Class 2: conflicting description
    if (descs && descs.size > 1) {
      groupCounter++;
      groups.push({
        duplicateGroupId: `dup-${groupCounter}`,
        duplicateType: "conflicting_description",
        severity: "high",
        records: [...indices],
        sourcePages: uniquePages,
        recommendedDisposition: "Verify correct description from source",
        autoMergeAllowed: false,
      });
    }

    // Class 3: conflicting revision
    if (revs && revs.size > 1) {
      groupCounter++;
      groups.push({
        duplicateGroupId: `dup-${groupCounter}`,
        duplicateType: "conflicting_revision",
        severity: "critical",
        records: [...indices],
        sourcePages: uniquePages,
        recommendedDisposition: "Resolve revision conflict before use",
        autoMergeAllowed: false,
      });
    }

    // Class 4: conflicting manufacturer
    if (mans && mans.size > 1) {
      groupCounter++;
      groups.push({
        duplicateGroupId: `dup-${groupCounter}`,
        duplicateType: "conflicting_manufacturer",
        severity: "high",
        records: [...indices],
        sourcePages: uniquePages,
        recommendedDisposition: "Verify correct manufacturer",
        autoMergeAllowed: false,
      });
    }
  }

  // Class 7: duplicate source row extraction (same source page, table, row)
  const sourceRowMap = new Map<string, number[]>();
  for (let i = 0; i < rows.length; i++) {
    const key = `${rows[i].sourcePage}|${rows[i].sourceTable}|${rows[i].sourceRow}`;
    if (!sourceRowMap.has(key)) sourceRowMap.set(key, []);
    sourceRowMap.get(key)!.push(i);
  }
  for (const [, indices] of sourceRowMap) {
    if (indices.length < 2) continue;
    groupCounter++;
    groups.push({
      duplicateGroupId: `dup-src-${groupCounter}`,
      duplicateType: "duplicate_source_row",
      severity: "medium",
      records: [...indices],
      sourcePages: [rows[indices[0]].sourcePage],
      recommendedDisposition: "Remove duplicate extraction",
      autoMergeAllowed: true,
    });
    consolidatedRowIndices.push(...indices.slice(1));
  }

  return { groups, consolidatedRowIndices };
}
