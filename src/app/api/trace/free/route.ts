/**
 * POST /api/trace/free
 * Trace Free — no auth; routes to tools via slug/knowledge + optional flash model.
 */
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkAssistantRateLimit } from "@/lib/features/assistant/assistant-rate-limit";
import { handleFreeTraceRequest } from "@/lib/infrastructure/trace/free-handler";
import type { TraceConversationMessage } from "@/lib/infrastructure/trace/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TraceFreeBody = {
  readonly message?: unknown;
  readonly locale?: unknown;
  readonly currentPath?: unknown;
  readonly currentToolSlug?: unknown;
  readonly messages?: unknown;
};

function resolveClientIp(headerStore: Awaited<ReturnType<typeof headers>>): string {
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "local"
  );
}

function parseMessages(value: unknown): TraceConversationMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      const record = entry as Record<string, unknown>;
      const role =
        record.role === "assistant" ? "assistant" : record.role === "user" ? "user" : null;
      const content = typeof record.content === "string" ? record.content.trim() : "";
      if (!role || !content) {
        return null;
      }
      return { role, content: content.slice(0, 1200) };
    })
    .filter((entry): entry is TraceConversationMessage => entry !== null)
    .slice(-10);
}

export async function POST(request: NextRequest) {
  if (process.env.TRACE_FREE_ENABLED === "false") {
    return NextResponse.json(
      { ok: false, error: "trace_disabled", message: "Trace Free is temporarily unavailable." },
      { status: 503 },
    );
  }

  const headerStore = await headers();
  const ip = resolveClientIp(headerStore);
  const rateLimit = checkAssistantRateLimit(`trace-free:${ip}`, 15, 60_000);

  if (!rateLimit.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "rate_limited",
        message: "Too many requests. Please wait and try again.",
      },
      { status: 429 },
    );
  }

  let body: TraceFreeBody;
  try {
    body = (await request.json()) as TraceFreeBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json", message: "Request body must be JSON." },
      { status: 400 },
    );
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json(
      { ok: false, error: "empty_message", message: "A non-empty message is required." },
      { status: 400 },
    );
  }

  const locale = typeof body.locale === "string" && body.locale.trim() ? body.locale.trim() : "en";

  const result = await handleFreeTraceRequest({
    locale,
    message,
    currentPath: typeof body.currentPath === "string" ? body.currentPath : "",
    currentToolSlug: typeof body.currentToolSlug === "string" ? body.currentToolSlug : "",
    messages: parseMessages(body.messages),
  });

  return NextResponse.json(result, { status: 200 });
}
