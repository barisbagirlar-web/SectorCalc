/**
 * Generate Sample BOM Output Files
 *
 * Creates three downloadable sample artifacts for the Maintenance BOM
 * Recovery landing page: 8-sheet workbook, 7-sheet exception report,
 * and CSV source map. Synthetic data only — no real parts.
 *
 * Usage:  node scripts/generate-sample-bom-outputs.mjs
 * Output: public/samples/Sample_Maintenance_BOM.xlsx
 *         public/samples/Sample_Procurement_Exception_Report.xlsx
 *         public/samples/Sample_Source_Map.csv
 */

import * as XLSX from "xlsx";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/* ── Helpers ─────────────────────────────────────────────────── */

const FORMULA_CHARS = ["=", "+", "-", "@", "\t", "\r"];

function safeCellValue(value) {
  if (value == null) return "";
  const str = String(value);
  if (FORMULA_CHARS.some((c) => str.startsWith(c))) {
    return { t: "s", v: str };
  }
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return str;
}

function applyCommonWorkbookSettings(ws, colWidths) {
  ws["!cols"] = colWidths.map((w) => ({ wch: w }));
  const ref = ws["!ref"];
  if (ref) ws["!autofilter"] = { ref };
  ws["!freeze"] = { xSplit: 0, ySplit: 1, topLeftCell: "A2" };
}

/* ── Synthetic Data ──────────────────────────────────────────── */

const SOURCE_DOC = "MMS-2024-07-Maintenance_Manual.pdf";

/**
 * 15-row synthetic BOM matching the scenario spec.
 *
 * itemNumber is 1-indexed; sourceRow is 0-indexed (as the engine would produce).
 */
