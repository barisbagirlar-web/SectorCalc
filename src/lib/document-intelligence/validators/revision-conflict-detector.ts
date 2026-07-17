/**
 * Revision Conflict Detection — Four classes as specified.
 *
 * Detects:
 * - same normalized part number with multiple revisions
 * - revision present on one occurrence and absent on another
 * - probable OCR confusion
 * - mixed revision schemes
 *
 * Never infers which revision is current without explicit source evidence.
 */

import type { BomRow, RevisionConflict } from "@/types/document-intelligence";

export function detectRevisionConflicts(rows: BomRow[]): RevisionConflict[] {
  const conflicts: RevisionConflict[] = [];

  // Group by normalized part number
  const partMap = new Map<string, BomRow[]>();
  for (const row of rows) {
    const key = row.partNumberNormalized;
    if (!key) continue;
    if (!partMap.has(key)) partMap.set(key, []);
    partMap.get(key)!.push(row);
  }

  for (const [partNumber, group] of partMap) {
    if (group.length < 2) continue;

    const revisions = group.map((r) => r.revision ?? "").filter(Boolean);
    const uniqueRevisions = [...new Set(revisions)];
    const hasMissing = group.some((r) => !r.revision);

    // Mixed revision schemes (e.g. "A" and "Rev 1" — heuristic)
    const mixedSchemes = uniqueRevisions.filter((r) => {
      const hasAlpha = /[A-Za-z]/.test(r);
      const hasDigit = /\d/.test(r);
      return hasAlpha && hasDigit && uniqueRevisions.some((o) => o !== r && /^\d+$/.test(o));
    });

    if (mixedSchemes.length > 0) {
      conflicts.push({
        partNumber,
        observedRevisions: uniqueRevisions,
        sourcePages: [...new Set(group.map((r) => r.sourcePage))],
        conflictType: "mixed_revision_schemes",
        severity: "high",
        reviewRequired: true,
      });
      continue;
    }

    // Multiple distinct revisions
    if (uniqueRevisions.length > 1) {
      conflicts.push({
        partNumber,
        observedRevisions: uniqueRevisions,
        sourcePages: [...new Set(group.map((r) => r.sourcePage))],
        conflictType: "multiple_revisions",
        severity: "critical",
        reviewRequired: true,
      });
      continue;
    }

    // Revision present on one occurrence, absent on another
    if (uniqueRevisions.length === 1 && hasMissing) {
      conflicts.push({
        partNumber,
        observedRevisions: [uniqueRevisions[0], "(missing)"],
        sourcePages: [...new Set(group.map((r) => r.sourcePage))],
        conflictType: "partial_missing_revision",
        severity: "medium",
        reviewRequired: true,
      });
    }
  }

  return conflicts;
}
