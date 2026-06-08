#!/usr/bin/env npx tsx
/**
 * Autonomous release gate check — runs CI gates (or reads env), outputs JSON proof.
 * Does not trigger deploy commands.
 */

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

import { runDualIntelligenceRuntimeCoverageAudit } from "@/lib/formula-governance/dual-intelligence-runtime-coverage/dual-intelligence-runtime-coverage-audit";
import {
  computeReleaseProofScore,
  createReleaseGate,
  evaluateChangedFilesAllowlist,
  parseGateStatusFromEnv,
  parseReleaseProofThresholdsFromEnv,
} from "@/lib/release/release-proof-score";
import type {
  ReleaseCoverageMetrics,
  ReleaseGateResult,
  ReleaseGateStatus,
  ReleaseProofResult,
} from "@/lib/release/release-proof-types";

const LOCALE_PREFIX = process.env.RELEASE_GATE_LOCALE ?? "en";
const BASE_URL = process.env.RELEASE_GATE_BASE_URL ?? process.env.CATALOG_QA_BASE_URL;

function runGit(command: string): string {
  try {
    return execSync(command, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  } catch {
    return "";
  }
}

function resolveCommitSha(): string | undefined {
  const fromEnv = process.env.RELEASE_GATE_COMMIT_SHA?.trim();
  if (fromEnv) {
    return fromEnv;
  }
  const sha = runGit("git rev-parse --short HEAD");
  return sha || undefined;
}

function listChangedFiles(): string[] {
  const staged = runGit("git diff --cached --name-only");
  const unstaged = runGit("git diff --name-only");
  const untracked = runGit("git ls-files --others --exclude-standard");
  return [...new Set([...staged.split("\n"), ...unstaged.split("\n"), ...untracked.split("\n")].filter(Boolean))];
}

function parseAllowlist(raw: string | undefined): string[] {
  if (!raw?.trim()) {
    return [];
  }
  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function runCommandGate(command: string, label: string): ReleaseGateStatus {
  try {
    execSync(command, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      env: process.env,
    });
    return "PASS";
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`${label} failed: ${message}`);
    return "FAIL";
  }
}

function resolveGateStatus(
  envKey: string,
  run: () => ReleaseGateStatus,
  skipEnvKey?: string,
): ReleaseGateStatus {
  const fromEnv = parseGateStatusFromEnv(process.env, envKey);
  if (fromEnv) {
    return fromEnv;
  }
  if (skipEnvKey && process.env[skipEnvKey] === "1") {
    return "SKIP";
  }
  if (process.env.RELEASE_GATE_FROM_ENV === "1") {
    return "SKIP";
  }
  return run();
}

function buildExecGates(): ReleaseGateResult[] {
  const lintStatus = resolveGateStatus("RELEASE_GATE_LINT", () => runCommandGate("npm run lint", "lint"));
  const testStatus = resolveGateStatus("RELEASE_GATE_TEST_FORMULAS", () =>
    runCommandGate("npm run test:formulas", "test:formulas"),
  );
  const buildStatus = resolveGateStatus("RELEASE_GATE_BUILD", () =>
    runCommandGate("npm run build", "build"),
  );
  const auditStatus = resolveGateStatus("RELEASE_GATE_AUDIT_COVERAGE", () =>
    runCommandGate("npm run audit:dual-intelligence-runtime-coverage", "audit coverage"),
  );
  const secretsStatus = resolveGateStatus("RELEASE_GATE_CHECK_SECRETS", () =>
    runCommandGate("npm run check:secrets", "check:secrets"),
  );

  return [
    createReleaseGate("lint", lintStatus),
    createReleaseGate("test_formulas", testStatus),
    createReleaseGate("build", buildStatus),
    createReleaseGate("audit_coverage", auditStatus),
    createReleaseGate("check_secrets", secretsStatus),
  ];
}

function localizedPath(path: string): string {
  if (path.startsWith("/admin")) {
    return path;
  }
  return `/${LOCALE_PREFIX}${path === "/" ? "" : path}`;
}

function hasVisible404(body: string): boolean {
  const normalized = body.toLowerCase();
  if (normalized.includes('data-page-not-found="true"')) {
    return true;
  }
  if (/<h1[^>]*>\s*404\s*<\/h1>/i.test(body)) {
    return true;
  }
  if (normalized.includes("this page could not be found")) {
    return true;
  }
  return false;
}

