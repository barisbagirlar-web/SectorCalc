/**
 * BOM Hierarchy Detection (Section 60)
 *
 * Preserves maintenance context where present in the source document.
 *
 * Rules:
 *  - Create hierarchy only from explicit source structure, indentation,
 *    section headings, table references, or parent identifiers.
 *  - Never infer hierarchy solely from semantic similarity.
 *  - Conflicting hierarchy creates review exception.
 *  - Flat documents remain flat.
 *  - Hierarchy is optional for clean export unless source explicitly requires it.
 *  - Circular hierarchy detection — acyclic graph enforcement.
 */

import type { BomRow } from "@/types/document-intelligence";

/* ── Hierarchy Exception Types ────────────────────────────────── */

export type HierarchyExceptionType =
  | "unresolved_parent"
  | "conflicting_parent"
  | "circular_hierarchy"
  | "orphan_subassembly"
  | "invalid_hierarchy_level";

export interface HierarchyException {
  type: HierarchyExceptionType;
  severity: "critical" | "high" | "medium" | "low";
  rowIndex: number;
  partNumber: string | null;
  description: string;
}

export interface HierarchyResult {
  rows: HierarchyEnhancedRow[];
  exceptions: HierarchyException[];
  hasHierarchy: boolean;
}

export interface HierarchyEnhancedRow {
  itemNumber: number;
  partNumber: string | null;
  partNumberNormalized: string | null;
  description: string | null;
  parentItemNumber: number | null;
  parentPartNumber: string | null;
  hierarchyLevel: number | null;
  hierarchyPath: string | null;
  hierarchyEvidence: string | null;
}

/* ── Constants ────────────────────────────────────────────────── */

const MAX_HIERARCHY_DEPTH = 20;

/* ── Detection Strategies ─────────────────────────────────────── */

/**
 * Detect hierarchy by finding section-heading rows that are followed
 * by indented detail rows. A section heading becomes a parent.
 */
function detectBySectionHeadings(rows: BomRow[]): {
  parentMap: Map<number, { parentPartNumber: string; hierarchyLevel: number }>;
  exceptions: HierarchyException[];
} {
  const parentMap = new Map<number, { parentPartNumber: string; hierarchyLevel: number }>();
  const exceptions: HierarchyException[] = [];

  let currentLevel = 0;
  const levelStack: Array<{ itemNumber: number; partNumber: string }> = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // Check for hierarchy evidence from extraction pass B
    const hasHierarchyEvidence = row.hierarchyEvidence != null;

    if (hasHierarchyEvidence) {
      // This row is a section heading — becomes a parent
      const parentPN = row.partNumberNormalized ?? row.partNumberRaw ?? `SECTION-${i}`;
      const level = (currentLevel + 1);

      levelStack.push({ itemNumber: row.itemNumber, partNumber: parentPN });
      currentLevel = level;

      // Mark subsequent rows as children of this parent
      for (let j = i + 1; j < rows.length; j++) {
        const nextRow = rows[j];
        if (nextRow.hierarchyEvidence != null) break; // Next section heading

        parentMap.set(j, {
          parentPartNumber: parentPN,
          hierarchyLevel: level,
        });
      }
    }

    // Check explicit parent reference in row data
    if (row.parentPartNumber != null && row.parentItemNumber != null) {
      // Verify parent exists
      const parentExists = rows.some(
        (r) => r.itemNumber === row.parentItemNumber ||
          (r.partNumberNormalized ?? r.partNumberRaw) === row.parentPartNumber,
      );

      if (!parentExists) {
        exceptions.push({
          type: "unresolved_parent",
          severity: "high",
          rowIndex: i,
          partNumber: row.partNumberNormalized ?? row.partNumberRaw,
          description: `Parent part "${row.parentPartNumber}" (item ${row.parentItemNumber}) not found in extracted rows`,
        });
      }
    }
  }

  return { parentMap, exceptions };
}

/**
 * Detect circular hierarchy by following parent references.
 */
