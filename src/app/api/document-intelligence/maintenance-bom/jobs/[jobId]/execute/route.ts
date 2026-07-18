/**
 * Maintenance BOM Recovery — Execute API
 *
 * POST /api/document-intelligence/maintenance-bom/jobs/{jobId}/execute
 *
 * Allowed only when paymentStatus is `paid`. Drives the full processing
 * workflow synchronously (n8n-style orchestration node):
 *   paid → queued → [processJob: extracting → … → completed]
 * On success the reserved credits are consumed; on failure they are released
 * (refunded) automatically so a customer is never charged without delivery.
 * Idempotent: re-invoking a completed job returns the completed state.
 */

import { NextRequest, NextResponse } from "next/server";
import { parseBearerToken, verifySignedInUser } from "@/lib/infrastructure/firebase/verify-signed-in-user";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { processJob } from "@/lib/document-intelligence/pipeline/process-job";
import { consumeEntitlement, releaseEntitlement } from "@/lib/document-intelligence/entitlements/maintenance-bom-entitlement";

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

    // ── Idempotency: already completed ───────────────────────────
    if (job.status === "completed") {
      return NextResponse.json({ ok: true, data: { jobId, status: "completed", message: "Job already completed.", summary: job.summary ?? null } });
    }

    // ── State + payment guards ───────────────────────────────────
    const allowedFromStates = ["paid", "queued", "extracting", "normalizing", "validating", "generating_outputs"];
    if (!allowedFromStates.includes(job.status)) {
      return NextResponse.json({ ok: false, error: { code: "INVALID_STATE", message: `Cannot execute job in status: ${job.status}. Allowed: paid` } }, { status: 400 });
    }
    if (job.paymentStatus !== "paid") {
      return NextResponse.json({ ok: false, error: { code: "PAYMENT_NOT_CONFIRMED", message: "Payment has not been confirmed for this job." } }, { status: 402 });
    }

    // ── Transition to queued (idempotent) ────────────────────────
    const processingExecutionId = (job.processingExecutionId as string) || `exec-${jobId}-${Date.now()}`;
    if (job.status === "paid") {
      await jobRef.update({ status: "queued", processingExecutionId, updatedAt: new Date().toISOString() });
      await jobRef.collection("events").add({
        type: "job_queued",
        fromStatus: "paid",
        toStatus: "queued",
        actor: "user",
        timestamp: new Date().toISOString(),
        executionId: processingExecutionId,
      });
    }

    // ── Run orchestrated pipeline synchronously ──────────────────
    const result = await processJob(jobId, processingExecutionId);

    // ── Finalize credit lifecycle (single compensation site) ─────
    if (job.entitlementStatus === "reserved") {
      if (result.ok) {
        await consumeEntitlement(user.uid, jobId, (job.checkoutRequestId as string) ?? "");
        await jobRef.update({ entitlementStatus: "consumed", updatedAt: new Date().toISOString() });
      } else {
        const release = await releaseEntitlement(user.uid, jobId);
        if (release.ok) {
          await jobRef.update({ entitlementStatus: "released", paymentStatus: "refunded", updatedAt: new Date().toISOString() });
        }
      }
    }

    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: result.failureCode ?? "PIPELINE_ERROR",
            message: "Processing failed. Your credits have been refunded.",
          },
          data: { jobId, status: result.status, refunded: job.entitlementStatus === "reserved" },
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      data: {
        jobId,
        status: result.status,
        processingExecutionId,
        summary: result.summary ?? null,
        message: "Processing completed.",
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred." } }, { status: 500 });
  }
}
