/**
 * API Route: Admin/Operator Control Plane — Job Management
 *
 * GET  /api/document-intelligence/admin/jobs?status=stuck&limit=20
 *   List jobs with safe metadata. Supports status filtering.
 *   No document content exposed in responses.
 *
 * Auth: Bearer token + admin custom claim (admin: true)
 *
 * Dependencies:
 *   - getAdminFirestore from @/lib/infrastructure/firebase/admin
 *   - requireAdminFromRequest from @/lib/infrastructure/firebase/verify-admin-user
 */

import { type NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { requireAdminFromRequest } from "@/lib/infrastructure/firebase/verify-admin-user";
import { isDocumentIntelligenceEnabled } from "@/types/document-intelligence";
import type { JobStatus } from "@/types/document-intelligence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ── Status filter mapping ────────────────────────────────────── */

const STUCK_STATUSES: JobStatus[] = [
  "diagnostic_uploaded",
  "diagnostic_scanning",
  "queued",
  "extracting",
];

const STATUS_FILTERS: Record<string, JobStatus[] | undefined> = {
  stuck: STUCK_STATUSES,
  pending_payment: ["awaiting_payment"],
  processing: ["extracting", "normalizing", "validating", "generating_outputs"],
  failed: ["failed_retryable", "failed_terminal"],
};

/* ── Job Safe Metadata ────────────────────────────────────────── */

interface AdminJobView {
  jobId: string;
  userId: string;
  status: JobStatus | null;
  paymentStatus: string | null;
  entitlementStatus: string | null;
  diagnosticStatus: string | null;
  originalFilename: string | null;
  fileSizeBytes: number | null;
  pageCount: number | null;
  engineVersion: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  completedAt: string | null;
  expiresAt: string | null;
  failureCode: string | null;
  retryCount: number;
  processingExecutionId: string | null;
}

function toAdminJobView(id: string, data: Record<string, unknown>): AdminJobView {
  return {
    jobId: id,
    userId: (data.userId as string) ?? "",
    status: (data.status as JobStatus) ?? null,
    paymentStatus: (data.paymentStatus as string) ?? null,
    entitlementStatus: (data.entitlementStatus as string) ?? null,
    diagnosticStatus: (data.diagnosticStatus as string) ?? null,
    originalFilename: (data.originalFilenameSanitized as string) ?? null,
    fileSizeBytes: (data.fileSizeBytes as number) ?? null,
    pageCount: (data.pageCount as number) ?? null,
    engineVersion: (data.engineVersion as string) ?? null,
    createdAt: (data.createdAt as string) ?? null,
    updatedAt: (data.updatedAt as string) ?? null,
    completedAt: (data.completedAt as string) ?? null,
    expiresAt: (data.expiresAt as string) ?? null,
    failureCode: (data.failureCode as string) ?? null,
    retryCount: (data.retryCount as number) ?? 0,
    processingExecutionId: (data.processingExecutionId as string) ?? null,
  };
}

/* ── GET /api/document-intelligence/admin/jobs ─────────────────── */

export async function GET(request: NextRequest): Promise<NextResponse> {
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

  const db = getAdminFirestore();
  if (!db) {
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "Infrastructure not available" } },
      { status: 500 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status") ?? "all";
    const limitStr = searchParams.get("limit") ?? "20";
    const limit = Math.min(Math.max(parseInt(limitStr, 10) || 20, 1), 100);

    let query: FirebaseFirestore.Query = db.collection("documentIntelligenceJobs");

    // Apply status filter
    if (statusFilter !== "all") {
      const statuses = STATUS_FILTERS[statusFilter];
      if (!statuses) {
        return NextResponse.json(
          {
            ok: false,
            error: {
              code: "INVALID_FILTER",
              message: `Invalid status filter "${statusFilter}". Valid filters: all, stuck, pending_payment, processing, failed`,
            },
          },
          { status: 400 },
        );
      }
      query = query.where("status", "in", statuses);
    }

    const snapshot = await query
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const jobs: AdminJobView[] = [];
    snapshot.forEach((doc) => {
      jobs.push(toAdminJobView(doc.id, doc.data() as Record<string, unknown>));
    });

    return NextResponse.json({
      ok: true,
      data: {
        jobs,
        count: jobs.length,
        limit,
        filter: statusFilter,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred." } },
      { status: 500 },
    );
  }
}
