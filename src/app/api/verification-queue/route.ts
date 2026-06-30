/**
 * POST /api/verification-queue
 * Persists public calculation feedback into Firestore verification_queue.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  createVerificationQueueItem,
} from "@/lib/features/feedback/create-verification-item";
import type {
  VerificationIssueType,
  VerificationQueueSubmitInput,
  VerificationQueueTier,
} from "@/lib/features/feedback/feedback-types";
import { VERIFICATION_ISSUE_TYPES } from "@/lib/features/feedback/feedback-types";
import { sanitizeVerificationSnapshot } from "@/lib/features/feedback/create-verification-item";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT = new Map<string, number>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 8;

function isIssueType(value: unknown): value is VerificationIssueType {
  return typeof value === "string" && (VERIFICATION_ISSUE_TYPES as readonly string[]).includes(value);
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const last = RATE_LIMIT.get(ip) ?? 0;
  if (now - last < RATE_WINDOW_MS / RATE_MAX) {
    return false;
  }
  RATE_LIMIT.set(ip, now);
  return true;
}

function isTier(value: unknown): value is VerificationQueueTier {
  return value === "free" || value === "premium" || value === "unknown";
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  if (!isIssueType(b.issueType)) {
    return NextResponse.json({ ok: false, error: "invalid_issue_type" }, { status: 400 });
  }

  const input: VerificationQueueSubmitInput = {
    toolSlug: typeof b.toolSlug === "string" ? b.toolSlug : "",
    locale: typeof b.locale === "string" ? b.locale : "en",
    tier: isTier(b.tier) ? b.tier : "unknown",
    region: typeof b.region === "string" ? b.region : undefined,
    issueType: b.issueType,
    message: typeof b.message === "string" ? b.message : "",
    email: typeof b.email === "string" ? b.email : undefined,
    userId: typeof b.userId === "string" ? b.userId : undefined,
    pageUrl: typeof b.pageUrl === "string" ? b.pageUrl : "",
    userAgent: typeof b.userAgent === "string" ? b.userAgent : request.headers.get("user-agent") ?? undefined,
    honeypot: typeof b.honeypot === "string" ? b.honeypot : undefined,
    inputSnapshot: sanitizeVerificationSnapshot(
      b.inputSnapshot && typeof b.inputSnapshot === "object" && !Array.isArray(b.inputSnapshot)
        ? (b.inputSnapshot as Record<string, unknown>)
        : undefined,
    ),
    resultSnapshot: sanitizeVerificationSnapshot(
      b.resultSnapshot && typeof b.resultSnapshot === "object" && !Array.isArray(b.resultSnapshot)
        ? (b.resultSnapshot as Record<string, unknown>)
        : undefined,
    ),
  };

  const result = await createVerificationQueueItem(input);
  if (!result.ok) {
    const status = result.error === "rejected" ? 400 : result.error === "admin_unavailable" ? 503 : 400;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result, { status: 201 });
}
