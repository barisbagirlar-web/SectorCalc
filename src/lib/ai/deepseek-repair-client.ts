import "server-only";
import OpenAI from "openai";
import { RepairSuggestionSchema } from "@/lib/ai-repair/repair-schema";
import {
  buildRepairSystemPrompt,
  buildRepairUserPrompt,
  type RepairRequestPayload,
} from "@/lib/ai-repair/repair-prompts";
import { getDeepSeekRepairEnv } from "@/lib/ai/deepseek-env";

const DEEPSEEK_JSON_SCHEMA_HINT = [
  "Return only valid JSON. Do not use markdown. Do not add prose.",
  "Use exactly these camelCase keys:",
  "severity (info|warning|error|deploy-blocker), summary, rootCause, affectedFiles (string[]),",
  "proposedPatchPlan (string[]), commandsToRun (string[]), deployBlocker (boolean),",
  "requiresHumanReview (boolean), riskNotes (string[]).",
].join("\n");

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value];
  }

  return [];
}

function normalizeRepairJson(input: unknown): unknown {
  if (!input || typeof input !== "object") {
    return input;
  }

  const record = input as Record<string, unknown>;

  return {
    severity: record.severity,
    summary: record.summary ?? record.message,
    rootCause: record.rootCause ?? record.root_cause,
    affectedFiles: asStringArray(record.affectedFiles ?? record.affected_files),
    proposedPatchPlan: asStringArray(
      record.proposedPatchPlan ?? record.patch_plan ?? record.patchPlan,
    ),
    commandsToRun: asStringArray(
      record.commandsToRun ?? record.commands ?? record.commands_to_run,
    ),
    deployBlocker: record.deployBlocker ?? record.deploy_blocker,
    requiresHumanReview: record.requiresHumanReview ?? record.requires_human_review,
    riskNotes: asStringArray(record.riskNotes ?? record.risk_notes),
  };
}

export async function runDeepSeekRepairAnalysis(
  payload: RepairRequestPayload,
  model: string,
) {
  const env = getDeepSeekRepairEnv();

  const client = new OpenAI({
    apiKey: env.apiKey,
    baseURL: "https://api.deepseek.com",
  });

  const completion = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: `${buildRepairSystemPrompt()}\n${DEEPSEEK_JSON_SCHEMA_HINT}`,
      },
      {
        role: "user",
        content: buildRepairUserPrompt(payload, env.maxInputChars),
      },
    ],
    response_format: {
      type: "json_object",
    },
  });

  const rawText = completion.choices[0]?.message?.content || "";

  let json: unknown;

  try {
    json = JSON.parse(rawText);
  } catch {
    throw new Error(`DeepSeek returned non-JSON response: ${rawText.slice(0, 500)}`);
  }

  const parsed = RepairSuggestionSchema.safeParse(normalizeRepairJson(json));

  if (!parsed.success) {
    throw new Error(`DeepSeek repair schema validation failed: ${parsed.error.message}`);
  }

  return parsed.data;
}
