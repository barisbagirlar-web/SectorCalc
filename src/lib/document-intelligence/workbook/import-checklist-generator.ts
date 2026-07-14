/**
 * Import Readiness Checklist HTML Generator
 *
 * Produces a self-contained, human-readable HTML document listing every
 * pre-import readiness check item for the Maintenance BOM Recovery output.
 *
 * The checklist covers all items from Section 79 of the product specification:
 * data verification, duplicate resolution, field completion, revision
 * normalisation, pilot import, and sign-off.
 */

import { escapeHtml } from "@/lib/document-intelligence/workbook/html-utils";

/* ── Types ─────────────────────────────────────────────────────── */

export interface ChecklistItem {
  id: string;
  category: string;
  description: string;
  completed: boolean;
  required: boolean;
}

/* ── Section 79 Checklist Definition ──────────────────────────── */

const SECTION_79_ITEMS: ChecklistItem[] = [
  // Data Verification
  { id: "DV-01", category: "Data Verification", description: "Verify that all source PDF pages were processed (compare processedPages against original document page count).", completed: false, required: true },
  { id: "DV-02", category: "Data Verification", description: "Confirm extracted row count matches expected BOM line items.", completed: false, required: true },
  { id: "DV-03", category: "Data Verification", description: "Validate that the Clean BOM worksheet contains only rows with validationStatus = 'clean'.", completed: false, required: true },
  { id: "DV-04", category: "Data Verification", description: "Review all rows with validationStatus = 'review_required' against original source PDF.", completed: false, required: true },
  { id: "DV-05", category: "Data Verification", description: "Investigate all rows with validationStatus = 'blocked' and determine root cause.", completed: false, required: true },
  { id: "DV-06", category: "Data Verification", description: "Walk through a random 10% sample of 'clean' rows to validate extraction accuracy.", completed: false, required: false },

  // Duplicate Resolution
  { id: "DR-01", category: "Duplicate Resolution", description: "Review each duplicate group listed in the Duplicate Parts sheet.", completed: false, required: true },
  { id: "DR-02", category: "Duplicate Resolution", description: "For exact_normalized duplicates: determine whether they are true duplicates or distinct line items that happen to share a part number.", completed: false, required: true },
  { id: "DR-03", category: "Duplicate Resolution", description: "For conflicting_description duplicates: compare source images to determine correct description.", completed: false, required: true },
  { id: "DR-04", category: "Duplicate Resolution", description: "For conflicting_revision duplicates: resolve which revision is current (see Revision Conflict sheet).", completed: false, required: true },
  { id: "DR-05", category: "Duplicate Resolution", description: "For probable_formatting duplicates: verify whether normalisation correctly merged equivalent but differently formatted part numbers.", completed: false, required: false },
  { id: "DR-06", category: "Duplicate Resolution", description: "Consolidate confirmed duplicates: keep one canonical row, document exclusion rationale in ERP notes.", completed: false, required: true },

  // Missing Field Completion
  { id: "MF-01", category: "Missing Field Completion", description: "Review all Missing Field exceptions. Prioritise export-blocking exceptions.", completed: false, required: true },
  { id: "MF-02", category: "Missing Field Completion", description: "For missing_part_number: retrieve part number from drawing title block, purchase history, or manufacturer catalogue.", completed: false, required: true },
  { id: "MF-03", category: "Missing Field Completion", description: "For missing_description: obtain description from engineering records or source document context.", completed: false, required: true },
  { id: "MF-04", category: "Missing Field Completion", description: "For missing_quantity: determine quantity from MRP system, physical count, or engineering BOM.", completed: false, required: true },
  { id: "MF-05", category: "Missing Field Completion", description: "For invalid_quantity: verify numeric value against source document; correct if OCR error is confirmed.", completed: false, required: true },
  { id: "MF-06", category: "Missing Field Completion", description: "For missing_revision: determine revision from title block, revision table, or engineering change log.", completed: false, required: false },
  { id: "MF-07", category: "Missing Field Completion", description: "For missing_material: research material specification from engineering records or supplier data.", completed: false, required: false },
  { id: "MF-08", category: "Missing Field Completion", description: "For missing_manufacturer: identify OEM from part number cross-reference or procurement history.", completed: false, required: false },

  // Revision Normalisation
  { id: "RN-01", category: "Revision Normalisation", description: "Review all Revision Conflict entries. Determine the correct revision for each affected part number.", completed: false, required: true },
  { id: "RN-02", category: "Revision Normalisation", description: "For multiple_revisions conflicts: identify which revision is the current engineering release.", completed: false, required: true },
  { id: "RN-03", category: "Revision Normalisation", description: "For title_block_mismatch: reconcile title block revision against table revision entries.", completed: false, required: true },
  { id: "RN-04", category: "Revision Normalisation", description: "For partial_missing_revision: complete missing revision fields from engineering records.", completed: false, required: true },
  { id: "RN-05", category: "Revision Normalisation", description: "For ocr_confusion: manually verify revision characters against source PDF image.", completed: false, required: false },
  { id: "RN-06", category: "Revision Normalisation", description: "For mixed_revision_schemes: choose a single revision scheme for ERP import (e.g., numeric or alphabetic).", completed: false, required: false },

  // Data Export & Pilot Import
  { id: "EI-01", category: "Export & Pilot Import", description: "Export the Clean BOM worksheet as the master import dataset.", completed: false, required: true },
  { id: "EI-02", category: "Export & Pilot Import", description: "Run a pilot import into the ERP sandbox or staging environment with a subset of rows (e.g., 20 records).", completed: false, required: true },
  { id: "EI-03", category: "Export & Pilot Import", description: "Verify pilot import: check part numbers, descriptions, quantities, UOMs, and revision fields in the ERP system.", completed: false, required: true },
  { id: "EI-04", category: "Export & Pilot Import", description: "Review ERP validation errors (if any) and adjust source data before full import.", completed: false, required: true },
  { id: "EI-05", category: "Export & Pilot Import", description: "Import remaining rows in batches, verifying each batch before proceeding.", completed: false, required: true },

  // Sign-Off & Audit
  { id: "SO-01", category: "Sign-Off & Audit", description: "Engineering review sign-off on all corrected and verified records.", completed: false, required: true },
  { id: "SO-02", category: "Sign-Off & Audit", description: "Procurement review sign-off on pricing, lead time, and supplier data verification.", completed: false, required: true },
  { id: "SO-03", category: "Sign-Off & Audit", description: "Record all manual corrections, decisions on duplicates, and override justifications in an audit log.", completed: false, required: true },
  { id: "SO-04", category: "Sign-Off & Audit", description: "Archive the original source PDF, the delivery ZIP, and the completed checklist for audit compliance.", completed: false, required: true },
  { id: "SO-05", category: "Sign-Off & Audit", description: "Confirm that all blocked and review_required records have been addressed (resolved, accepted with justification, or escalated).", completed: false, required: true },
];

