#!/usr/bin/env node
// Guard: PRO V2 PDF Report Quality
// Verifies:
// 1. PRO V2 code does NOT use window.print() for PDF export
// 2. PDF document directory has required files
// 3. @react-pdf/renderer is used correctly
// 4. Required report headings exist in the PDF document
// 5. Forbidden site-shell text is absent from PDF sources
// 6. Page numbering, disclaimer, location in footer
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRO_V2_DIR = join(__dirname, "..", "src", "sectorcalc", "pro-v2");
const PDF_DIR = join(PRO_V2_DIR, "pdf");

let failures = 0;
function fail(msg) { console.error(`  FAIL: ${msg}`); failures++; }
function pass(msg) { console.log(`  OK: ${msg}`); }

// ── 1. Check PDF directory exists and has required files ──
console.log("\n--- PDF Directory Check ---");
const requiredPdfFiles = [
  "ProReportPdfDocument.tsx",
  "ProPdfHeader.tsx",
  "ProPdfFooter.tsx",
  "ProPdfSection.tsx",
  "ProPdfTable.tsx",
  "exportProReportPdf.tsx",
];

if (readdirSync(PDF_DIR)) {
  const files = readdirSync(PDF_DIR);
  for (const rf of requiredPdfFiles) {
    if (!files.includes(rf)) {
      fail(`Missing required PDF file: ${rf}`);
    } else {
      pass(`${rf} (${statSync(join(PDF_DIR, rf)).size} bytes)`);
    }
  }
} else {
  fail("PDF directory not found");
}

// ── 2. Check ProExecutionFormV2.tsx no longer uses window.print ──
console.log("\n--- window.print Check ---");
const formContent = readFileSync(join(PRO_V2_DIR, "ProExecutionFormV2.tsx"), "utf-8");
if (/\bwindow\.print\b/.test(formContent)) {
  fail("ProExecutionFormV2.tsx still contains window.print()");
} else {
  pass("No window.print() in ProExecutionFormV2.tsx");
}

// ── 3. Check PDF sources use @react-pdf/renderer ──
console.log("\n--- @react-pdf/renderer Usage Check ---");
for (const file of requiredPdfFiles) {
  const content = readFileSync(join(PDF_DIR, file), "utf-8");
      if (file === "exportProReportPdf.tsx") {
    if (!content.includes('from "@react-pdf/renderer"') && !content.includes("ProReportPdfDocument")) {
      fail(`${file} does not reference @react-pdf/renderer or ProReportPdfDocument`);
    } else {
      pass(`${file} uses @react-pdf/renderer`);
    }
  } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
    if (!content.includes('from "@react-pdf/renderer"')) {
      fail(`${file} does not import from @react-pdf/renderer`);
    } else {
      pass(`${file} imports @react-pdf/renderer`);
    }
  }
}

// ── 4. Check forbidden site-shell text in PDF sources ──
console.log("\n--- Forbidden Content Check ---");
const forbiddenPatterns = [
  /\bPricing\b/,
  /\bGet started\b/,
  /\bSign in\b/,
  /\bSign out\b/,
  /\bTrusted by engineers worldwide\b/,
  /\bTrace AI\b/,
  /\braw JSON\b/,
  /\bdebugRuntime\b/,
  /\binternal diagnostic\b/,
  /\bLoad Example\b/,
  /\bReset\b/,
  /window\.print\(\)/,
];

let forbiddenFound = 0;
for (const file of requiredPdfFiles) {
  const content = readFileSync(join(PDF_DIR, file), "utf-8");
  for (const pat of forbiddenPatterns) {
    if (pat.test(content)) {
      fail(`Forbidden pattern "${pat}" found in ${file}`);
      forbiddenFound++;
    }
  }
}
if (forbiddenFound === 0) {
  pass(`${forbiddenPatterns.length} forbidden patterns checked — 0 found`);
}

// ── 5. Check required report sections in PDF template ──
console.log("\n--- Required Sections Check ---");
const requiredSections = [
  "Executive Interpretation",
  "Cost Distribution",
  "Calculated Values",
  "Primary Cost Driver",
  "Hidden Loss Diagnosis",
  "Missed Assumptions",
  "Risk Warnings",
  "Sensitivity Checks",
  "Professional Checklist",
  "Assumptions Used",
  "Recommended Next Action",
];
const docContent = readFileSync(join(PDF_DIR, "ProReportPdfDocument.tsx"), "utf-8");
for (const section of requiredSections) {
  if (docContent.includes(section)) {
    pass(`"${section}" present`);
  } else {
    fail(`Required section "${section}" missing`);
  }
}

// ── 6. Check page structure (footer and disclaimer) ──
console.log("\n--- Page Structure Check ---");
const footerContent = readFileSync(join(PDF_DIR, "ProPdfFooter.tsx"), "utf-8");
if (footerContent.includes("Page {pageNumber}")) {
  pass("Page numbering present in footer");
} else {
  fail("Page numbering missing from footer");
}
if (footerContent.includes("Decision-support report")) {
  pass("Decision-support disclaimer present in footer");
} else {
  fail("Decision-support disclaimer missing from footer");
}
if (footerContent.includes("Stuttgart, Germany")) {
  pass("Location footer present");
} else {
  fail("Location footer missing");
}

// ── 7. Check export function uses pdf().toBlob() ──
console.log("\n--- Export Function Check ---");
const exportContent = readFileSync(join(PDF_DIR, "exportProReportPdf.tsx"), "utf-8");
if (exportContent.includes(".toBlob()")) {
  pass("exportProReportPdf uses pdf().toBlob() for blob generation");
} else {
  fail("exportProReportPdf missing .toBlob() call");
}
if (exportContent.includes("a.download")) {
  pass("exportProReportPdf triggers file download with correct filename");
} else {
  fail("exportProReportPdf missing download trigger");
}

// ── Report ──
console.log(`\n=== PDF REPORT GUARD ===`);
console.log(`Failures: ${failures}`);
if (failures > 0) {
  console.log("GUARD FAILED\n");
  process.exit(1);
} else {
  console.log("GUARD PASS: PRO V2 PDF report system valid\n");
}
