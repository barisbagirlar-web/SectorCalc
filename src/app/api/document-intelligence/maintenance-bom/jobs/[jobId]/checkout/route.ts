/**
 * Maintenance BOM Recovery — Checkout API
 *
 * POST /api/document-intelligence/maintenance-bom/jobs/{jobId}/checkout
 *
 * Allowed only for diagnostic_eligible jobs.
 * Server computes 149-credit requirement and returns checkout data.
 * Never trusts price/entitlement from the browser.
 */

import { NextRequest, NextResponse } from "next/server";
import { parseBearerToken, verifySignedInUser } from "@/lib/infrastructure/firebase/verify-signed-in-user";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import {
  getCheckoutData,
  checkEntitlement,
  reserveCredits,
} from "@/lib/document-intelligence/entitlements/maintenance-bom-entitlement";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
): Promise<NextResponse> {
  try {
    // ── Authenticate ─────────────────────────────────────────────
    const token = parseBearerToken(request);
    if (!token) {
      return NextResponse.json({ ok: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } }, { status: 401 });
    }

    const user = await verifySignedInUser(token);
    if (!user) {
      return NextResponse.json({ ok: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } }, { status: 401 });
    }

    const { jobId } = await params;

    // ── Feature flag check ───────────────────────────────────────
    if (process.env.DOCUMENT_INTELLIGENCE_ENABLED !== "true") {
      return NextResponse.json({ ok: false, error: { code: "PRODUCT_UNAVAILABLE", message: "This product is currently unavailable." } }, { status: 503 });
    }

    // ── Get job and verify ownership ─────────────────────────────
    const db = getAdminFirestore();
    if (!db) {
      return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "Infrastructure not available" } }, { status: 500 });
    }

    const jobRef = db.collection("documentIntelligenceJobs").doc(jobId);
    const jobSnap = await jobRef.get();

    if (!jobSnap.exists) {
      return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: "Job not found" } }, { status: 404 });
    }

    const job = jobSnap.data()!;

    if (job.userId !== user.uid) {
      return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: "Access denied" } }, { status: 403 });
    }

    // ── Must be diagnostic_eligible ──────────────────────────────
    if (job.status !== "diagnostic_eligible") {
      return NextResponse.json({ ok: false, error: { code: "INVALID_STATE", message: `Cannot checkout for job in status: ${job.status}` } }, { status: 400 });
    }

    if (job.diagnosticStatus !== "eligible") {
      return NextResponse.json({ ok: false, error: { code: "NOT_ELIGIBLE", message: "Diagnostic did not return eligible status" } }, { status: 400 });
    }

    // ── Check credit entitlement ─────────────────────────────────
    const entitlement = await checkEntitlement(user.uid);
    if (!entitlement.ok) {
      if (entitlement.reason === "INSUFFICIENT_CREDITS") {
        return NextResponse.json({ ok: false, error: { code: "INSUFFICIENT_CREDITS", message: "Insufficient credits. Please purchase more credits." } }, { status: 402 });
      }
      return NextResponse.json({ ok: false, error: { code: "ENTITLEMENT_ERROR", message: "Unable to verify payment entitlement." } }, { status: 500 });
    }

    // ── Reserve credits atomically ────────────────────────────────
    const reservation = await reserveCredits(user.uid, jobId);
    if (!reservation.ok) {
      if (reservation.reason === "INSUFFICIENT_CREDITS") {
        return NextResponse.json({ ok: false, error: { code: "INSUFFICIENT_CREDITS", message: "Insufficient credits. Please purchase more credits." } }, { status: 402 });
      }
      return NextResponse.json({ ok: false, error: { code: "RESERVATION_FAILED", message: "Failed to reserve credits. Please try again." } }, { status: 500 });
    }

    // ── Transition job status to awaiting_payment ─────────────────
    await jobRef.update({
      status: "awaiting_payment",
      paymentStatus: "checkout_pending",
      entitlementStatus: "reserved",
      checkoutRequestId: reservation.checkoutRequestId,
      updatedAt: new Date().toISOString(),
    });

    // ── Return checkout data ─────────────────────────────────────
    const checkoutData = getCheckoutData();

    return NextResponse.json({
      ok: true,
      data: {
        jobId,
        ...checkoutData,
        checkoutRequestId: reservation.checkoutRequestId,
        availableCredits: entitlement.availableCredits,
        sufficientCredits: true,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred." } }, { status: 500 });
  }
}
