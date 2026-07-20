/**
 * Maintenance BOM Recovery — Internal Process API
 *
 * POST /api/document-intelligence/maintenance-bom/internal/process
 *
 * Private worker invocation only. Service-to-service authentication.
 * Delegates to the shared in-process orchestrator (`processJob`) so the
 * worker path and the synchronous execute path share one implementation.
 *
 * Idempotent: processingExecutionId prevents duplicate processing.
 */
import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";
import { processJob } from "@/lib/document-intelligence/pipeline/process-job";
import { consumeEntitlement, releaseEntitlement } from "@/lib/document-intelligence/entitlements/maintenance-bom-entitlement";

const INTERNAL_AUTH_TOKEN = process.env.DOCUMENT_WORKER_SECRET || process.env.INTERNAL_AUTH_TOKEN;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ProcessRequest {
  jobId: string;
  processingExecutionId: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // ── Service-to-service auth ──────────────────────────────────
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !INTERNAL_AUTH_TOKEN || authHeader !== `Bearer ${INTERNAL_AUTH_TOKEN}`) {
      return NextResponse.json({ ok: false, error: { code: "TASK_AUTH_FAILURE", message: "Invalid service authentication" } }, { status: 401 });
    }

    const body: ProcessRequest = await request.json();
    const { jobId, processingExecutionId } = body;
    if (!jobId || !processingExecutionId) {
      return NextResponse.json({ ok: false, error: { code: "INVALID_REQUEST", message: "jobId and processingExecutionId are required" } }, { status: 400 });
    }

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

    // ── Execution-id guard ───────────────────────────────────────
    if (job.processingExecutionId && job.processingExecutionId !== processingExecutionId) {
      return NextResponse.json({ ok: false, error: { code: "EXECUTION_ID_MISMATCH", message: "processingExecutionId does not match job record" } }, { status: 409 });
    }

    if (["failed_terminal", "expired", "refunded"].includes(job.status)) {
      return NextResponse.json({ ok: false, error: { code: "TERMINAL_STATE", message: `Job is in terminal state: ${job.status}` } }, { status: 400 });
    }

    // ── Run shared orchestrator ─────────────────────────────────
    const result = await processJob(jobId, processingExecutionId);

    // ── Compensation: refund credits on failure (idempotent guard) ─
    if (!result.ok && job.entitlementStatus === "reserved") {
      const release = await releaseEntitlement(job.userId, jobId);
      if (release.ok) {
        await jobRef.update({ entitlementStatus: "released", paymentStatus: "refunded", updatedAt: new Date().toISOString() });
      }
    } else if (result.ok && job.entitlementStatus === "reserved") {
      await consumeEntitlement(job.userId, jobId, job.checkoutRequestId ?? "");
      await jobRef.update({ entitlementStatus: "consumed", updatedAt: new Date().toISOString() });
    }

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: { code: result.failureCode ?? "PIPELINE_ERROR", message: result.failureMessage ?? "Processing failed." } }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data: { jobId, status: result.status, processingExecutionId, summary: result.summary } });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "Processing failed." } }, { status: 500 });
  }
}
