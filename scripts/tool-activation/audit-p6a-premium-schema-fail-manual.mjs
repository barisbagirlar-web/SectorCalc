#!/usr/bin/env node
/**
 * P6A — Premium schema FAIL manual formula alignment audit.
 * Default: audit only. P6A_APPLY_SAFE_ALIGNMENT=1 enables LOW_RISK field alignment patches.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/activation-paths.mjs";
import {
  P6A_REPORT_PATH,
  buildP6aAuditReport,
  buildP6aMarkdownDoc,
  formatP6aStdout,
} from "./lib/p6a-premium-schema-fail-lib.mjs";

const DOC_PATH = path.join(ROOT, "docs/p6a-premium-schema-fail-manual-audit.md");

function applySafeAlignmentPatches(report) {
  if (process.env.P6A_APPLY_SAFE_ALIGNMENT !== "1") {
    return { applied: [], skipped: "P6A_APPLY_SAFE_ALIGNMENT not set" };
  }
  const applied = [];
  const skipped = [];
  for (const candidate of report.candidates) {
    if (!candidate.canAutoPatchSafely) {
      skipped.push({ slug: candidate.slug, reason: candidate.autoPatchReason });
      continue;
    }
    if (candidate.riskClass !== "LOW_RISK_ESTIMATOR_ALIGNMENT") {
      skipped.push({ slug: candidate.slug, reason: "not_low_risk" });
      continue;
    }
    skipped.push({
      slug: candidate.slug,
      reason: "no_safe_field_alignment_patch_identified_in_p6a",
    });
  }
  return { applied, skipped };
}

function main() {
  const report = buildP6aAuditReport();
  const patchResult = applySafeAlignmentPatches(report);
  report.patchResult = patchResult;
  fs.mkdirSync(path.dirname(P6A_REPORT_PATH), { recursive: true });
  fs.writeFileSync(P6A_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(DOC_PATH, buildP6aMarkdownDoc(report), "utf8");
  console.log(formatP6aStdout(report));
  if (patchResult.applied.length > 0) {
    console.log(`patches applied: ${patchResult.applied.length}`);
  } else {
    console.log(`patches applied: 0 (${patchResult.skipped})`);
  }
  console.log(`doc: ${path.relative(ROOT, DOC_PATH)}`);
}

main();
