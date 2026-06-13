#!/usr/bin/env node
/**
 * Revenue gate consistency assert — independent fresh-process verification.
 *
 * Requires fresh audit outputs:
 *   node scripts/tool-activation/audit-p24-tool-quality.mjs
 *   node scripts/tool-activation/audit-runtime-trust-engine.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const TRUST_REPORT_PATH = path.join(ROOT, "scripts/.cache/runtime-trust-engine-report.json");
const P24_REPORT_PATH = path.join(ROOT, "scripts/.cache/p24-tool-quality-report.json");
const FRESH_EVAL_SCRIPT = path.join(ROOT, "scripts/tool-activation/assert-revenue-gate-fresh-eval.ts");

const MIN_PAYMENT_ELIGIBLE = 10;
const MIN_FORMULA_GATE_ELIGIBLE = 10;
const PROBLEM_SLUG = "abonelik-yazilim-cloud-yillik-maliyet-hesabi";

const TARGET_8 = [
  "change-order-impact-analyzer",
  "menu-profit-leak-detector",
  "office-cleaning-bid-optimizer",
  "landscaping-contract-profit-tool",
  "signage-bid-safe-price-tool",
  "welding-bid-risk-analyzer",
  "hvac-project-margin-guard",
  "cnc-quote-risk-analyzer",
];

const BACKUP_2 = ["sheet-metal-quote-risk-tool", "plumbing-job-margin-verdict"];

const FRESH_CHECK_SLUGS = [...TARGET_8, ...BACKUP_2, PROBLEM_SLUG];

function fail(message) {
  failures.push(message);
}

const failures = [];

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`missing_report:${path.relative(ROOT, filePath)}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadFreshEvaluations() {
  const result = spawnSync(
    "npx",
    ["tsx", FRESH_EVAL_SCRIPT, ...FRESH_CHECK_SLUGS],
    { cwd: ROOT, encoding: "utf8", shell: false },
  );
  if (result.status !== 0) {
    fail(`fresh_eval_process_failed:${result.stderr || result.stdout || "unknown"}`);
    return new Map();
  }
  try {
    const rows = JSON.parse(result.stdout.trim());
    return new Map(rows.map((row) => [row.slug, row]));
  } catch {
    fail("fresh_eval_invalid_json");
    return new Map();
  }
}

function getReportItem(report, slug) {
  return report.items?.find((item) => item.slug === slug) ?? null;
}

function getP24Verdict(p24Report, slug) {
  const row = (p24Report.tools ?? p24Report.items ?? []).find((item) => item.slug === slug);
  return row?.verdict ?? null;
}

function compareAuditWithFresh(slug, reportItem, freshRow) {
  if (!reportItem || !freshRow) {
    return;
  }
  const fields = ["status", "paymentEligible", "formulaGateEligible", "calculationEligible"];
  for (const field of fields) {
    if (reportItem[field] !== freshRow[field]) {
      fail(`stale_audit_mismatch:${slug}:${field}:report=${reportItem[field]}:fresh=${freshRow[field]}`);
    }
  }
}

function main() {
  console.log("=== assert-revenue-gate ===\n");

  const trustReport = readJson(TRUST_REPORT_PATH);
  const p24Report = readJson(P24_REPORT_PATH);
  const freshBySlug = loadFreshEvaluations();

  if (trustReport) {
    if (trustReport.paymentEligible < MIN_PAYMENT_ELIGIBLE) {
      fail(`paymentEligible_below_min:${trustReport.paymentEligible}<${MIN_PAYMENT_ELIGIBLE}`);
    }
    if (trustReport.formulaGateEligible < MIN_FORMULA_GATE_ELIGIBLE) {
      fail(`formulaGateEligible_below_min:${trustReport.formulaGateEligible}<${MIN_FORMULA_GATE_ELIGIBLE}`);
    }

    const freePayment = (trustReport.items ?? []).filter(
      (item) => item.paymentEligible && item.tier === "free",
    );
    if (freePayment.length > 0) {
      fail(`free_payment_eligible:${freePayment.map((item) => item.slug).join(",")}`);
    }

    const problem = getReportItem(trustReport, PROBLEM_SLUG);
    if (!problem) {
      fail(`problem_slug_missing_from_report:${PROBLEM_SLUG}`);
    } else {
      if (problem.paymentEligible) {
        fail(`problem_slug_payment_eligible:${PROBLEM_SLUG}`);
      }
      if (problem.formulaGateEligible) {
        fail(`problem_slug_formula_gate_eligible:${PROBLEM_SLUG}`);
      }
    }

    for (const slug of TARGET_8) {
      const item = getReportItem(trustReport, slug);
      if (!item) {
        fail(`target_slug_missing_from_report:${slug}`);
        continue;
      }
      if (!item.paymentEligible) {
        fail(`target_slug_not_payment_eligible:${slug}`);
      }
      if (!item.formulaGateEligible) {
        fail(`target_slug_not_formula_gate_eligible:${slug}`);
      }
      compareAuditWithFresh(slug, item, freshBySlug.get(slug));
    }

    const backupEligible = BACKUP_2.filter((slug) => getReportItem(trustReport, slug)?.paymentEligible);
    if (backupEligible.length < 1) {
      fail(`backup_slugs_not_payment_eligible:${BACKUP_2.join(",")}`);
    }

    for (const slug of BACKUP_2) {
      compareAuditWithFresh(slug, getReportItem(trustReport, slug), freshBySlug.get(slug));
    }

    compareAuditWithFresh(PROBLEM_SLUG, getReportItem(trustReport, PROBLEM_SLUG), freshBySlug.get(PROBLEM_SLUG));
  }

  if (p24Report) {
    for (const slug of TARGET_8) {
      const verdict = getP24Verdict(p24Report, slug);
      if (verdict !== "PASS") {
        fail(`target_slug_p24_not_pass:${slug}:${verdict ?? "missing"}`);
      }
    }
  }

  for (const slug of TARGET_8) {
    const fresh = freshBySlug.get(slug);
    if (!fresh) {
      continue;
    }
    if (!fresh.p24TrustPass) {
      fail(`target_slug_p24_trust_not_pass:${slug}`);
    }
    if (fresh.p24Verdict !== "PASS") {
      fail(`target_slug_fresh_p24_verdict_not_pass:${slug}:${fresh.p24Verdict}`);
    }
    if (!fresh.paymentEligible) {
      fail(`target_slug_fresh_not_payment_eligible:${slug}`);
    }
  }

  const problemFresh = freshBySlug.get(PROBLEM_SLUG);
  if (problemFresh?.paymentEligible) {
    fail(`problem_slug_fresh_payment_eligible:${PROBLEM_SLUG}`);
  }
  if (problemFresh?.formulaGateEligible) {
    fail(`problem_slug_fresh_formula_gate_eligible:${PROBLEM_SLUG}`);
  }

  if (failures.length > 0) {
    console.error("assert:revenue-gate FAIL");
    for (const message of failures) {
      console.error(` - ${message}`);
    }
    process.exit(1);
  }

  console.log("assert:revenue-gate PASS");
  if (trustReport) {
    console.log(` - paymentEligible: ${trustReport.paymentEligible}`);
    console.log(` - formulaGateEligible: ${trustReport.formulaGateEligible}`);
    console.log(` - free paymentEligible: 0`);
    console.log(` - problem slug blocked: ${PROBLEM_SLUG}`);
    console.log(` - target 8 slugs payment eligible`);
    console.log(` - backup eligible: ${BACKUP_2.filter((slug) => getReportItem(trustReport, slug)?.paymentEligible).join(", ")}`);
    console.log(` - audit/fresh eval aligned for ${FRESH_CHECK_SLUGS.length} slugs`);
  }
}

main();
