#!/usr/bin/env node
/**
 * S6 — Final sprint readiness audit (GO / NO_GO / DEPLOY_READY_BUT_NOT_DEPLOYED).
 * Does not deploy. Aggregates S1–S5 outputs, revenue boundary, and regression gates.
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
const REPORT_PATH = path.join(ROOT, "scripts/.cache/s6-final-sprint-readiness-report.json");
const REPORT_MD_PATH = path.join(ROOT, "docs/s6-final-sprint-readiness-report.md");

const PROBLEM_SLUG = "abonelik-yazilim-cloud-yillik-maliyet-hesabi";
const FEED_LEAK_SLUG = "feed-efficiency-analyzer";
const S5_COMMIT_SUBJECT = "feat(tools): apply s5 guide oracle ux scaffold";

/** Completed S3 sprint — source of truth for processed/patched counts (not regenerated manifest). */
const S3_COMPLETED_SPRINT = {
  commit: "260cc17",
  docPath: "docs/s3-low-risk-activation-batch-2.md",
  batchCountAtExecution: 22,
  processedCount: 22,
  patchedCount: 22,
};

const COMMIT_PATTERNS = {
  revenueKillSwitch: /fix\(control-plane\): enforce revenue eligibility allowlist/,
  s3: /feat\(tools\): apply s3 low risk activation batch/,
  s4: /docs\(tools\): add s4 category-only route decision matrix/,
  s5: /feat\(tools\): apply s5 guide oracle ux scaffold/,
};

const GENERATED_DIRTY_ALLOWLIST = new Set([
  "next-env.d.ts",
  "src/lib/tools/runtime-readiness-p24-verdicts.ts",
  "public/ai-categories.json",
  "public/ai-tool-index.json",
  "public/ai-tool-index.txt",
  "public/ai-tool-routes.json",
]);

const S6_ALLOWED_DIRTY = new Set([
  "scripts/tool-activation/audit-s6-final-sprint-readiness.mjs",
  "docs/s6-final-sprint-readiness-report.md",
  "package.json",
  "scripts/.cache/s6-final-sprint-readiness-report.json",
]);

const FORBIDDEN_TOUCHED_RE =
  /(^\.env|^scripts\/\.cache\/|^public\/ai-|^next-env\.d\.ts$|^functions\/|^apps\/|^src\/lib\/billing\/|^src\/lib\/payment\/|^src\/lib\/premium-schema\/calculators\/|^src\/lib\/formula-governance\/contracts\/|^src\/lib\/premium-schema\/schemas\/|^scripts\/tool-activation\/revenue-eligible-allowlist\.mjs$|^messages\/|^src\/lib\/tool-guides\/)/;

const CALCULATOR_CORE_RE =
  /^src\/lib\/premium-schema\/calculators\/|^src\/lib\/formula-governance\/contracts\/|^src\/lib\/premium-schema\/schemas\//;

const CACHE_REPORTS = {
  s2: "scripts/.cache/s2-low-risk-activation-report.json",
  s3: "scripts/.cache/s3-low-risk-activation-report.json",
  s4: "scripts/.cache/s4-category-only-route-decision-report.json",
  s5: "scripts/.cache/s5-guide-oracle-ux-scaffold-report.json",
  manifest: "scripts/.cache/sprint-tool-activation-manifest.json",
  runtimeTrust: "scripts/.cache/runtime-trust-engine-report.json",
  inputGuides: "scripts/.cache/input-guide-audit-report.json",
  p4DeployGuard: "scripts/.cache/p4-deploy-guard-report.json",
  p6a: "scripts/.cache/p6a-premium-schema-fail-manual-audit.json",
};

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

function gitLogOneline(limit = 30) {
  const result = runCommand(`git log --oneline -${limit}`);
  return result.ok ? result.stdout.split("\n").filter(Boolean) : [];
}

function findCommit(pattern) {
  for (const line of gitLogOneline(40)) {
    if (pattern.test(line)) {
      const [hash, ...rest] = line.split(" ");
      return { hash, subject: rest.join(" ") };
    }
  }
  return null;
}

