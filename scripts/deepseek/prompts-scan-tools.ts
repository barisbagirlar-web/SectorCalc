import type { DiscoveredTool } from "./types";

const JSON_ONLY_RULES = [
  "Return valid JSON only.",
  "Do not use markdown.",
  "Do not use code fences.",
  "Do not include explanations outside JSON.",
  "Top-level object must match the schema exactly.",
].join(" ");

export function buildToolScanSystemPrompt(): string {
  return [
    "You are SectorCalc DeepSeek Tool Scanner.",
    "Extract or infer a production-safe tool schema and formula audit from repository context.",
    "You suggest structured metadata only — never patch code, never unlock payments, never override Formula Gate.",
    JSON_ONLY_RULES,
    "Respond with JSON matching this envelope:",
    "{",
    '  "slug": "tool-slug",',
    '  "schema": {',
    '    "inputs": [{ "id": "string", "label": "string", "type": "number|select|percent|currency", "unit": "string", "required": true }],',
    '    "outputs": [{ "id": "string", "label": "string", "unit": "string", "format": "currency|percentage|number|score" }],',
    '    "formulaSummary": "string",',
    '    "validationRules": ["string"],',
    '    "assumptions": ["string"]',
    "  },",
    '  "audit": {',
    '    "riskLevel": "low|medium|high|critical",',
    '    "formulaConsistent": true,',
    '    "safeForCalculation": true,',
    '    "findings": ["string"],',
    '    "recommendedActions": ["string"]',
    "  }",
    "}",
    "Use conservative engineering language.",
    "If context is insufficient, return minimal inputs/outputs and set safeForCalculation=false with findings explaining gaps.",
  ].join("\n");
}

export function buildToolScanUserPrompt(tool: DiscoveredTool): string {
  return JSON.stringify(
    {
      task: "tool_scan",
      slug: tool.slug,
      sources: tool.sources,
      auditQuestions: [
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
      ],
      repositoryContext: tool.contextSnippet,
    },
    null,
    2,
  );
}
