// LOCKED — DO NOT MODIFY without explicit user approval.
// Trace engine: max_tokens=120, temperature=0.3, MAX_REPLY_LENGTH=600.
// Changing these will produce long/AI-sounding responses.

import "server-only";

import OpenAI from "openai";
import {
  buildTraceContextFromFreeRequest,
  serializeTraceContext,
} from "@/lib/infrastructure/trace/context-builder";
import {
  buildTraceFreeLocaleHint,
  TRACE_FREE_SYSTEM_PROMPT,
} from "@/lib/infrastructure/trace/prompts";
import { buildToolCatalogForPrompt } from "@/lib/infrastructure/trace/tool-catalog-prompt";
import { findBestTools } from "@/lib/infrastructure/trace/tool-recommendation";
import { routeAssistantSlug } from "@/lib/features/assistant/slug-router";
import type { TraceFreeRequest, TraceFreeResponse } from "@/lib/infrastructure/trace/types";

const MAX_REPLY_LENGTH = 600;

function resolveFlashModel(): string {
  return (
    process.env.AI_TRACE_FLASH_MODEL?.trim() ||
    process.env.AI_CUSTOMER_FLASH_MODEL?.trim() ||
    "deepseek-chat"
  );
}

function createDeepSeekClient(): OpenAI | null {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    console.error("[Trace] DEEPSEEK_API_KEY is not set");
    return null;
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.deepseek.com",
    maxRetries: 2,
    timeout: 20_000,
  });
}

function formatSuggestionsForPrompt(
  suggestions: readonly { slug: string; label: string; href: string }[],
): string {
  if (suggestions.length === 0) {
    return "";
  }

  return suggestions
    .map((entry) => `${entry.label}: ${entry.href}`)
    .join("\n");
}

async function generateFlashReply(
  request: TraceFreeRequest,
  suggestions: readonly { slug: string; label: string; href: string }[],
  blockedMessage?: string,
): Promise<string | null> {
  const client = createDeepSeekClient();
  if (!client) {
    return null;
  }

  const context = buildTraceContextFromFreeRequest(request);
  const modelName = resolveFlashModel();

  const system = [
    TRACE_FREE_SYSTEM_PROMPT,
    buildTraceFreeLocaleHint(context.locale),
    "=== FULL TOOL CATALOG (use this to route EVERY question) ===",
    buildToolCatalogForPrompt(context.locale),
    blockedMessage
      ? `Guardrail note: ${blockedMessage}. Explain the limit briefly and stay helpful.`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const userContent = [
    `User message: ${context.message}`,
    "",
    "Page context:",
    serializeTraceContext(context),
    "",
    "Keyword-matched tools:",
    formatSuggestionsForPrompt(suggestions),
  ].join("\n");

  try {
    const response = await client.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: system },
        ...context.recentMessages.map((entry) => ({
          role: entry.role as "user" | "assistant",
          content: entry.content,
        })),
        { role: "user", content: userContent },
      ],
      temperature: 0.3,
      max_tokens: 120,
      top_p: 0.5,
      frequency_penalty: 0.3,
      presence_penalty: 0.2,
    });

    const reply = response.choices[0]?.message?.content?.trim();
    if (!reply) {
      console.warn("[Trace] DeepSeek returned empty reply");
      return null;
    }

    return reply.slice(0, MAX_REPLY_LENGTH);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Trace] DeepSeek API error:", msg);

    if (msg.includes("401") || msg.includes("Unauthorized") || msg.includes("auth")) {
      console.error(
        "[Trace] DeepSeek 401 check DEEPSEEK_API_KEY on this environment. " +
        `Model requested: ${modelName}`,
      );
    }

    return null;
  }
}

function buildFallbackReply(
  message: string,
  suggestions: readonly { slug: string; label: string; href: string }[],
  blockedMessage?: string,
): { reply: string; strongMatch: boolean } {
  if (blockedMessage) {
    return { reply: blockedMessage, strongMatch: false };
  }

  if (suggestions.length > 0) {
    const top = suggestions[0];
    return {
      reply: `${top.label}: ${top.href}`,
      strongMatch: true,
    };
  }

  return {
    reply: "Tell me what you want to calculate and I will find the right tool.",
    strongMatch: false,
  };
}

export async function handleFreeTraceRequest(
  request: TraceFreeRequest,
): Promise<TraceFreeResponse> {
  const locale = request.locale.trim() || "en";
  const message = request.message.trim().slice(0, 1000);
  const routed = await routeAssistantSlug(message, locale);
  const suggestions = await findBestTools(message, locale);

  const flashReply = await generateFlashReply(request, suggestions, routed.blocked ? routed.message : undefined);

  if (flashReply) {
    return {
      ok: true,
      reply: flashReply,
      suggestions: routed.suggestion ? dedupePrimary(routed.suggestion, suggestions) : suggestions,
      modelTier: "flash",
      blocked: false,
    };
  }

  const fallback = buildFallbackReply(message, suggestions, routed.blocked ? routed.message : undefined);

  return {
    ok: true,
    reply: fallback.reply,
    suggestions: routed.suggestion ? dedupePrimary(routed.suggestion, suggestions) : suggestions,
    modelTier: "router",
    blocked: routed.blocked,
  };
}

function dedupePrimary(
  primary: { slug: string; label: string; href: string },
  suggestions: readonly { slug: string; label: string; href: string }[],
): { slug: string; label: string; href: string }[] {
  const rest = suggestions.filter((entry) => entry.slug !== primary.slug);
  return [primary, ...rest].slice(0, 3);
}
