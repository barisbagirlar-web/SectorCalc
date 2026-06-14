import "server-only";
import OpenAI from "openai";
import { CustomerAiResponseSchema } from "./customer-ai-schema";
import {
  buildCustomerAiSystemPrompt,
  buildCustomerAiUserPrompt,
} from "./customer-ai-prompts";
import type {
  CustomerAiConversationMessage,
  CustomerAiIntent,
  CustomerAiRequest,
} from "./customer-ai-types";

const VALID_INTENTS: readonly CustomerAiIntent[] = [
  "tool_finder",
  "parameter_extraction",
  "input_help",
  "result_explanation",
  "premium_suggestion",
  "general_tool_question",
  "unsupported",
];

function normalizeIntent(value: unknown): CustomerAiIntent {
  const raw = String(value ?? "general_tool_question")
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, "_");

  if (VALID_INTENTS.includes(raw as CustomerAiIntent)) {
    return raw as CustomerAiIntent;
  }

  if (raw.includes("tool") || raw.includes("find") || raw.includes("search") || raw.includes("calculate")) {
    return "tool_finder";
  }
  if (raw.includes("parameter") || raw.includes("extract")) {
    return "parameter_extraction";
  }
  if (raw.includes("input") || raw.includes("help")) {
    return "input_help";
  }
  if (raw.includes("result") || raw.includes("explain") || raw.includes("interpret")) {
    return "result_explanation";
  }
  if (raw.includes("premium")) {
    return "premium_suggestion";
  }

  return "general_tool_question";
}

function normalizePremiumSuggestion(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value.slice(0, 600);
  }

  return undefined;
}

function getDeepSeekKey() {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error("Missing DEEPSEEK_API_KEY");
  return key;
}

function selectCustomerModel(request: CustomerAiRequest) {
  const flash = process.env.AI_CUSTOMER_FLASH_MODEL || "deepseek-v4-flash";
  const pro = process.env.AI_CUSTOMER_PRO_MODEL || "deepseek-v4-pro";

  if (request.isPremium || request.calculationResult || request.message.length > 600) {
    return {
      model: pro,
      tier: "pro" as const,
    };
  }

  return {
    model: flash,
    tier: "flash" as const,
  };
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map(String).filter(Boolean);
}

function normalizeCustomerAiJson(input: unknown): unknown {
  if (!input || typeof input !== "object") {
    return input;
  }

  const record = input as Record<string, unknown>;

  return {
    intent: normalizeIntent(record.intent),
    answer: String(record.answer ?? record.message ?? record.response ?? "").slice(0, 1200),
    suggestedToolSlug: record.suggestedToolSlug ?? record.suggested_tool_slug,
    extractedInputs: record.extractedInputs ?? record.extracted_inputs,
    missingInputs: asStringArray(record.missingInputs ?? record.missing_inputs),
    premiumSuggestion: normalizePremiumSuggestion(
      record.premiumSuggestion ?? record.premium_suggestion,
    ),
    confidence:
      typeof record.confidence === "number"
        ? record.confidence
        : Number(record.confidence ?? 0.7),
    requiresBackendValidation:
      typeof record.requiresBackendValidation === "boolean"
        ? record.requiresBackendValidation
        : Boolean(record.requires_backend_validation ?? true),
  };
}

function buildConversationMessages(
  request: CustomerAiRequest,
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  const history = (request.messages ?? [])
    .filter(
      (entry): entry is CustomerAiConversationMessage =>
        (entry.role === "user" || entry.role === "assistant") &&
        typeof entry.content === "string" &&
        entry.content.trim().length > 0,
    )
    .slice(-10)
    .map((entry) => ({
      role: entry.role,
      content: entry.content.trim(),
    }));

  return [
    ...history,
    {
      role: "user",
      content: buildCustomerAiUserPrompt(request),
    },
  ];
}

export async function runDeepSeekCustomerAssistant(request: CustomerAiRequest) {
  const routing = selectCustomerModel(request);

  const client = new OpenAI({
    apiKey: getDeepSeekKey(),
    baseURL: "https://api.deepseek.com",
  });

  const completion = await client.chat.completions.create({
    model: routing.model,
    messages: [
      {
        role: "system",
        content:
          buildCustomerAiSystemPrompt(request) +
          "\nReturn only valid JSON. No markdown. No prose.",
      },
      ...buildConversationMessages(request),
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

  const parsed = CustomerAiResponseSchema.safeParse(normalizeCustomerAiJson(json));

  if (!parsed.success) {
    throw new Error(`Customer AI schema validation failed: ${parsed.error.message}`);
  }

  return {
    ...parsed.data,
    modelUsed: routing.model,
    modelTier: routing.tier,
  };
}
