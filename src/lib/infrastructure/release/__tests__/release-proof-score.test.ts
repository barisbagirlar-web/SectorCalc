/**
 * Release proof score tests - deterministic SYSTEM_APPROVABLE / BLOCKED verdict.
 */

import { describe, expect, test } from "vitest";
import {
  buildCoverageMetricGates,
  computeReleaseProofScore,
  createReleaseGate,
  evaluateChangedFilesAllowlist,
} from "@/lib/infrastructure/release/release-proof-score";
import type {
  ReleaseCoverageMetrics,
  ReleaseGateResult,
  ReleaseProofInput,
} from "@/lib/infrastructure/release/release-proof-types";

const BASE_COVERAGE: ReleaseCoverageMetrics = {
  formulaContractCount: 131,
  fullLoopRuntimeCount: 129,
  auditPipelineCount: 0,
  stagedCalculationBridge: 0,
  governedBuildtimeOnly: 0,
};

function requiredPassGates(): ReleaseGateResult[] {
  return [
    createReleaseGate("lint", "PASS"),
    createReleaseGate("test_formulas", "PASS"),
    createReleaseGate("build", "PASS"),
    createReleaseGate("audit_coverage", "PASS"),
    createReleaseGate("check_secrets", "PASS"),
  ];
}

function buildInput(
  overrides: Partial<ReleaseProofInput> = {},
): ReleaseProofInput {
  return {
    generatedAt: "2026-06-09T00:00:00.000Z",
    commitSha: "abc1234",
    gates: requiredPassGates(),
    coverage: BASE_COVERAGE,
    thresholds: {
      minFormulaContractCount: 120,
      minFullLoopRuntimeCount: 117,
      maxAuditPipelineCount: 0,
    },
    ...overrides,
  };
}

describe("computeReleaseProofScore", () => {
  test("all required gates PASS yields SYSTEM_APPROVABLE with proofScore 100", () => {
    const result = computeReleaseProofScore(buildInput());

    expect(result.verdict).toBe("SYSTEM_APPROVABLE");
    expect(result.score.proofScore).toBe(100);
    expect(result.score.passedRequiredGates).toBe(result.score.totalRequiredGates);
    expect(result.blockers).toEqual([]);
    expect(result.deployCommandAllowed).toBe(false);
  });

  test("one required gate FAIL yields BLOCKED with reduced proofScore", () => {
    const result = computeReleaseProofScore(
      buildInput({
        gates: [
          createReleaseGate("lint", "FAIL", "Lint failed."),
          ...requiredPassGates().slice(1),
        ],
      }),
    );

    expect(result.verdict).toBe("BLOCKED");
    expect(result.score.proofScore).toBeLessThan(100);
    expect(result.score.failedGates).toContain("lint");
    expect(result.blockers.length).toBeGreaterThan(0);
  });

  test("optional gate FAIL does not block when required gates pass", () => {
    const result = computeReleaseProofScore(
      buildInput({
        gates: [
          ...requiredPassGates(),
          createReleaseGate("route_smoke", "FAIL", "Route smoke failed.", undefined, false),
        ],
      }),
    );

    expect(result.verdict).toBe("SYSTEM_APPROVABLE");
    expect(result.score.failedGates).toContain("route_smoke");
  });

  test("proof score is deterministic for identical input", () => {
    const input = buildInput();
    const first = computeReleaseProofScore(input);
    const second = computeReleaseProofScore(input);

    expect(first.score.proofScore).toBe(second.score.proofScore);
    expect(first.verdict).toBe(second.verdict);
    expect(first.input.gates.map((gate) => gate.id)).toEqual(
      second.input.gates.map((gate) => gate.id),
    );
  });

  test("audit_pipeline count above max fails required gate", () => {
    const coverageGates = buildCoverageMetricGates(
      { ...BASE_COVERAGE, auditPipelineCount: 2 },
      {
        minFormulaContractCount: 120,
        minFullLoopRuntimeCount: 117,
        maxAuditPipelineCount: 0,
      },
    );

    const auditGate = coverageGates.find((gate) => gate.id === "audit_pipeline_count");
    expect(auditGate?.status).toBe("FAIL");
  });
});

describe("evaluateChangedFilesAllowlist", () => {
  test("disabled when allowlist empty", () => {
    const check = evaluateChangedFilesAllowlist(["src/a.ts"], []);
    expect(check.enabled).toBe(false);
    expect(check.disallowedFiles).toEqual([]);
  });

  test("matches glob patterns for changed files", () => {
    const check = evaluateChangedFilesAllowlist(
      ["src/lib/release/release-proof-score.ts", "firestore.rules"],
      ["src/lib/release/**"],
    );

    expect(check.enabled).toBe(true);
    expect(check.disallowedFiles).toEqual(["firestore.rules"]);
  });

  test("allowlist gate PASS when all changed files match", () => {
    const changedFiles = evaluateChangedFilesAllowlist(
      ["src/lib/release/release-proof-types.ts"],
      ["src/lib/release/**"],
    );

    const result = computeReleaseProofScore(
      buildInput({
        changedFiles,
      }),
    );

    const allowlistGate = result.input.gates.find((gate) => gate.id === "changed_files_allowlist");
    expect(allowlistGate?.status).toBe("PASS");
  });
});
