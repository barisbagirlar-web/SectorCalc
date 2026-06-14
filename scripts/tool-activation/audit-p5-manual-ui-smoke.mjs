#!/usr/bin/env node
/**
 * P5 — Manual UI QA accelerator + pre-deploy smoke report.
 * Does not deploy. Does not open a browser. Produces JSON + markdown checklist.
 *
 * Optional live fetch when SECTORCALC_QA_BASE_URL is set (e.g. http://localhost:3000).
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  EXPECTED_REVENUE_ELIGIBLE_COUNTS,
  isRevenueEligibleAllowed,
} from "./revenue-eligible-allowlist.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const REPORT_JSON_PATH = path.join(ROOT, "scripts/.cache/p5-manual-ui-smoke-report.json");
const REPORT_MD_PATH = path.join(ROOT, "docs/p5-manual-ui-qa-report.md");

const PROBLEM_SLUG = "abonelik-yazilim-cloud-yillik-maliyet-hesabi";
const FEED_LEAK_SLUG = "feed-efficiency-analyzer";
const PROBLEM_SLUG_ROUTE = `/tr/tools/premium/${PROBLEM_SLUG}`;

const COMMIT_PATTERNS = [
  { key: "revenueKillSwitch", pattern: /fix\(control-plane\): enforce revenue eligibility allowlist/, prefix: "c72366e" },
  { key: "s3", pattern: /feat\(tools\): apply s3 low risk activation batch/, prefix: "260cc17" },
  { key: "s4", pattern: /docs\(tools\): add s4 category-only route decision matrix/, prefix: "2fd63f0" },
  { key: "s5", pattern: /feat\(tools\): apply s5 guide oracle ux scaffold/, prefix: "7fe52a6" },
  { key: "s6Doc", pattern: /docs\(audit\): add s6 final sprint readiness report/, prefix: "f6a379a" },
  { key: "s6Stabilize", pattern: /fix\(audit\): stabilize s6 final sprint readiness gate and report/, prefix: "e1cf5e5" },
  { key: "s6BuildClean", pattern: /fix\(audit\): harden s6 build pre-clean for flaky .next removal/, prefix: "167db44" },
];

const CRITICAL_ROUTES = [
  "/tr",
  "/tr/free-tools",
  "/tr/premium-tools",
  "/tr/tools/free/machine-time-calculator",
  "/tr/tools/free/project-cost-calculator",
  "/tr/tools/free/cleaning-cost-calculator",
  "/tr/tools/premium-schema/cnc-oee-loss",
  PROBLEM_SLUG_ROUTE,
  "/tr/pricing",
  "/tr/account",
  "/en",
  "/en/free-tools",
  "/en/premium-tools",
  "/en/tools/free/machine-time-calculator",
  "/en/tools/premium-schema/cnc-oee-loss",
];

const GENERATED_DIRTY_ALLOWLIST = new Set([
  "next-env.d.ts",
  "src/lib/tools/runtime-readiness-p24-verdicts.ts",
  "public/ai-categories.json",
  "public/ai-tool-index.json",
  "public/ai-tool-index.txt",
  "public/ai-tool-routes.json",
]);

const P5_ALLOWED_DIRTY = new Set([
  "scripts/tool-activation/audit-p5-manual-ui-smoke.mjs",
  "docs/p5-manual-ui-qa-report.md",
  "package.json",
  "scripts/.cache/p5-manual-ui-smoke-report.json",
]);

const PAYMENT_UNLOCK_PATTERNS = [
  { id: "formula_gate_approved_tr", pattern: /\bFormula Gate Onaylı\b/ },
  { id: "formula_gate_approved_en", pattern: /\bFormula Gate Approved\b/ },
  { id: "payment_eligible_attr", pattern: /data-payment-eligible="true"/i },
  { id: "formula_gate_eligible_attr", pattern: /data-formula-gate-eligible="true"/i },
  { id: "subscribe_cta", pattern: /\b(Abone Ol|Subscribe Now|Start Subscription)\b/i },
  { id: "checkout_cta", pattern: /\b(Ödeme Yap|Proceed to Checkout|Complete Purchase)\b/i },
];

const blockers = [];

function addBlocker(message) {
  if (!blockers.includes(message)) {
    blockers.push(message);
  }
}

function readJson(relativePath) {
  const absolute = path.join(ROOT, relativePath);
  if (!fs.existsSync(absolute)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(absolute, "utf8"));
}

function runCommand(command) {
  const result = spawnSync(command, {
    cwd: ROOT,
    shell: true,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return {
    ok: result.status === 0,
    stdout: (result.stdout ?? "").trim(),
    stderr: (result.stderr ?? "").trim(),
    detail: ((result.stderr || result.stdout || "exit non-zero").trim()).slice(0, 300),
  };
}

function gitLogOneline(limit = 40) {
  const result = runCommand(`git log --oneline -${limit}`);
  return result.ok ? result.stdout.split("\n").filter(Boolean) : [];
}

function findCommit(pattern) {
  for (const line of gitLogOneline(50)) {
    if (pattern.test(line)) {
      const [hash, ...rest] = line.split(" ");
      return { hash, subject: rest.join(" ") };
    }
  }
  return null;
}

function checkCommitChain() {
  const commits = {};
  for (const { key, pattern, prefix } of COMMIT_PATTERNS) {
    const commit = findCommit(pattern);
    commits[key] = commit;
    if (!commit) {
      addBlocker(`missing_commit:${key}`);
      continue;
    }
    if (prefix && !commit.hash.startsWith(prefix)) {
      addBlocker(`commit_hash_mismatch:${key}:${commit.hash}:expected_prefix_${prefix}`);
    }
  }
  return commits;
}

function parsePorcelainPath(line) {
  const trimmed = line.trimEnd();
  if (trimmed.length < 3) {
    return trimmed;
  }
  const renamed = trimmed.match(/^..[\s]+(.+?) -> (.+)$/);
  if (renamed) {
    return renamed[2].trim();
  }
  if (trimmed.length >= 4 && trimmed[2] === " ") {
    return trimmed.slice(3).trim();
  }
  if (trimmed[1] === " ") {
    return trimmed.slice(2).trim();
  }
  const match = trimmed.match(/^..[\s]+(.+)$/);
  return match ? match[1].trim() : trimmed;
}

function getWorkingTreeEntries() {
  const result = runCommand("git status --porcelain");
  if (!result.ok) {
    return [];
  }
  return result.stdout.split("\n").filter(Boolean).map((line) => parsePorcelainPath(line));
}

function isAllowedDirtyPath(file) {
  if (GENERATED_DIRTY_ALLOWLIST.has(file)) {
    return true;
  }
  if (P5_ALLOWED_DIRTY.has(file)) {
    return true;
  }
  if (file.endsWith("next-env.d.ts")) {
    return true;
  }
  return false;
}

function checkWorkingTree() {
  const entries = getWorkingTreeEntries();
  const disallowed = entries.filter((file) => !isAllowedDirtyPath(file));
  if (disallowed.length > 0) {
    addBlocker(`working_tree_dirty:${disallowed.join(",")}`);
  }
  return {
    workingTreeClean: disallowed.length === 0,
    dirtyEntries: entries,
    disallowedDirty: disallowed,
  };
}

function stripScripts(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function hasActiveCalculateCta(visible) {
  if (!/data-calculation-form="true"/.test(visible)) {
    return false;
  }
  return /<button[^>]*type="submit"[^>]*>[\s\S]*?(Hesapla|Calculate)/i.test(visible);
}

function scanProblemSlugPaymentUnlock(html) {
  const visible = stripScripts(html);
  const findings = [];
  for (const { id, pattern } of PAYMENT_UNLOCK_PATTERNS) {
    if (pattern.test(visible) || pattern.test(html)) {
      findings.push(id);
    }
  }
  if (hasActiveCalculateCta(visible)) {
    findings.push("active_calculate_cta");
  }
  const hasSafeState =
    html.includes('data-runtime-trust-safe-state="true"') ||
    html.includes('data-runtime-readiness-safe-state="true"') ||
    /Hesaplama kalite kontrolünde/i.test(visible);
  return {
    paymentUnlockClaimDetected: findings.length > 0,
    findings,
    hasSafeState,
  };
}

async function fetchRouteSmoke(baseUrl, route) {
  const url = `${baseUrl.replace(/\/$/, "")}${route}`;
  const check = {
    route,
    url,
    status: null,
    ok: false,
    emptyBody: false,
    error: null,
    problemSlugScan: null,
  };

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "SectorCalc-P5-Manual-UI-Smoke/1.0" },
      redirect: "follow",
    });
    check.status = res.status;
    const html = await res.text();
    check.emptyBody = html.trim().length === 0;

    if (res.status !== 200) {
      addBlocker(`route_http_${res.status}:${route}`);
    }
    if (check.emptyBody) {
      addBlocker(`route_empty_body:${route}`);
    }

    if (route === PROBLEM_SLUG_ROUTE) {
      check.problemSlugScan = scanProblemSlugPaymentUnlock(html);
      if (check.problemSlugScan.paymentUnlockClaimDetected) {
        addBlocker(
          `problem_slug_payment_unlock:${check.problemSlugScan.findings.join(",")}`,
        );
      }
    }

    check.ok = res.status === 200 && !check.emptyBody;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    check.error = message;
    addBlocker(`route_fetch_error:${route}:${message}`);
  }

  return check;
}

async function runFetchSmoke(baseUrl) {
  const routeChecks = [];
  for (const route of CRITICAL_ROUTES) {
    routeChecks.push(await fetchRouteSmoke(baseUrl, route));
  }
  return routeChecks;
}

function checkRevenueBoundary() {
  const trustReport = readJson("scripts/.cache/runtime-trust-engine-report.json");
  const boundary = {
    paymentEligible: trustReport?.paymentEligible ?? null,
    formulaGateEligible: trustReport?.formulaGateEligible ?? null,
    freePaymentEligible: null,
    feedEfficiencyBlocked: false,
    problemSlugLocked: false,
    allowlistEnforced: true,
  };

  if (!trustReport) {
    addBlocker("missing_runtime_trust_report");
    return boundary;
  }

  const freePayment = (trustReport.items ?? []).filter(
    (item) => item.paymentEligible && item.tier === "free",
  );
  boundary.freePaymentEligible = freePayment.length;

  const feedItem = (trustReport.items ?? []).find((item) => item.slug === FEED_LEAK_SLUG);
  boundary.feedEfficiencyBlocked = Boolean(
    feedItem && !feedItem.paymentEligible && !feedItem.formulaGateEligible,
  );

  const problemItem = (trustReport.items ?? []).find((item) => item.slug === PROBLEM_SLUG);
  boundary.problemSlugLocked = Boolean(
    problemItem && !problemItem.paymentEligible && !problemItem.formulaGateEligible,
  );

  const offAllowlist = (trustReport.items ?? []).filter(
    (item) =>
      !isRevenueEligibleAllowed(item.slug) &&
      (item.paymentEligible || item.formulaGateEligible),
  );
  boundary.allowlistEnforced = offAllowlist.length === 0;

  if (boundary.paymentEligible !== EXPECTED_REVENUE_ELIGIBLE_COUNTS.paymentEligible) {
    addBlocker(`paymentEligible_not_22:${boundary.paymentEligible}`);
  }
  if (boundary.formulaGateEligible !== EXPECTED_REVENUE_ELIGIBLE_COUNTS.formulaGateEligible) {
    addBlocker(`formulaGateEligible_not_22:${boundary.formulaGateEligible}`);
  }
  if (boundary.freePaymentEligible !== EXPECTED_REVENUE_ELIGIBLE_COUNTS.freePaymentEligible) {
    addBlocker(`free_payment_eligible_not_zero:${boundary.freePaymentEligible}`);
  }
  if (!boundary.feedEfficiencyBlocked) {
    addBlocker(`feed_efficiency_not_blocked:${FEED_LEAK_SLUG}`);
  }
  if (!boundary.problemSlugLocked) {
    addBlocker(`problem_slug_not_locked:${PROBLEM_SLUG}`);
  }
  if (!boundary.allowlistEnforced) {
    addBlocker(`allowlist_violation:${offAllowlist.map((item) => item.slug).join(",")}`);
  }

  return boundary;
}

function readGateReferences() {
  const p4 = readJson("scripts/.cache/p4-deploy-guard-report.json");
  const s6 = readJson("scripts/.cache/s6-final-sprint-readiness-report.json");
  const revenueAssert = runCommand("npm run assert:revenue-gate");

  if (!revenueAssert.ok) {
    addBlocker(`assert_revenue_gate_fail:${revenueAssert.detail}`);
  }

  let p4Verdict = p4?.verdict ?? "MISSING";
  if (p4Verdict !== "GO" && p4) {
    const nonTreeBlockers = (p4.blockers ?? []).filter(
      (blocker) => !String(blocker).startsWith("git_working_tree_clean"),
    );
    if (nonTreeBlockers.length === 0) {
      p4Verdict = "GO";
    }
  }

  const s6Status = s6?.status ?? "MISSING";

  if (p4Verdict !== "GO") {
    addBlocker(`p4_deploy_guard_not_go:${p4Verdict}`);
  }
  if (s6Status !== "DEPLOY_READY_BUT_NOT_DEPLOYED") {
    addBlocker(`s6_not_deploy_ready:${s6Status}`);
  }

  return {
    revenueGateAssert: revenueAssert.ok ? "PASS" : "FAIL",
    p4DeployGuard: p4Verdict,
    s6Readiness: s6Status,
  };
}

function buildManualChecklistRoutes() {
  return [
    "/tr",
    "/tr/free-tools",
    "/tr/premium-tools",
    "/tr/tools/free/machine-time-calculator",
    "/tr/tools/free/project-cost-calculator",
    "/tr/tools/free/cleaning-cost-calculator",
    "/tr/tools/premium-schema/cnc-oee-loss",
    PROBLEM_SLUG_ROUTE,
    "/tr/pricing",
    "/tr/account",
  ];
}

function renderMarkdownReport(report) {
  const routeTableRows = CRITICAL_ROUTES.map(
    (route) => `| \`${route}\` | ☐ | ☐ | ☐ | ☐ | |`,
  ).join("\n");

  const revenueRows = [
    ["paymentEligible count", "22", String(report.revenueBoundary.paymentEligible ?? "n/a")],
    ["formulaGateEligible count", "22", String(report.revenueBoundary.formulaGateEligible ?? "n/a")],
    ["freePaymentEligible", "0", String(report.revenueBoundary.freePaymentEligible ?? "n/a")],
    ["feed-efficiency-analyzer", "blocked", report.revenueBoundary.feedEfficiencyBlocked ? "blocked" : "OPEN"],
    [PROBLEM_SLUG, "locked", report.revenueBoundary.problemSlugLocked ? "locked" : "OPEN"],
  ]
    .map(([check, expected, result]) => `| ${check} | ${expected} | ${result} |`)
    .join("\n");

  const manualRoutes = buildManualChecklistRoutes()
    .map((route) => `* \`${route}\``)
    .join("\n");

  const blockerLines =
    report.blockers.length === 0 ? ["* none"] : report.blockers.map((b) => `* ${b}`);

  const localSmokeSummary = report.baseUrl
    ? report.routeChecks.every((check) => check.ok)
      ? "automated fetch PASS (manual browser QA still required)"
      : "automated fetch FAIL — see blockers"
    : "skipped — set SECTORCALC_QA_BASE_URL for fetch smoke";

  const problemSlugScanNote =
    report.routeChecks.find((check) => check.route === PROBLEM_SLUG_ROUTE)?.problemSlugScan ??
    null;

  return [
    "# P5 Manual UI QA Report",
    "",
    "## Summary",
    "",
    `* Status: \`${report.status}\``,
    "* Deploy executed: no",
    `* Base URL: ${report.baseUrl || "not set"}`,
    `* Local smoke: ${localSmokeSummary}`,
    `* Revenue boundary: payment=${report.revenueBoundary.paymentEligible} formulaGate=${report.revenueBoundary.formulaGateEligible} freePayment=${report.revenueBoundary.freePaymentEligible}`,
    `* Blockers: ${report.blockers.length === 0 ? "none" : report.blockers.join("; ")}`,
    "",
    "## Gate References",
    "",
    `* assert:revenue-gate: ${report.gates.revenueGateAssert}`,
    `* P4 deploy guard: ${report.gates.p4DeployGuard}`,
    `* S6 readiness: ${report.gates.s6Readiness}`,
    "",
    "## Critical Route Checklist",
    "",
    "| Route | Desktop | Mobile | Console | Network | Notes |",
    "| --- | --- | --- | --- | --- | --- |",
    routeTableRows,
    "",
    "## Revenue/Lock Checklist",
    "",
    "| Check | Expected | Result |",
    "| --- | --- | --- |",
    revenueRows,
    "",
    "## Problem Slug Fetch Scan",
    "",
    problemSlugScanNote
      ? `* paymentUnlockClaimDetected: ${problemSlugScanNote.paymentUnlockClaimDetected}\n* hasSafeState: ${problemSlugScanNote.hasSafeState}\n* findings: ${problemSlugScanNote.findings.length === 0 ? "none" : problemSlugScanNote.findings.join(", ")}`
      : "* not run — no SECTORCALC_QA_BASE_URL",
    "",
    "## Manual Browser QA",
    "",
    "Desktop:",
    "",
    manualRoutes,
    "",
    "Mobile:",
    "",
    "* Same route set",
    "* Check overflow",
    "* Check header",
    "* Check cards",
    "* Check form fields",
    "* Check CTA buttons",
    "",
    "Console:",
    "",
    "* No red runtime errors",
    "",
    "Network:",
    "",
    "* No 404",
    "* No 500",
    "* No failed critical JS/CSS",
    "",
    "## Deploy Decision",
    "",
    "* Manual UI QA: PENDING",
    "* Deploy approval: NO until user explicitly approves",
    "",
    "## Blockers",
    "",
    ...blockerLines,
    "",
    `_Generated at ${report.generatedAt}_`,
    "",
  ].join("\n");
}

function resolveStatus(baseUrl, routeChecks) {
  if (blockers.length > 0) {
    return "NO_GO";
  }
  if (!baseUrl) {
    return "MANUAL_QA_REQUIRED";
  }
  const allOk = routeChecks.length > 0 && routeChecks.every((check) => check.ok);
  return allOk ? "LOCAL_SMOKE_PASS" : "NO_GO";
}

async function main() {
  console.log("=== audit:p5-manual-ui-smoke ===\n");

  const commits = checkCommitChain();
  const repo = checkWorkingTree();
  const revenueBoundary = checkRevenueBoundary();
  const gates = readGateReferences();

  const baseUrl = process.env.SECTORCALC_QA_BASE_URL?.trim() || "";
  let routeChecks = [];

  if (baseUrl) {
    console.log(`fetch smoke: ${baseUrl}`);
    routeChecks = await runFetchSmoke(baseUrl);
    const passCount = routeChecks.filter((check) => check.ok).length;
    console.log(`route checks: ${passCount}/${routeChecks.length} pass`);
  } else {
    console.log("fetch smoke: skipped (SECTORCALC_QA_BASE_URL not set)");
    for (const route of CRITICAL_ROUTES) {
      routeChecks.push({
        route,
        url: null,
        status: null,
        ok: null,
        emptyBody: null,
        error: null,
        problemSlugScan: null,
        skipped: true,
      });
    }
  }

  const status = resolveStatus(baseUrl, routeChecks);

  const report = {
    generatedAt: new Date().toISOString(),
    phase: "P5_manual_ui_qa",
    deployExecuted: false,
    status,
    baseUrl: baseUrl || null,
    commitChain: Object.fromEntries(
      Object.entries(commits).map(([key, commit]) => [key, commit?.hash ?? null]),
    ),
    repo: {
      workingTreeClean: repo.workingTreeClean,
      dirtyEntries: repo.dirtyEntries,
    },
    gates,
    routeChecks,
    revenueBoundary,
    manualChecklist: {
      desktopRequired: true,
      mobileRequired: true,
      consoleRequired: true,
      networkRequired: true,
      routes: buildManualChecklistRoutes(),
    },
    blockers,
    nextStep: "Manual UI QA before deploy",
  };

  fs.mkdirSync(path.dirname(REPORT_JSON_PATH), { recursive: true });
  fs.writeFileSync(REPORT_JSON_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(REPORT_MD_PATH, `${renderMarkdownReport(report)}\n`, "utf8");

  console.log(`status: ${status}`);
  console.log(`deployExecuted: false`);
  console.log(`baseUrl: ${baseUrl || "not set"}`);
  console.log(`blockers: ${blockers.length}`);
  console.log(`output: ${path.relative(ROOT, REPORT_JSON_PATH)}`);
  console.log(`markdown: ${path.relative(ROOT, REPORT_MD_PATH)}`);

  console.log("\nCommit chain:");
  for (const { key } of COMMIT_PATTERNS) {
    const hash = commits[key]?.hash ?? "missing";
    const ok = Boolean(commits[key]);
    console.log(` ${ok ? "✓" : "✗"} ${key}: ${hash}`);
  }

  console.log("\nRevenue boundary:");
  console.log(` paymentEligible: ${revenueBoundary.paymentEligible}`);
  console.log(` formulaGateEligible: ${revenueBoundary.formulaGateEligible}`);
  console.log(` freePaymentEligible: ${revenueBoundary.freePaymentEligible}`);
  console.log(` feedEfficiencyBlocked: ${revenueBoundary.feedEfficiencyBlocked}`);
  console.log(` problemSlugLocked: ${revenueBoundary.problemSlugLocked}`);

  if (blockers.length > 0) {
    console.error("\nBlockers:");
    for (const blocker of blockers) {
      console.error(` - ${blocker}`);
    }
    process.exit(1);
  }

  console.log(`\naudit:p5-manual-ui-smoke ${status}`);
}

main();
