import "server-only";

import OpenAI from "openai";
import {
  buildTraceContextFromFreeRequest,
  serializeTraceContext,
} from "@/lib/trace/context-builder";
import {
  buildTraceFreeLocaleHint,
  TRACE_FREE_SYSTEM_PROMPT,
} from "@/lib/trace/prompts";
import { buildToolCatalogForPrompt } from "@/lib/trace/tool-catalog-prompt";
import { findBestTools } from "@/lib/trace/tool-recommendation";
import { routeAssistantSlug } from "@/lib/assistant/slug-router";
import type { TraceFreeRequest, TraceFreeResponse } from "@/lib/trace/types";

const MAX_REPLY_LENGTH = 1500;

// ── DeepSeek model configuration ──
// DeepSeek API docs: https://api-docs.deepseek.com/quick_start/pricing
// Model "deepseek-chat" maps to the latest DeepSeek-V3/V4 series.
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
    console.error("[Trace] DEEPSEEK_API_KEY is not set — DeepSeek unavailable");
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
    return "No keyword match. Use the catalog below to recommend the right tool.";
  }

  return suggestions
    .map((entry, index) => `${index + 1}. ${entry.label} (${entry.slug}) → ${entry.href}`)
    .join("\n");
}

/**
 * Generate a DeepSeek flash reply. Logs errors to server console.
 * Returns null on any failure — caller handles fallback.
 */
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
      temperature: 0.7,
      max_tokens: 500,
      top_p: 0.9,
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

    // Log additional context for 401/auth errors
    if (msg.includes("401") || msg.includes("Unauthorized") || msg.includes("auth")) {
      console.error(
        "[Trace] DeepSeek 401 — check DEEPSEEK_API_KEY on this environment. " +
        `Model requested: ${modelName}`,
      );
    }

    return null;
  }
}

/**
 * Build a contextual fallback message when DeepSeek is unavailable.
 * More helpful than the plain router fallback.
 */
function buildFallbackReply(
  message: string,
  suggestions: readonly { slug: string; label: string; href: string }[],
  blockedMessage?: string,
): { reply: string; strongMatch: boolean } {
  if (blockedMessage) {
    return { reply: blockedMessage, strongMatch: false };
  }

  // Check if we have a strong tool match
  if (suggestions.length > 0) {
    const top = suggestions[0];
    return {
      reply: `I found a tool that matches your question: **${top.label}**. Try it here: ${top.href}\n\nNeed something different? Let me know.`,
      strongMatch: true,
    };
  }

  return {
    reply: `I'm here to help you find the right SectorCalc tool for your calculation needs. Can you tell me more about what you're trying to calculate? I can route you to free tools (instant, no signup) or Pro analyzers (full verdict, PDF reports).`,
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

  // ── Try Flash (DeepSeek) first ──
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

  // ── DeepSeek unavailable → smart fallback ──
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