/* ── HTML Generator ───────────────────────────────────────────── */

export function generateImportChecklistHtml(
  items: ChecklistItem[],
  version: string,
): string {
  const effectiveItems = items.length > 0 ? items : SECTION_79_ITEMS;
  const generatedAt = new Date().toISOString();

  // Group by category
  const categories = new Map<string, ChecklistItem[]>();
  for (const item of effectiveItems) {
    if (!categories.has(item.category)) {
      categories.set(item.category, []);
    }
    categories.get(item.category)!.push(item);
  }

  const categorySections = Array.from(categories.entries()).map(
    ([category, catItems]) => {
      const total = catItems.length;
      const completed = catItems.filter((i) => i.completed).length;
      const requiredCount = catItems.filter((i) => i.required).length;
      const requiredCompleted = catItems.filter((i) => i.required && i.completed).length;

      const rows = catItems
        .map(
          (item) => `
        <tr class="${item.completed ? "row-completed" : "row-pending"}${item.required ? "" : " optional"}">
          <td>${escapeHtml(item.id)}</td>
          <td>${item.required ? "Required" : "Recommended"}</td>
          <td>${escapeHtml(item.description)}</td>
          <td class="status-cell">
            <span class="badge ${item.completed ? "badge-pass" : "badge-fail"}">
              ${item.completed ? "Done" : "Open"}
            </span>
          </td>
        </tr>`,
        )
        .join("\n");

      return `
  <div class="category-section">
    <div class="category-header">
      <h2>${escapeHtml(category)}</h2>
      <div class="category-stats">
        ${completed}/${total} items &middot;
        Required: ${requiredCompleted}/${requiredCount}
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Requirement</th>
          <th>Description</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
${rows}
      </tbody>
    </table>
  </div>`;
    },
  ).join("\n");

  const totalItems = effectiveItems.length;
  const totalCompleted = effectiveItems.filter((i) => i.completed).length;
  const totalRequired = effectiveItems.filter((i) => i.required).length;
  const totalRequiredCompleted = effectiveItems.filter((i) => i.required && i.completed).length;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SectorCalc — Import Readiness Checklist (Section 79) v${escapeHtml(version)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #F0EEE6;
      color: #1A1915;
      line-height: 1.5;
      padding: 2rem;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.25rem; }
    .subtitle { color: #666; font-size: 0.875rem; margin-bottom: 2rem; }
    .summary-bar {
      display: flex; gap: 1.5rem; flex-wrap: wrap;
      background: #fff; border: 1px solid #D4D2C8; padding: 1rem 1.5rem;
      margin-bottom: 2rem; font-size: 0.875rem;
    }
    .summary-stat { display: flex; flex-direction: column; }
    .summary-stat .value { font-size: 1.5rem; font-weight: 700; }
    .summary-stat .label { color: #666; font-size: 0.75rem; text-transform: uppercase; }
    .category-section { margin-bottom: 2rem; }
    .category-header {
      display: flex; justify-content: space-between; align-items: baseline;
      background: #1A1915; color: #F0EEE6; padding: 0.75rem 1rem;
    }
    .category-header h2 { font-size: 1rem; font-weight: 500; }
    .category-stats { font-size: 0.8rem; color: #BD5D3A; }
    table {
      width: 100%; border-collapse: collapse;
      background: #fff; font-size: 0.8125rem;
    }
    th, td { text-align: left; padding: 0.5rem 0.75rem; border: 1px solid #D4D2C8; vertical-align: top; }
    th { background: #333; color: #F0EEE6; font-weight: 500; }
    tr.row-completed { background: #F0F7F0; }
    tr.row-pending { background: #FDF6F3; }
    tr.optional td:first-child { opacity: 0.7; }
    .badge {
      display: inline-block; font-size: 0.75rem; padding: 0.15rem 0.5rem;
      font-weight: 600; text-transform: uppercase;
    }
    .badge-pass { background: #2E7D32; color: #fff; }
    .badge-fail { background: #BD5D3A; color: #fff; }
    .status-cell { width: 80px; text-align: center; }
    @media (max-width: 768px) {
      body { padding: 1rem; }
      .summary-bar { flex-direction: column; gap: 0.5rem; }
      th, td { padding: 0.375rem; font-size: 0.75rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>SectorCalc Maintenance BOM Recovery — Import Readiness Checklist</h1>
    <p class="subtitle">
      Section 79 verification items &middot; Schema v${escapeHtml(version)} &middot;
      Generated: ${escapeHtml(generatedAt)}
    </p>

    <div class="summary-bar">
      <div class="summary-stat">
        <span class="value">${totalCompleted}/${totalItems}</span>
        <span class="label">Total Items</span>
      </div>
      <div class="summary-stat">
        <span class="value">${totalRequiredCompleted}/${totalRequired}</span>
        <span class="label">Required Items</span>
      </div>
      <div class="summary-stat">
        <span class="value">${Math.round(totalItems > 0 ? (totalCompleted / totalItems) * 100 : 0)}%</span>
        <span class="label">Completion</span>
      </div>
      <div class="summary-stat">
        <span class="value">${totalItems - totalCompleted}</span>
        <span class="label">Remaining</span>
      </div>
    </div>

    ${categorySections}

    <p style="margin-top:2rem;font-size:0.75rem;color:#888;border-top:1px solid #D4D2C8;padding-top:1rem;">
      This checklist is based on SectorCalc Maintenance BOM Recovery specification Section 79 (Import Readiness).
      Complete all required items before ERP import. Recommended items should be completed where feasible
      to ensure data quality. Sign-off (SO-01 through SO-03) must be documented per the audit trail requirements.
    </p>
  </div>
</body>
</html>`;
}

export { SECTION_79_ITEMS };
