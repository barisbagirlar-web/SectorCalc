import "server-only";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { getOpenAiRepairEnv } from "@/lib/ai/openai-env";
import {
  RepairSuggestionSchema,
  type RepairSuggestionOutput,
} from "@/lib/ai-repair/repair-schema";
import {
  buildRepairSystemPrompt,
  buildRepairUserPrompt,
  type RepairRequestPayload,
} from "@/lib/ai-repair/repair-prompts";

export async function runOpenAiRepairAnalysis(
  payload: RepairRequestPayload,
): Promise<RepairSuggestionOutput> {
  const env = getOpenAiRepairEnv();

  const client = new OpenAI({
    apiKey: env.apiKey,
  });

  const response = await client.responses.parse({
    model: env.repairModel,
    input: [
      {
        role: "system",
        content: buildRepairSystemPrompt(),
      },
      {
        role: "user",
        content: buildRepairUserPrompt(payload, env.maxInputChars),
      },
    ],
    text: {
      format: zodTextFormat(RepairSuggestionSchema, "sectorcalc_repair_suggestion"),
    },
  });

  const parsed = response.output_parsed;
  if (!parsed) {
    throw new Error("OpenAI repair analysis returned empty structured output.");
  }

  return RepairSuggestionSchema.parse(parsed);
}
