/**
 * ERP-Ready Excel Workbook Generator
 *
 * Generates 8-sheet .xlsx workbook with frozen headers, autofilters,
 * consistent data types, no macros, and formula injection protection.
 *
 * Dependencies: xlsx (SheetJS Community Edition — MIT license)
 */

import * as XLSX from "xlsx";
import type {
  BomRow,
  DuplicateGroup,
  MissingFieldException,
  RevisionConflict,
  ProcessingSummary,
  ProcurementException,
} from "@/types/document-intelligence";
import type { DispositionResult } from "@/lib/document-intelligence/validators/export-disposition";

/* ── Formula Injection Protection ──────────────────────────────── */

const FORMULA_CHARS = ["=", "+", "-", "@", "\t", "\r"];

function safeCellValue(value: unknown): string | number | boolean {
  if (value == null) return "";
  const str = String(value);
  if (FORMULA_CHARS.some((c) => str.startsWith(c))) {
    return `'${str}`;
  }
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return str;
}

/* ── Styles (inline via xlsx utils since we want frozen headers) ── */

function applyCommonWorkbookSettings(ws: XLSX.WorkSheet, colWidths: number[]): void {
  ws["!cols"] = colWidths.map((w) => ({ wch: w }));
  const ref = ws["!ref"];
  if (ref) ws["!autofilter"] = { ref };
  // Freeze top row
  ws["!freeze"] = { xSplit: 0, ySplit: 1, topLeftCell: "A2" };
}

/* ── Sheet 1: Clean BOM ────────────────────────────────────────── */