function buildSyntheticRows() {
  const rows = [
    // Row 0 — Clean, leading-zero part number
    {
      itemNumber: 1,
      partNumberRaw: "00123",
      partNumberNormalized: "00123",
      descriptionRaw: "Bearing, Ball, Deep Groove 6205",
      descriptionNormalized: "Bearing, Ball, Deep Groove 6205",
      quantity: 4,
      unit: "EA",
      material: "Steel, AISI 52100",
      manufacturer: "SKF",
      manufacturerPartNumber: "6205-2RS",
      revision: "C",
      equipment: "Centrifugal Pump P-101",
      subassembly: "Pump Drive End",
      sourceDocument: SOURCE_DOC,
      sourcePage: 1,
      sourceTable: "T-01",
      sourceRow: 1,
      confidence: 0.97,
      validationStatus: "clean",
      validationFlags: [],
      reviewRequired: false,
      exportDisposition: "clean",
    },
    // Row 1 — Clean, leading-zero part number
    {
      itemNumber: 2,
      partNumberRaw: "00456",
      partNumberNormalized: "00456",
      descriptionRaw: 'O-Ring, Viton, 2-214, 75 Durometer',
      descriptionNormalized: 'O-Ring, Viton, 2-214, 75 Durometer',
      quantity: 10,
      unit: "EA",
      material: "Viton FKM",
      manufacturer: "Parker Hannifin",
      manufacturerPartNumber: "2-214-V75",
      revision: "A",
      equipment: "Heat Exchanger E-201",
      subassembly: "Tube Bundle Seal",
      sourceDocument: SOURCE_DOC,
      sourcePage: 1,
      sourceTable: "T-01",
      sourceRow: 2,
      confidence: 0.99,
      validationStatus: "clean",
      validationFlags: [],
      reviewRequired: false,
      exportDisposition: "clean",
    },
    // Row 2 — Clean, leading-zero part number
    {
      itemNumber: 3,
      partNumberRaw: "00789",
      partNumberNormalized: "00789",
      descriptionRaw: "Gasket, Spiral Wound, DN80 PN16",
      descriptionNormalized: "Gasket, Spiral Wound, DN80 PN16",
      quantity: 2,
      unit: "EA",
      material: "SS 316 / Graphite",
      manufacturer: "Flexitallic",
      manufacturerPartNumber: "SWG-DN80-316",
      revision: "B",
      equipment: "Steam Header H-301",
      subassembly: "Flange Connection",
      sourceDocument: SOURCE_DOC,
      sourcePage: 1,
      sourceTable: "T-01",
      sourceRow: 3,
      confidence: 0.94,
      validationStatus: "clean",
      validationFlags: [],
      reviewRequired: false,
      exportDisposition: "clean",
    },
    // Row 3 — Clean, leading-zero part number
    {
      itemNumber: 4,
      partNumberRaw: "00102",
      partNumberNormalized: "00102",
      descriptionRaw: "Mechanical Seal, Type 21, 1.500 in",
      descriptionNormalized: "Mechanical Seal, Type 21, 1.500 in",
      quantity: 1,
      unit: "EA",
      material: "Carbon / SiC / Viton",
      manufacturer: "John Crane",
      manufacturerPartNumber: "21-1.500-CS",
      revision: "D",
      equipment: "Centrifugal Pump P-101",
      subassembly: "Pump Seal Chamber",
      sourceDocument: SOURCE_DOC,
      sourcePage: 1,
      sourceTable: "T-01",
      sourceRow: 4,
      confidence: 0.96,
      validationStatus: "clean",
      validationFlags: [],
      reviewRequired: false,
      exportDisposition: "clean",
    },
    // Row 4 — Clean, leading-zero part number
    {
      itemNumber: 5,
      partNumberRaw: "00931",
      partNumberNormalized: "00931",
      descriptionRaw: "V-Belt, SPB 2650, 5 Rib",
      descriptionNormalized: "V-Belt, SPB 2650, 5 Rib",
      quantity: 3,
      unit: "EA",
      material: "EPDM Rubber / Polyester Cord",
      manufacturer: "ContiTech",
      manufacturerPartNumber: "SPB-2650-5",
      revision: "A",
      equipment: "Fan F-401",
      subassembly: "Drive Train",
      sourceDocument: SOURCE_DOC,
      sourcePage: 1,
      sourceTable: "T-01",
      sourceRow: 5,
      confidence: 0.93,
      validationStatus: "clean",
      validationFlags: [],
      reviewRequired: false,
      exportDisposition: "clean",
    },
    // Row 5 — Missing quantity (review required)
    {
      itemNumber: 6,
      partNumberRaw: "01234",
      partNumberNormalized: "01234",
      descriptionRaw: "Filter Element, Oil, 10 Micron",
      descriptionNormalized: "Filter Element, Oil, 10 Micron",
      quantity: null,
      unit: "EA",
      material: "Cellulose / SS Mesh",
      manufacturer: "Pall Corporation",
      manufacturerPartNumber: "HC8300-FAN",
      revision: "B",
      equipment: "Lube Oil System L-501",
      subassembly: "Oil Filtration",
      sourceDocument: SOURCE_DOC,
      sourcePage: 2,
      sourceTable: "T-02",
      sourceRow: 0,
      confidence: 0.82,
      validationStatus: "review_required",
      validationFlags: ["missing_quantity"],
      reviewRequired: true,
      exportDisposition: "review_required",
    },
    // Row 6 — Duplicate (ABC-123 first occurrence)
    {
      itemNumber: 7,
      partNumberRaw: "ABC-123",
      partNumberNormalized: "ABC-123",
      descriptionRaw: "Bearing, Ball, Angular Contact 7205",
      descriptionNormalized: "Bearing, Ball, Angular Contact 7205",
      quantity: 2,
      unit: "EA",
      material: "Steel, AISI 52100",
      manufacturer: "FAG",
      manufacturerPartNumber: "7205-B",
      revision: "A",
      equipment: "Gearbox G-601",
      subassembly: "Input Shaft",
      sourceDocument: SOURCE_DOC,
      sourcePage: 2,
      sourceTable: "T-02",
      sourceRow: 1,
      confidence: 0.91,
      validationStatus: "clean",
      validationFlags: [],
      reviewRequired: false,
      exportDisposition: "clean",
    },
    // Row 7 — Duplicate (ABC-123 second occurrence, conflicting description)
    {
      itemNumber: 8,
      partNumberRaw: "ABC-123",
      partNumberNormalized: "ABC-123",
      descriptionRaw: "Bearing, Roller, Cylindrical NU205",
      descriptionNormalized: "Bearing, Roller, Cylindrical NU205",
      quantity: 2,
      unit: "EA",
      material: "Steel, AISI 52100",
      manufacturer: "FAG",
      manufacturerPartNumber: "NU205-E",
      revision: null,
      equipment: "Gearbox G-601",
      subassembly: "Output Shaft",
      sourceDocument: SOURCE_DOC,
      sourcePage: 3,
      sourceTable: "T-03",
      sourceRow: 0,
      confidence: 0.78,
      validationStatus: "review_required",
      validationFlags: ["conflicting_description", "duplicate_part"],
      reviewRequired: true,
      exportDisposition: "review_required",
    },
    // Row 8 — Revision conflict (DEF-456, Rev A, page 4)
    {
      itemNumber: 9,
      partNumberRaw: "DEF-456",
      partNumberNormalized: "DEF-456",
      descriptionRaw: "Impeller, Closed, 8 in, 316 SS",
      descriptionNormalized: "Impeller, Closed, 8 in, 316 SS",
      quantity: 1,
      unit: "EA",
      material: "SS 316, Cast",
      manufacturer: "Goulds Pumps",
      manufacturerPartNumber: "3196-IMP-8",
      revision: "A",
      equipment: "Centrifugal Pump P-102",
      subassembly: "Hydraulic Assembly",
      sourceDocument: SOURCE_DOC,
      sourcePage: 4,
      sourceTable: "T-04",
      sourceRow: 0,
      confidence: 0.89,
      validationStatus: "review_required",
      validationFlags: ["revision_conflict"],
      reviewRequired: true,
      exportDisposition: "review_required",
    },
    // Row 9 — Revision conflict (DEF-456, Rev B, page 5)
    {
      itemNumber: 10,
      partNumberRaw: "DEF-456",
      partNumberNormalized: "DEF-456",
      descriptionRaw: "Impeller, Closed, 8 in, 316 SS",
      descriptionNormalized: "Impeller, Closed, 8 in, 316 SS",
      quantity: 1,
      unit: "EA",
      material: "SS 316, Cast",
      manufacturer: "Goulds Pumps",
      manufacturerPartNumber: "3196-IMP-8",
      revision: "B",
      equipment: "Centrifugal Pump P-102",
      subassembly: "Hydraulic Assembly",
      sourceDocument: SOURCE_DOC,
      sourcePage: 5,
      sourceTable: "T-05",
      sourceRow: 0,
      confidence: 0.87,
      validationStatus: "review_required",
      validationFlags: ["revision_conflict"],
      reviewRequired: true,
      exportDisposition: "review_required",
    },
    // Row 10 — Low confidence
    {
      itemNumber: 11,
      partNumberRaw: "05678",
      partNumberNormalized: "05678",
      descriptionRaw: "Coupling, Flexible, Jaw Type, L090",
      descriptionNormalized: "Coupling, Flexible, Jaw Type, L090",
      quantity: 1,
      unit: "EA",
      material: "Ductile Iron / Urethane",
      manufacturer: "Lovejoy",
      manufacturerPartNumber: "L090-F",
      revision: "C",
      equipment: "Motor M-701",
      subassembly: "Coupling Guard",
      sourceDocument: SOURCE_DOC,
      sourcePage: 5,
      sourceTable: "T-05",
      sourceRow: 1,
      confidence: 0.45,
      validationStatus: "blocked",
      validationFlags: ["low_confidence"],
      reviewRequired: true,
      exportDisposition: "review_required",
    },
    // Row 11 — Clean
    {
      itemNumber: 12,
      partNumberRaw: "09123",
      partNumberNormalized: "09123",
      descriptionRaw: "Pressure Gauge, 0-16 bar, 1/2 in NPT",
      descriptionNormalized: "Pressure Gauge, 0-16 bar, 1/2 in NPT",
      quantity: 2,
      unit: "EA",
      material: "Brass / SS 316",
      manufacturer: "WIKA",
      manufacturerPartNumber: "232.50.100",
      revision: "A",
      equipment: "Steam Drum D-801",
      subassembly: "Instrumentation",
      sourceDocument: SOURCE_DOC,
      sourcePage: 5,
      sourceTable: "T-05",
      sourceRow: 2,
      confidence: 0.95,
      validationStatus: "clean",
      validationFlags: [],
      reviewRequired: false,
      exportDisposition: "clean",
    },
    // Row 12 — Clean
    {
      itemNumber: 13,
      partNumberRaw: "06789",
      partNumberNormalized: "06789",
      descriptionRaw: "Solenoid Valve, 24 VDC, 3/2 NC",
      descriptionNormalized: "Solenoid Valve, 24 VDC, 3/2 NC",
      quantity: 1,
      unit: "EA",
      material: "Brass / NBR Seals",
      manufacturer: "ASCO",
      manufacturerPartNumber: "SCG551A001MS",
      revision: "B",
      equipment: "Control Panel CP-901",
      subassembly: "Pneumatic Controls",
      sourceDocument: SOURCE_DOC,
      sourcePage: 6,
      sourceTable: "T-06",
      sourceRow: 0,
      confidence: 0.98,
      validationStatus: "clean",
      validationFlags: [],
      reviewRequired: false,
      exportDisposition: "clean",
    },
    // Row 13 — Formula injection safe value
    {
      itemNumber: 14,
      partNumberRaw: "=SUM(A1:A10)",
      partNumberNormalized: "=SUM(A1:A10)",
      descriptionRaw: "Malicious Part Number — Formula Injection Attempt",
      descriptionNormalized: "Malicious Part Number — Formula Injection Attempt",
      quantity: 1,
      unit: "EA",
      material: null,
      manufacturer: null,
      manufacturerPartNumber: null,
      revision: null,
      equipment: null,
      subassembly: null,
      sourceDocument: SOURCE_DOC,
      sourcePage: 6,
      sourceTable: "T-06",
      sourceRow: 1,
      confidence: 0.73,
      validationStatus: "review_required",
      validationFlags: ["formula_injection", "missing_material"],
      reviewRequired: true,
      exportDisposition: "review_required",
    },
    // Row 14 — Missing part number
    {
      itemNumber: 15,
      partNumberRaw: null,
      partNumberNormalized: null,
      descriptionRaw: "Unidentified Component — Motor Mount Bracket",
      descriptionNormalized: "Unidentified Component — Motor Mount Bracket",
      quantity: 4,
      unit: "EA",
      material: "Steel, Mild",
      manufacturer: null,
      manufacturerPartNumber: null,
      revision: null,
      equipment: "Motor M-701",
      subassembly: "Mounting Frame",
      sourceDocument: SOURCE_DOC,
      sourcePage: 6,
      sourceTable: "T-06",
      sourceRow: 2,
      confidence: 0.61,
      validationStatus: "blocked",
      validationFlags: ["missing_part_number", "missing_manufacturer"],
      reviewRequired: true,
      exportDisposition: "review_required",
    },
  ];
  return rows;
}

