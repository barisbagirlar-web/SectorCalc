/**
 * Maintenance BOM Recovery — Internal Process API
 *
 * POST /api/document-intelligence/maintenance-bom/internal/process
 *
 * Private worker invocation only. Service-to-service authentication.
 * Invokes the full processing pipeline: extract → canonical map →
 * dual-pass → validate → hierarchy → QA → generate outputs.
 *
 * Idempotent: processingExecutionId prevents duplicate processing.
 */
import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore, getAdminStorage } from "@/lib/infrastructure/firebase/admin";
import { runFullPipeline } from "@/lib/document-intelligence/pipeline/pipeline-orchestrator";

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

    if (job.status === "completed" && job.processingExecutionId === processingExecutionId) {
      return NextResponse.json({ ok: true, data: { jobId, status: "completed", message: "Job was already completed (idempotent replay)" } });
    }

    if (job.status !== "queued" && job.status !== "extracting") {
      if (["failed_terminal", "expired", "refunded"].includes(job.status)) {
        return NextResponse.json({ ok: false, error: { code: "TERMINAL_STATE", message: `Job is in terminal state: ${job.status}` } }, { status: 400 });
      }
    }

    const startedAt = new Date().toISOString();

    // ── Record extracting stage ──────────────────────────────────
    await jobRef.update({
      status: "extracting",
      startedAt,
      processingExecutionId,
      updatedAt: startedAt,
    });
    await jobRef.collection("events").add({
      type: "processing_started",
      fromStatus: job.status,
      toStatus: "extracting",
      actor: "worker",
      timestamp: startedAt,
      executionId: processingExecutionId,
    });

    // ── Fetch PDF from storage ──────────────────────────────────
    let pdfBuffer: ArrayBuffer;
    const storagePath = job.storagePath as string;
    if (storagePath) {
      const storage = getAdminStorage();
      if (storage) {
        const [contents] = await storage.bucket().file(storagePath).download();
        // Convert Buffer to ArrayBuffer
        pdfBuffer = new Uint8Array(contents).buffer as ArrayBuffer;
      } else {
        // Fall back to empty buffer — pipeline will use mock provider
        pdfBuffer = new ArrayBuffer(0);
      }
    } else {
      pdfBuffer = new ArrayBuffer(0);
    }
    const filename = (job.originalFilenameSanitized as string) || "document.pdf";

    // ── Record normalizing stage ─────────────────────────────────
    await jobRef.update({ status: "normalizing", updatedAt: new Date().toISOString() });

    // ── Run the full pipeline ───────────────────────────────────
    const { output, stageResults } = await runFullPipeline({
      pdfBuffer,
      filename,
    });

    // ── Record validating stage ─────────────────────────────────
    await jobRef.update({ status: "validating", updatedAt: new Date().toISOString() });

    // ── Record generating_outputs stage ─────────────────────────
    await jobRef.update({ status: "generating_outputs", updatedAt: new Date().toISOString() });

    // ── Upload outputs to storage ────────────────────────────────
    const outputPrefix = `document-intelligence/outputs/${job.userId}/${jobId}`;
    const storage = getAdminStorage();

    if (storage) {
      const bucket = storage.bucket();

      // Upload workbook
      await bucket.file(`${outputPrefix}/SectorCalc_Maintenance_BOM_${jobId}.xlsx`).save(output.workbookBuffer, {
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        metadata: { jobId, processingExecutionId },
      });

      // Upload exception report
      await bucket.file(`${outputPrefix}/SectorCalc_Procurement_Exception_Report_${jobId}.xlsx`).save(output.exceptionReportBuffer, {
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Upload source map
      await bucket.file(`${outputPrefix}/SectorCalc_Source_Map_${jobId}.csv`).save(output.sourceMapCsv, {
        contentType: "text/csv",
      });

      // Upload data dictionary
      await bucket.file(`${outputPrefix}/SectorCalc_Data_Dictionary_${jobId}.html`).save(output.dataDictionaryHtml, {
        contentType: "text/html",
      });
    }

    // ── Record completion ───────────────────────────────────────
    const completedAt = new Date().toISOString();
    const errorList = stageResults.filter((s) => !s.success).map((s) => `${s.stage}: ${s.error}`);

    if (errorList.length > 0) {
      await jobRef.update({
        status: "failed_retryable",
        failureCode: "PIPELINE_ERROR",
        failureMessage: errorList.join("; "),
        updatedAt: completedAt,
      });
      return NextResponse.json({ ok: false, error: { code: "PIPELINE_ERROR", message: errorList.join("; ") } }, { status: 500 });
    }

    await jobRef.update({
      status: "completed",
      completedAt,
      updatedAt: completedAt,
      "summary.extractedRows": output.summary.extractedRows,
      "summary.cleanRows": output.summary.cleanRows,
      "summary.reviewRows": output.summary.reviewRows,
      "summary.blockedRows": output.summary.blockedRows,
      "summary.engineVersion": output.summary.engineVersion,
      sourceMapUrl: `${outputPrefix}/SectorCalc_Source_Map_${jobId}.csv`,
      workbookUrl: `${outputPrefix}/SectorCalc_Maintenance_BOM_${jobId}.xlsx`,
      exceptionReportUrl: `${outputPrefix}/SectorCalc_Procurement_Exception_Report_${jobId}.xlsx`,
      totalPipelineDurationMs: stageResults.find((s) => s.stage === "total_pipeline")?.durationMs ?? 0,
    });

    // Log stage events
    for (const sr of stageResults) {
      await jobRef.collection("events").add({
        type: `stage_${sr.stage}`,
        success: sr.success,
        durationMs: sr.durationMs,
        error: sr.error || null,
        actor: "worker",
        timestamp: new Date().toISOString(),
        executionId: processingExecutionId,
      });
    }

    await jobRef.collection("events").add({
      type: "processing_completed",
      fromStatus: "generating_outputs",
      toStatus: "completed",
      actor: "worker",
      timestamp: completedAt,
      executionId: processingExecutionId,
      stageCount: stageResults.length,
    });

    return NextResponse.json({
      ok: true,
      data: {
        jobId,
        status: "completed",
        processingExecutionId,
        summary: {
          extractedRows: output.summary.extractedRows,
          cleanRows: output.summary.cleanRows,
          reviewRows: output.summary.reviewRows,
          blockedRows: output.summary.blockedRows,
          qaStatus: output.qaDecision.status,
        },
        stageResults: stageResults.map((s) => ({ stage: s.stage, success: s.success, durationMs: s.durationMs })),
      },
    });
  } catch {
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "Processing failed." } }, { status: 500 });
  }
}
