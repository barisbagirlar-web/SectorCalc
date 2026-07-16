/**
 * API Route: POST /api/document-intelligence/admin/jobs/{jobId}/refund
 *
 * Initiates the refund workflow for a job. Records an immutable audit event.
 * The refund state transition moves the job to "refunded" status.
 *
 * This is an administrative action. Actual financial refund processing
 * is handled by the payment provider (Stripe/Paddle) via webhook.
 * This endpoint records the administrative decision and triggers the
 * entitlement release workflow.
 *
 * Auth: Bearer token + admin custom claim (admin: true)
 * Body: { reason: string }
 *
 * Dependencies:
 *   - getAdminFirestore from @/lib/infrastructure/firebase/admin
 *   - requireAdminFromRequest from @/lib/infrastructure/firebase/verify-admin-user
 */

import { type NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { requireAdminFromRequest } from "@/lib/infrastructure/firebase/verify-admin-user";
import { isDocumentIntelligenceEnabled } from "@/types/document-intelligence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RefundBody {
  reason: string;
}

/** Statuses from which a refund transition is allowed. */
const REFUNDABLE_STATUSES: string[] = [
  "completed",
  "failed_retryable",
  "failed_terminal",
];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
): Promise<NextResponse> {
  if (!isDocumentIntelligenceEnabled()) {
    return NextResponse.json(
      { ok: false, error: { code: "FEATURE_DISABLED", message: "Document Intelligence is not enabled." } },
      { status: 503 },
    );
  }

  const admin = await requireAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Admin authentication required" } },
      { status: 401 },
    );
  }

  const { jobId } = await params;

  if (!jobId || jobId.trim().length === 0) {
    return NextResponse.json(
      { ok: false, error: { code: "INVALID_REQUEST", message: "jobId is required" } },
      { status: 400 },
    );
  }

  // Parse body
  let body: RefundBody;
  try {
    const raw: unknown = await request.json();
    if (typeof raw !== "object" || raw === null) {
      return NextResponse.json(
        { ok: false, error: { code: "INVALID_BODY", message: "Request body must be a JSON object" } },
        { status: 400 },
      );
    }
    body = raw as RefundBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: "INVALID_BODY", message: "Request body must be valid JSON" } },
      { status: 400 },
    );
  }

  const reason = body?.reason?.trim();
  if (!reason) {
    return NextResponse.json(
      { ok: false, error: { code: "MISSING_REASON", message: "A refund reason is required" } },
      { status: 400 },
    );
  }

  const db = getAdminFirestore();
  if (!db) {
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Infrastructure not available" } },
      { status: 500 },
    );
  }

  try {
    const jobRef = db.collection("documentIntelligenceJobs").doc(jobId);
    const snap = await jobRef.get();

    if (!snap.exists) {
      return NextResponse.json(
        { ok: false, error: { code: "NOT_FOUND", message: "Job not found" } },
        { status: 404 },
      );
    }

    const job = snap.data()!;
    const currentStatus = job.status as string;

    // Validate refund transition
    if (!REFUNDABLE_STATUSES.includes(currentStatus)) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "INVALID_STATUS",
            message: `Cannot refund job in status "${currentStatus}". Only ${REFUNDABLE_STATUSES.join(", ")} jobs can be refunded.`,
          },
        },
        { status: 409 },
      );
    }

    // Verify the job was paid (had a payment transaction)
    const paymentStatus = job.paymentStatus as string;
    if (paymentStatus !== "paid" && paymentStatus !== "refunded") {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "NOT_PAID",
            message: `Job payment status is "${paymentStatus}". Refund requires a paid job.`,
          },
        },
        { status: 409 },
      );
    }

    const now = new Date().toISOString();

    // Record immutable refund event BEFORE updating job status
    const refundEventRef = jobRef.collection("refundEvents").doc();
    await refundEventRef.set({
      action: "refund_initiated",
      performedBy: admin.uid,
      performedByEmail: admin.email,
      reason,
      previousStatus: currentStatus,
      previousPaymentStatus: paymentStatus,
      timestamp: now,
      _immutable: true,
    });

    // Update job status to refunded
    await jobRef.update({
      status: "refunded",
      paymentStatus: "refunded",
      updatedAt: now,
      refundedAt: now,
      refundReason: reason,
      refundedBy: admin.uid,
    });

    // Log audit event
    const auditRef = jobRef.collection("audit").doc();
    await auditRef.set({
      action: "refund",
      performedBy: admin.uid,
      performedByEmail: admin.email,
      reason,
      previousStatus: currentStatus,
      newStatus: "refunded",
      refundEventId: refundEventRef.id,
      timestamp: now,
      _immutable: true,
    });

    return NextResponse.json({
      ok: true,
      data: {
        jobId,
        action: "refund",
        previousStatus: currentStatus,
        newStatus: "refunded",
        refundEventId: refundEventRef.id,
        timestamp: now,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred." } },
      { status: 500 },
    );
  }
}
