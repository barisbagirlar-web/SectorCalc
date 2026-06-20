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

function getFlashModel(): string {
  return process.env.AI_TRACE_FLASH_MODEL?.trim() || process.env.AI_CUSTOMER_FLASH_MODEL?.trim() || "deepseek-chat";
}

function getDeepSeekClient(): OpenAI | null {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.deepseek.com",
    maxRetries: 2,
    timeout: 15000,
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

async function generateFlashReply(
  request: TraceFreeRequest,
  suggestions: readonly { slug: string; label: string; href: string }[],
  blockedMessage?: string,
): Promise<string | null> {
  const client = getDeepSeekClient();
  if (!client) {
    return null;
  }

  const context = buildTraceContextFromFreeRequest(request);
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
      model: getFlashModel(),
      messages: [
        { role: "system", content: system },
        ...context.recentMessages.map((entry) => ({
          role: entry.role,
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
    return reply ? reply.slice(0, MAX_REPLY_LENGTH) : null;
  } catch {
    return null;
  }
}

export async function handleFreeTraceRequest(
  request: TraceFreeRequest,
): Promise<TraceFreeResponse> {
  const locale = request.locale.trim() || "en";
  const message = request.message.trim().slice(0, 1000);
  const routed = await routeAssistantSlug(message, locale);
  const suggestions = await findBestTools(message, locale);

  if (routed.blocked) {
    const flashReply = await generateFlashReply(request, suggestions, routed.message);
    return {
      ok: true,
      reply: flashReply ?? routed.message,
      suggestions,
      modelTier: flashReply ? "flash" : "router",
      blocked: true,
    };
  }

  const flashReply = await generateFlashReply(request, suggestions);
  if (flashReply) {
    return {
      ok: true,
      reply: flashReply,
      suggestions: routed.suggestion ? dedupePrimary(routed.suggestion, suggestions) : suggestions,
      modelTier: "flash",
      blocked: false,
    };
  }

  return {
    ok: true,
    reply: routed.message,
    suggestions: routed.suggestion ? dedupePrimary(routed.suggestion, suggestions) : suggestions,
    modelTier: "router",
    blocked: false,
  };
}

function dedupePrimary(
  primary: { slug: string; label: string; href: string },
  suggestions: readonly { slug: string; label: string; href: string }[],
): { slug: string; label: string; href: string }[] {
  const rest = suggestions.filter((entry) => entry.slug !== primary.slug);
  return [primary, ...rest].slice(0, 3);
}
