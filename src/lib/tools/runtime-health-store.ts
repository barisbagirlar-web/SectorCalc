import type {
  RuntimeTrustDecision,
  RuntimeTrustFinding,
  RuntimeTrustStatus,
} from "@/lib/tools/runtime-trust-engine";

export type RuntimeToolHealthStatus = "ready" | "review" | "blocked";

export type RuntimeToolHealthSource =
  | "runtime-audit"
  | "live-crawler"
  | "manual-admin"
  | "deploy-gate";

export type RuntimeToolHealthRecord = {
  readonly slug: string;
  readonly status: RuntimeToolHealthStatus;
  readonly formulaGateEligible: boolean;
  readonly paymentEligible: boolean;
  readonly calculationEligible: boolean;
  readonly findings: readonly string[];
  readonly lastCheckedAt: string;
  readonly source: RuntimeToolHealthSource;
};

const healthBySlug = new Map<string, RuntimeToolHealthRecord>();

/** In-memory health read — Firestore integration planned for ERT-1. */
export function readRuntimeToolHealth(slug: string): RuntimeToolHealthRecord | null {
  const key = slug.trim();
  if (!key) {
    return null;
  }
  return healthBySlug.get(key) ?? null;
}

/** Test/admin hook — not wired to Firestore in ERT-0. */
export function writeRuntimeToolHealth(record: RuntimeToolHealthRecord): void {
  healthBySlug.set(record.slug.trim(), record);
}

export function clearRuntimeToolHealthStore(): void {
  healthBySlug.clear();
}

export function mergeRuntimeHealthWithDecision(
  decision: RuntimeTrustDecision,
  healthRecord: RuntimeToolHealthRecord | null,
): RuntimeTrustDecision {
  if (!healthRecord || healthRecord.status === "ready") {
    return decision;
  }

  const mergedFindings: RuntimeTrustFinding[] = [
    ...decision.findings,
    ...(healthRecord.findings as RuntimeTrustFinding[]),
  ].filter((finding, index, list) => list.indexOf(finding) === index);

  return {
    ...decision,
    status: healthRecord.status as RuntimeTrustStatus,
    formulaGateEligible: false,
    paymentEligible: false,
    calculationEligible: false,
    findings: mergedFindings,
    recommendedAction:
      healthRecord.status === "blocked" ? "block_payment" : "safe_review",
  };
}
