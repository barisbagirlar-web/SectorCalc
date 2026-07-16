/**
 * API Route: POST /api/document-intelligence/admin/jobs/{jobId}/retry
 *
 * Retries a failed_retryable job. Moves the job back to "queued" so the
 * processing pipeline picks it up again. Records an audit event.
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

interface RetryBody {
  reason: string;
}

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
  let body: RetryBody;
  try {
    const raw: unknown = await request.json();
    if (typeof raw !== "object" || raw === null) {
      return NextResponse.json(
        { ok: false, error: { code: "INVALID_BODY", message: "Request body must be a JSON object" } },
        { status: 400 },
      );
    }
    body = raw as RetryBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: "INVALID_BODY", message: "Request body must be valid JSON" } },
      { status: 400 },
    );
  }

  const reason = body?.reason?.trim();
  if (!reason) {
    return NextResponse.json(
      { ok: false, error: { code: "MISSING_REASON", message: "A retry reason is required" } },
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

    // Only failed_retryable jobs can be retried
    if (currentStatus !== "failed_retryable") {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "INVALID_STATUS",
            message: `Cannot retry job in status "${currentStatus}". Only "failed_retryable" jobs can be retried.`,
          },
        },
        { status: 409 },
      );
    }

    const now = new Date().toISOString();
    const retryCount = (job.retryCount as number) ?? 0;

    // Move back to queued for re-processing
    await jobRef.update({
      status: "queued",
      updatedAt: now,
      retryCount: retryCount + 1,
      lastRetryReason: reason,
      lastRetriedBy: admin.uid,
      lastRetriedAt: now,
      failureCode: null,
    });

    // Log audit event in a subcollection
    const auditRef = jobRef.collection("audit").doc();
    await auditRef.set({
      action: "retry",
      performedBy: admin.uid,
      performedByEmail: admin.email,
      reason,
      previousStatus: currentStatus,
      newStatus: "queued",
      timestamp: now,
      _immutable: true,
    });

    return NextResponse.json({
      ok: true,
      data: {
        jobId,
        action: "retry",
        previousStatus: currentStatus,
        newStatus: "queued",
        retryCount: retryCount + 1,
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