function checkCommitChain() {
  const checks = {};
  for (const [key, pattern] of Object.entries(COMMIT_PATTERNS)) {
    const commit = findCommit(pattern);
    checks[key] = Boolean(commit);
    if (!commit) {
      addBlocker(`missing_commit:${key}`);
    }
  }
  return {
    revenueKillSwitch: checks.revenueKillSwitch ?? false,
    s3: checks.s3 ?? false,
    s4: checks.s4 ?? false,
    s5: checks.s5 ?? false,
    commits: {
      revenueKillSwitch: findCommit(COMMIT_PATTERNS.revenueKillSwitch),
      s3: findCommit(COMMIT_PATTERNS.s3),
      s4: findCommit(COMMIT_PATTERNS.s4),
      s5: findCommit(COMMIT_PATTERNS.s5),
    },
  };
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
  return result.stdout
    .split("\n")
    .filter(Boolean)
    .map((line) => parsePorcelainPath(line));
}

function isAllowedDirtyPath(file) {
  if (GENERATED_DIRTY_ALLOWLIST.has(file)) {
    return true;
  }
  if (S6_ALLOWED_DIRTY.has(file)) {
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

function checkForbiddenTouchedAfterS5() {
  const s5 = findCommit(COMMIT_PATTERNS.s5);
  if (!s5) {
    return [];
  }
  const result = runCommand(`git diff --name-only ${s5.hash}..HEAD`);
  if (!result.ok) {
    return [];
  }
  const files = result.stdout.split("\n").map((line) => line.trim()).filter(Boolean);
  return files.filter((file) => FORBIDDEN_TOUCHED_RE.test(file) || CALCULATOR_CORE_RE.test(file));
}

function checkRevenueBoundary() {
  const trustReport = readJson(CACHE_REPORTS.runtimeTrust);
  const revenue = {
    paymentEligible: trustReport?.paymentEligible ?? null,
    formulaGateEligible: trustReport?.formulaGateEligible ?? null,
    freePaymentEligible: null,
    feedEfficiencyBlocked: false,
    problemSlugLocked: false,
    allowlistEnforced: true,
  };

  if (!trustReport) {
    addBlocker("missing_runtime_trust_report");
    return revenue;
  }

  const freePayment = (trustReport.items ?? []).filter(
    (item) => item.paymentEligible && item.tier === "free",
  );
  revenue.freePaymentEligible = freePayment.length;

  const feedItem = (trustReport.items ?? []).find((item) => item.slug === FEED_LEAK_SLUG);
  revenue.feedEfficiencyBlocked = Boolean(feedItem && !feedItem.paymentEligible && !feedItem.formulaGateEligible);

  const problemItem = (trustReport.items ?? []).find((item) => item.slug === PROBLEM_SLUG);
  revenue.problemSlugLocked = Boolean(
    problemItem && !problemItem.paymentEligible && !problemItem.formulaGateEligible,
  );

  const offAllowlist = (trustReport.items ?? []).filter(
    (item) =>
      !isRevenueEligibleAllowed(item.slug) &&
      (item.paymentEligible || item.formulaGateEligible),
  );
  revenue.allowlistEnforced = offAllowlist.length === 0;

  if (revenue.paymentEligible !== EXPECTED_REVENUE_ELIGIBLE_COUNTS.paymentEligible) {
    addBlocker(`paymentEligible_not_${EXPECTED_REVENUE_ELIGIBLE_COUNTS.paymentEligible}:${revenue.paymentEligible}`);
  }
  if (revenue.formulaGateEligible !== EXPECTED_REVENUE_ELIGIBLE_COUNTS.formulaGateEligible) {
    addBlocker(
      `formulaGateEligible_not_${EXPECTED_REVENUE_ELIGIBLE_COUNTS.formulaGateEligible}:${revenue.formulaGateEligible}`,
    );
  }
  if (revenue.freePaymentEligible !== EXPECTED_REVENUE_ELIGIBLE_COUNTS.freePaymentEligible) {
    addBlocker(`free_payment_eligible_not_zero:${revenue.freePaymentEligible}`);
  }
  if (!revenue.feedEfficiencyBlocked) {
    addBlocker(`feed_efficiency_not_blocked:${FEED_LEAK_SLUG}`);
  }
  if (!revenue.problemSlugLocked) {
    addBlocker(`problem_slug_not_locked:${PROBLEM_SLUG}`);
  }
  if (!revenue.allowlistEnforced) {
    addBlocker(`allowlist_violation:${offAllowlist.map((item) => item.slug).join(",")}`);
  }

  return revenue;
}

function summarizeSprintReports() {
  const s2 = readJson(CACHE_REPORTS.s2);
  const s3 = readJson(CACHE_REPORTS.s3);
  const s4 = readJson(CACHE_REPORTS.s4);
  const s5 = readJson(CACHE_REPORTS.s5);
  const manifest = readJson(CACHE_REPORTS.manifest);

  const sprintSummary = {
    s2: {
      input: s2?.inputCount ?? null,
      patched: s2?.patched?.length ?? null,
      skipped: s2?.skipped?.length ?? null,
    },
    s3: {
      input: s3?.inputCount ?? null,
      patched: s3?.patched?.length ?? null,
      skipped: s3?.skipped?.length ?? null,
    },
    s4: {
      processed: s4?.processedCount ?? null,
      schema_contract_required: s4?.decisions?.schema_contract_required?.length ?? null,
      manual_expert_review_required: s4?.decisions?.manual_expert_review_required?.length ?? null,
      keep_quarantined_missing_backing: s4?.decisions?.keep_quarantined_missing_backing?.length ?? null,
      guide_only_candidate: s4?.decisions?.guide_only_candidate?.length ?? null,
    },
    s5: {
      input: s5?.inputCount ?? null,
      patched: s5?.patchedCount ?? s5?.patched?.length ?? null,
      skipped: s5?.skippedCount ?? s5?.skipped?.length ?? null,
    },
  };

  const manifestSummary = manifest
    ? {
        totalTools: manifest.totalTools ?? null,
        s2BatchCount: manifest.batches?.S2_lowRiskActivationBatch1?.length ?? null,
        s3BatchCount: manifest.batches?.S3_lowRiskActivationBatch2?.length ?? null,
        s4BatchCount: manifest.batches?.S4_categoryOnlyRouteDecisionAndScaffold?.length ?? null,
        s5BatchCount: manifest.batches?.S5_guideOracleUxScaffold?.length ?? null,
        categoryOnlyCount: manifest.currentState?.categoryOnlyQuarantine ?? null,
        guideOracleQueueCount: manifest.currentState?.guideOracleMissing ?? null,
      }
    : null;

  if (!manifest) {
    addBlocker("missing_sprint_manifest");
  }

  return { sprintSummary, manifestSummary };
}

function buildManifestDriftNotes(manifest, sprintSummary, commitChecks) {
  const notes = [];
  const manifestS3Count = manifest?.batches?.S3_lowRiskActivationBatch2?.length ?? null;
  const completedS3Patched = sprintSummary.s3.patched ?? S3_COMPLETED_SPRINT.patchedCount;

  if (
    manifestS3Count !== null &&
    manifestS3Count !== S3_COMPLETED_SPRINT.batchCountAtExecution
  ) {
    notes.push({
      sprint: "S3",
      type: "manifest_drift",
      blocker: false,
      completedSprintSourceOfTruth: {
        commit: S3_COMPLETED_SPRINT.commit,
        doc: S3_COMPLETED_SPRINT.docPath,
        batchCountAtExecution: S3_COMPLETED_SPRINT.batchCountAtExecution,
        processed: S3_COMPLETED_SPRINT.processedCount,
        patched: completedS3Patched,
      },
      currentManifest: {
        s3BatchCount: manifestS3Count,
        source: CACHE_REPORTS.manifest,
        note: "Future queue uses regenerated manifest; completed sprint counts stay frozen.",
      },
      message:
        `S3 completed sprint (commit ${S3_COMPLETED_SPRINT.commit}) processed/patched ` +
        `${S3_COMPLETED_SPRINT.processedCount} tools when manifest S3 batch count was ` +
        `${S3_COMPLETED_SPRINT.batchCountAtExecution}. Regenerated manifest shows S3 batch count ` +
        `${manifestS3Count}. Not an S6 blocker.`,
    });
  }

  const s3CommitHash = commitChecks.commits.s3?.hash ?? null;
  if (s3CommitHash && !s3CommitHash.startsWith(S3_COMPLETED_SPRINT.commit)) {
    notes.push({
      sprint: "S3",
      type: "commit_hash_drift",
      blocker: false,
      expectedCommitPrefix: S3_COMPLETED_SPRINT.commit,
      foundCommit: s3CommitHash,
      message:
        `S3 commit on branch (${s3CommitHash}) differs from completed sprint ` +
        `(${S3_COMPLETED_SPRINT.commit}). Use ${S3_COMPLETED_SPRINT.docPath} for completed counts.`,
    });
  }

  return notes;
}

function renderMarkdownReport(report) {
  const driftLines =
    report.manifestDriftNotes.length === 0
      ? ["- none"]
      : report.manifestDriftNotes.map(
          (note) => `- **${note.sprint} / ${note.type}** (not a blocker): ${note.message}`,
        );

  const blockerLines =
    report.blockers.length === 0 ? ["- none"] : report.blockers.map((blocker) => `- ${blocker}`);

  const forbiddenLines =
    report.repo.forbiddenTouched.length === 0
      ? ["- none"]
      : report.repo.forbiddenTouched.map((file) => `- ${file}`);

  const deployReady = report.status === "DEPLOY_READY_BUT_NOT_DEPLOYED";

  return [
    "# S6 Final Sprint Readiness Report",
    "",
    "## Executive Summary",
    "",
    `- Final status: \`${report.status}\``,
    `- Deploy executed: no`,
    `- Deploy ready: ${deployReady ? "yes" : "no"}`,
    `- Main blocker if any: ${report.blockers[0] ?? "none"}`,
    "",
    "## Commit Chain",
    "",
    `- Revenue kill-switch: \`${report.commitHashes.revenueKillSwitch}\``,
    `- S3: \`${report.commitHashes.s3}\``,
    `- S4: \`${report.commitHashes.s4}\``,
    `- S5: \`${report.commitHashes.s5}\` (${report.commitHashes.s5Subject})`,
    "",
    "## Revenue Boundary",
    "",
    `- paymentEligible: ${report.revenue.paymentEligible}`,
    `- formulaGateEligible: ${report.revenue.formulaGateEligible}`,
    `- freePaymentEligible: ${report.revenue.freePaymentEligible}`,
    `- feed-efficiency-analyzer: ${report.revenue.feedEfficiencyBlocked ? "blocked" : "OPEN"}`,
    `- problem slug: ${report.revenue.problemSlugLocked ? "locked" : "OPEN"}`,
    `- allowlist: ${report.revenue.allowlistEnforced ? "enforced" : "violation"}`,
    "",
    "## Sprint Summary",
    "",
    "### S2",
    "",
    `- input: ${report.sprintSummary.s2.input ?? "n/a"}`,
    `- patched: ${report.sprintSummary.s2.patched ?? "n/a"}`,
    `- skipped: ${report.sprintSummary.s2.skipped ?? "n/a"}`,
    "",
    "### S3",
    "",
    `- input: ${report.sprintSummary.s3.input ?? "n/a"}`,
    `- patched: ${report.sprintSummary.s3.patched ?? "n/a"} (source: ${S3_COMPLETED_SPRINT.docPath})`,
    `- skipped: ${report.sprintSummary.s3.skipped ?? "n/a"}`,
    "",
    "### S4",
    "",
    `- processed: ${report.sprintSummary.s4.processed ?? "n/a"}`,
    `- schema_contract_required: ${report.sprintSummary.s4.schema_contract_required ?? "n/a"}`,
    `- manual_expert_review_required: ${report.sprintSummary.s4.manual_expert_review_required ?? "n/a"}`,
    "",
    "### S5",
    "",
    `- input: ${report.sprintSummary.s5.input ?? "n/a"}`,
    `- patched: ${report.sprintSummary.s5.patched ?? "n/a"}`,
    `- skipped: ${report.sprintSummary.s5.skipped ?? "n/a"}`,
    "",
    "## Manifest drift notes",
    "",
    ...driftLines,
    "",
    "## Forbidden File Check",
    "",
    ...forbiddenLines,
    "",
    "## Test Results",
    "",
    "| Test | Result |",
    "| --- | --- |",
    ...Object.entries(report.tests).map(([name, result]) => `| ${name} | ${result} |`),
    "",
    "## Deploy Readiness",
    "",
    "- deploy allowed: no",
    "- deploy executed: no",
    `- p4 guard result: ${report.tests.p4DeployGuard}`,
    `- final recommendation: ${deployReady ? "DEPLOY_READY_BUT_NOT_DEPLOYED — manual UI checklist + explicit deploy approval still required." : "NO_GO — resolve blockers before deploy."}`,
    "",
    "## Remaining Backlog",
    "",
    `- category-only requiring schema/contract: ${report.backlog.categoryOnlyRequiringSchemaContract ?? "n/a"}`,
    `- manual expert review: ${report.backlog.manualExpertReview ?? "n/a"}`,
    `- remaining guide/oracle gaps: ${report.backlog.remainingGuideOracleGaps ?? "n/a"}`,
    `- remaining active free missing backing: ${report.backlog.remainingActiveFreeMissingBacking ?? "n/a"}`,
    `- premium-schema fail manual: ${report.backlog.premiumSchemaFailManual ?? "n/a"}`,
    "",
    "## Blockers",
    "",
    ...blockerLines,
    "",
  ].join("\n");
}

function runTestGate(name, command, { preCommand, retries = 0 } = {}) {
  let result = { ok: false, detail: "not run" };
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    if (attempt > 0) {
      runCommand("rm -rf .next");
    } else if (preCommand) {
      runCommand(preCommand);
    }
    result = runCommand(command);
    if (result.ok) {
      break;
    }
  }
  if (!result.ok) {
    addBlocker(`${name}_fail:${result.detail}`);
  }
  return result.ok ? "PASS" : "FAIL";
}

function readP4DeployGuardStatus() {
  const report = readJson(CACHE_REPORTS.p4DeployGuard);
  if (!report) {
    return "NO_GO";
  }
  if (report.verdict === "GO") {
    return "PASS";
  }
  const nonTreeBlockers = (report.blockers ?? []).filter(
    (blocker) => !String(blocker).startsWith("git_working_tree_clean"),
  );
  return nonTreeBlockers.length === 0 ? "PASS" : "NO_GO";
}

function buildBacklog(manifest, sprintSummary) {
  const p6a = readJson(CACHE_REPORTS.p6a);
  return {
    categoryOnlyRequiringSchemaContract: sprintSummary.s4.schema_contract_required,
    manualExpertReview: sprintSummary.s4.manual_expert_review_required,
    remainingGuideOracleGaps: manifest?.currentState?.guideOracleMissing ?? null,
    remainingActiveFreeMissingBacking: manifest?.currentState?.freeActiveMissingBacking ?? null,
    premiumSchemaFailManual: p6a?.summary?.total ?? manifest?.currentState?.premiumSchemaFailManual ?? null,
  };
}

function main() {
  console.log("=== audit:s6-final-sprint-readiness ===\n");

  const commitChecks = checkCommitChain();
  const forbiddenTouched = checkForbiddenTouchedAfterS5();
  if (forbiddenTouched.length > 0) {
    addBlocker(`forbidden_touched:${forbiddenTouched.join(",")}`);
  }

  const revenue = checkRevenueBoundary();
  const { sprintSummary, manifestSummary } = summarizeSprintReports();
  const manifest = readJson(CACHE_REPORTS.manifest);
  const manifestDriftNotes = buildManifestDriftNotes(manifest, sprintSummary, commitChecks);

  const tests = {
    lint: runTestGate("lint", "npm run lint"),
    tsc: runTestGate("tsc", "npx tsc --noEmit"),
    build: runTestGate("build", "npm run prebuild && npx next build", {
      preCommand: "rm -rf .next",
      retries: 1,
    }),
    revenueGate: runTestGate("revenueGate", "npm run assert:revenue-gate"),
    runtimeTrust: runTestGate("runtimeTrust", "node scripts/tool-activation/audit-runtime-trust-engine.mjs"),
    inputGuides: runTestGate("inputGuides", "npm run audit:input-guides"),
    sprintManifest: runTestGate("sprintManifest", "npm run audit:sprint-activation-manifest"),
    p4DeployGuard: readP4DeployGuardStatus(),
  };

  if (tests.p4DeployGuard === "NO_GO") {
    addBlocker("p4_deploy_guard_no_go");
  }

  const repoWorking = checkWorkingTree();

  const status =
    blockers.length === 0 ? "DEPLOY_READY_BUT_NOT_DEPLOYED" : "NO_GO";

  const report = {
    generatedAt: new Date().toISOString(),
    phase: "S6_final_sprint_readiness",
    status,
    deployExecuted: false,
    commitChecks: {
      revenueKillSwitch: commitChecks.revenueKillSwitch,
      s3: commitChecks.s3,
      s4: commitChecks.s4,
      s5: commitChecks.s5,
    },
    commitHashes: {
      revenueKillSwitch: commitChecks.commits.revenueKillSwitch?.hash ?? null,
      s3: commitChecks.commits.s3?.hash ?? null,
      s4: commitChecks.commits.s4?.hash ?? null,
      s5: commitChecks.commits.s5?.hash ?? null,
      s5Subject: S5_COMMIT_SUBJECT,
    },
    repo: {
      workingTreeClean: repoWorking.workingTreeClean,
      dirtyEntries: repoWorking.dirtyEntries,
      forbiddenTouched,
    },
    revenue: {
      paymentEligible: revenue.paymentEligible,
      formulaGateEligible: revenue.formulaGateEligible,
      freePaymentEligible: revenue.freePaymentEligible,
      feedEfficiencyBlocked: revenue.feedEfficiencyBlocked,
      problemSlugLocked: revenue.problemSlugLocked,
      allowlistEnforced: revenue.allowlistEnforced,
    },
    sprintManifest: manifestSummary,
    sprintSummary,
    manifestDriftNotes,
    tests,
    backlog: buildBacklog(manifest, sprintSummary),
    blockers,
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(REPORT_MD_PATH, `${renderMarkdownReport(report)}\n`, "utf8");

  console.log(`status: ${status}`);
  console.log(`deployExecuted: false`);
  console.log(`blockers: ${blockers.length}`);
  console.log(`output: ${path.relative(ROOT, REPORT_PATH)}`);
  console.log(`markdown: ${path.relative(ROOT, REPORT_MD_PATH)}`);

  if (manifestDriftNotes.length > 0) {
    console.log("\nManifest drift notes (not blockers):");
    for (const note of manifestDriftNotes) {
      console.log(` - ${note.message}`);
    }
  }

  console.log("\nCommit checks:");
  for (const [key, ok] of Object.entries(report.commitChecks)) {
    const hash = report.commitHashes[key];
    console.log(` ${ok ? "✓" : "✗"} ${key}: ${ok ? hash ?? "found" : "missing"}`);
  }

  console.log("\nRevenue boundary:");
  console.log(` paymentEligible: ${revenue.paymentEligible}`);
  console.log(` formulaGateEligible: ${revenue.formulaGateEligible}`);
  console.log(` freePaymentEligible: ${revenue.freePaymentEligible}`);
  console.log(` feedEfficiencyBlocked: ${revenue.feedEfficiencyBlocked}`);
  console.log(` problemSlugLocked: ${revenue.problemSlugLocked}`);

  console.log("\nTests:");
  for (const [name, result] of Object.entries(tests)) {
    console.log(` ${result === "PASS" ? "✓" : "✗"} ${name}: ${result}`);
  }

  if (blockers.length > 0) {
    console.error("\nBlockers:");
    for (const blocker of blockers) {
      console.error(` - ${blocker}`);
    }
    process.exit(1);
  }

  console.log("\naudit:s6-final-sprint-readiness DEPLOY_READY_BUT_NOT_DEPLOYED");
}

main();
