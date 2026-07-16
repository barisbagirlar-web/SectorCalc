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
import type { DomainId } from "@/sectorcalc/diagnostics/domain-taxonomy";
import { DOMAIN_REGISTRY } from "@/sectorcalc/diagnostics/domain-taxonomy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCT_KEY = PRODUCT_KEYS.ENGINEERING_DIAGNOSTICS;

/* ── Gated preview helpers ── */

function riskBandFromScore(score: number): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  if (score >= 76) return "CRITICAL";
  if (score >= 51) return "HIGH";
  if (score >= 26) return "MEDIUM";
  return "LOW";
}

function riskBandLabel(score: number): string {
  if (score >= 76) return "Critical Risk — Immediate Action Required";
  if (score >= 51) return "High Risk — Urgent Engineering Review Needed";
  if (score >= 26) return "Medium Risk — Further Investigation Recommended";
  return "Low Risk — Standard Monitoring Sufficient";
}

function briefExplanation(score: number, decision: string): string {
  if (score >= 76) {
    return `The assessment indicates a critical risk level (score: ${score}/100). The decision state is "${decision.replace(/_/g, " ")}". Significant measurement deviation or cost exposure detected. A qualified professional must perform an on-site inspection and corrective action is required immediately.`;
  }
  if (score >= 51) {
    return `The assessment indicates a high risk level (score: ${score}/100). The decision state is "${decision.replace(/_/g, " ")}". Non-conformance likely. Detailed engineering review and measurement verification are strongly recommended before proceeding.`;
  }
  if (score >= 26) {
    return `The assessment indicates a moderate risk level (score: ${score}/100). The decision state is "${decision.replace(/_/g, " ")}". Some uncertainty detected in measurements or cost exposure. Further investigation is recommended.`;
  }
  return `The assessment indicates a low risk level (score: ${score}/100). The decision state is "${decision.replace(/_/g, " ")}". Measurements are within expected ranges. Standard quality monitoring is sufficient.`;
}

export async function POST(req: Request) {
  try {
    /* ── Auth gate (soft — optional for gated preview) ──────────── */
    let userId: string | null = null;
    let isOwner = false;
    let authenticated = false;

    const token = parseBearerToken(req);
    if (token) {
      const user = await verifySignedInUser(token);
      if (user) {
        authenticated = true;
        userId = user.uid;
        isOwner = user.email ? isProBypassEmail(user.email) : false;
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

    /* ── Execute deterministic engine (no auth required) ────────── */
    const result = runDiagnostic(parsed.data);

    /* ── Determine access: authenticated + has/purchasable credits ── */
    let hasCommercialAccess = false;

    if (authenticated && userId) {
      if (isOwner) {
        hasCommercialAccess = true;
      } else {
        const hasUsage = await checkProductUsage(userId, PRODUCT_KEY);
        if (hasUsage) {
          hasCommercialAccess = true;
        } else {
          // Try to grant from credits
          const grantResult = await grantProductUsesFromCredits(userId, PRODUCT_KEY);
          if (grantResult.ok) {
            hasCommercialAccess = true;
          }
        }
      }
    }

    /* ── Response: full commercial vs gated preview ────────────── */
    if (hasCommercialAccess && userId) {
      // Full deterministic result (authenticated + entitled)
      if (!isOwner) {
        await decrementProductUse(userId, PRODUCT_KEY);
      }

      const usageDoc = !isOwner ? await getProductUsageDoc(userId, PRODUCT_KEY) : null;
      const remainingUses = usageDoc?.remainingUses ?? null;

      return NextResponse.json(
        {
          ...result,
          remaining_uses: remainingUses,
          product: "ENGINEERING_DIAGNOSTICS",
        },
        { status: 200 }
      );
    }

    // Gated preview (free — no commercial value)
    const totalRisk = result.decision.total_risk_score;
    const band = riskBandFromScore(totalRisk);
    const domainInfo = DOMAIN_REGISTRY[parsed.data.domain_id as DomainId];

    return NextResponse.json(
      {
        ok: true,
        mode: "gated_preview",
        preview: {
          domain_detected: domainInfo?.label ?? parsed.data.domain_id,
          domain_category: domainInfo?.category ?? "advisory",
          risk_band: band,
          risk_band_label: riskBandLabel(totalRisk),
          brief_explanation: briefExplanation(totalRisk, result.decision.decision),
        },
        requires_upgrade: true,
        disclaimer:
          "AI-assisted preliminary screening and decision-support output. Manual verification required. Sign in and purchase Diagnostic Credits to unlock the full engineering diagnostic report.",
        error: authenticated
          ? "INSUFFICIENT_CREDITS"
          : "GATED_PREVIEW",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[analyze] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
