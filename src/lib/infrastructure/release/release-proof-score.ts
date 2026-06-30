/**
 * Deterministic release proof score — all required gates must PASS for SYSTEM_APPROVABLE.
 */

import type {
  ReleaseChangedFilesCheck,
  ReleaseCoverageMetrics,
  ReleaseGateId,
  ReleaseGateResult,
  ReleaseGateStatus,
  ReleaseProofInput,
  ReleaseProofResult,
  ReleaseProofScore,
  ReleaseProofThresholds,
  ReleaseVerdict,
} from "@/lib/infrastructure/release/release-proof-types";

export const DEFAULT_RELEASE_PROOF_THRESHOLDS: ReleaseProofThresholds = {
  minFormulaContractCount: 1,
  minFullLoopRuntimeCount: 1,
  maxAuditPipelineCount: 0,
};

const REQUIRED_GATE_IDS: readonly ReleaseGateId[] = [
  "lint",
  "test_formulas",
  "build",
  "audit_coverage",
  "check_secrets",
  "formula_contract_count",
  "full_loop_runtime_count",
  "audit_pipeline_count",
];

const OPTIONAL_GATE_IDS: readonly ReleaseGateId[] = [
  "route_smoke",
  "ssr_visible_404_check",
  "changed_files_allowlist",
  "rollback_note",
];

function gateLabel(id: ReleaseGateId): string {
  switch (id) {
    case "lint":
      return "Lint";
    case "test_formulas":
      return "Formula tests";
    case "build":
      return "Production build";
    case "audit_coverage":
      return "Dual-intelligence runtime coverage audit";
    case "check_secrets":
      return "Secret leak scan";
    case "route_smoke":
      return "Route smoke";
    case "ssr_visible_404_check":
      return "SSR visible 404 check";
    case "formula_contract_count":
      return "FormulaContract count";
    case "full_loop_runtime_count":
      return "full_loop_runtime count";
    case "audit_pipeline_count":
      return "audit_pipeline count";
    case "changed_files_allowlist":
      return "Changed files allowlist";
    case "rollback_note":
      return "Rollback note";
    default: {
      const exhaustive: never = id;
      return exhaustive;
    }
  }
}

function isRequiredGate(id: ReleaseGateId): boolean {
  return REQUIRED_GATE_IDS.includes(id);
}

function normalizeGate(gate: ReleaseGateResult): ReleaseGateResult {
  return {
    ...gate,
    label: gate.label || gateLabel(gate.id),
    required: gate.required ?? isRequiredGate(gate.id),
  };
}

function globPatternToRegExp(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "§§")
    .replace(/\*/g, "[^/]*")
    .replace(/§§/g, ".*");
  return new RegExp(`^${escaped}$`);
}

function matchesAllowlistPattern(filePath: string, pattern: string): boolean {
  if (pattern.endsWith("/")) {
    return filePath.startsWith(pattern) || filePath.startsWith(pattern.slice(0, -1));
  }
  if (pattern.includes("*")) {
    return globPatternToRegExp(pattern).test(filePath);
  }
  return filePath === pattern || filePath.startsWith(`${pattern}/`);
}

export function evaluateChangedFilesAllowlist(
  changedFiles: readonly string[],
  allowlist: readonly string[],
): ReleaseChangedFilesCheck {
  if (allowlist.length === 0) {
    return {
      enabled: false,
      changedFiles,
      allowlist,
      disallowedFiles: [],
    };
  }

  const disallowedFiles = changedFiles.filter(
    (filePath) => !allowlist.some((pattern) => matchesAllowlistPattern(filePath, pattern)),
  );

  return {
    enabled: true,
    changedFiles,
    allowlist,
    disallowedFiles,
  };
}

