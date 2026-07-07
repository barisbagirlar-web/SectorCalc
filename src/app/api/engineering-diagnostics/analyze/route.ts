import { NextResponse } from "next/server";
import { AnalyzeRequestSchema, runDiagnostic } from "@/sectorcalc/diagnostics/diagnostic-service";
import {
  parseBearerToken,
  verifySignedInUser,
} from "@/lib/infrastructure/firebase/verify-signed-in-user";
import {
  checkProductUsage,
  grantProductUsesFromCredits,
  decrementProductUse,
  getProductUsageDoc,
  PRODUCT_KEYS,
} from "@/lib/credits/product-usage-policy";
import { isProBypassEmail } from "@/lib/features/billing/subscription";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCT_KEY = PRODUCT_KEYS.ENGINEERING_DIAGNOSTICS;

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

    /* ── Product usage gate ────────────────────────────────────── */
    const isOwner = user.email ? isProBypassEmail(user.email) : false;

    if (!isOwner) {
      const hasUsage = await checkProductUsage(user.uid, PRODUCT_KEY);
      if (!hasUsage) {
        // No remaining uses — try to grant from credits
        const grantResult = await grantProductUsesFromCredits(user.uid, PRODUCT_KEY);
        if (!grantResult.ok) {
          return NextResponse.json(
            {
              ok: false,
              error: "INSUFFICIENT_CREDITS",
              message: "5 credits are required to unlock 3 Full Engineering Diagnostics.",
              credits_required: 5,
              usage_grant: 3,
            },
            { status: 402 }
          );
        }
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

    /* ── Deduct 1 product use (compute first, spend after) ─────── */
    if (!isOwner) {
      await decrementProductUse(user.uid, PRODUCT_KEY);
    }

    const usageDoc = !isOwner ? await getProductUsageDoc(user.uid, PRODUCT_KEY) : null;
    const remainingUses = usageDoc?.remainingUses ?? null;

    return NextResponse.json(
      {
        ...result,
        remaining_uses: remainingUses,
        product: "ENGINEERING_DIAGNOSTICS",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
