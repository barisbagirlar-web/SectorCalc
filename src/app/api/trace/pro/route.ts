/**
 * POST /api/trace/pro
 * Trace Pro — Firebase auth + premium gate; deep reasoning via customer AI gateway.
 */
import { NextResponse } from "next/server";
import { checkAssistantRateLimit } from "@/lib/features/assistant/assistant-rate-limit";
import { handleProTraceRequest } from "@/lib/infrastructure/trace/pro-handler";
import type { TraceConversationMessage } from "@/lib/infrastructure/trace/types";
import {
  parseBearerToken,
  verifySignedInUser,
} from "@/lib/infrastructure/firebase/verify-signed-in-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TraceProBody = {
  readonly message?: unknown;
  readonly locale?: unknown;
  readonly currentPath?: unknown;
  readonly currentToolSlug?: unknown;
  readonly isPremium?: unknown;
  readonly formInputs?: unknown;
  readonly calculationResult?: unknown;
  readonly messages?: unknown;
};

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

export async function POST(req: Request) {
  if (process.env.TRACE_PRO_ENABLED === "false") {
    return NextResponse.json(
      { ok: false, error: "trace_pro_disabled", message: "Trace Pro is temporarily unavailable." },
      { status: 503 },
    );
  }

  const idToken = parseBearerToken(req);
  if (!idToken) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const signedInUser = await verifySignedInUser(idToken);
  if (!signedInUser) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const rateLimit = checkAssistantRateLimit(`trace-pro:${signedInUser.uid}`, 20, 60_000);
  if (!rateLimit.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", message: "Too many Trace Pro requests." },
      { status: 429 },
    );
  }

  let body: TraceProBody;
  try {
    body = (await req.json()) as TraceProBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ ok: false, error: "empty_message" }, { status: 400 });
  }

  const locale = typeof body.locale === "string" && body.locale.trim() ? body.locale.trim() : "en";
  const isPremium = body.isPremium === true;

  const result = await handleProTraceRequest({
    locale,
    message,
    userId: signedInUser.uid,
    isPremium,
    currentPath: typeof body.currentPath === "string" ? body.currentPath : "",
    currentToolSlug: typeof body.currentToolSlug === "string" ? body.currentToolSlug : "",
    formInputs:
      body.formInputs && typeof body.formInputs === "object"
        ? (body.formInputs as Record<string, unknown>)
        : {},
    calculationResult:
      body.calculationResult && typeof body.calculationResult === "object"
        ? (body.calculationResult as Record<string, unknown>)
        : undefined,
    messages: parseMessages(body.messages),
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json(result, { status: 200 });
}
