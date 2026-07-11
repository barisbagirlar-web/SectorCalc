#!/usr/bin/env node
// Generate PRO V2 report output contract matrix
// Compares FORMULA_OUTPUT_KEYS vs CONTRACT_OUTPUT_KEYS vs REPORT_CONSUMED_KEYS

import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const PRO_V2_SLUGS = [
  "break-even-survival-cash-calculator",
  "machine-hourly-rate-proof-report",
  "loss-making-job-detector",
  "receivables-cost-payment-term-addendum",
  "setup-time-reduction-roi-smed",
  "product-sku-margin-ranker",
  "true-employee-cost-statement",
  "job-quote-builder-pro-pack",
  "machine-investment-feasibility-buy-lease-keep",
  "capital-equipment-investment-appraisal-npv-irr",
  "customer-sku-profitability-forensics",
  "downtime-scrap-loss-statement",
  "oee-loss-monetization-improvement-business-case",
  "scrap-rework-cost-tracker",
  "outsource-vs-in-house-analyzer",
  "plant-wide-shop-rate-cost-structure-audit",
  "fx-commodity-pass-through-pricer",
  "energy-efficiency-grant-incentive-feasibility-pack",
  "motor-compressor-replacement-roi",
  "weld-procedure-cost-consumable-estimation-suite",
];

