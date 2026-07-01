/**
 * POST /api/assistant
 * Slug-routing assistant: deterministic keywords → knowledge match → DeepSeek.
 *
 * No calculation. DeepSeek is only used for slug guessing when local routing fails.
 * Full conversational AI lives at POST /api/ai-gateway/customer.
 */
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkAssistantRateLimit } from "@/lib/features/assistant/assistant-rate-limit";
import { routeAssistantSlug } from "@/lib/features/assistant/slug-router";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 1000;

type AssistantChatMessage = {
  readonly role?: unknown;
  readonly content?: unknown;
};

type AssistantRequestBody = {
  readonly message?: unknown;
  readonly messages?: unknown;
  readonly locale?: unknown;
};

function extractUserMessage(body: AssistantRequestBody): string {
  if (typeof body.message === "string" && body.message.trim()) {
    return body.message.trim();
  }

  if (Array.isArray(body.messages)) {
    const messages = body.messages as AssistantChatMessage[];
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const entry = messages[index];
      if (entry?.role === "user" && typeof entry.content === "string" && entry.content.trim()) {
        return entry.content.trim();
      }
    }
  }

  return "";
}

function resolveClientIp(headerStore: Awaited<ReturnType<typeof headers>>): string {
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "local"
  );
}

export async function POST(request: NextRequest) {
  const headerStore = await headers();
  const ip = resolveClientIp(headerStore);
  const rateLimit = checkAssistantRateLimit(ip);

  if (!rateLimit.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "rate_limited",
        message: "Too many requests, please wait a moment.",
      },
      { status: 429 },
    );
  }

  let body: AssistantRequestBody;
  try {
    body = (await request.json()) as AssistantRequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json", message: "Request body must be JSON." },
      { status: 400 },
    );
  }

  const userMessage = extractUserMessage(body);
  if (!userMessage) {
    return NextResponse.json(
      { ok: false, error: "empty_message", message: "A non-empty message is required." },
      { status: 400 },
    );
  }

  const locale = typeof body.locale === "string" && body.locale.trim() ? body.locale.trim() : "en";
  const safeMessage = userMessage.slice(0, MAX_MESSAGE_LENGTH);
  const result = await routeAssistantSlug(safeMessage, locale);

  return NextResponse.json(
    {
      ok: true,
      message: result.message,
      slug: result.slug,
      source: result.source,
      blocked: result.blocked,
      topic: result.topic ?? null,
      suggestion: result.suggestion ?? null,
    },
    { status: 200 },
  );
}
