import { getDeepSeekRepairEnv } from "@/lib/ai/deepseek-env";
import { createRepairFingerprint } from "./repair-fingerprint";
import { summarizeRepairHistory } from "./repair-history-store";
import type {
  RepairHistorySummary,
  RepairRequestPayload,
  RepairRoutingDecision,
} from "./repair-types";

const HUMAN_REVIEW_KEYWORDS = [
  "auth",
  "authentication",
  "payment",
  "checkout",
  "stripe",
  "firebase rules",
  "firestore.rules",
  "cloudflare",
  "dns",
  "secret",
  "api key",
  "brevo",
  "mail",
  "tax",
  "regulated",
  "safety-critical",
  "pressure vessel",
  "electrical safety",
  "iş güvenliği",
  "vergi",
  "ödeme",
  "kimlik doğrulama",
];

const PRO_KEYWORDS = [
  "formula",
  "FormulaContract",
  "metadata",
  "coverage",
  "TypeScript",
  "tsc",
  "build",
  "MISSING_MESSAGE",
  "i18n",
  "route",
  "schema",
  "validation",
  "audit",
  "public-status",
  "jsonld",
  "semantic",
  "runtime",
];

function isRoutineLocaleRepair(
  scope: string,
  output: string,
  changedFiles: string[],
  retryCount: number,
): boolean {
  if (retryCount >= 1 || changedFiles.length >= 4 || output.length > 6000) {
    return false;
  }

  const outputLower = output.toLowerCase();

  return (
    scope === "locale" ||
    outputLower.includes("missing translation") ||
    outputLower.includes("missing message") ||
    outputLower.includes("missing_message")
  );
}

function withHistoryContext(
  fingerprint: string,
  historySummary: RepairHistorySummary,
  reason: string,
): string {
  return [
    reason,
    `History: flashFailures=${historySummary.flashFailures}, proFailures=${historySummary.proFailures}, lastOutcome=${historySummary.lastOutcome ?? "none"}.`,
  ].join(" ");
}

function buildDecision(
  fingerprint: string,
  historySummary: RepairHistorySummary,
  decision: Omit<RepairRoutingDecision, "fingerprint" | "historySummary">,
): RepairRoutingDecision {
  return {
    ...decision,
    fingerprint,
    historySummary,
    reason: withHistoryContext(fingerprint, historySummary, decision.reason),
  };
}

export function decideRepairModel(payload: RepairRequestPayload): RepairRoutingDecision {
  const env = getDeepSeekRepairEnv();

  const output = payload.output || "";
  const command = payload.command || "";
  const scope = String(payload.scope || "unknown");
  const changedFiles = payload.changedFiles || [];
  const retryCount = payload.retryCount || 0;

  const fingerprint = createRepairFingerprint(payload);
  const historySummary = summarizeRepairHistory(fingerprint);

  const flashFailureThreshold = Number(process.env.AI_REPAIR_FLASH_FAILURE_THRESHOLD || 2);
  const proFailureThreshold = Number(process.env.AI_REPAIR_PRO_FAILURE_THRESHOLD || 2);

  const combined = [scope, command, output.slice(0, env.maxInputChars), changedFiles.join("\n")]
    .join("\n")
    .toLowerCase();

  const humanHit = HUMAN_REVIEW_KEYWORDS.some((keyword) =>
    combined.includes(keyword.toLowerCase()),
  );

  if (humanHit) {
    return buildDecision(fingerprint, historySummary, {
      tier: "human-review",
      model: null,
      reason: "High-risk scope or sensitive system area requires human review.",
      requiresHumanReview: true,
      deterministicGateRequired: true,
    });
  }

  if (historySummary.proFailures >= proFailureThreshold) {
    return buildDecision(fingerprint, historySummary, {
      tier: "human-review",
      model: null,
      reason:
        "Same repair fingerprint failed repeatedly with Pro; human review required.",
      requiresHumanReview: true,
      deterministicGateRequired: true,
    });
  }

  if (historySummary.flashFailures >= flashFailureThreshold) {
    return buildDecision(fingerprint, historySummary, {
      tier: "pro",
      model: env.proModel,
      reason: "Same repair fingerprint failed repeatedly with Flash; escalated to Pro.",
      requiresHumanReview: false,
      deterministicGateRequired: true,
    });
  }

  if (env.routingMode === "flash-only") {
    return buildDecision(fingerprint, historySummary, {
      tier: "flash",
      model: env.flashModel,
      reason: "Routing mode is flash-only.",
      requiresHumanReview: false,
      deterministicGateRequired: true,
    });
  }

  if (env.routingMode === "pro-only") {
    return buildDecision(fingerprint, historySummary, {
      tier: "pro",
      model: env.proModel,
      reason: "Routing mode is pro-only.",
      requiresHumanReview: false,
      deterministicGateRequired: true,
    });
  }

  if (
    historySummary.flashSuccesses > 0 &&
    historySummary.flashFailures === 0 &&
    isRoutineLocaleRepair(scope, output, changedFiles, retryCount)
  ) {
    return buildDecision(fingerprint, historySummary, {
      tier: "flash",
      model: env.flashModel,
      reason: "Prior successful Flash repair for this fingerprint; reusing fast model.",
      requiresHumanReview: false,
      deterministicGateRequired: true,
    });
  }

  if (isRoutineLocaleRepair(scope, output, changedFiles, retryCount)) {
    return buildDecision(fingerprint, historySummary, {
      tier: "flash",
      model: env.flashModel,
      reason: "Routine locale/i18n repair context; using fast model.",
      requiresHumanReview: false,
      deterministicGateRequired: true,
    });
  }

  const isLongOutput = output.length > 6000;
  const isMultiFile = changedFiles.length >= 4;
  const isRetry = retryCount >= 1;
  const proHit = PRO_KEYWORDS.some((keyword) => combined.includes(keyword.toLowerCase()));

  if (proHit || isLongOutput || isMultiFile || isRetry) {
    return buildDecision(fingerprint, historySummary, {
      tier: "pro",
      model: env.proModel,
      reason:
        "Complex repair context detected: formula/build/typescript/audit/long-output/multi-file/retry.",
      requiresHumanReview: false,
      deterministicGateRequired: true,
    });
  }

  return buildDecision(fingerprint, historySummary, {
    tier: "flash",
    model: env.flashModel,
    reason: "Routine repair context; using fast model.",
    requiresHumanReview: false,
    deterministicGateRequired: true,
  });
}
