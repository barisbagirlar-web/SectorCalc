/**
 * API Route: GET /api/document-intelligence/maintenance-bom/jobs/[jobId]
 *
 * Owner-only safe job state retrieval.
 * Returns full job state for authenticated owner.
 */

import { NextRequest, NextResponse } from "next/server";
import { parseBearerToken, verifySignedInUser } from "@/lib/infrastructure/firebase/verify-signed-in-user";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { isDocumentIntelligenceEnabled } from "@/types/document-intelligence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  if (!isDocumentIntelligenceEnabled()) {
    return NextResponse.json(
      { ok: false, error: { code: "FEATURE_DISABLED", message: "Document Intelligence is not enabled." } },
      { status: 503 },
    );
  }

  try {
    const token = parseBearerToken(request);
    if (!token) {
      return NextResponse.json({ ok: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } }, { status: 401 });
    }

    const user = await verifySignedInUser(token);
    if (!user) {
      return NextResponse.json({ ok: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } }, { status: 401 });
    }

    const { jobId } = await params;

    const db = getAdminFirestore();
    if (!db) {
      return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "Infrastructure not available" } }, { status: 500 });
    }

    const jobRef = db.collection("documentIntelligenceJobs").doc(jobId);
    const snap = await jobRef.get();

    if (!snap.exists) {
      return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: "Job not found" } }, { status: 404 });
    }

    const job = snap.data()!;

    // Tenant isolation: owner can only access own job
    if (job.userId !== user.uid) {
      return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: "Access denied" } }, { status: 403 });
    }

    // Return safe subset of job data (no source URLs, no internal fields)
    return NextResponse.json({
      ok: true,
      data: {
        jobId,
        status: job.status || null,
        diagnosticStatus: job.diagnosticStatus || null,
        paymentStatus: job.paymentStatus || "unpaid",
        entitlementStatus: job.entitlementStatus || "none",
        originalFilename: job.originalFilenameSanitized || null,
        mimeType: job.mimeType || null,
        fileSizeBytes: job.fileSizeBytes || null,
        pageCount: job.pageCount || null,
        detectedLanguage: job.detectedLanguage || null,
        estimatedRows: job.estimatedRows || null,
        engineVersion: job.engineVersion || null,
        validatorVersion: job.validatorVersion || null,
        schemaVersion: job.schemaVersion || null,
        createdAt: job.createdAt || null,
        updatedAt: job.updatedAt || null,
        completedAt: job.completedAt || null,
        expiresAt: job.expiresAt || null,
        sourceDeletedAt: job.sourceDeletedAt || null,
        failureCode: job.failureCode || null,
        failurePublicMessage: job.failurePublicMessage || null,
        retryCount: job.retryCount || 0,
        processingExecutionId: job.processingExecutionId || null,
        acceptedLimits: job.acceptedLimitsSnapshot || null,
        metricsSummary: job.metricsSummary || null,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred." } }, { status: 500 });
  }
}
