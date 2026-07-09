// Guard: Verify insight report contains all required premium sections.
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const contractFile = resolve(root, "src/sectorcalc/pro-v2/proInsightContract.ts");
const contractContent = readFileSync(contractFile, "utf-8");

const engineFile = resolve(root, "src/sectorcalc/pro-v2/proInsightEngine.ts");
const engineContent = readFileSync(engineFile, "utf-8");

const resultPanelFile = resolve(root, "src/sectorcalc/pro-v2/ProResultPanelV2.tsx");
const resultContent = readFileSync(resultPanelFile, "utf-8");

// Required sections in the contract
const requiredSections = [
  "primaryKpi",
  "decisionState",
  "executiveInterpretation",
  "costDistribution",
  "calculatedValues",
  "hiddenLosses",
  "missedAssumptions",
  "riskWarnings",
  "sensitivityChecks",
  "checklist",
  "recommendedAction",
  "assumptionsUsed",
];

// Required weld-specific fields
const weldFields = [
  "costPerMeter",
  "wireMass",
  "wireCostTotal",
  "gasCostTotal",
  "laborCostTotal",
  "overheadCostTotal",
  "contingencyAmount",
  "totalCost",
  "marginAmount",
  "marginPercent",
  "keyCostDriver",
];

let allPass = true;

// Check contract
for (const section of requiredSections) {
  if (!contractContent.includes(section)) {
    console.error(`GUARD FAIL: proInsightContract.ts missing section "${section}"`);
    allPass = false;
  }
}

// Check weld-specific fields in contract
for (const field of weldFields) {
  if (!contractContent.includes(field)) {
    console.error(`GUARD FAIL: proInsightContract.ts missing weld field "${field}"`);
    allPass = false;
  }
}

// Check engine generates all sections
for (const section of requiredSections) {
  if (!engineContent.includes(section)) {
    console.error(`GUARD FAIL: proInsightEngine.ts missing section "${section}"`);
    allPass = false;
  }
}

// Check result panel renders all sections
for (const section of requiredSections) {
  if (!resultContent.includes(section)) {
    console.error(`GUARD FAIL: ProResultPanelV2.tsx missing section "${section}"`);
    allPass = false;
  }
}

// Minimum count checks
const sectionCount = (resultContent.match(/SectionTitle>/g) || []).length;
if (sectionCount < 10) {
  console.error(`GUARD FAIL: Only ${sectionCount} SectionTitle instances in result panel (expected >= 10)`);
  allPass = false;
}

const metricBoxCount = (resultContent.match(/MetricBox/g) || []).length;
if (metricBoxCount < 1) {
  console.error("GUARD FAIL: No MetricBox instances in result panel");
  allPass = false;
}

if (allPass) {
  console.log(`GUARD PASS: Insight report richness verified (${requiredSections.length} sections, ${weldFields.length} weld fields)`);
} else {
  process.exit(1);
}