function buildCleanBomSheet(rows: DispositionResult): XLSX.WorkSheet {
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

  const data: unknown[][] = [headers];

  for (const dr of rows.rows) {
    if (dr.disposition !== "clean") continue;
    const r = dr.row;
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
  applyCommonWorkbookSettings(ws, [6, 20, 30, 10, 8, 14, 16, 20, 10, 14, 14, 12, 16]);
  return ws;
}

/* ── Sheet 2: Review Required ──────────────────────────────────── */

function buildReviewRequiredSheet(
  rows: DispositionResult,
  exceptions: MissingFieldException[]
): XLSX.WorkSheet {
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

  const exceptionMap = new Map<number, MissingFieldException[]>();
  for (const ex of exceptions) {
    if (!exceptionMap.has(ex.rowIndex)) exceptionMap.set(ex.rowIndex, []);
    exceptionMap.get(ex.rowIndex)!.push(ex);
  }

  const data: unknown[][] = [headers];

  for (const dr of rows.rows) {
    if (dr.disposition !== "review_required") continue;
    const r = dr.row;
    const exs = exceptionMap.get(rows.rows.indexOf(dr)) ?? [];

    data.push([
      safeCellValue(r.itemNumber),
      safeCellValue(r.partNumberNormalized),
      safeCellValue(r.descriptionNormalized),
      safeCellValue(r.quantity),
      safeCellValue(exs.length > 0 ? exs[0].type : ""),
      safeCellValue(exs.length > 0 ? exs[0].severity : "medium"),
      safeCellValue(r.confidence),
      safeCellValue(dr.reasons.join("; ")),
      safeCellValue(r.sourcePage),
      safeCellValue(
        exs.length > 0 ? exs[0].type.replace(/_/g, " ") : "Review required"
      ),
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  applyCommonWorkbookSettings(ws, [6, 20, 30, 10, 20, 10, 12, 40, 12, 30]);
  return ws;
}

/* ── Sheet 3: Duplicate Parts ──────────────────────────────────── */

function buildDuplicatePartsSheet(
  groups: DuplicateGroup[],
  rows: BomRow[]
): XLSX.WorkSheet {
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

  const data: unknown[][] = [headers];

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
  applyCommonWorkbookSettings(ws, [12, 24, 10, 20, 30, 10, 12, 16, 40]);
  return ws;
}

/* ── Sheet 4: Missing Fields ───────────────────────────────────── */

function buildMissingFieldsSheet(
  exceptions: MissingFieldException[],
  rows: BomRow[]
): XLSX.WorkSheet {
  const headers = [
    "Row",
    "Part Number",
    "Exception Type",
    "Severity",
    "Export Blocking",
  ];

  const data: unknown[][] = [headers];

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

/* ── Sheet 5: Revision Conflicts ───────────────────────────────── */

function buildRevisionConflictsSheet(
  conflicts: RevisionConflict[]
): XLSX.WorkSheet {
  const headers = [
    "Part Number",
    "Observed Revisions",
    "Source Pages",
    "Conflict Type",
    "Severity",
    "Review Required",
  ];

  const data: unknown[][] = [headers];

  for (const c of conflicts) {
    data.push([
      safeCellValue(c.partNumber),
      safeCellValue(c.observedRevisions.join(", ")),
      safeCellValue(c.sourcePages.join(", ")),
      safeCellValue(c.conflictType.replace(/_/g, " ")),
      safeCellValue(c.severity),
      safeCellValue("Yes"),
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  applyCommonWorkbookSettings(ws, [20, 24, 14, 24, 10, 14]);
  return ws;
}

/* ── Sheet: Procurement Ready (Section 62) ────────────────────── */

function buildProcurementReadySheet(rows: DispositionResult): XLSX.WorkSheet {
  const headers = [
    "Part Number",
    "Description",
    "Quantity",
    "Unit",
    "Manufacturer",
    "Manufacturer Part Number",
    "Revision",
    "Equipment",
    "Subassembly",
    "Material",
    "Source Page",
    "Procurement Status",
    "Review Note",
  ];

  const data: unknown[][] = [headers];

  for (const dr of rows.rows) {
    if (dr.disposition !== "clean") continue;
    const r = dr.row;
    data.push([
      safeCellValue(r.partNumberNormalized),
      safeCellValue(r.descriptionNormalized),
      safeCellValue(r.quantity),
      safeCellValue(r.unit),
      safeCellValue(r.manufacturer),
      safeCellValue(r.manufacturerPartNumber),
      safeCellValue(r.revision),
      safeCellValue(r.equipment),
      safeCellValue(r.subassembly),
      safeCellValue(r.material),
      safeCellValue(r.sourcePage),
      "Ready",
      "",
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  applyCommonWorkbookSettings(ws, [20, 30, 10, 8, 16, 20, 10, 14, 14, 14, 12, 18, 30]);
  return ws;
}

/* ── Sheet: RFQ Preparation (Section 62) ──────────────────────── */

function buildRfqPreparationSheet(rows: DispositionResult): XLSX.WorkSheet {
  const headers = [
    "Part Number",
    "Description",
    "Quantity",
    "Unit",
    "Manufacturer",
    "Manufacturer Part Number",
    "Revision",
    "Delivery/Quote Notes",
    "Supplier",
    "Quoted Unit Price",
    "Currency",
    "Lead Time",
  ];

  const data: unknown[][] = [headers];

  for (const dr of rows.rows) {
    if (dr.disposition !== "clean") continue;
    const r = dr.row;
    data.push([
      safeCellValue(r.partNumberNormalized),
      safeCellValue(r.descriptionNormalized),
      safeCellValue(r.quantity),
      safeCellValue(r.unit),
      safeCellValue(r.manufacturer),
      safeCellValue(r.manufacturerPartNumber),
      safeCellValue(r.revision),
      "",  // Customer field
      "",  // Customer field
      "",  // Customer field
      "",  // Customer field
      "",  // Customer field
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  applyCommonWorkbookSettings(ws, [20, 30, 10, 8, 16, 20, 10, 20, 16, 16, 10, 14]);
  return ws;
}

/* ── Sheet: Low Confidence Records ──────────────────────────────── */

function buildLowConfidenceSheet(rows: DispositionResult): XLSX.WorkSheet {
  const headers = [
    "Item",
    "Part Number",
    "Description",
    "Confidence",
    "Source Page",
    "Validation Flags",
    "Recommended Action",
  ];

  const data: unknown[][] = [headers];

  for (const dr of rows.rows) {
    const r = dr.row;
    if (r.confidence >= 0.7) continue;
    data.push([
      safeCellValue(r.itemNumber),
      safeCellValue(r.partNumberNormalized ?? r.partNumberRaw),
      safeCellValue(r.descriptionNormalized ?? r.descriptionRaw),
      safeCellValue(r.confidence),
      safeCellValue(r.sourcePage),
      safeCellValue(r.validationFlags.join("; ")),
      "Visually verify against source document — see Data Dictionary for field guidance",
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  applyCommonWorkbookSettings(ws, [6, 20, 30, 12, 12, 30, 60]);
  return ws;
}

/* ── Sheet: CMMS Spare Parts Template (Section 61) ────────────── */

function buildCmmsTemplateSheet(rows: BomRow[]): XLSX.WorkSheet {
  const headers = [
    "Equipment ID",
    "Equipment Name",
    "Part Number",
    "Description",
    "Quantity",
    "Unit",
    "Manufacturer",
    "Manufacturer Part Number",
    "Supplier",
    "Storage Location",
    "Min Stock Level",
    "Max Stock Level",
    "Reorder Point",
    "Lead Time",
    "Unit Price",
    "Currency",
    "Preferred",
  ];

  const data: unknown[][] = [headers];

  for (const r of rows) {
    if (!r.partNumberNormalized && !r.partNumberRaw) continue;
    data.push([
      safeCellValue(r.equipment ?? ""),
      safeCellValue(r.equipment ?? ""),
      safeCellValue(r.partNumberNormalized ?? r.partNumberRaw),
      safeCellValue(r.descriptionNormalized ?? r.descriptionRaw),
      safeCellValue(r.quantity),
      safeCellValue(r.unit),
      safeCellValue(r.manufacturer),
      safeCellValue(r.manufacturerPartNumber),
      "",  // Supplier — customer field
      "",  // Storage Location — customer field
      "",  // Min Stock Level — customer field
      "",  // Max Stock Level — customer field
      "",  // Reorder Point — customer field
      "",  // Lead Time — customer field
      "",  // Unit Price — customer field
      "",  // Currency — customer field
      "",  // Preferred — customer field
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  applyCommonWorkbookSettings(ws, [16, 24, 20, 30, 10, 8, 16, 20, 16, 16, 12, 12, 12, 10, 12, 10, 12]);
  return ws;
}

/* ── Sheet: Asset Hierarchy (Section 60) ──────────────────────── */

function buildAssetHierarchySheet(rows: BomRow[]): XLSX.WorkSheet {
  const hasHierarchy = rows.some(
    (r) => r.parentPartNumber != null || r.hierarchyLevel != null || r.hierarchyEvidence != null,
  );
  if (!hasHierarchy) {
    const data: unknown[][] = [
      ["Asset Hierarchy"],
      [],
      ["No hierarchical structure detected in this document."],
      ["Extracted rows are presented as a flat BOM."],
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws["!cols"] = [{ wch: 60 }];
    return ws;
  }

  const headers = [
    "Item",
    "Part Number",
    "Description",
    "Quantity",
    "Parent Item Number",
    "Parent Part Number",
    "Hierarchy Level",
    "Hierarchy Path",
    "Hierarchy Evidence",
    "Equipment",
    "Subassembly",
  ];

  const data: unknown[][] = [headers];

  for (const r of rows) {
    data.push([
      safeCellValue(r.itemNumber),
      safeCellValue(r.partNumberNormalized),
      safeCellValue(r.descriptionNormalized),
      safeCellValue(r.quantity),
      safeCellValue(r.parentItemNumber),
      safeCellValue(r.parentPartNumber),
      safeCellValue(r.hierarchyLevel),
      safeCellValue(r.hierarchyPath),
      safeCellValue(r.hierarchyEvidence),
      safeCellValue(r.equipment),
      safeCellValue(r.subassembly),
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  applyCommonWorkbookSettings(ws, [8, 20, 30, 10, 16, 20, 14, 36, 20, 16, 16]);
  return ws;
}

/* ── Sheet: Dual-Pass Reconciliation Summary (Section 59) ──────── */

function buildReconciliationSheet(rows: BomRow[]): XLSX.WorkSheet {
  const headers = [
    "Item",
    "Part Number",
    "Extraction Pass",
    "Reconciliation Status",
    "Review Required",
  ];

  const data: unknown[][] = [headers];

  for (const r of rows) {
    data.push([
      safeCellValue(r.itemNumber),
      safeCellValue(r.partNumberNormalized),
      safeCellValue(r.extractionPass ?? "unknown"),
      safeCellValue(r.reconciliationStatus ?? "unknown"),
      safeCellValue(r.reviewRequired ? "Yes" : "No"),
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  applyCommonWorkbookSettings(ws, [8, 20, 16, 24, 14]);
  return ws;
}

/* ── Sheet 6: Source Map ───────────────────────────────────────── */

function buildSourceMapSheet(rows: BomRow[]): XLSX.WorkSheet {
  const headers = [
    "Row ID",
    "Source Document",
    "Source Page",
    "Source Table",
    "Source Row",
    "Evidence Reference",
  ];

  const data: unknown[][] = [headers];

  for (const r of rows) {
    data.push([
      safeCellValue(r.itemNumber),
      safeCellValue(r.sourceDocument),
      safeCellValue(r.sourcePage),
      safeCellValue(r.sourceTable),
      safeCellValue(r.sourceRow),
      safeCellValue(`${r.sourceDocument}#p${r.sourcePage}t${r.sourceTable}r${r.sourceRow}`),
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  applyCommonWorkbookSettings(ws, [8, 24, 12, 14, 12, 36]);
  return ws;
}

/* ── Sheet 7: Processing Summary ───────────────────────────────── */

function buildProcessingSummarySheet(
  summary: ProcessingSummary
): XLSX.WorkSheet {
  const data: unknown[][] = [
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

/* ── Sheet: Generic ERP Import Template ────────────────────────── */

function buildGenericErpImportTemplateSheet(): XLSX.WorkSheet {
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

  const data: unknown[][] = [headers];
  const ws = XLSX.utils.aoa_to_sheet(data);
  applyCommonWorkbookSettings(ws, [20, 30, 10, 8, 14, 16, 20, 10, 14, 14, 24]);
  return ws;
}

/* ── Main Generator ────────────────────────────────────────────── */

export interface WorkbookInput {
  rows: BomRow[];
  disposition: DispositionResult;
  duplicateGroups: DuplicateGroup[];
  missingFieldExceptions: MissingFieldException[];
  revisionConflicts: RevisionConflict[];
  summary: ProcessingSummary;
  jobId: string;
}

export function generateMaintenanceBomWorkbook(input: WorkbookInput): Buffer {
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    buildCleanBomSheet(input.disposition),
    "Clean BOM"
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildReviewRequiredSheet(input.disposition, input.missingFieldExceptions),
    "Review Required"
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildDuplicatePartsSheet(input.duplicateGroups, input.rows),
    "Duplicate Parts"
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildMissingFieldsSheet(input.missingFieldExceptions, input.rows),
    "Missing Fields"
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildRevisionConflictsSheet(input.revisionConflicts),
    "Revision Conflicts"
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildSourceMapSheet(input.rows),
    "Source Map"
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildProcessingSummarySheet(input.summary),
    "Processing Summary"
  );
  XLSX.utils.book_append_sheet(
    wb,
    buildGenericErpImportTemplateSheet(),
    "Generic ERP Import Template"
  );
  // Section 62: Procurement Ready
  XLSX.utils.book_append_sheet(
    wb,
    buildProcurementReadySheet(input.disposition),
    "Procurement Ready"
  );
  // Section 62: RFQ Preparation
  XLSX.utils.book_append_sheet(
    wb,
    buildRfqPreparationSheet(input.disposition),
    "RFQ Preparation"
  );
  // Section 61: CMMS Spare Parts Template
  XLSX.utils.book_append_sheet(
    wb,
    buildCmmsTemplateSheet(input.rows),
    "CMMS Spare Parts Template"
  );
  // Section 60: Asset Hierarchy
  XLSX.utils.book_append_sheet(
    wb,
    buildAssetHierarchySheet(input.rows),
    "Asset Hierarchy"
  );
  // Section 59: Dual-Pass Reconciliation
  XLSX.utils.book_append_sheet(
    wb,
    buildReconciliationSheet(input.rows),
    "Reconciliation"
  );
  // Low Confidence Records (dedicated sheet, independent of Review Required)
  XLSX.utils.book_append_sheet(
    wb,
    buildLowConfidenceSheet(input.disposition),
    "Low Confidence"
  );

  return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
}

/* Rename old buildImportTemplateSheet to avoid conflict */

/* ── Procurement Exception Report ──────────────────────────────── */

export interface ExceptionReportInput {
  summary: ProcessingSummary;
  exceptions: ProcurementException[];
  duplicateGroups: DuplicateGroup[];
  missingFields: MissingFieldException[];
  revisions: RevisionConflict[];
  rows: BomRow[];
  jobId: string;
}

function buildExecutiveSummarySheet(
  input: ExceptionReportInput
): XLSX.WorkSheet {
  const data: unknown[][] = [
    ["Procurement Exception Report"],
    [`Job ID: ${input.jobId}`],
    [],
    ["Total Rows", safeCellValue(input.summary.extractedRows)],
    ["Critical Exceptions", safeCellValue(input.exceptions.filter((e) => e.severity === "critical").length)],
    ["High Severity", safeCellValue(input.exceptions.filter((e) => e.severity === "high").length)],
    ["Medium Severity", safeCellValue(input.exceptions.filter((e) => e.severity === "medium").length)],
    ["Low Severity", safeCellValue(input.exceptions.filter((e) => e.severity === "low").length)],
    ["Duplicate Groups", safeCellValue(input.duplicateGroups.length)],
    ["Missing Field Exceptions", safeCellValue(input.missingFields.length)],
    ["Revision Conflicts", safeCellValue(input.revisions.length)],
    [],
    ["Generated At", safeCellValue(input.summary.generatedAt)],
    ["Engine Version", safeCellValue(input.summary.engineVersion)],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws["!cols"] = [{ wch: 28 }, { wch: 24 }];
  return ws;
}

export function generateExceptionReport(input: ExceptionReportInput): Buffer {
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, buildExecutiveSummarySheet(input), "Executive Summary");

  // Critical Exceptions sheet
  const critHeaders = ["Type", "Severity", "Description", "Part Number", "Source Page", "Recommendation"];
  const critData: unknown[][] = [critHeaders];
  for (const ex of input.exceptions) {
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
  applyCommonWorkbookSettings(ws, [24, 10, 50, 20, 12, 40]);
  XLSX.utils.book_append_sheet(wb, ws, "Critical Exceptions");

  // Duplicate Candidates
  const dupHeaders = ["Group ID", "Type", "Severity", "Part Number", "Pages"];
  const dupData: unknown[][] = [dupHeaders];
  for (const g of input.duplicateGroups) {
    for (const idx of g.records) {
      dupData.push([
        safeCellValue(g.duplicateGroupId),
        safeCellValue(g.duplicateType),
        safeCellValue(g.severity),
        safeCellValue(input.rows[idx]?.partNumberNormalized ?? ""),
        safeCellValue(input.rows[idx]?.sourcePage ?? ""),
      ]);
    }
  }
  ws = XLSX.utils.aoa_to_sheet(dupData);
  applyCommonWorkbookSettings(ws, [12, 24, 10, 20, 10]);
  XLSX.utils.book_append_sheet(wb, ws, "Duplicate Candidates");

  // Missing Required Data
  const missHeaders = ["Row", "Exception Type", "Severity", "Export Blocking"];
  const missData: unknown[][] = [missHeaders];
  for (const m of input.missingFields) {
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

  // Revision Conflicts
  const revHeaders = ["Part Number", "Revisions", "Pages", "Type", "Severity"];
  const revData: unknown[][] = [revHeaders];
  for (const r of input.revisions) {
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

  // Low Confidence Records — dedicated data sheet
  const lcHeaders = ["Row", "Part Number", "Description", "Confidence", "Source Page", "Validation Flags", "Recommended Action"];
  const lcData: unknown[][] = [lcHeaders];
  for (let i = 0; i < input.rows.length; i++) {
    const r = input.rows[i];
    if (r.confidence >= 0.7) continue;
    lcData.push([
      safeCellValue(i + 1),
      safeCellValue(r.partNumberNormalized ?? r.partNumberRaw),
      safeCellValue(r.descriptionNormalized ?? r.descriptionRaw),
      safeCellValue(r.confidence),
      safeCellValue(r.sourcePage),
      safeCellValue(r.validationFlags.join("; ")),
      "Verify against source document",
    ]);
  }
  ws = XLSX.utils.aoa_to_sheet(lcData);
  applyCommonWorkbookSettings(ws, [8, 20, 30, 12, 12, 30, 36]);
  XLSX.utils.book_append_sheet(wb, ws, "Low Confidence Records");

  // Recommended Review Sequence
  const seqHeaders = ["Priority", "Area", "Reason", "Estimated Effort"];
  const seqData: unknown[][] = [seqHeaders];
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
