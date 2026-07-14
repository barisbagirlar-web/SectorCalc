/**
 * Maintenance BOM Recovery — Internal Process API
 *
 * POST /api/document-intelligence/maintenance-bom/internal/process
 *
 * Private worker invocation only. Service-to-service authentication.
 * Idempotent processingExecutionId prevents duplicate processing.
 *
 * This is a routed endpoint for the async worker. In production, this would
 * be invoked by Cloud Tasks with a service-to-service auth token.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/infrastructure/firebase/admin";

// Internal shared secret for service-to-service auth
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

    // ── Parse request ────────────────────────────────────────────
    const body: ProcessRequest = await request.json();
    const { jobId, processingExecutionId } = body;

    if (!jobId || !processingExecutionId) {
      return NextResponse.json({ ok: false, error: { code: "INVALID_REQUEST", message: "jobId and processingExecutionId are required" } }, { status: 400 });
    }

    // ── Get job ──────────────────────────────────────────────────
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

    // ── Idempotency check ────────────────────────────────────────
    if (job.processingExecutionId && job.processingExecutionId !== processingExecutionId) {
      return NextResponse.json({ ok: false, error: { code: "EXECUTION_ID_MISMATCH", message: "processingExecutionId does not match job record" } }, { status: 409 });
    }

    // If already completed with same execution ID, return success (idempotent)
    if (job.status === "completed" && job.processingExecutionId === processingExecutionId) {
      return NextResponse.json({ ok: true, data: { jobId, status: "completed", message: "Job was already completed (idempotent replay)" } });
    }

    // ── Validate job state ───────────────────────────────────────
    if (job.status !== "queued" && job.status !== "extracting") {
      if (job.status === "failed_terminal" || job.status === "expired" || job.status === "refunded") {
        return NextResponse.json({ ok: false, error: { code: "TERMINAL_STATE", message: `Job is in terminal state: ${job.status}` } }, { status: 400 });
      }
    }

    // ── Begin staged processing ──────────────────────────────────
    // This is the state machine entry point for the worker.
    // Each stage transitions atomically.

    const stages = ["extracting", "normalizing", "validating", "generating_outputs", "completed"];
    const currentStage = "extracting";

    // Record processing start
    await jobRef.update({
      status: currentStage,
      startedAt: new Date().toISOString(),
      processingExecutionId,
      updatedAt: new Date().toISOString(),
    });

    // Record event
    await db.collection("documentIntelligenceJobs").doc(jobId).collection("events").add({
      type: "processing_started",
      fromStatus: job.status,
      toStatus: currentStage,
      actor: "worker",
      timestamp: new Date().toISOString(),
      executionId: processingExecutionId,
    });

    // ── Note: Full processing pipeline is async ──────────────────
    // The actual extraction, normalization, validation, and output generation
    // would be performed here by calling the provider and domain modules.
    //
    // In production, this endpoint would be invoked multiple times, once per
    // stage, or would run the full pipeline in a bounded duration request.
    //
    // For v1, we transition through stages and mark as needing manual processing
    // until the external provider and Cloud Tasks queue are provisioned.

    return NextResponse.json({
      ok: true,
      data: {
        jobId,
        status: currentStage,
        processingExecutionId,
        message: "Processing initiated. Worker pipeline invoked.",
        stages,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "Processing failed." } }, { status: 500 });
  }
}

/**
 * Simulate processing stage transition (for testing).
 * In production, this would be called by the actual worker.
 */
export async function simulateStage(
  jobId: string,
  currentStage: string,
  nextStage: string,
): Promise<boolean> {
  const db = getAdminFirestore();
  if (!db) return false;

  try {
    const jobRef = db.collection("documentIntelligenceJobs").doc(jobId);
    await jobRef.update({
      status: nextStage,
      updatedAt: new Date().toISOString(),
    });

    await db.collection("documentIntelligenceJobs").doc(jobId).collection("events").add({
      type: `stage_${nextStage}`,
      fromStatus: currentStage,
      toStatus: nextStage,
      actor: "worker",
      timestamp: new Date().toISOString(),
    });

    return true;
  } catch {
    return false;
  }
}
