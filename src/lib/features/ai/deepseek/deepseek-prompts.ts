import type { FormulaAuditToolContext } from "@/lib/features/ai/deepseek/deepseek-types";

export const DEEPSEEK_JSON_ONLY_INSTRUCTION =
  [
    "Return valid JSON only.",
    "Do not use markdown.",
    "Do not use code fences.",
    "Do not include explanations outside JSON.",
    "Top-level object must match the schema exactly.",
    "If no patch is possible, still return valid JSON with whyNotPatchable.",
    "Every selected item must return exactly one item.",
  ].join(" ");

export function buildFormulaAuditSystemPrompt(): string {
  return [
    "You are SectorCalc Formula Auditor (offline quality advisor).",
    "Review formula, input schema, labels, units, and validation alignment.",
    "You suggest fixes only - never approve Formula Gate, never patch code, never open payments.",
    DEEPSEEK_JSON_ONLY_INSTRUCTION,
    "Respond with JSON matching this envelope:",
    "{",
    '  "taskType": "formula_audit",',
    '  "generatedAt": "<ISO8601>",',
    '  "mustNotAutoApply": true,',
    '  "items": [',
    "    {",
    '      "slug": "tool-slug",',
    '      "riskLevel": "low|medium|high|critical",',
    '      "rootCause": "string",',
    '      "findings": ["string"],',
    '      "suggestedFiles": ["path"],',
    '      "suggestedChanges": [',
    "        {",
    '          "type": "label_fix|input_schema_fix|validation_rule|formula_review|unit_check|safe_state",',
    '          "description": "string",',
    '          "confidence": "low|medium|high"',
    "        }",
    "      ]",
    "    }",
    "  ]",
    "}",
    "mustNotAutoApply must always be true.",
    "One item per audited slug.",
  ].join("\n");
}

export function buildFormulaAuditUserPrompt(tools: FormulaAuditToolContext[]): string {
  const auditQuestions = [
    "Is the formula mathematically consistent?",
    "Are variables present in the input schema?",
    "Do input labels match formula variables?",
    "Any unit mismatch?",
    "Division-by-zero risk?",
    "Negative value risk?",
    "Percent/rate boundary risk?",
    "Missing min/max validation?",
    "Result interpretation errors?",
    "Is this tool safe for full calculation?",
    "If not safe, what safe_state action is recommended?",
  ];

  return JSON.stringify(
    {
      task: "formula_audit",
      auditQuestions,
      tools: tools.map((tool) => ({
        slug: tool.slug,
        p24Verdict: tool.p24Verdict,
        p24Findings: tool.p24Findings,
        ertStatus: tool.ertStatus,
        ertFindings: tool.ertFindings,
        formulaContract: tool.formulaContract,
        inputSchema: tool.inputSchema,
      })),
    },
    null,
    2,
  );
}

export function buildHealthcheckUserPrompt(): string {
  return JSON.stringify({
    task: "healthcheck",
    ping: true,
    requiredShape: { ok: true, service: "sectorcalc-deepseek" },
  });
}

export function buildHealthcheckSystemPrompt(): string {
  return [
    "SectorCalc DeepSeek health probe.",
    DEEPSEEK_JSON_ONLY_INSTRUCTION,
    'Return: {"ok":true,"service":"sectorcalc-deepseek"}',
  ].join("\n");
}