export function buildCoverageMetricGates(
  coverage: ReleaseCoverageMetrics,
  thresholds: ReleaseProofThresholds = DEFAULT_RELEASE_PROOF_THRESHOLDS,
): readonly ReleaseGateResult[] {
  const formulaPass = coverage.formulaContractCount >= thresholds.minFormulaContractCount;
  const fullLoopPass = coverage.fullLoopRuntimeCount >= thresholds.minFullLoopRuntimeCount;
  const auditPipelinePass = coverage.auditPipelineCount <= thresholds.maxAuditPipelineCount;

  return [
    {
      id: "formula_contract_count",
      label: gateLabel("formula_contract_count"),
      required: true,
      status: formulaPass ? "PASS" : "FAIL",
      value: coverage.formulaContractCount,
      detail: formulaPass
        ? `FormulaContract count ${coverage.formulaContractCount} >= ${thresholds.minFormulaContractCount}.`
        : `FormulaContract count ${coverage.formulaContractCount} below minimum ${thresholds.minFormulaContractCount}.`,
    },
    {
      id: "full_loop_runtime_count",
      label: gateLabel("full_loop_runtime_count"),
      required: true,
      status: fullLoopPass ? "PASS" : "FAIL",
      value: coverage.fullLoopRuntimeCount,
      detail: fullLoopPass
        ? `full_loop_runtime count ${coverage.fullLoopRuntimeCount} >= ${thresholds.minFullLoopRuntimeCount}.`
        : `full_loop_runtime count ${coverage.fullLoopRuntimeCount} below minimum ${thresholds.minFullLoopRuntimeCount}.`,
    },
    {
      id: "audit_pipeline_count",
      label: gateLabel("audit_pipeline_count"),
      required: true,
      status: auditPipelinePass ? "PASS" : "FAIL",
      value: coverage.auditPipelineCount,
      detail: auditPipelinePass
        ? `audit_pipeline count ${coverage.auditPipelineCount} <= ${thresholds.maxAuditPipelineCount}.`
        : `audit_pipeline count ${coverage.auditPipelineCount} exceeds maximum ${thresholds.maxAuditPipelineCount}.`,
    },
  ];
}

export function buildChangedFilesAllowlistGate(
  changedFilesCheck: ReleaseChangedFilesCheck | undefined,
): ReleaseGateResult {
  if (!changedFilesCheck?.enabled) {
    return {
      id: "changed_files_allowlist",
      label: gateLabel("changed_files_allowlist"),
      required: false,
      status: "SKIP",
      detail: "Allowlist not configured.",
    };
  }

  const pass = changedFilesCheck.disallowedFiles.length === 0;
  return {
    id: "changed_files_allowlist",
    label: gateLabel("changed_files_allowlist"),
    required: false,
    status: pass ? "PASS" : "FAIL",
    value: changedFilesCheck.changedFiles.length,
    detail: pass
      ? `All ${changedFilesCheck.changedFiles.length} changed file(s) match allowlist.`
      : `Disallowed changed files: ${changedFilesCheck.disallowedFiles.join(", ")}.`,
  };
}

export function buildRollbackNoteGate(rollbackNote: string | undefined): ReleaseGateResult {
  const trimmed = rollbackNote?.trim() ?? "";
  if (trimmed.length === 0) {
    return {
      id: "rollback_note",
      label: gateLabel("rollback_note"),
      required: false,
      status: "SKIP",
      detail: "Rollback note not provided.",
    };
  }

  return {
    id: "rollback_note",
    label: gateLabel("rollback_note"),
    required: false,
    status: "PASS",
    value: trimmed.length,
    detail: "Rollback note present.",
  };
}

export function createReleaseGate(
  id: ReleaseGateId,
  status: ReleaseGateStatus,
  detail?: string,
  value?: number | string | boolean,
  required = isRequiredGate(id),
): ReleaseGateResult {
  return normalizeGate({
    id,
    label: gateLabel(id),
    status,
    required,
    detail,
    value,
  });
}

