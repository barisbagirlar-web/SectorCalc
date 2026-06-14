#!/usr/bin/env node
/**
 * P8 — Global Tool Activation Bridge report generator.
 * Run: npx tsx scripts/tool-activation/p8-global-activation-bridge-report.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkToolBacking } from "../../src/lib/tools/tool-backing-detector";
import { evaluateRuntimeTrust } from "../../src/lib/tools/runtime-trust-engine";
import { resolveToolFormPresence } from "../../src/components/tools/resolve-tool-form-presence";
import { listPremiumSchemaIds } from "../../src/lib/premium-schema/schema-registry";
import { EXPECTED_REVENUE_ELIGIBLE_COUNTS } from "./revenue-eligible-allowlist.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const INDEX_FILE = path.join(ROOT, "public/ai-tool-index.json");
const REPORT_PATH = path.join(ROOT, "docs/p8-global-tool-activation-bridge-report.md");
const TRUST_REPORT_PATH = path.join(ROOT, "scripts/.cache/runtime-trust-engine-report.json");

const SPECIAL_SLUGS = [
  "7-israf-muda-avcisi-parasal-karsilik-calculator",
  "cnc-quote-risk-analyzer",
  "welding-bid-risk-analyzer",
  "3d-print-job-margin-tool",
  "tesis-layout-optimizer",
  "kwh-consumption-check",
  "feed-efficiency-analyzer",
  "abonelik-yazilim-cloud-yillik-maliyet-hesabi",
];

function collectSlugs(): string[] {
  const slugSet = new Set<string>(listPremiumSchemaIds());
  if (fs.existsSync(INDEX_FILE)) {
    const index = JSON.parse(fs.readFileSync(INDEX_FILE, "utf8")) as {
      tools?: Array<{ slug: string }>;
    };
    for (const tool of index.tools ?? []) {
      slugSet.add(tool.slug);
    }
  }
  return [...slugSet].sort((a, b) => a.localeCompare(b));
}

function blockedReason(backing: ReturnType<typeof checkToolBacking>): string {
  if (backing.isProblemLocked) return "problem_locked";
  if (backing.isBlockedSafety) return "blocked_safety";
  if (backing.isManualExpert) return "expert_queue";
  if (!backing.calculatorExists) return "missing_calculator";
  if (!backing.validationExists) return "missing_validation";
  if (!backing.contractExists) return "missing_contract";
  if (!backing.guideExists) return "missing_guide";
  if (!backing.oracleExists) return "missing_oracle";
  return "incomplete_backing";
}

function readRevenueBoundary() {
  if (!fs.existsSync(TRUST_REPORT_PATH)) {
    return {
      paymentEligible: "n/a",
      formulaGateEligible: "n/a",
      freePaymentEligible: "n/a",
    };
  }
  const report = JSON.parse(fs.readFileSync(TRUST_REPORT_PATH, "utf8")) as {
    paymentEligible?: number;
    formulaGateEligible?: number;
    items?: Array<{ slug: string; tier: string; paymentEligible: boolean }>;
  };
  const freePayment = (report.items ?? []).filter(
    (item) => item.paymentEligible && item.tier === "free",
  ).length;
  return {
    paymentEligible: report.paymentEligible ?? "n/a",
    formulaGateEligible: report.formulaGateEligible ?? "n/a",
    freePaymentEligible: freePayment,
  };
}

function main() {
  const slugs = collectSlugs();
  const activated: Array<{
    slug: string;
    backing: ReturnType<typeof checkToolBacking>;
    form: boolean;
    trust: ReturnType<typeof evaluateRuntimeTrust>;
  }> = [];
  const stillBlocked: Array<{ slug: string; reason: string }> = [];
  let backingComplete = 0;
  let expertQueue = 0;
  let blockedSafety = 0;

  for (const slug of slugs) {
    const backing = checkToolBacking(slug);
    if (backing.isComplete) {
      backingComplete += 1;
    }
    if (backing.isManualExpert) {
      expertQueue += 1;
    }
    if (backing.isBlockedSafety) {
      blockedSafety += 1;
    }

    const trust = evaluateRuntimeTrust({ slug, locale: "tr", surface: "premium" });
    const form = resolveToolFormPresence({ slug, locale: "tr", surface: "premium" });

    if (backing.isComplete && trust.calculationEligible && form) {
      activated.push({ slug, backing, form, trust });
    } else if (!backing.isComplete || backing.isBlockedSafety || backing.isProblemLocked || backing.isManualExpert) {
      stillBlocked.push({ slug, reason: blockedReason(backing) });
    }
  }

  const activatedByBridge = activated.filter(
    (row) => SPECIAL_SLUGS.includes(row.slug) || row.trust.paymentEligible === false,
  ).length;

  const revenue = readRevenueBoundary();
  const feedTrust = evaluateRuntimeTrust({
    slug: "feed-efficiency-analyzer",
    locale: "tr",
    surface: "premium",
  });
  const problemTrust = evaluateRuntimeTrust({
    slug: "abonelik-yazilim-cloud-yillik-maliyet-hesabi",
    locale: "tr",
    surface: "premium",
  });

  const activatedRows = activated
    .slice(0, 120)
    .map(
      (row) =>
        `| ${row.slug} | ${row.backing.calculatorExists ? "yes" : "no"} | ${row.backing.validationExists ? "yes" : "no"} | ${row.backing.oracleExists ? "yes" : "no"} | ${row.backing.contractExists ? "yes" : "no"} | ${row.backing.guideExists ? "yes" : "no"} | ${row.form ? "true" : "false"} | ${row.trust.status}/${row.trust.calculationEligible} |`,
    )
    .join("\n");

  const blockedRows = stillBlocked
    .filter((row) => SPECIAL_SLUGS.includes(row.slug) || row.reason !== "incomplete_backing")
    .slice(0, 80)
    .map((row) => `| ${row.slug} | ${row.reason} |`)
    .join("\n");

  const report = `# P8 Global Tool Activation Bridge Report

## Summary

* Total tools scanned: ${slugs.length}
* Backing complete: ${backingComplete}
* Activated by bridge: ${activated.length}
* Still locked: ${stillBlocked.length}
* Expert queue: ${expertQueue}
* Blocked safety: ${blockedSafety}
* Revenue boundary: payment=${revenue.paymentEligible} formulaGate=${revenue.formulaGateEligible} freePayment=${revenue.freePaymentEligible}

## Activated Slugs

| Slug | Calculator | Validation | Oracle | Contract | Guide | FormPresence | RuntimeTrust |
| ---- | ---------: | ---------: | -----: | -------: | ----: | -----------: | -----------: |
${activatedRows}

## Still Blocked

| Slug | Reason |
| ---- | ------ |
${blockedRows}

## Revenue Boundary

| Check | Expected | Actual |
| paymentEligible | ${EXPECTED_REVENUE_ELIGIBLE_COUNTS.paymentEligible} | ${revenue.paymentEligible} |
| formulaGateEligible | ${EXPECTED_REVENUE_ELIGIBLE_COUNTS.formulaGateEligible} | ${revenue.formulaGateEligible} |
| freePaymentEligible | ${EXPECTED_REVENUE_ELIGIBLE_COUNTS.freePaymentEligible} | ${revenue.freePaymentEligible} |
| feed-efficiency-analyzer | blocked | calc=${feedTrust.calculationEligible} form=${resolveToolFormPresence({ slug: "feed-efficiency-analyzer", locale: "tr", surface: "premium" })} |
| abonelik-yazilim-cloud-yillik-maliyet-hesabi | locked | calc=${problemTrust.calculationEligible} form=${resolveToolFormPresence({ slug: "abonelik-yazilim-cloud-yillik-maliyet-hesabi", locale: "tr", surface: "premium" })} |

Generated: ${new Date().toISOString()}
`;

  fs.writeFileSync(REPORT_PATH, report, "utf8");
  console.log(`P8 report written: ${path.relative(ROOT, REPORT_PATH)}`);
  console.log(`total=${slugs.length} backingComplete=${backingComplete} activated=${activated.length}`);
}

main();
