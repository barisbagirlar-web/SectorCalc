// SectorCalc Pro Session Creation API
// Authenticated user required.
// Creates exactly one Pro session for the given toolKey, deducting exactly 1 credit.
// Session maxRuns = 10.

import { NextRequest, NextResponse } from "next/server";
import { parseBearerToken, verifySignedInUser } from "@/lib/infrastructure/firebase/verify-signed-in-user";
import { createProSession } from "@/lib/credits/tool-usage-session.server";
import { getPublicToolBySlug } from "@/sectorcalc/runtime/public-tool-manifest";
import { isProBypassEmail } from "@/lib/features/billing/subscription";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CreateSessionRequest {
  toolKey: string;
}

const BYPASS_SESSION_ID = "bypass-unlimited";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // ── Authenticate ─────────────────────────────────────────────
    const token = parseBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const user = await verifySignedInUser(token);
    if (!user) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    // ── Parse request ────────────────────────────────────────────
    const body: CreateSessionRequest = await request.json();

    if (!body.toolKey || typeof body.toolKey !== "string") {
      return NextResponse.json({ error: "MISSING_TOOL_KEY" }, { status: 400 });
    }

    // ── Validate tool exists and is Pro ──────────────────────────
    const manifestEntry = getPublicToolBySlug(body.toolKey);
    if (!manifestEntry) {
      return NextResponse.json({ error: "TOOL_NOT_FOUND" }, { status: 404 });
    }

    if (manifestEntry.accessTier !== "PRO") {
      return NextResponse.json({ error: "TOOL_NOT_PRO" }, { status: 400 });
    }

    // ── Owner bypass: unlimited access, no credit deduction ──────
    if (user.email && isProBypassEmail(user.email)) {
      return NextResponse.json({
        usageSessionId: BYPASS_SESSION_ID,
        toolKey: body.toolKey,
        remainingRuns: 999,
        creditCost: 0,
        status: "ACTIVE",
      });
    }

    // ── Create session ───────────────────────────────────────────
    const result = await createProSession(user.uid, body.toolKey);

    if (!result.ok) {
      if (result.reason === "INSUFFICIENT_CREDITS") {
        return NextResponse.json({ error: "INSUFFICIENT_CREDITS" }, { status: 402 });
      }
      return NextResponse.json({ error: result.reason }, { status: 500 });
    }

    // ── Return session info ──────────────────────────────────────
    return NextResponse.json({
      usageSessionId: result.session.sessionId,
      toolKey: result.session.toolKey,
      remainingRuns: result.session.remainingRuns,
      creditCost: result.session.creditCost,
      status: result.session.status,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `SERVER_ERROR: ${msg}` }, { status: 500 });
  }
}