/* ── Duplicate Groups ────────────────────────────────────────── */

function buildDuplicateGroups() {
  return [
    {
      duplicateGroupId: "DUP-001",
      duplicateType: "conflicting_description",
      severity: "high",
      records: [6, 7],
      sourcePages: [2, 3],
      recommendedDisposition: "Manual review required — verify correct description for ABC-123 before import",
      autoMergeAllowed: false,
    },
    {
      duplicateGroupId: "DUP-002",
      duplicateType: "conflicting_revision",
      severity: "high",
      records: [8, 9],
      sourcePages: [4, 5],
      recommendedDisposition: "Manual review required — confirm latest revision for DEF-456",
      autoMergeAllowed: false,
    },
  ];
}

/* ── Missing Field Exceptions ────────────────────────────────── */

function buildMissingFieldExceptions() {
  return [
    {
      type: "missing_quantity",
      rowIndex: 5,
      severity: "high",
      exportBlocking: false,
    },
    {
      type: "missing_material",
      rowIndex: 13,
      severity: "medium",
      exportBlocking: false,
    },
    {
      type: "missing_part_number",
      rowIndex: 14,
      severity: "critical",
      exportBlocking: true,
    },
    {
      type: "missing_manufacturer",
      rowIndex: 14,
      severity: "low",
      exportBlocking: false,
    },
  ];
}

