import type { BulkToolRepairItem } from "@/lib/ai/deepseek/bulk-tool-repair-types";
import { DEEPSEEK_JSON_ONLY_INSTRUCTION } from "@/lib/ai/deepseek/deepseek-prompts";

export function buildBulkRepairSystemPrompt(): string {
  return [
    "You are SectorCalc Bulk Tool Repair Advisor (ASR-0).",
    "For each tool, produce ONLY an allowed low/medium repair patch plan.",
    "Never invent formulas, never approve payments, never bypass Formula Gate.",
    "Do not return keep_safe_state unless no applicable repair exists — explain why in whyNotPatchable.",
    DEEPSEEK_JSON_ONLY_INSTRUCTION,
    "Respond with JSON only (no markdown, no code fences):",
    '{ "taskType": "bulk_tool_repair", "items": [ { "slug": "...", "repairDecision": "auto_apply_candidate|manual_review|keep_safe_state|skip", "riskLevel": "low|medium|high|critical", "rootCause": "...", "whyNotPatchable": "", "patches": [ { "type": "i18n_fix|unit_fix|validation_fix|schema_fix|result_renderer|submit_handler|guide_hide|contract_alignment|route_wiring", "targetFile": "...", "targetFileHint": "...", "description": "...", "safeToApply": true, "requiresHumanApproval": true } ], "expectedAuditAfterPatch": "PASS|WARN|REVIEW", "testCommands": [] } ] }',
    "Rules:",
    "- One item per input slug. Do not add slugs not in the input batch.",
    "- If an applicable i18n/unit/schema/validation/result/submit/guide_hide/contract_alignment fix exists, return repairDecision=auto_apply_candidate with concrete patches.",
    "- If targetFile is unknown, set targetFile to empty string and provide targetFileHint.",
    "- If patch cannot be auto-applied, set requiresHumanApproval=true.",
    "- If no patch is possible, repairDecision=keep_safe_state or skip and whyNotPatchable is mandatory.",
    "- high/critical risk or formula rewrites → manual_review with explicit reason.",
    "- Do not return keep_safe_state for all items in a batch.",
    "- Output must be parseable JSON — no trailing commas, no comments, no prose.",
  ].join("\n");
}

export function buildBulkRepairUserPrompt(items: BulkToolRepairItem[]): string {
  const explicitTasks = items.map((item) => {
    const gaps: string[] = [];
    if (!item.validationExists) gaps.push("missing validation");
    if (!item.formSchemaExists) gaps.push("missing schema");
    if (!item.resultRendererExists) gaps.push("missing result renderer");
    if (!item.submitHandlerExists) gaps.push("missing submit handler");
    if (item.unitIssues.length > 0) gaps.push("unit issue");
    if (item.guideStatus === "generic") gaps.push("generic guide");
    if (item.findings.some((f) => /freePremiumSplit/i.test(f))) gaps.push("premium/free copy mismatch");
    if (item.knownFormulaAuditFindings.length > 0) gaps.push("contract alignment");

    return {
      slug: item.slug,
      explicitTask:
        gaps.length > 0
          ? `Produce low/medium repair patch plan for: ${gaps.join(", ")}. Return auto_apply_candidate if patches exist.`
          : "Review findings and propose only safe low/medium repair patches if applicable.",
    };
  });

  return JSON.stringify(
    {
      task: "bulk_tool_repair",
      instruction:
        "For each tool, return repairDecision=auto_apply_candidate when applicable low/medium patches exist. Avoid unnecessary keep_safe_state.",
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
        explicitTask: explicitTasks.find((t) => t.slug === item.slug)?.explicitTask ?? "",
      })),
    },
    null,
    2,
  );
}
