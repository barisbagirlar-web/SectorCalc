import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { ROOT } from "./activation-paths.mjs";
import {
  auditSingleTool,
  applyFormulaBatch,
  buildP6bAuditReport,
  loadRevenueBoundary,
  loadSchemaRegistryAliases,
  resolveSchemaForSlug,
  verifyPatchedTools,
} from "./p6b-formula-factory-lib.mjs";
import { readToolIndex } from "./activation-scan-lib.mjs";
import { loadFactoryInputs } from "./premium-backfill-factory-lib.mjs";
import { buildIndexes } from "./p24-tool-quality-lib.mjs";
import { ensureFormulaSourceAudit } from "./formula-source-audit-lib.mjs";
import { buildQualityScanReport, QUALITY_SCAN_REPORT_PATH } from "./quality-backfill-scan-lib.mjs";

export const P7_AUDIT_PATH = path.join(ROOT, "scripts/.cache/p7-night-factory-audit.json");
export const P7_APPLY_REPORT_PATH = path.join(ROOT, "scripts/.cache/p7-night-factory-apply-report.json");
export const P7_VERIFY_REPORT_PATH = path.join(ROOT, "scripts/.cache/p7-night-factory-verify-report.json");
export const P7_DOC_PATH = path.join(ROOT, "docs/p7-night-deepseek-full-factory-report.md");
export const P7_QUALITY_GATE_DOC = path.join(ROOT, "docs/p7-chief-engineer-quality-gate.md");

const REVERT_PATHS = [
  "src/lib/premium-schema/calculators",
  "src/lib/premium-schema/__tests__",
  "src/lib/formula-governance/contracts",
  "src/lib/tool-guides",
  "messages/en.json",
  "messages/tr.json",
];