function mergeGateResults(
  gates: readonly ReleaseGateResult[],
  coverageGates: readonly ReleaseGateResult[],
  changedFilesGate: ReleaseGateResult,
  rollbackNoteGate: ReleaseGateResult,
): ReleaseGateResult[] {
  const byId = new Map<ReleaseGateId, ReleaseGateResult>();

  for (const gate of gates.map(normalizeGate)) {
    byId.set(gate.id, gate);
  }

  for (const gate of coverageGates) {
    byId.set(gate.id, gate);
  }

  byId.set(changedFilesGate.id, changedFilesGate);
  byId.set(rollbackNoteGate.id, rollbackNoteGate);

  const orderedIds: ReleaseGateId[] = [...REQUIRED_GATE_IDS, ...OPTIONAL_GATE_IDS];
  return orderedIds
    .filter((id) => byId.has(id))
    .map((id) => byId.get(id)!);
}

function computeScoreFromGates(gates: readonly ReleaseGateResult[]): ReleaseProofScore {
  const requiredGates = gates.filter((gate) => gate.required);
  const passedRequiredGates = requiredGates.filter((gate) => gate.status === "PASS").length;
  const totalRequiredGates = requiredGates.length;
  const failedGates = gates.filter((gate) => gate.status === "FAIL").map((gate) => gate.id);
  const skippedOptionalGates = gates
    .filter((gate) => !gate.required && gate.status === "SKIP")
    .map((gate) => gate.id);

  const proofScore =
    totalRequiredGates === 0
      ? 0
      : Math.round((passedRequiredGates / totalRequiredGates) * 100);

  return {
    proofScore,
    maxScore: 100,
    passedRequiredGates,
    totalRequiredGates,
    failedGates,
    skippedOptionalGates,
  };
}

function collectBlockers(gates: readonly ReleaseGateResult[]): string[] {
  return gates
    .filter((gate) => gate.required && gate.status === "FAIL")
    .map((gate) => gate.detail ?? `${gate.label} failed.`);
}

export function computeReleaseProofScore(input: ReleaseProofInput): ReleaseProofResult {
  const thresholds = input.thresholds ?? DEFAULT_RELEASE_PROOF_THRESHOLDS;
  const coverageGates = buildCoverageMetricGates(input.coverage, thresholds);
  const changedFilesGate = buildChangedFilesAllowlistGate(input.changedFiles);
  const rollbackNoteGate = buildRollbackNoteGate(input.rollbackNote);
  const mergedGates = mergeGateResults(
    input.gates,
    coverageGates,
    changedFilesGate,
    rollbackNoteGate,
  );

  const score = computeScoreFromGates(mergedGates);
  const blockers = collectBlockers(mergedGates);
  const allRequiredPassed =
    score.totalRequiredGates > 0 && score.passedRequiredGates === score.totalRequiredGates;
  const verdict: ReleaseVerdict = allRequiredPassed ? "SYSTEM_APPROVABLE" : "BLOCKED";

  return {
    verdict,
    score,
    input: {
      ...input,
      thresholds,
      gates: mergedGates,
    },
    blockers,
    deployCommandAllowed: false,
  };
}

export function parseReleaseProofThresholdsFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): ReleaseProofThresholds {
  return {
    minFormulaContractCount: parsePositiveInt(
      env.RELEASE_MIN_FORMULA_CONTRACTS,
      DEFAULT_RELEASE_PROOF_THRESHOLDS.minFormulaContractCount,
    ),
    minFullLoopRuntimeCount: parsePositiveInt(
      env.RELEASE_MIN_FULL_LOOP_RUNTIME,
      DEFAULT_RELEASE_PROOF_THRESHOLDS.minFullLoopRuntimeCount,
    ),
    maxAuditPipelineCount: parseNonNegativeInt(
      env.RELEASE_MAX_AUDIT_PIPELINE,
      DEFAULT_RELEASE_PROOF_THRESHOLDS.maxAuditPipelineCount,
    ),
  };
}

function parsePositiveInt(raw: string | undefined, fallback: number): number {
  if (!raw) {
    return fallback;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseNonNegativeInt(raw: string | undefined, fallback: number): number {
  if (!raw) {
    return fallback;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export function parseGateStatusFromEnv(
  env: NodeJS.ProcessEnv,
  key: string,
): ReleaseGateStatus | undefined {
  const raw = env[key]?.trim().toUpperCase();
  if (raw === "PASS" || raw === "FAIL" || raw === "SKIP") {
    return raw;
  }
  return undefined;
}
