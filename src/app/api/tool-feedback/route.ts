/**
 * POST /api/tool-feedback
 * Sends tool result feedback email via Brevo (server-side only).
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getToolFeedbackMailEnv,
  sendToolFeedbackMail,
  type ToolFeedbackTier,
} from "@/lib/notifications/tool-feedback-mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MESSAGE_MIN_LENGTH = 5;
const MESSAGE_MAX_LENGTH = 2_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isToolTier(value: unknown): value is ToolFeedbackTier {
  return (
    value === "free" ||
    value === "premium" ||
    value === "premium-schema" ||
    value === "unknown"
  );
}

function sanitizeMessage(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/\0/g, "").trim().slice(0, MESSAGE_MAX_LENGTH);
}

function sanitizeOptionalString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.replace(/<[^>]*>/g, "").replace(/\0/g, "").trim();
  if (!trimmed) {
    return undefined;
  }
  return trimmed.slice(0, maxLength);
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;

  const honeypot = sanitizeOptionalString(record.honeypot, 200);
  if (honeypot) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const toolSlug = sanitizeOptionalString(record.toolSlug, 120);
  if (!toolSlug) {
    return NextResponse.json({ ok: false, error: "invalid_tool_slug" }, { status: 400 });
  }

  const message = sanitizeMessage(typeof record.message === "string" ? record.message : "");
  if (message.length < MESSAGE_MIN_LENGTH) {
    return NextResponse.json({ ok: false, error: "invalid_message" }, { status: 400 });
  }

  const email = sanitizeOptionalString(record.email, 120);
  if (email && !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const env = getToolFeedbackMailEnv();
  if (!env) {
    return NextResponse.json(
      { ok: false, error: "feedback_mail_unavailable" },
      { status: 503 },
    );
  }

  const toolTier: ToolFeedbackTier = isToolTier(record.toolTier) ? record.toolTier : "unknown";
  const locale = sanitizeOptionalString(record.locale, 16) ?? "en";
  const pageUrl = sanitizeOptionalString(record.pageUrl, 500) ?? "/";
  const userAgent =
    sanitizeOptionalString(record.userAgent, 512) ??
    sanitizeOptionalString(request.headers.get("user-agent"), 512);
  const issueType = sanitizeOptionalString(record.issueType, 80);

  const resultSnapshot =
    record.resultSnapshot !== undefined && record.resultSnapshot !== null
      ? record.resultSnapshot
      : undefined;

  const sendResult = await sendToolFeedbackMail(
    {
      toolSlug,
      toolTier,
      locale,
      pageUrl,
      message,
      email,
      issueType,
      userAgent,
      resultSnapshot,
      timestamp: new Date().toISOString(),
    },
    env,
  );

  if (!sendResult.ok) {
    return NextResponse.json({ ok: false, error: "feedback_mail_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