function detectCircularReferences(rows: BomRow[]): HierarchyException[] {
  const exceptions: HierarchyException[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.parentItemNumber == null) continue;

    const visited = new Set<number>();
    let currentItem = row.itemNumber;
    let depth = 0;

    while (currentItem != null && depth < MAX_HIERARCHY_DEPTH) {
      if (visited.has(currentItem)) {
        exceptions.push({
          type: "circular_hierarchy",
          severity: "critical",
          rowIndex: i,
          partNumber: row.partNumberNormalized ?? row.partNumberRaw,
          description: `Circular hierarchy detected involving item ${currentItem}`,
        });
        break;
      }
      visited.add(currentItem);

      const parent = rows.find((r) => r.itemNumber === currentItem);
      if (!parent || parent.parentItemNumber == null) break;

      currentItem = parent.parentItemNumber;
      depth++;
    }

    if (depth >= MAX_HIERARCHY_DEPTH) {
      exceptions.push({
        type: "invalid_hierarchy_level",
        severity: "critical",
        rowIndex: i,
        partNumber: row.partNumberNormalized ?? row.partNumberRaw,
        description: `Hierarchy depth exceeds maximum (${MAX_HIERARCHY_DEPTH})`,
      });
    }
  }

  return exceptions;
}

/**
 * Detect orphan subassembly rows: rows that reference a subassembly
 * that has no parent equipment or assembly.
 */
function detectOrphanSubassemblies(rows: BomRow[]): HierarchyException[] {
  const exceptions: HierarchyException[] = [];
  const subassemblies = new Set(
    rows
      .filter((r) => r.subassembly != null)
      .map((r) => r.subassembly),
  );

  const hasEquipment = rows.some((r) => r.equipment != null);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.subassembly != null && !hasEquipment && row.equipment == null) {
      exceptions.push({
        type: "orphan_subassembly",
        severity: "medium",
        rowIndex: i,
        partNumber: row.partNumberNormalized ?? row.partNumberRaw,
        description: `Subassembly "${row.subassembly}" has no parent equipment or assembly`,
      });
    }
  }

  return exceptions;
}

/**
 * Build hierarchy path string for a row.
 */
function buildHierarchyPath(
  rowIndex: number,
  rows: BomRow[],
  parentMap: Map<number, { parentPartNumber: string; hierarchyLevel: number }>,
): string | null {
  const parts: string[] = [];

  const info = parentMap.get(rowIndex);
  if (!info) return null;

  parts.push(info.parentPartNumber);

  // Walk up the hierarchy
  let currentLevel = info.hierarchyLevel;
  for (const [idx, pinfo] of parentMap) {
    if (pinfo.hierarchyLevel < currentLevel &&
      idx < rowIndex) {
      parts.unshift(pinfo.parentPartNumber);
      currentLevel = pinfo.hierarchyLevel;
    }
  }

  return parts.join(" > ");
}

/* ── Main Entry Point ─────────────────────────────────────────── */

export function detectBomHierarchy(rows: BomRow[]): HierarchyResult {
  const { parentMap, exceptions: headingExceptions } = detectBySectionHeadings(rows);
  const circularExceptions = detectCircularReferences(rows);
  const orphanExceptions = detectOrphanSubassemblies(rows);

  const allExceptions = [
    ...headingExceptions,
    ...circularExceptions,
    ...orphanExceptions,
  ];

  const hasHierarchy = parentMap.size > 0 ||
    rows.some((r) => r.parentPartNumber != null || r.hierarchyEvidence != null);

  const enhancedRows: HierarchyEnhancedRow[] = rows.map((row, i) => {
    const parentInfo = parentMap.get(i);
    const hierarchyPath = buildHierarchyPath(i, rows, parentMap);

    return {
      itemNumber: row.itemNumber,
      partNumber: row.partNumberRaw,
      partNumberNormalized: row.partNumberNormalized,
      description: row.descriptionNormalized,
      parentItemNumber: parentInfo ? null : row.parentItemNumber,
      parentPartNumber: parentInfo?.parentPartNumber ?? row.parentPartNumber ?? null,
      hierarchyLevel: parentInfo?.hierarchyLevel ?? null,
      hierarchyPath: hierarchyPath ?? null,
      hierarchyEvidence: row.hierarchyEvidence ?? null,
    };
  });

  return {
    rows: enhancedRows,
    exceptions: allExceptions,
    hasHierarchy,
  };
}