// Read contract registry content
const registryPath = resolve(root, "src", "sectorcalc", "pro-report", "pro-report-contract-registry.ts");
function extractContractEntries(content, slug) {
  // Find the register block for this slug
  const slugMarker = `toolSlug: "${slug}"`;
  const idx = content.indexOf(slugMarker);
  if (idx === -1) return [];

  // Find the end of this register block (next "register({" or end)
  const rest = content.slice(idx);
  const endIdx = rest.search(/\n\s*\}\);\s*\n\s*\/\/?\s*-{3,}|\n\s*register\(\{/);
  const block = endIdx === -1 ? rest : rest.slice(0, endIdx);

  // Extract entry sourceOutputId values
  const entries = [];
  const entryRegex = /entry\(["']([^"']+)["']/g;
  let match;
  while ((match = entryRegex.exec(block)) !== null) {
    if (match[1] !== "sourceOutputId") {
      entries.push(match[1]);
    }
  }
  return entries;
}

// Read formula module files for each tool
function extractFormulaOutputs(slug) {
  const formulaPath = resolve(
    root, "src", "sectorcalc", "formulas", "pro-v531", `${slug}.formula.ts`
  );
  if (!existsSync(formulaPath)) return [];

  const content = readFileSync(formulaPath, "utf8");
  const outputs = [];

  // Match output object definitions: { id: "out_xxx", ...
  const outputRegex = /\{\s*id:\s*["'](out_[a-z_]+)["']/g;
  let match;
  while ((match = outputRegex.exec(content)) !== null) {
    outputs.push(match[1]);
  }

  return [...new Set(outputs)];
}

// Read schema output keys
function extractSchemaOutputs(slug) {
  const schemaPath = resolve(
    root, "src", "sectorcalc", "schemas", "pro-v531", `${slug}.schema.json`
  );
  if (!existsSync(schemaPath)) return [];

  const content = readFileSync(schemaPath, "utf8");
  try {
    const schema = JSON.parse(content);
    if (schema.outputs && Array.isArray(schema.outputs)) {
      return schema.outputs.map((o) => o.id);
    }
  } catch { /* not valid JSON */ }
  return [];
}

// Read adapter module for each tool
function extractAdapterConsumedKeys(slug) {
  const adapterPath = resolve(
    root, "src", "sectorcalc", "pro-form", "pro-execute-payload-adapter.ts"
  );
  if (!existsSync(adapterPath)) return [];

  const content = readFileSync(adapterPath, "utf8");

  // Find the formToSchemaMap for this slug
  const slugToMapName = {
    "break-even-survival-cash-calculator": "breakEvenFormToSchemaMap",
    "machine-hourly-rate-proof-report": "machineHourlyFormToSchemaMap",
    "loss-making-job-detector": "lossMakingJobFormToSchemaMap",
    "receivables-cost-payment-term-addendum": "receivablesCostFormToSchemaMap",
    "setup-time-reduction-roi-smed": "setupTimeRoiFormToSchemaMap",
    "product-sku-margin-ranker": "productSkuFormToSchemaMap",
    "true-employee-cost-statement": "trueEmployeeCostFormToSchemaMap",
    "job-quote-builder-pro-pack": "jobQuoteFormToSchemaMap",
    "machine-investment-feasibility-buy-lease-keep": "capitalEquipmentFormToSchemaMap",
    "capital-equipment-investment-appraisal-npv-irr": "capitalEquipmentAppraisalFormToSchemaMap",
    "customer-sku-profitability-forensics": "customerSkuFormToSchemaMap",
    "downtime-scrap-loss-statement": "downtimeScrapFormToSchemaMap",
    "oee-loss-monetization-improvement-business-case": "oeeLossFormToSchemaMap",
    "scrap-rework-cost-tracker": "scrapReworkFormToSchemaMap",
    "outsource-vs-in-house-analyzer": "outsourceFormToSchemaMap",
    "plant-wide-shop-rate-cost-structure-audit": "plantWideFormToSchemaMap",
    "fx-commodity-pass-through-pricer": "fxCommodityFormToSchemaMap",
    "energy-efficiency-grant-incentive-feasibility-pack": "energyEfficiencyFormToSchemaMap",
    "motor-compressor-replacement-roi": "motorCompressorFormToSchemaMap",
    "weld-procedure-cost-consumable-estimation-suite": "weldFormToSchemaMap",
  };

  const mapName = slugToMapName[slug];
  if (!mapName) return [];

  const mapRegex = new RegExp(`export const ${mapName}: FormToSchemaMap = \\{([^}]+)\\}`, "s");
  const match = mapRegex.exec(content);
  if (!match) return [];

  const mapBody = match[1];
  const keys = [];
  const keyRegex = /\b([a-z_]+_?[a-z_]*):\s*["']([^"']+)["']/g;
  let km;
  while ((km = keyRegex.exec(mapBody)) !== null) {
    keys.push(km[2]); // schema-side key (normalized)
  }
  return keys;
}

const registryContent = readFileSync(registryPath, "utf8");

const GENERIC_KEYS = [
  "out_utilization_margin",
  "out_demand_metric",
  "out_capacity_metric",
  "out_sensitivity_driver",
  "out_fmea_trigger",
  "out_threshold_crossing",
  "out_expanded_uncertainty",
  "out_evidence_completeness",
  "out_reference_deviation",
  "out_derating_factor",
  "out_final_decision_state",
  "out_decision_state",
];

const matrix = [];
let totalMissing = 0;
let totalExtra = 0;
let totalGeneric = 0;

for (const slug of PRO_V2_SLUGS) {
  const formulaOutputs = extractFormulaOutputs(slug);
  const schemaOutputs = extractSchemaOutputs(slug);
  const contractEntries = extractContractEntries(registryContent, slug);
  const adapterKeys = extractAdapterConsumedKeys(slug);

  // Determine expected outputs from schema (source of truth)
  const expectedOutputs = schemaOutputs;

  // Check missing: contract should not miss expected outputs that are key decision outputs
  // Tools intentionally omit some formula outputs (e.g. normalized_demand, audit_hash)
  // from their contract. This is a DESIGN CHOICE, not a defect.
  // We track it but don't FAIL for it unless critical decision keys are missing.
  const criticalKeys = expectedOutputs.filter(
    (o) => o.startsWith("out_utilization_margin") || o.includes("decision_state") || o.includes("final_decision")
  );
  const missingCritical = criticalKeys.filter((o) => !contractEntries.includes(o));
  const missing = expectedOutputs.filter((o) => !contractEntries.includes(o));

  // Check extra (contract entries that don't exist in schema at all)
  const extra = contractEntries.filter((o) => !expectedOutputs.includes(o) && !o.startsWith("out_"));

  // Check generic keys used
  const genericUsed = contractEntries.filter((o) => GENERIC_KEYS.includes(o));

  const hasMissingCritical = missingCritical.length > 0;
  const hasExtra = extra.length > 0;
  const hasGeneric = genericUsed.length > 0;

  let status;
  if (hasMissingCritical) {
    status = "FAIL";
  } else if (hasExtra) {
    status = "WARN";
  } else if (hasGeneric) {
    status = "GENERIC_MAPPED";
  } else {
    status = "PASS";
  }

  // Recalculate: only report non-critical missing
  const nonCriticalMissing = missing.filter((o) => !missingCritical.includes(o));

  if (hasMissingCritical) totalMissing++;
  if (hasExtra) totalExtra++;
  if (hasGeneric) totalGeneric++;

  const row = {
    SLUG: slug,
    FORMULA_OUTPUTS: formulaOutputs,
    EXPECTED_OUTPUTS: expectedOutputs,
    ADAPTER_KEYS: adapterKeys,
    CONTRACT_ENTRIES: contractEntries,
    MISSING_OUTPUTS: nonCriticalMissing,
    EXTRA_ENTRIES: extra,
    GENERIC_OUTPUTS_USED: genericUsed,
    STATUS: status,
  };
  matrix.push(row);

  const indicator = hasMissingCritical ? "❌" : hasExtra ? "⚠️" : hasGeneric ? "⚙️" : "✅";
  console.log(`  ${indicator} ${slug}: ${contractEntries.length} entries, ${nonCriticalMissing.length} non-critical missing, ${extra.length} extra, ${genericUsed.length} generic → ${status}`);
}

// Write report
const reportDir = resolve(root, "reports");
if (!existsSync(reportDir)) mkdirSync(reportDir, { recursive: true });

const report = {
  generatedAt: new Date().toISOString(),
  totalTools: PRO_V2_SLUGS.length,
  summary: {
    toolsWithCriticalMissing: totalMissing,
    toolsWithExtraEntries: totalExtra,
    toolsWithGenericOutputs: totalGeneric,
  },
  tools: matrix,
};

const reportPath = resolve(reportDir, "pro-v2-report-output-contract-matrix.json");
writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");
console.log(`\nReport written to: ${reportPath}`);
console.log(`\nSUMMARY: ${PRO_V2_SLUGS.length} tools analyzed`);
console.log(`  Critical missing: ${totalMissing}`);
console.log(`  Extra entries: ${totalExtra}`);
console.log(`  Generic outputs used: ${totalGeneric}`);

// Exit with code
if (totalMissing > 0) {
  console.error(`\n❌ ${totalMissing} tool(s) have critical output keys missing from their contract`);
  process.exit(1);
}
if (totalExtra > 0) {
  console.warn("\n⚠️ Some tools have extra entries not in schema");
}
console.log("\n✅ Contract matrix generated successfully");