function writeText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content.endsWith("\n") ? content : `${content}\n`, "utf8");
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function ensureQualityScan() {
  if (!fs.existsSync(QUALITY_SCAN_REPORT_PATH)) {
    const report = buildQualityScanReport();
    fs.mkdirSync(path.dirname(QUALITY_SCAN_REPORT_PATH), { recursive: true });
    fs.writeFileSync(QUALITY_SCAN_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }
}

export function buildP7ToolUniverse() {
  ensureQualityScan();
  ensureFormulaSourceAudit();

  const index = readToolIndex();
  const { schemas: schemaIndex, formulaRegistryIds } = loadFactoryInputs();
  const aliases = loadSchemaRegistryAliases();
  const indexes = buildIndexes();

  const p6bTools = index.tools.map((tool) =>
    auditSingleTool(tool, schemaIndex, aliases, indexes, formulaRegistryIds),
  );

  return { index, schemaIndex, aliases, p6bTools };
}

export function classifyP7ScanTargets(p6bTools) {
  const fullyWorking = [];
  const expertQueue = [];
  const blockedUnknown = [];
  const deepseekTargets = [];
  const skippedFullyWorking = [];

  for (const tool of p6bTools) {
    if (tool.fullyWorking && tool.backingComplete) {
      fullyWorking.push(tool.slug);
      skippedFullyWorking.push(tool.slug);
      continue;
    }

    if (
      tool.manualExpertRequired ||
      tool.riskClass === "HIGH_ENGINEERING_SAFETY" ||
      tool.riskClass === "HIGH_FINANCE_LEGAL_TAX" ||
      tool.riskClass === "HIGH_REGULATORY"
    ) {
      expertQueue.push({ slug: tool.slug, riskClass: tool.riskClass, patchAction: tool.patchAction });
      continue;
    }

    if (tool.riskClass === "BLOCKED_UNKNOWN" || tool.blockedSafety) {
      blockedUnknown.push({ slug: tool.slug, riskClass: tool.riskClass, patchAction: tool.patchAction });
      continue;
    }

    if (tool.riskClass === "LOW_GENERAL_CALC" || tool.riskClass === "MEDIUM_BUSINESS_CALC") {
      deepseekTargets.push(tool);
    }
  }

  return {
    fullyWorking,
    skippedFullyWorking,
    expertQueue,
    blockedUnknown,
    deepseekTargets,
  };
}

export function selectP7ApplyBatch(audit) {
  const slugs = new Set();
  const deepseekApproved = new Set();

  for (const row of audit.deepseekResults ?? []) {
    if (row.patchEligible && row.response?.slug) {
      slugs.add(row.response.slug);
      deepseekApproved.add(row.response.slug);
    }
  }

  for (const tool of audit.p6bTools ?? []) {
    if (tool.autoPatchEligible && tool.patchAction === "AUTO_PATCH_READY") {
      slugs.add(tool.slug);
    }

    if (
      tool.routeStatus === "active-route" &&
      !tool.manualExpertRequired &&
      !tool.blockedSafety &&
      (tool.riskClass === "LOW_GENERAL_CALC" || tool.riskClass === "MEDIUM_BUSINESS_CALC") &&
      tool.formulaStatus === "FULLY_WORKING" &&
      tool.rendererStatus === "FULLY_WORKING" &&
      !tool.backingComplete &&
      deepseekApproved.has(tool.slug)
    ) {
      slugs.add(tool.slug);
    }
  }

  const { schemaIndex, aliases } = loadFactoryInputs();
  const eligible = [];
  const skipped = [];

  for (const slug of [...slugs].sort()) {
    const { schema } = resolveSchemaForSlug(slug, schemaIndex, aliases);
    if (!schema || schema.formulaPipeline.length === 0) {
      skipped.push({ slug, reason: "missing_schema_pipeline_for_apply" });
      continue;
    }
    eligible.push(slug);
  }

  return { eligible, skipped };
}

export function applyP7VerifiedBatch(slugs) {
  if (slugs.length === 0) {
    return {
      generatedAt: new Date().toISOString(),
      requested: [],
      generated: [],
      passed: [],
      failed: [],
      skipped: [],
      testFiles: [],
      guideSpecsCount: 0,
      filesTouched: [],
    };
  }
  return applyFormulaBatch(slugs);
}

export function revertFailedToolFiles(slugs) {
  const reverted = [];
  const errors = [];

  for (const slug of slugs) {
    const files = [
      `src/lib/premium-schema/calculators/${slug}.ts`,
      `src/lib/premium-schema/calculators/${slug}-validation.ts`,
      `src/lib/premium-schema/__tests__/${slug}.test.ts`,
      `src/lib/formula-governance/contracts/${slug}-critical.ts`,
    ];

    for (const relativePath of files) {
      const absolutePath = path.join(ROOT, relativePath);
      if (!fs.existsSync(absolutePath)) continue;
      try {
        execFileSync("git", ["restore", relativePath], { cwd: ROOT, stdio: "pipe" });
        reverted.push(relativePath);
      } catch (error) {
        errors.push({
          slug,
          path: relativePath,
          reason: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  return { reverted, errors };
}

export function verifyP7Batch(slugs) {
  const verifyReport = verifyPatchedTools(slugs);
  const failedSlugs = verifyReport.results.filter((row) => row.result !== "PASS").map((row) => row.slug);
  const revertReport = revertFailedToolFiles(failedSlugs);

  return {
    ...verifyReport,
    failedAndReverted: failedSlugs,
    revertReport,
  };
}

export function renderP7ReportDoc(audit, applyReport, verifyReport) {
  const rb = verifyReport?.revenueBoundary ?? audit.revenueBoundary ?? loadRevenueBoundary();
  const expertPreview = (audit.expertQueue ?? []).slice(0, 40);
  const blockedPreview = (audit.blockedUnknown ?? []).slice(0, 20);
  const reverted = verifyReport?.failedAndReverted ?? [];

  const patchedRows =
    verifyReport?.results?.length > 0
      ? verifyReport.results
          .map(
            (row) =>
              `| ${row.slug} | ${row.input} | ${row.formula} | ${row.validation} | ${row.oracle} | ${row.renderer} | ${row.result} |`,
          )
          .join("\n")
      : "| — | — | — | — | — | — | — |";

  return `# P7 Nightrun DeepSeek Full Factory Report

## Summary

* Total tools scanned: ${audit.summary?.totalTools ?? 0}
* Fully working before: ${audit.summary?.fullyWorkingBefore ?? 0}
* Fully working after: ${audit.summary?.fullyWorkingAfter ?? audit.summary?.fullyWorkingBefore ?? 0}
* DeepSeek attempted: ${audit.summary?.deepseekAttempted ?? 0}
* Patch eligible (gate passed): ${audit.summary?.patchEligible ?? 0}
* Generated: ${applyReport?.generated?.length ?? 0}
* Patched and verified: ${verifyReport?.results?.filter((r) => r.result === "PASS").length ?? 0}
* Failed and reverted: ${reverted.length}
* Expert queue: ${audit.expertQueue?.length ?? 0}
* Blocked unknown: ${audit.blockedUnknown?.length ?? 0}
* Deploy executed: no

## Chief Engineer + Domain Packs

* Chief Engineer prompt enforced: ${audit.chiefEngineerSystemPrompt?.enforced ? "yes" : "no"}
* Domain packs enabled: ${audit.domainPromptPacks?.enabled ? "yes" : "no"}
* Domain pack count: ${audit.domainPromptPacks?.packCount ?? 0}
* DeepSeek used: ${audit.summary?.deepseekAttempted > 0 ? "yes" : "no"}

## Patched Tools

| Slug | Input | Formula | Validation | Oracle | Renderer | Result |
|------|-------|---------|------------|--------|----------|--------|
${patchedRows}

## Failed And Reverted

${reverted.length > 0 ? reverted.map((slug) => `- ${slug}`).join("\n") : "- none"}

## Expert Queue (sample)

| Slug | Risk Class |
|------|------------|
${expertPreview.map((row) => `| ${row.slug} | ${row.riskClass} |`).join("\n")}

## Blocked Unknown

| Slug | Risk Class |
|------|------------|
${blockedPreview.map((row) => `| ${row.slug} | ${row.riskClass} |`).join("\n")}

## Revenue Boundary

| Check | Expected | Actual |
| paymentEligible | 22 | ${rb?.paymentEligible ?? "—"} |
| formulaGateEligible | 22 | ${rb?.formulaGateEligible ?? "—"} |
| freePaymentEligible | 0 | ${rb?.freePaymentEligible ?? "—"} |
| feed-efficiency-analyzer | blocked | ${rb?.feedEfficiencyBlocked ? "blocked" : "OPEN"} |
| abonelik-yazilim-cloud-yillik-maliyet-hesabi | locked | ${rb?.problemSlugLocked ? "locked" : "OPEN"} |
`;
}

export function writeP7Outputs(audit, applyReport, verifyReport) {
  writeText(P7_AUDIT_PATH, JSON.stringify(audit, null, 2));
  if (applyReport) writeText(P7_APPLY_REPORT_PATH, JSON.stringify(applyReport, null, 2));
  if (verifyReport) writeText(P7_VERIFY_REPORT_PATH, JSON.stringify(verifyReport, null, 2));
  writeText(P7_DOC_PATH, renderP7ReportDoc(audit, applyReport, verifyReport));
}

export function loadP7AuditOrThrow() {
  const audit = readJson(P7_AUDIT_PATH);
  if (!audit) {
    throw new Error("Missing P7 audit cache — run audit:p7-night first");
  }
  return audit;
}

export function summarizeP6bAfterApply() {
  const audit = buildP6bAuditReport();
  return audit.summary.fullyWorking;
}

export { buildP6bAuditReport, loadRevenueBoundary, REVERT_PATHS };