/* ── Revision Conflicts ──────────────────────────────────────── */

function buildRevisionConflicts() {
  return [
    {
      partNumber: "DEF-456",
      observedRevisions: ["A", "B"],
      sourcePages: [4, 5],
      conflictType: "multiple_revisions",
      severity: "high",
      reviewRequired: true,
    },
  ];
}

/* ── Processing Summary ──────────────────────────────────────── */

function buildProcessingSummary() {
  return {
    inputFilename: SOURCE_DOC,
    processedPages: 6,
    extractedRows: 15,
    cleanRows: 7,
    reviewRows: 7,
    blockedRows: 1,
    duplicateGroups: 2,
    missingFieldCount: 4,
    revisionConflictCount: 1,
    lowConfidenceCount: 1,
    engineVersion: "1.0.0",
    validatorVersion: "1.0.0",
    schemaVersion: "maintenance_bom_v1",
    generatedAt: new Date().toISOString(),
  };
}

/* ── Procurement Exceptions ──────────────────────────────────── */

function buildProcurementExceptions() {
  return [
    {
      type: "missing_part_number",
      severity: "critical",
      description: "Row 15 has no part number. Component cannot be procured without a part identifier.",
      rowIndex: 14,
      partNumber: null,
      sourcePage: 6,
      recommendation: "Locate part number from engineering drawing or equipment manual. Check MMS-2024-07 p.6.",
    },
    {
      type: "conflicting_description",
      severity: "high",
      description:
        "Part ABC-123 appears twice (rows 7-8) with conflicting descriptions: 'Bearing, Ball, Angular Contact 7205' vs 'Bearing, Roller, Cylindrical NU205'.",
      rowIndex: 7,
      partNumber: "ABC-123",
      sourcePage: 3,
      recommendation:
        "Verify the correct description against the engineering drawing. Remove or correct the erroneous entry before RFQ.",
    },
    {
      type: "conflicting_revision",
      severity: "high",
      description:
        "Part DEF-456 (rows 9-10) has revision A on page 4 and revision B on page 5. Only one revision level should be active.",
      rowIndex: 8,
      partNumber: "DEF-456",
      sourcePage: 5,
      recommendation:
        "Confirm the current revision from the document title block. Update all records to match the active revision.",
    },
    {
      type: "missing_quantity",
      severity: "high",
      description: "Row 6 has no quantity for part 01234 (Filter Element). Purchasing cannot proceed without a quantity.",
      rowIndex: 5,
      partNumber: "01234",
      sourcePage: 2,
      recommendation: "Obtain the required quantity from the maintenance planner or bill of materials owner.",
    },
    {
      type: "low_confidence",
      severity: "medium",
      description: "Row 11 (part 05678) has confidence 0.45, below the 0.7 threshold. Text may be misread.",
      rowIndex: 10,
      partNumber: "05678",
      sourcePage: 5,
      recommendation: "Visually verify the extracted values against the source document before proceeding.",
    },
    {
      type: "formula_injection",
      severity: "medium",
      description: "Row 14 part number starts with '=' (formula injection attempt). Value has been escaped as text.",
      rowIndex: 13,
      partNumber: "'=SUM(A1:A10)",
      sourcePage: 6,
      recommendation: "Verify the actual part number from source. The escaped value is safe for ERP import.",
    },
  ];
}

/* ── Sheet: Clean BOM ────────────────────────────────────────── */

