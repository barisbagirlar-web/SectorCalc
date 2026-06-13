#!/usr/bin/env node
/**
 * P4 — Golden Oracle smoke layer.
 * Reads cached P24 + Runtime Trust reports (does not re-run audits).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const REPORT_PATH = path.join(ROOT, "scripts/.cache/p4-golden-oracle-report.json");
const TRUST_REPORT_PATH = path.join(ROOT, "scripts/.cache/runtime-trust-engine-report.json");
const P24_REPORT_PATH = path.join(ROOT, "scripts/.cache/p24-tool-quality-report.json");

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

const blockers = [];

function readJsonOrBlock(filePath, label) {
  if (!fs.existsSync(filePath)) {
    blockers.push(`missing_report:${label}:${path.relative(ROOT, filePath)}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    blockers.push(`invalid_report:${label}`);
    return null;
  }
}

function getTrustItem(trustReport, slug) {
  return trustReport?.items?.find((item) => item.slug === slug) ?? null;
}

function getP24Verdict(p24Report, slug) {
  const row = (p24Report?.tools ?? p24Report?.items ?? []).find((item) => item.slug === slug);
  return row?.verdict ?? null;
}

function main() {
  console.log("=== test:p4-golden-oracle ===\n");

  const trustReport = readJsonOrBlock(TRUST_REPORT_PATH, "runtime-trust");
  const p24Report = readJsonOrBlock(P24_REPORT_PATH, "p24");

  const checkedSlugs = [...TARGET_8, PROBLEM_SLUG];
  let paymentEligibleCount = 0;
  let formulaGateEligibleCount = 0;
  let freePaymentEligible = 0;
  let problemSlugSafe = false;
  let targetSlugsSafe = false;

  if (trustReport) {
    paymentEligibleCount = trustReport.paymentEligible ?? 0;
    formulaGateEligibleCount = trustReport.formulaGateEligible ?? 0;
    freePaymentEligible = (trustReport.items ?? []).filter(
      (item) => item.paymentEligible && item.tier === "free",
    ).length;

    if (freePaymentEligible !== 0) {
      blockers.push(`free_payment_eligible:${freePaymentEligible}`);
    }

    const problem = getTrustItem(trustReport, PROBLEM_SLUG);
    if (!problem) {
      blockers.push(`problem_slug_missing:${PROBLEM_SLUG}`);
    } else if (problem.paymentEligible || problem.formulaGateEligible) {
      if (problem.paymentEligible) {
        blockers.push(`problem_slug_payment_eligible:${PROBLEM_SLUG}`);
      }
      if (problem.formulaGateEligible) {
        blockers.push(`problem_slug_formula_gate_eligible:${PROBLEM_SLUG}`);
      }
    } else {
      problemSlugSafe = true;
    }

    const targetFailures = [];
    for (const slug of TARGET_8) {
      const item = getTrustItem(trustReport, slug);
      if (!item) {
        targetFailures.push(`missing:${slug}`);
        continue;
      }
      if (!item.paymentEligible) {
        targetFailures.push(`payment:${slug}`);
      }
      if (!item.formulaGateEligible) {
        targetFailures.push(`formulaGate:${slug}`);
      }
    }
    if (targetFailures.length > 0) {
      blockers.push(`target_slugs_unsafe:${targetFailures.join(",")}`);
    } else {
      targetSlugsSafe = true;
    }
  }

  if (p24Report) {
    for (const slug of TARGET_8) {
      const verdict = getP24Verdict(p24Report, slug);
      if (verdict !== "PASS") {
        blockers.push(`target_p24_not_pass:${slug}:${verdict ?? "missing"}`);
        targetSlugsSafe = false;
      }
    }
  }

  const oracleSmoke = TARGET_8.map((slug) => {
    const trust = getTrustItem(trustReport, slug);
    const p24Verdict = getP24Verdict(p24Report, slug);
    return {
      slug,
      paymentEligible: trust?.paymentEligible ?? false,
      formulaGateEligible: trust?.formulaGateEligible ?? false,
      p24Verdict: p24Verdict ?? "missing",
      oraclePass:
        Boolean(trust?.paymentEligible) &&
        Boolean(trust?.formulaGateEligible) &&
        p24Verdict === "PASS",
    };
  });

  const problemOracle = {
    slug: PROBLEM_SLUG,
    paymentEligible: getTrustItem(trustReport, PROBLEM_SLUG)?.paymentEligible ?? false,
    formulaGateEligible: getTrustItem(trustReport, PROBLEM_SLUG)?.formulaGateEligible ?? false,
    negativeOraclePass: problemSlugSafe,
  };

  const verdict = blockers.length === 0 ? "PASS" : "FAIL";

  const report = {
    generatedAt: new Date().toISOString(),
    checkedSlugs,
    paymentEligibleCount,
    formulaGateEligibleCount,
    freePaymentEligible,
    problemSlugSafe,
    targetSlugsSafe,
    oracleSmoke,
    problemOracle,
    verdict,
    blockers,
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`verdict: ${verdict}`);
  console.log(`paymentEligibleCount: ${paymentEligibleCount}`);
  console.log(`formulaGateEligibleCount: ${formulaGateEligibleCount}`);
  console.log(`freePaymentEligible: ${freePaymentEligible}`);
  console.log(`problemSlugSafe: ${problemSlugSafe}`);
  console.log(`targetSlugsSafe: ${targetSlugsSafe}`);
  console.log(`output: ${path.relative(ROOT, REPORT_PATH)}`);

  if (blockers.length > 0) {
    console.error("\nBlockers:");
    for (const blocker of blockers) {
      console.error(` - ${blocker}`);
    }
    process.exit(1);
  }

  console.log("\ntest:p4-golden-oracle PASS");
}

main();
