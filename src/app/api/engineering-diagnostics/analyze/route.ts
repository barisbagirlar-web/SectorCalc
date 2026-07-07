import { NextResponse } from "next/server";
import { AnalyzeRequestSchema, runDiagnostic } from "@/sectorcalc/diagnostics/diagnostic-service";
import {
  parseBearerToken,
  verifySignedInUser,
} from "@/lib/infrastructure/firebase/verify-signed-in-user";
import {
  checkUserCreditBalance,
  decrementCredits,
} from "@/lib/credits/tool-usage-session.server";
import { isProBypassEmail } from "@/lib/features/billing/subscription";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ANALYZE_CREDIT_COST = 1;

export async function POST(req: Request) {
  try {
    /* ── Auth gate ─────────────────────────────────────────────── */
    const token = parseBearerToken(req);
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const user = await verifySignedInUser(token);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Invalid or expired authentication token." },
        { status: 401 }
      );
    }

    /* ── Credit gate ───────────────────────────────────────────── */
    const isOwner = user.email ? isProBypassEmail(user.email) : false;
    if (!isOwner) {
      const hasCredits = await checkUserCreditBalance(user.uid, ANALYZE_CREDIT_COST);
      if (!hasCredits) {
        return NextResponse.json(
          {
            ok: false,
            error: "INSUFFICIENT_CREDITS",
            message: "1 credit is required to run a diagnostic analysis.",
          },
          { status: 402 }
        );
      }
    }

    /* ── Parse body ────────────────────────────────────────────── */
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const parsed = AnalyzeRequestSchema.safeParse(body);

    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      }));
      return NextResponse.json(
        { ok: false, error: "Schema validation failed", issues },
        { status: 422 }
      );
    }

    /* ── Execute ───────────────────────────────────────────────── */
    const result = runDiagnostic(parsed.data);

    /* ── Deduct credit (compute first, spend after) ────────────── */
    if (!isOwner) {
      await decrementCredits(user.uid, ANALYZE_CREDIT_COST);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
