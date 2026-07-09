// Guard: Verify PDF export capability exists in ProV2 components.
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const resultPanelFile = resolve(root, "src/sectorcalc/pro-v2/ProResultPanelV2.tsx");
const content = readFileSync(resultPanelFile, "utf-8");

const formFile = resolve(root, "src/sectorcalc/pro-v2/ProExecutionFormV2.tsx");
const formContent = readFileSync(formFile, "utf-8");

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

// Cross-file checks
const crossChecks = [
  { pattern: "window.print()", files: [content, formContent], desc: "window.print() handler" },
  { pattern: "@media print", files: [content, formContent], desc: "print CSS media query" },
  { pattern: "handleExportPdf", files: [formContent], desc: "handleExportPdf handler" },
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

if (allPass) {
  console.log("GUARD PASS: PDF export capability verified");
} else {
  process.exit(1);
}
