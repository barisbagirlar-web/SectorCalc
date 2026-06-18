import type { RepairPatch, SchemaRecord } from "./stub-formula-types";
import { repairJsonText } from "../schema-json-utils";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const MODEL = "deepseek-chat";

export function buildStubRepairPrompt(schema: SchemaRecord): string {
  const inputLines = (schema.inputs ?? [])
    .map((input) => `- ${input.id} (${input.unit ?? "unit"}) — ${input.label ?? input.id}`)
    .join("\n");

  return `Repair ONLY formulas and outputs for this industrial calculator.

Tool: ${schema.toolName}
Title: ${schema.title ?? schema.toolName}
Description: ${schema.description ?? ""}

Inputs (use ALL numeric input ids across formulas; never add new inputs):
${inputLines}

RULES:
1. formulas must be valid JS expressions using input ids with + - * / ** and Math.* only
2. FORBIDDEN: stub sums like "a + b + c" without domain multiplication/units
3. At least 2 formula keys; primary output must reference real cost/efficiency/risk math
4. outputs.primary must exist in formulas
5. outputs.unit must match result type (cost tools → USD, rates → %, time → hours)
6. outputs.breakdown: array of 2-4 formula keys for sub-metrics
7. Include hiddenLossDrivers (2 strings) and suggestedActions (2 strings) in outputs

Return JSON ONLY:
{
  "formulas": { "result": "...", "annual_lost_hours": "...", ... },
  "outputs": {
    "primary": "result",
    "breakdown": ["annual_lost_hours", "..."],
    "unit": "USD",
    "hiddenLossDrivers": ["...", "..."],
    "suggestedActions": ["...", "..."],
    "dataConfidenceAdjusted": "result"
  }
}`;
}

export async function callDeepSeekStubRepair(
  schema: SchemaRecord,
  apiKey: string,
): Promise<RepairPatch> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an ISO 9001 industrial engineer. Output ONLY valid JSON for formulas and outputs.",
        },
        { role: "user", content: buildStubRepairPrompt(schema) },
      ],
      temperature: 0.1,
      max_tokens: 2500,
      response_format: { type: "json_object" },
    }),
  });

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(payload.error?.message ?? `HTTP ${response.status}`);
  }

  const content = payload.choices?.[0]?.message?.content ?? "";
  const parsed = JSON.parse(repairJsonText(content)) as RepairPatch;
  if (!parsed.formulas || !parsed.outputs) {
    throw new Error("model response missing formulas/outputs");
  }
  return parsed;
}
