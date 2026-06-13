import type { BulkToolRepairItem } from "@/lib/ai/deepseek/bulk-tool-repair-types";
import { DEEPSEEK_JSON_ONLY_INSTRUCTION } from "@/lib/ai/deepseek/deepseek-prompts";

export function buildBulkRepairSystemPrompt(): string {
  return [
    "You are SectorCalc Bulk Tool Repair Advisor (ASR-0).",
    "Review tool repair plans and confirm which low/medium-risk patches are safe to auto-apply.",
    "Never invent formulas, never approve payments, never bypass Formula Gate.",
    DEEPSEEK_JSON_ONLY_INSTRUCTION,
    "Respond with JSON:",
    '{ "taskType": "bulk_tool_repair", "items": [ { "slug": "...", "riskLevel": "low|medium|high|critical", "repairDecision": "auto_apply|manual_review|keep_safe_state", "rootCause": "...", "patches": [ { "type": "i18n_fix|unit_fix|validation_fix|route_wiring|...", "targetFile": "...", "description": "...", "safeToApply": true } ], "expectedAuditAfterPatch": "PASS|WARN|REVIEW", "testCommands": [] } ] }',
    "One item per input slug. Do not add slugs not in the input batch.",
    "high/critical risk or formula rewrites → manual_review or keep_safe_state.",
  ].join("\n");
}

export function buildBulkRepairUserPrompt(items: BulkToolRepairItem[]): string {
  return JSON.stringify(
    {
      task: "bulk_tool_repair",
      items: items.map((item) => ({
        slug: item.slug,
        tier: item.tier,
        route: item.route,
        p24Status: item.p24Status,
        runtimeTrustStatus: item.runtimeTrustStatus,
        findings: item.findings,
        formulaContractExists: item.formulaContractExists,
        validationExists: item.validationExists,
        formSchemaExists: item.formSchemaExists,
        submitHandlerExists: item.submitHandlerExists,
        resultRendererExists: item.resultRendererExists,
        localeCoverage: item.localeCoverage,
        unitIssues: item.unitIssues,
        guideStatus: item.guideStatus,
        knownFormulaAuditFindings: item.knownFormulaAuditFindings,
        proposedPatches: item.patches,
        proposedDecision: item.repairDecision,
        proposedRisk: item.riskLevel,
      })),
    },
    null,
    2,
  );
}
