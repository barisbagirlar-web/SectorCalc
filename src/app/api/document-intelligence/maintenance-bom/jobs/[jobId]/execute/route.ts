/**
 * Maintenance BOM Recovery — Execute API
 *
 * POST /api/document-intelligence/maintenance-bom/jobs/{jobId}/execute
 *
 * Allowed only when entitlement is paid/reserved.
 * Idempotently queues processing via Firestore status transition.
 */

import { NextRequest, NextResponse } from "next/server";
import { parseBearerToken, verifySignedInUser } from "@/lib/infrastructure/firebase/verify-signed-in-user";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";

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

    // ── Must be paid or already queued ───────────────────────────
    // Idempotency: if already queued/extracting, return current state
    const allowedFromStates = ["paid", "queued", "failed_retryable"];
    if (!allowedFromStates.includes(job.status)) {
      return NextResponse.json({ ok: false, error: { code: "INVALID_STATE", message: `Cannot execute job in status: ${job.status}. Allowed: paid, queued, failed_retryable` } }, { status: 400 });
    }

    if (job.paymentStatus !== "paid") {
      return NextResponse.json({ ok: false, error: { code: "PAYMENT_NOT_CONFIRMED", message: "Payment has not been confirmed for this job." } }, { status: 402 });
    }

    // ── Idempotent transition to queued ─────────────────────────
    // If already queued, return current state (idempotent)
    if (job.status === "queued" || job.status === "failed_retryable") {
      return NextResponse.json({
        ok: true,
        data: {
          jobId,
          status: "queued",
          previousStatus: job.status,
          processingExecutionId: job.processingExecutionId || null,
          message: job.status === "queued" ? "Job is already queued for processing." : "Retry queued. Job will be reprocessed.",
        },
      });
    }

    const processingExecutionId = `exec-${jobId}-${Date.now()}`;

    await jobRef.update({
      status: "queued",
      paymentStatus: "paid",
      processingExecutionId,
      retryCount: (job.retryCount || 0) + (job.status === "failed_retryable" ? 1 : 0),
      updatedAt: new Date().toISOString(),
    });

    // Record event
    await db.collection("documentIntelligenceJobs").doc(jobId).collection("events").add({
      type: "job_queued",
      fromStatus: job.status,
      toStatus: "queued",
      actor: "user",
      timestamp: new Date().toISOString(),
      executionId: processingExecutionId,
    });

    return NextResponse.json({
      ok: true,
      data: {
        jobId,
        status: "queued",
        processingExecutionId,
        message: "Job has been queued for processing.",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred." } }, { status: 500 });
  }
}