function buildCleanBomSheet(rows) {
  const headers = [
    "Item",
    "Part Number",
    "Description",
    "Quantity",
    "Unit",
    "Material",
    "Manufacturer",
    "Manufacturer Part Number",
    "Revision",
    "Equipment",
    "Subassembly",
    "Source Page",
    "Validation Status",
  ];
  const data = [headers];

  for (const r of rows) {
    // Only clean rows (skip review_required and excluded)
    const isDuplicate = r.itemNumber >= 7 && r.itemNumber <= 8 && r.itemNumber !== 9;
    const isRevConflict = r.itemNumber >= 9 && r.itemNumber <= 10;
    const isLowConf = r.itemNumber === 11;
    const isMissingQty = r.itemNumber === 6;
    const isFormulaInject = r.itemNumber === 14;
    const isMissingPN = r.itemNumber === 15;
    const isClean = !isDuplicate && !isRevConflict && !isLowConf && !isMissingQty && !isFormulaInject && !isMissingPN;
    if (!isClean) continue;

    data.push([
      safeCellValue(r.itemNumber),
      safeCellValue(r.partNumberNormalized),
      safeCellValue(r.descriptionNormalized),
      safeCellValue(r.quantity),
      safeCellValue(r.unit),
      safeCellValue(r.material),
      safeCellValue(r.manufacturer),
      safeCellValue(r.manufacturerPartNumber),
      safeCellValue(r.revision),
      safeCellValue(r.equipment),
      safeCellValue(r.subassembly),
      safeCellValue(r.sourcePage),
      "Clean",
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  applyCommonWorkbookSettings(ws, [6, 20, 30, 10, 8, 18, 18, 22, 10, 20, 18, 12, 16]);
  return ws;
}

/* ── Sheet: Review Required ──────────────────────────────────── */

function buildReviewRequiredSheet(rows, exceptions) {
  const headers = [
    "Item",
    "Part Number",
    "Description",
    "Quantity",
    "Exception Code",
    "Severity",
    "Confidence",
    "Review Reason",
    "Source Page",
    "Suggested Action",
  ];
  const data = [headers];
  const exceptionMap = new Map();
  for (const ex of exceptions) {
    if (!exceptionMap.has(ex.rowIndex)) exceptionMap.set(ex.rowIndex, []);
    exceptionMap.get(ex.rowIndex).push(ex);
  }

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const isClean =
      r.itemNumber !== 6 &&
      r.itemNumber !== 7 &&
      r.itemNumber !== 8 &&
      r.itemNumber !== 9 &&
      r.itemNumber !== 10 &&
      r.itemNumber !== 11 &&
      r.itemNumber !== 14 &&
      r.itemNumber !== 15;
    if (isClean) continue;

    const exs = exceptionMap.get(i) ?? [];

    let reviewReason = "";
    let suggestedAction = "";

    if (r.itemNumber === 6) {
      reviewReason = "Missing quantity; user-flagged review";
      suggestedAction = "Obtain quantity from maintenance planner";
    } else if (r.itemNumber === 7) {
      reviewReason = "Duplicate part ABC-123 — first occurrence";
      suggestedAction = "Keep if description is correct; verify against source";
    } else if (r.itemNumber === 8) {
      reviewReason = "Duplicate part ABC-123 — conflicting description; user-flagged review";
      suggestedAction = "Cross-reference description with engineering drawing";
    } else if (r.itemNumber === 9) {
      reviewReason = "Revision conflict DEF-456 — Rev A on page 4";
      suggestedAction = "Confirm current revision from title block";
    } else if (r.itemNumber === 10) {
      reviewReason = "Revision conflict DEF-456 — Rev B on page 5";
      suggestedAction = "Confirm current revision from title block";
    } else if (r.itemNumber === 11) {
      reviewReason = "Low confidence extraction (0.45)";
      suggestedAction = "Verify against source document manually";
    } else if (r.itemNumber === 14) {
      reviewReason = "Formula injection detected; missing material";
      suggestedAction = "Verify actual part number; escaped for safety";
    } else if (r.itemNumber === 15) {
      reviewReason = "Missing part number (blocking)";
      suggestedAction = "Locate part number from engineering drawing";
    }

    data.push([
      safeCellValue(r.itemNumber),
      safeCellValue(r.partNumberNormalized),
      safeCellValue(r.descriptionNormalized),
      safeCellValue(r.quantity),
      safeCellValue(exs.length > 0 ? exs[0].type : ""),
      safeCellValue(exs.length > 0 ? exs[0].severity : "high"),
      safeCellValue(r.confidence),
      safeCellValue(reviewReason),
      safeCellValue(r.sourcePage),
      safeCellValue(suggestedAction),
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  applyCommonWorkbookSettings(ws, [6, 20, 30, 10, 24, 10, 12, 50, 12, 40]);
  return ws;
}

/* ── Sheet: Duplicate Parts ──────────────────────────────────── */

function buildDuplicatePartsSheet(groups, rows) {
  const headers = [
    "Group ID",
    "Duplicate Type",
    "Severity",
    "Part Number",
    "Description",
    "Revision",
    "Source Pages",
    "Auto-Merge Allowed",
    "Recommended Disposition",
  ];
  const data = [headers];

  for (const group of groups) {
    for (const idx of group.records) {
      const r = rows[idx];
      data.push([
        safeCellValue(group.duplicateGroupId),
        safeCellValue(group.duplicateType.replace(/_/g, " ")),
        safeCellValue(group.severity),
        safeCellValue(r.partNumberNormalized),
        safeCellValue(r.descriptionNormalized),
        safeCellValue(r.revision),
        safeCellValue(r.sourcePage),
        safeCellValue(group.autoMergeAllowed ? "Yes" : "No"),
        safeCellValue(group.recommendedDisposition),
      ]);
    }
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  applyCommonWorkbookSettings(ws, [12, 24, 10, 20, 30, 10, 12, 16, 50]);
  return ws;
}

/* ── Sheet: Missing Fields ───────────────────────────────────── */

function buildMissingFieldsSheet(exceptions, rows) {
  const headers = ["Row", "Part Number", "Exception Type", "Severity", "Export Blocking"];
  const data = [headers];

  for (const ex of exceptions) {
    const r = rows[ex.rowIndex];
    data.push([
      safeCellValue(ex.rowIndex + 1),
      safeCellValue(r?.partNumberNormalized ?? ""),
      safeCellValue(ex.type.replace(/_/g, " ")),
      safeCellValue(ex.severity),
      safeCellValue(ex.exportBlocking ? "Yes" : "No"),
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  applyCommonWorkbookSettings(ws, [8, 20, 28, 10, 14]);
  return ws;
}

/* ── Sheet: Revision Conflicts ───────────────────────────────── */

function buildRevisionConflictsSheet(conflicts) {
  const headers = [
    "Part Number",
    "Observed Revisions",
    "Source Pages",
    "Conflict Type",
    "Severity",
    "Review Required",
  ];
  const data = [headers];

  for (const c of conflicts) {
    data.push([
      safeCellValue(c.partNumber),
      safeCellValue(c.observedRevisions.join(", ")),
      safeCellValue(c.sourcePages.join(", ")),
      safeCellValue(c.conflictType.replace(/_/g, " ")),
      safeCellValue(c.severity),
      "Yes",
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  applyCommonWorkbookSettings(ws, [20, 24, 14, 24, 10, 14]);
  return ws;
}

/* ── Sheet: Source Map ───────────────────────────────────────── */

function buildSourceMapSheet(rows) {
  const headers = [
    "Row ID",
    "Source Document",
    "Source Page",
    "Source Table",
    "Source Row",
    "Evidence Reference",
  ];
  const data = [headers];

  for (const r of rows) {
    data.push([
      safeCellValue(r.itemNumber),
      safeCellValue(r.sourceDocument),
      safeCellValue(r.sourcePage),
      safeCellValue(r.sourceTable),
      safeCellValue(r.sourceRow),
      safeCellValue(
        `${r.sourceDocument}#p${r.sourcePage}t${r.sourceTable}r${r.sourceRow}`
      ),
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  applyCommonWorkbookSettings(ws, [8, 24, 12, 14, 12, 48]);
  return ws;
}

/* ── Sheet: Processing Summary ───────────────────────────────── */

function buildProcessingSummarySheet(summary) {
  const data = [
    ["Metric", "Value"],
    ["Input Filename", safeCellValue(summary.inputFilename)],
    ["Processed Pages", safeCellValue(summary.processedPages)],
    ["Extracted Rows", safeCellValue(summary.extractedRows)],
    ["Clean Rows", safeCellValue(summary.cleanRows)],
    ["Review Required Rows", safeCellValue(summary.reviewRows)],
    ["Blocked Rows", safeCellValue(summary.blockedRows)],
    ["Duplicate Groups", safeCellValue(summary.duplicateGroups)],
    ["Missing Field Exceptions", safeCellValue(summary.missingFieldCount)],
    ["Revision Conflicts", safeCellValue(summary.revisionConflictCount)],
    ["Low Confidence Records", safeCellValue(summary.lowConfidenceCount)],
    ["Engine Version", safeCellValue(summary.engineVersion)],
    ["Validator Version", safeCellValue(summary.validatorVersion)],
    ["Schema Version", safeCellValue(summary.schemaVersion)],
    ["Generated At", safeCellValue(summary.generatedAt)],
    [],
    [
      "Prepared for controlled ERP import review. Automated extraction and consistency",
    ],
    [
      "checks support data preparation. The customer must review flagged and business-",
    ],
    [
      "critical records before ERP import, RFQ issuance, purchasing, maintenance, or",
    ],
    ["engineering use."],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws["!cols"] = [{ wch: 28 }, { wch: 24 }];
  return ws;
}

/* ── Sheet: Low Confidence Records ────────────────────────────── */

function buildLowConfidenceSheet(rows) {
  const headers = [
    "Row",
    "Part Number",
    "Description",
    "Confidence",
    "Source Page",
    "Validation Flags",
    "Recommended Action",
  ];
  const data = [headers];

  for (const r of rows) {
    if (r.confidence >= 0.7) continue;
    data.push([
      safeCellValue(r.itemNumber),
      safeCellValue(r.partNumberNormalized ?? r.partNumberRaw),
      safeCellValue(r.descriptionNormalized ?? r.descriptionRaw),
      safeCellValue(r.confidence),
      safeCellValue(r.sourcePage),
      safeCellValue((r.validationFlags || []).join("; ")),
      "Visually verify against source document",
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  applyCommonWorkbookSettings(ws, [8, 20, 30, 12, 12, 30, 40]);
  return ws;
}

/* ── Sheet: Generic ERP Import Template ──────────────────────── */

function buildImportTemplateSheet() {
  const headers = [
    "Part Number",
    "Description",
    "Quantity",
    "Unit",
    "Material",
    "Manufacturer",
    "Manufacturer Part Number",
    "Revision",
    "Equipment",
    "Subassembly",
    "Source Document",
  ];
  const data = [headers];
  const ws = XLSX.utils.aoa_to_sheet(data);
  applyCommonWorkbookSettings(ws, [20, 30, 10, 8, 18, 18, 22, 10, 20, 18, 24]);
  return ws;
}

/* ── Main Workbook Generator ─────────────────────────────────── */

function generateMaintenanceBomWorkbook(rows, groups, exceptions, conflicts, summary) {
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, buildCleanBomSheet(rows), "Clean BOM");
  XLSX.utils.book_append_sheet(wb, buildReviewRequiredSheet(rows, exceptions), "Review Required");
  XLSX.utils.book_append_sheet(wb, buildDuplicatePartsSheet(groups, rows), "Duplicate Parts");
  XLSX.utils.book_append_sheet(wb, buildMissingFieldsSheet(exceptions, rows), "Missing Fields");
  XLSX.utils.book_append_sheet(wb, buildRevisionConflictsSheet(conflicts), "Revision Conflicts");
  XLSX.utils.book_append_sheet(wb, buildLowConfidenceSheet(rows), "Low Confidence");
  XLSX.utils.book_append_sheet(wb, buildSourceMapSheet(rows), "Source Map");
  XLSX.utils.book_append_sheet(wb, buildProcessingSummarySheet(summary), "Processing Summary");
  XLSX.utils.book_append_sheet(wb, buildImportTemplateSheet(), "Generic ERP Import Template");

  return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
}

/* ── Exception Report Sheets ─────────────────────────────────── */

function buildExecutiveSummarySheet(summary, exceptions, groups, revisions) {
  const data = [
    ["Procurement Exception Report"],
    [`Job ID: SAMPLE-JOB-20240714-001`],
    [],
    ["Total Rows", safeCellValue(summary.extractedRows)],
    [
      "Critical Exceptions",
      safeCellValue(exceptions.filter((e) => e.severity === "critical").length),
    ],
    [
      "High Severity",
      safeCellValue(exceptions.filter((e) => e.severity === "high").length),
    ],
    [
      "Medium Severity",
      safeCellValue(exceptions.filter((e) => e.severity === "medium").length),
    ],
    [
      "Low Severity",
      safeCellValue(exceptions.filter((e) => e.severity === "low").length),
    ],
    ["Duplicate Groups", safeCellValue(groups.length)],
    ["Missing Field Exceptions", safeCellValue(exceptions.length)],
    ["Revision Conflicts", safeCellValue(revisions.length)],
    [],
    ["Generated At", safeCellValue(summary.generatedAt)],
    ["Engine Version", safeCellValue(summary.engineVersion)],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws["!cols"] = [{ wch: 28 }, { wch: 24 }];
  return ws;
}

function generateExceptionReport(rows, exceptions, groups, conflicts, summary) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Executive Summary
  XLSX.utils.book_append_sheet(
    wb,
    buildExecutiveSummarySheet(summary, exceptions, groups, conflicts),
    "Executive Summary"
  );

  // Sheet 2: Critical Exceptions
  const critHeaders = [
    "Type",
    "Severity",
    "Description",
    "Part Number",
    "Source Page",
    "Recommendation",
  ];
  const critData = [critHeaders];
  for (const ex of exceptions) {
    critData.push([
      safeCellValue(ex.type),
      safeCellValue(ex.severity),
      safeCellValue(ex.description),
      safeCellValue(ex.partNumber),
      safeCellValue(ex.sourcePage),
      safeCellValue(ex.recommendation),
    ]);
  }
  let ws = XLSX.utils.aoa_to_sheet(critData);
  applyCommonWorkbookSettings(ws, [24, 10, 60, 20, 12, 50]);
  XLSX.utils.book_append_sheet(wb, ws, "Critical Exceptions");

  // Sheet 3: Duplicate Candidates
  const dupHeaders = ["Group ID", "Type", "Severity", "Part Number", "Pages"];
  const dupData = [dupHeaders];
  for (const g of groups) {
    for (const idx of g.records) {
      dupData.push([
        safeCellValue(g.duplicateGroupId),
        safeCellValue(g.duplicateType),
        safeCellValue(g.severity),
        safeCellValue(rows[idx]?.partNumberNormalized ?? ""),
        safeCellValue(rows[idx]?.sourcePage ?? ""),
      ]);
    }
  }
  ws = XLSX.utils.aoa_to_sheet(dupData);
  applyCommonWorkbookSettings(ws, [12, 24, 10, 20, 10]);
  XLSX.utils.book_append_sheet(wb, ws, "Duplicate Candidates");

  // Sheet 4: Missing Required Data
  const missHeaders = ["Row", "Exception Type", "Severity", "Export Blocking"];
  const missData = [missHeaders];
  for (const m of buildMissingFieldExceptions()) {
    missData.push([
      safeCellValue(m.rowIndex + 1),
      safeCellValue(m.type),
      safeCellValue(m.severity),
      safeCellValue(m.exportBlocking ? "Yes" : "No"),
    ]);
  }
  ws = XLSX.utils.aoa_to_sheet(missData);
  applyCommonWorkbookSettings(ws, [8, 28, 10, 14]);
  XLSX.utils.book_append_sheet(wb, ws, "Missing Required Data");

  // Sheet 5: Revision Conflicts
  const revHeaders = ["Part Number", "Revisions", "Pages", "Type", "Severity"];
  const revData = [revHeaders];
  for (const r of conflicts) {
    revData.push([
      safeCellValue(r.partNumber),
      safeCellValue(r.observedRevisions.join(", ")),
      safeCellValue(r.sourcePages.join(", ")),
      safeCellValue(r.conflictType),
      safeCellValue(r.severity),
    ]);
  }
  ws = XLSX.utils.aoa_to_sheet(revData);
  applyCommonWorkbookSettings(ws, [20, 24, 14, 24, 10]);
  XLSX.utils.book_append_sheet(wb, ws, "Revision Conflicts");

  // Sheet 6: Low Confidence Records
  const lcHeaders = ["Row", "Part Number", "Confidence", "Source Page", "Recommended Action"];
  const lcData = [lcHeaders];
  for (const r of rows) {
    if (r.confidence >= 0.7) continue;
    lcData.push([
      safeCellValue(r.itemNumber),
      safeCellValue(r.partNumberNormalized),
      safeCellValue(r.confidence),
      safeCellValue(r.sourcePage),
      "Verify against source document",
    ]);
  }
  ws = XLSX.utils.aoa_to_sheet(lcData);
  applyCommonWorkbookSettings(ws, [8, 20, 12, 12, 36]);
  XLSX.utils.book_append_sheet(wb, ws, "Low Confidence Records");

  // Sheet 7: Recommended Review Sequence
  const seqHeaders = ["Priority", "Area", "Reason", "Estimated Effort"];
  const seqData = [seqHeaders];
  seqData.push(["1", "Critical Exceptions", "Blocking data issues", "High"]);
  seqData.push(["2", "Revision Conflicts", "May cause purchasing errors", "Medium"]);
  seqData.push(["3", "Duplicate Candidates", "Consolidate before import", "Medium"]);
  seqData.push(["4", "Missing Required Data", "Complete before import", "Low"]);
  seqData.push(["5", "Low Confidence Records", "Verify against source", "Low"]);
  ws = XLSX.utils.aoa_to_sheet(seqData);
  ws["!cols"] = [{ wch: 10 }, { wch: 24 }, { wch: 40 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, ws, "Recommended Review Sequence");

  return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
}

/* ── CSV Source Map ──────────────────────────────────────────── */

function generateCsvSourceMap(rows) {
  const headers = [
    "Row ID",
    "Source Document",
    "Source Page",
    "Source Table",
    "Source Row",
    "Evidence Reference",
  ];

  const csvRows = [headers.map(escapeCsvField).join(",")];

  for (const r of rows) {
    csvRows.push(
      [
        safeCsvField(r.itemNumber),
        safeCsvField(r.sourceDocument),
        safeCsvField(r.sourcePage),
        safeCsvField(r.sourceTable),
        safeCsvField(r.sourceRow),
        safeCsvField(
          `${r.sourceDocument}#p${r.sourcePage}t${r.sourceTable}r${r.sourceRow}`
        ),
      ].join(",")
    );
  }

  return csvRows.join("\n");
}

function escapeCsvField(value) {
  const str = value == null ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function safeCsvField(value) {
  if (value == null) return "";
  return escapeCsvField(value);
}

/* ── Main ────────────────────────────────────────────────────── */

function main() {
  const rows = buildSyntheticRows();
  const groups = buildDuplicateGroups();
  const exceptions = buildMissingFieldExceptions();
  const conflicts = buildRevisionConflicts();
  const summary = buildProcessingSummary();

  const outDir = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "public",
    "samples"
  );
  mkdirSync(outDir, { recursive: true });

  // 1. Sample_Maintenance_BOM.xlsx — 8-sheet workbook
  const bomBuf = generateMaintenanceBomWorkbook(rows, groups, exceptions, conflicts, summary);
  const bomPath = resolve(outDir, "Sample_Maintenance_BOM.xlsx");
  writeFileSync(bomPath, bomBuf);
  console.log(`✓ Wrote ${bomBuf.length} bytes → ${bomPath}`);

  // 2. Sample_Procurement_Exception_Report.xlsx — 7-sheet report
  const excBuf = generateExceptionReport(rows, buildProcurementExceptions(), groups, conflicts, summary);
  const excPath = resolve(outDir, "Sample_Procurement_Exception_Report.xlsx");
  writeFileSync(excPath, excBuf);
  console.log(`✓ Wrote ${excBuf.length} bytes → ${excPath}`);

  // 3. Sample_Source_Map.csv
  const csvContent = generateCsvSourceMap(rows);
  const csvPath = resolve(outDir, "Sample_Source_Map.csv");
  writeFileSync(csvPath, csvContent, "utf-8");
  console.log(`✓ Wrote ${csvContent.length} bytes → ${csvPath}`);
}

main();
