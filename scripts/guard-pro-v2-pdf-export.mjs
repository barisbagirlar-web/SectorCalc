// Guard: Verify PDF export capability exists in ProV2 components.
// Updated for @react-pdf/renderer based export.
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const resultPanelFile = resolve(root, "src/sectorcalc/pro-v2/ProResultPanelV2.tsx");
const content = readFileSync(resultPanelFile, "utf-8");

const formFile = resolve(root, "src/sectorcalc/pro-v2/ProExecutionFormV2.tsx");
const formContent = readFileSync(formFile, "utf-8");

const pdfDir = resolve(root, "src/sectorcalc/pro-v2/pdf");
const { readdirSync } = await import("fs");

const pdfFiles = readdirSync(pdfDir);

// Checks that apply to result panel
const resultPanelChecks = [
  { pattern: "onExportPdf", desc: "onExportPdf callback prop" },
  { pattern: "Export PDF Report", desc: "Export PDF button text" },
  { pattern: "generatedAt", desc: "report date in output" },
  { pattern: "toolName", desc: "tool name in output" },
  { pattern: "primaryKpi", desc: "primary result in print" },
  { pattern: "assumptionsUsed", desc: "assumptions in print" },
  { pattern: "recommendedAction", desc: "recommended action in print" },
];

// Cross-file checks — updated for @react-pdf/renderer
const crossChecks = [
  { pattern: "handleExportPdf", files: [formContent], desc: "handleExportPdf handler" },
  { pattern: "@media print", files: [content, formContent], desc: "print CSS media query" },
  { pattern: "exportProReportPdf", files: [formContent], desc: "exportProReportPdf import" },
  { pattern: "setPdfExporting", files: [formContent], desc: "pdfExporting loading state" },
];

// Check PDF directory has key files
const pdfDirChecks = [
  "ProReportPdfDocument.tsx",
  "ProPdfHeader.tsx",
  "ProPdfFooter.tsx",
  "ProPdfSection.tsx",
  "ProPdfTable.tsx",
  "exportProReportPdf.tsx",
];

let allPass = true;

for (const check of resultPanelChecks) {
  if (!content.includes(check.pattern)) {
    console.error(`GUARD FAIL: ResultPanel missing "${check.pattern}" (${check.desc})`);
    allPass = false;
  }
}

for (const check of crossChecks) {
  const found = check.files.some((f) => f.includes(check.pattern));
  if (!found) {
    console.error(`GUARD FAIL: Missing "${check.pattern}" (${check.desc})`);
    allPass = false;
  }
}

for (const f of pdfDirChecks) {
  if (!pdfFiles.includes(f)) {
    console.error(`GUARD FAIL: PDF directory missing "${f}"`);
    allPass = false;
  }
}

// Verify no window.print() remains (old pattern removed)
if (formContent.includes("window.print()") || content.includes("window.print()")) {
  console.error("GUARD FAIL: window.print() still present in PRO V2 components (must use @react-pdf/renderer)");
  allPass = false;
}

// Verify @react-pdf/renderer import in PDF components
const pdfDoc = readFileSync(resolve(pdfDir, "ProReportPdfDocument.tsx"), "utf-8");
if (!pdfDoc.includes('from "@react-pdf/renderer"')) {
  console.error("GUARD FAIL: ProReportPdfDocument.tsx missing @react-pdf/renderer import");
  allPass = false;
}

if (allPass) {
  console.log("GUARD PASS: PDF export capability verified");
} else {
  process.exit(1);
}
