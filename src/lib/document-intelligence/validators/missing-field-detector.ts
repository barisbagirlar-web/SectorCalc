/**
 * Missing-Field Detection — Required fields and exception classes.
 *
 * Default required fields for clean export:
 * - partNumberNormalized
 * - descriptionNormalized
 * - quantity
 */

import type { BomRow, MissingFieldException, MissingFieldType } from "@/types/document-intelligence";

export interface MissingFieldOptions {
  requireRevision?: boolean;
  requireManufacturer?: boolean;
  requireUnit?: boolean;
  requireEquipment?: boolean;
  requireSubassembly?: boolean;
}

export function detectMissingFields(
  rows: BomRow[],
  options: MissingFieldOptions = {}
): MissingFieldException[] {
  const exceptions: MissingFieldException[] = [];

  // Determine if revision/manufacturer fields exist elsewhere in the document
  const hasAnyRevision = rows.some((r) => r.revision != null && r.revision.length > 0);
  const hasAnyManufacturer = rows.some((r) => r.manufacturer != null && r.manufacturer.length > 0);
  const hasAnyUnit = rows.some((r) => r.unit != null && r.unit !== "each");
  const hasAnyEquipment = rows.some((r) => r.equipment != null);
  const hasAnySubassembly = rows.some((r) => r.subassembly != null);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // Missing part number — always export-blocking
    if (!row.partNumberNormalized || row.partNumberNormalized.trim().length === 0) {
      exceptions.push({
        type: "missing_part_number",
        rowIndex: i,
        severity: "critical",
        exportBlocking: true,
      });
    }

    // Missing description — export-blocking
    if (!row.descriptionNormalized || row.descriptionNormalized.trim().length === 0) {
      exceptions.push({
        type: "missing_description",
        rowIndex: i,
        severity: "critical",
        exportBlocking: true,
      });
    }

    // Missing or invalid quantity
    if (row.quantity == null) {
      exceptions.push({
        type: "missing_quantity",
        rowIndex: i,
        severity: "critical",
        exportBlocking: true,
      });
    } else if (row.quantity <= 0 || !Number.isFinite(row.quantity)) {
      exceptions.push({
        type: "invalid_quantity",
        rowIndex: i,
        severity: "critical",
        exportBlocking: true,
      });
    }

    // Revision — conditional required
    if (options.requireRevision || hasAnyRevision) {
      if (!row.revision || row.revision.trim().length === 0) {
        exceptions.push({
          type: "missing_revision",
          rowIndex: i,
          severity: hasAnyRevision ? "medium" : "low",
          exportBlocking: false,
        });
      }
    }

    // Material — not export-blocking by default
    if (!row.material || row.material.trim().length === 0) {
      // Only flag if others have material
      if (i > 0 && rows.some((r) => r.material != null && r.material.length > 0)) {
        exceptions.push({
          type: "missing_material",
          rowIndex: i,
          severity: "low",
          exportBlocking: false,
        });
      }
    }

    // Manufacturer — conditional
    if (options.requireManufacturer || hasAnyManufacturer) {
      if (!row.manufacturer || row.manufacturer.trim().length === 0) {
        exceptions.push({
          type: "missing_manufacturer",
          rowIndex: i,
          severity: hasAnyManufacturer ? "medium" : "low",
          exportBlocking: false,
        });
      }
    }

    // Unit — conditional
    if (options.requireUnit || hasAnyUnit) {
      if (!row.unit || row.unit.trim().length === 0) {
        exceptions.push({
          type: "invalid_quantity", // reuse for unit missing
          rowIndex: i,
          severity: "low",
          exportBlocking: false,
        });
      }
    }
  }

  return exceptions;
}