async function smokeRoute(path: string): Promise<{ ok: boolean; status?: number; error?: string; body?: string }> {
  if (!BASE_URL) {
    return { ok: false, error: "BASE_URL not configured" };
  }

  const url = `${BASE_URL.replace(/\/$/, "")}${path}`;
  try {
    const response = await fetch(url, {
      headers: { Accept: "text/html" },
      redirect: "follow",
    });
    const body = await response.text();
    return {
      ok: response.status === 200,
      status: response.status,
      body,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function readSmokeRoutes(): string[] {
  const fromEnv = process.env.RELEASE_GATE_SMOKE_ROUTES?.trim();
  if (fromEnv) {
    return fromEnv.split(",").map((route) => route.trim()).filter(Boolean);
  }

  return [
    localizedPath("/tools/free/loan-payment-calculator"),
    localizedPath("/tools/free/project-cost-calculator"),
    localizedPath("/tools/premium/welding-bid-risk-analyzer"),
    localizedPath("/pricing"),
  ];
}

async function buildRouteSmokeGate(): Promise<ReleaseGateResult> {
  const fromEnv = parseGateStatusFromEnv(process.env, "RELEASE_GATE_ROUTE_SMOKE");
  if (fromEnv) {
    return createReleaseGate(
      "route_smoke",
      fromEnv,
      "Route smoke status supplied via env.",
      undefined,
      false,
    );
  }

  if (process.env.RELEASE_GATE_SKIP_ROUTE_SMOKE === "1" || process.env.RELEASE_GATE_FROM_ENV === "1") {
    return createReleaseGate(
      "route_smoke",
      "SKIP",
      "Route smoke skipped.",
      undefined,
      false,
    );
  }

  if (!BASE_URL) {
    return createReleaseGate(
      "route_smoke",
      "SKIP",
      "Route smoke skipped — RELEASE_GATE_BASE_URL not set.",
      undefined,
      false,
    );
  }

  const routes = readSmokeRoutes();
  const failures: string[] = [];

  for (const route of routes) {
    const result = await smokeRoute(route);
    if (!result.ok) {
      failures.push(`${route}: ${result.error ?? result.status ?? "failed"}`);
    }
  }

  return createReleaseGate(
    "route_smoke",
    failures.length === 0 ? "PASS" : "FAIL",
    failures.length === 0
      ? `Route smoke passed for ${routes.length} route(s).`
      : failures.join("; "),
    routes.length,
    false,
  );
}

async function buildSsr404Gate(): Promise<ReleaseGateResult> {
  const fromEnv = parseGateStatusFromEnv(process.env, "RELEASE_GATE_SSR_VISIBLE_404");
  if (fromEnv) {
    return createReleaseGate(
      "ssr_visible_404_check",
      fromEnv,
      "SSR 404 status supplied via env.",
      undefined,
      false,
    );
  }

  if (process.env.RELEASE_GATE_SKIP_SSR_404 === "1" || process.env.RELEASE_GATE_FROM_ENV === "1") {
    return createReleaseGate(
      "ssr_visible_404_check",
      "SKIP",
      "SSR 404 check skipped.",
      undefined,
      false,
    );
  }

  if (!BASE_URL) {
    return createReleaseGate(
      "ssr_visible_404_check",
      "SKIP",
      "SSR 404 check skipped — RELEASE_GATE_BASE_URL not set.",
      undefined,
      false,
    );
  }

  const routes = readSmokeRoutes();
  const failures: string[] = [];

  for (const route of routes) {
    const result = await smokeRoute(route);
    if (!result.body) {
      failures.push(`${route}: empty body`);
      continue;
    }
    if (hasVisible404(result.body)) {
      failures.push(`${route}: visible 404 markers detected`);
    }
  }

  return createReleaseGate(
    "ssr_visible_404_check",
    failures.length === 0 ? "PASS" : "FAIL",
    failures.length === 0
      ? `No visible 404 markers on ${routes.length} route(s).`
      : failures.join("; "),
    routes.length,
    false,
  );
}

function buildCoverageMetrics(): ReleaseCoverageMetrics {
  const coverage = runDualIntelligenceRuntimeCoverageAudit();
  return {
    formulaContractCount: coverage.totalContracts,
    fullLoopRuntimeCount: coverage.fullLoopRuntimeCount,
    auditPipelineCount: coverage.auditPipelineOnly,
    stagedCalculationBridge: coverage.stagedCalculationBridge,
    governedBuildtimeOnly: coverage.governedBuildtimeOnly,
  };
}

function readInputFromFile(path: string): ReleaseProofResult {
  const raw = readFileSync(path, "utf8");
  const parsed = JSON.parse(raw) as ReleaseProofResult | { input: ReleaseProofResult["input"] };
  if ("verdict" in parsed && "score" in parsed) {
    return parsed as ReleaseProofResult;
  }
  return computeReleaseProofScore(parsed.input);
}

export async function runReleaseGateCheck(): Promise<ReleaseProofResult> {
  const fromFile = process.argv.find((arg) => arg.startsWith("--input="))?.split("=")[1];
  if (fromFile) {
    return readInputFromFile(fromFile);
  }

  const execGates = buildExecGates();
  const routeSmokeGate = await buildRouteSmokeGate();
  const ssr404Gate = await buildSsr404Gate();
  const changedFiles = listChangedFiles();
  const allowlist = parseAllowlist(process.env.RELEASE_CHANGED_FILES_ALLOWLIST);
  const changedFilesCheck = evaluateChangedFilesAllowlist(changedFiles, allowlist);
  const rollbackNote = process.env.RELEASE_ROLLBACK_NOTE?.trim();

  return computeReleaseProofScore({
    generatedAt: new Date().toISOString(),
    commitSha: resolveCommitSha(),
    rollbackNote,
    gates: [...execGates, routeSmokeGate, ssr404Gate],
    coverage: buildCoverageMetrics(),
    changedFiles: changedFilesCheck,
    thresholds: parseReleaseProofThresholdsFromEnv(),
  });
}

async function main(): Promise<void> {
  const result = await runReleaseGateCheck();
  const jsonOnly = process.argv.includes("--json");

  if (!jsonOnly) {
    console.log(`Release verdict: ${result.verdict}`);
    console.log(`Proof score: ${result.score.proofScore}/${result.score.maxScore}`);
    console.log(
      `Required gates: ${result.score.passedRequiredGates}/${result.score.totalRequiredGates} PASS`,
    );
    if (result.blockers.length > 0) {
      console.log("\nBlockers:");
      for (const blocker of result.blockers) {
        console.log(`- ${blocker}`);
      }
    }
    console.log("");
  }

  console.log(JSON.stringify(result, null, 2));
  process.exit(result.verdict === "SYSTEM_APPROVABLE" ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
