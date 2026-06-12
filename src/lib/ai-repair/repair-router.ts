import "server-only";
import { runOpenAiRepairAnalysis } from "@/lib/ai/openai-repair-client";
import { runDeepSeekRepairAnalysis } from "@/lib/ai/deepseek-repair-client";
import { getAiRepairProvider } from "@/lib/ai/deepseek-env";
import { createRepairFingerprint, createRepairId } from "./repair-fingerprint";
import { decideRepairModel } from "./repair-routing";
import type { RepairAnalysisResult, RepairRequestPayload } from "./repair-types";

function buildHistoryRiskNotes(
  fingerprint: string,
  historySummary: {
    flashFailures: number;
    proFailures: number;
  },
  routingReason: string,
): string[] {
  return [
    `Repair fingerprint: ${fingerprint}`,
    `Historical flash failures: ${historySummary.flashFailures}`,
    `Historical pro failures: ${historySummary.proFailures}`,
    `Routing reason: ${routingReason}`,
    "Deterministic gate required: lint + tsc + audit + build",
  ];
}

export async function analyzeRepairRequest(
  payload: RepairRequestPayload,
): Promise<RepairAnalysisResult> {
  const repairId = createRepairId();
  const fingerprint = createRepairFingerprint(payload);
  const provider = getAiRepairProvider();

  if (provider === "deepseek") {
    const routing = decideRepairModel(payload);
    const historyNotes = buildHistoryRiskNotes(
      routing.fingerprint,
      routing.historySummary,
      routing.reason,
    );

    if (routing.tier === "human-review" || !routing.model) {
      return {
        repairId,
        fingerprint: routing.fingerprint,
        suggestion: {
          severity: "deploy-blocker",
          summary: "Human review required before AI repair.",
          rootCause: routing.reason,
          affectedFiles: payload.changedFiles || [],
          proposedPatchPlan: [
            "Do not apply automated AI repair.",
            "Review the affected files manually.",
            "Run deterministic gates after manual patch.",
          ],
          commandsToRun: ["npm run lint", "npx tsc --noEmit", "npm run build"],
          deployBlocker: true,
          requiresHumanReview: true,
          riskNotes: [...historyNotes, "Deterministic gate is required before deploy."],
        },
      };
    }

    const suggestion = await runDeepSeekRepairAnalysis(payload, routing.model);

    return {
      repairId,
      fingerprint: routing.fingerprint,
      suggestion: {
        ...suggestion,
        riskNotes: [
          ...suggestion.riskNotes,
          ...historyNotes,
          `AI model tier: ${routing.tier}`,
          `AI model: ${routing.model}`,
        ],
        requiresHumanReview:
          suggestion.requiresHumanReview || routing.requiresHumanReview,
      },
    };
  }

  return {
    repairId,
    fingerprint,
    suggestion: await runOpenAiRepairAnalysis(payload),
  };
}
