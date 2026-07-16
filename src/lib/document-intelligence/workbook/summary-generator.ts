/**
 * Processing Summary HTML Generator
 *
 * Generates a printable HTML processing summary.
 * The existing stack has no safe PDF renderer, so we use printable HTML.
 * The browser's "Print to PDF" provides the PDF output.
 */

import type { ProcessingSummary } from "@/types/document-intelligence";

export function generateSummaryHtml(
  summary: ProcessingSummary,
  jobId: string
): string {
  const disclaimer =
    "Automated extraction and consistency checks support data preparation. " +
    "The customer must review flagged and business-critical records before " +
    "ERP import, RFQ issuance, purchasing, maintenance, or engineering use.";

  const preparedFor =
    "Prepared for controlled ERP import review.";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Processing Summary — ${escapeHtml(summary.inputFilename)}</title>
<style>
  @page { margin: 20mm 15mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1A1915; background: #fff; line-height: 1.5; margin: 0; padding: 0; }
  .page { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
  h1 { font-size: 24px; font-weight: 700; margin: 0 0 4px; color: #1A1915; }
  .subtitle { font-size: 14px; color: #696764; margin: 0 0 30px; }
  .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(26,25,21,0.10); border: 1px solid rgba(26,25,21,0.10); margin-bottom: 30px; }
  .summary-item { display: flex; justify-content: space-between; padding: 10px 14px; background: #FAF8F2; }
  .summary-item label { font-size: 13px; color: #696764; }
  .summary-item value { font-size: 13px; font-weight: 600; color: #1A1915; font-variant-numeric: tabular-nums; }
  .section { margin-bottom: 24px; }
  .section h2 { font-size: 16px; font-weight: 700; margin: 0 0 12px; padding-bottom: 6px; border-bottom: 1px solid rgba(26,25,21,0.10); }
  .section p, .section li { font-size: 13px; color: #696764; line-height: 1.6; }
  .section ul { padding-left: 20px; margin: 0; }
  .section ul li { margin-bottom: 4px; }
  .meta { font-size: 12px; color: #696764; margin-top: 30px; padding-top: 16px; border-top: 1px solid rgba(26,25,21,0.10); }
  .meta p { margin: 2px 0; }
  .disclaimer { margin-top: 30px; padding: 16px; background: #FAF8F2; border: 1px solid rgba(26,25,21,0.10); font-size: 12px; color: #696764; line-height: 1.6; }
  .badge { display: inline-block; padding: 2px 8px; font-size: 11px; font-weight: 600; border-radius: 0; }
  .badge-clean { background: #DCFCE7; color: #166534; }
  .badge-review { background: #FEF3C7; color: #92400E; }
  .badge-blocked { background: #FEE2E2; color: #991B1B; }
  @media print { body { padding: 0; } .page { padding: 0; } .no-print { display: none; } }
</style>
</head>
<body>
<div class="page">
  <h1>Processing Summary</h1>
  <p class="subtitle">${preparedFor}</p>

  <div class="summary-grid">
    <div class="summary-item"><label>Input File</label><value>${escapeHtml(summary.inputFilename)}</value></div>
    <div class="summary-item"><label>Job ID</label><value>${escapeHtml(jobId)}</value></div>
    <div class="summary-item"><label>Processed Pages</label><value>${summary.processedPages}</value></div>
    <div class="summary-item"><label>Extracted Rows</label><value>${summary.extractedRows}</value></div>
    <div class="summary-item"><label>Clean Rows</label><value>${summary.cleanRows}</value></div>
    <div class="summary-item"><label>Review Required Rows</label><value>${summary.reviewRows}</value></div>
    <div class="summary-item"><label>Blocked Rows (Duplicates)</label><value>${summary.blockedRows}</value></div>
    <div class="summary-item"><label>Duplicate Groups</label><value>${summary.duplicateGroups}</value></div>
    <div class="summary-item"><label>Missing Field Exceptions</label><value>${summary.missingFieldCount}</value></div>
    <div class="summary-item"><label>Revision Conflicts</label><value>${summary.revisionConflictCount}</value></div>
    <div class="summary-item"><label>Low Confidence Records</label><value>${summary.lowConfidenceCount}</value></div>
    <div class="summary-item"><label>Generated At</label><value>${summary.generatedAt}</value></div>
  </div>

  <div class="section">
    <h2>What Was Processed</h2>
    <p>${summary.processedPages} pages from ${escapeHtml(summary.inputFilename)} were analyzed. ${summary.extractedRows} candidate BOM rows were identified and extracted.</p>
  </div>

  <div class="section">
    <h2>What Was Excluded</h2>
    <ul>
      <li>${summary.blockedRows} duplicate source-row extractions were consolidated</li>
      <li>Rows without identifiable part numbers or table structure were excluded</li>
      <li>Pages exceeding the configured limit were not processed</li>
    </ul>
  </div>

  <div class="section">
    <h2>What Was Normalized</h2>
    <ul>
      <li>Part numbers: Unicode normalization, dash variant normalization, whitespace cleanup, uppercase comparison keys</li>
      <li>Raw values preserved alongside normalized values</li>
      <li>Leading zeroes preserved in part numbers</li>
    </ul>
  </div>

  <div class="section">
    <h2>Validations Applied</h2>
    <ul>
      <li>${summary.duplicateGroups} duplicate groups detected across 7 classes</li>
      <li>${summary.missingFieldCount} missing-field exceptions identified</li>
      <li>${summary.revisionConflictCount} revision conflicts detected</li>
      <li>${summary.lowConfidenceCount} low-confidence records blocked from clean export</li>
      <li>Formula injection protection applied to all exported values</li>
    </ul>
  </div>

  <div class="section">
    <h2>What Requires User Review</h2>
    <p>${summary.reviewRows} rows require user review before ERP import. These include rows with missing data, low confidence, revision conflicts, or detected anomalies. Review the "Review Required" sheet in the workbook for detailed exception information.</p>
  </div>

  <div class="section">
    <h2>Retention & Deletion</h2>
    <p>Source document: automatically deleted within 24 hours of successful output generation. Output artifacts: retained for 7 days, then automatically deleted. Downloads via short-lived authenticated URLs.</p>
  </div>

  <div class="meta">
    <p><strong>Engine Version:</strong> ${summary.engineVersion}</p>
    <p><strong>Validator Version:</strong> ${summary.validatorVersion}</p>
    <p><strong>Schema Version:</strong> ${summary.schemaVersion}</p>
  </div>

  <div class="disclaimer">
    <strong>Disclaimer:</strong> ${disclaimer}
  </div>
</div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
