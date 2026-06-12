#!/usr/bin/env node
import fs from "node:fs";
import {
  ACTIVATION_DIR,
  DRAFTS_DIR,
  P53_REFERENCE_SLUG,
  SCAN_REPORT_PATH,
  draftPath,
} from "./lib/activation-paths.mjs";
import {
  buildScanRecords,
  readToolIndex,
  resolveReferenceSelection,
} from "./lib/activation-scan-lib.mjs";

function ensureDirs() {
  fs.mkdirSync(ACTIVATION_DIR, { recursive: true });
  fs.mkdirSync(DRAFTS_DIR, { recursive: true });
}

function buildReferenceDraft(record) {
  const preserveExisting =
    record.hasFormulaContract || record.hasExistingFormulaExpression;

  return {
    slug: record.slug,
    formulaAction: preserveExisting ? "preserve-existing" : "create-new",
    riskLevel: record.riskLevel,
    inputs: [],
    outputs: [{ key: "primaryResult", unit: "" }],
    testCases: [
      {
        name: "reference activation baseline",
        inputs: {},
        expectedOutput: { primaryResult: 0 },
      },
    ],
    metadata: {
      activationMode: "reference-lock",
      routeStatus: record.routeStatus,
      tier: record.tier,
      note: preserveExisting
        ? "Existing production formula preserved; draft only adds validation metadata."
        : "No existing FormulaContract detected; activation draft is metadata/test scaffolding only.",
    },
    validationNotes: [
      preserveExisting
        ? "Existing formula detected in scan report"
        : "No existing FormulaContract or production formula expression detected",
    ],
  };
}

function main() {
  ensureDirs();

  const index = readToolIndex();
  const records = buildScanRecords(index.tools);
  const selected = resolveReferenceSelection(records);

  const report = {
    generatedAt: new Date().toISOString(),
    selectedReferenceSlug: selected.slug,
    selectedReferenceReason: selected.reason,
    referenceHasActiveRoute: selected.referenceHasActiveRoute,
    referenceHasFormulaContract: selected.referenceHasFormulaContract,
    referenceFormulaPreserved: selected.referenceFormulaPreserved,
    referenceSlugOverride: process.env.TOOL_ACTIVATION_REFERENCE_SLUG || null,
    p53ReferenceSlug: P53_REFERENCE_SLUG,
    tools: records,
  };

  fs.writeFileSync(SCAN_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  fs.writeFileSync(
    draftPath(selected.slug),
    `${JSON.stringify(buildReferenceDraft(selected.record), null, 2)}\n`,
    "utf8",
  );

  console.log(`Scan report written: ${SCAN_REPORT_PATH}`);
  console.log(`Selected reference slug: ${selected.slug}`);
  console.log(`Reason: ${selected.reason}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
