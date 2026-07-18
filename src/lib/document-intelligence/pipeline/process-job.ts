/**
 * Document Intelligence — Job Processing Orchestrator (in-process)
 *
 * Runs the full processing pipeline for a single job and persists every
 * state transition to Firestore. Designed as an n8n-style workflow node:
 * deterministic, idempotent, with an explicit success/failure outcome that
 * the caller uses to drive credit consumption vs. compensation (refund).
 *
 * This function NEVER touches the credit ledger; entitlement finalization
 * (consume on success, release on failure) is the caller's responsibility so
 * that compensation stays centralized and idempotent at a single site.
 */
import "server-only";

import { getAdminFirestore, getAdminStorage } from "@/lib/infrastructure/firebase/admin";
import { runFullPipeline } from "@/lib/document-intelligence/pipeline/pipeline-orchestrator";
import {
  OUTPUT_ARTIFACT_SPECS,
  artifactFilename,
  artifactStoragePath,
  outputStoragePrefix,
} from "@/lib/document-intelligence/pipeline/output-artifacts";
import {
  MAINTENANCE_BOM_OUTPUT_RETENTION_DAYS,
  type ProcessingSummary,
} from "@/types/document-intelligence";

export interface ProcessJobResult {
  ok: boolean;
  status: "completed" | "failed_terminal";
  failureCode?: string;
  failureMessage?: string;
  summary?: Partial<ProcessingSummary>;
}

/* ── Deterministic processing summary HTML ─────────────────────────── */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildProcessingSummaryHtml(jobId: string, summary: ProcessingSummary): string {
  const rows: Array<[string, string | number]> = [
    ["Job ID", jobId],
    ["Source file", summary.inputFilename],
    ["Pages processed", summary.processedPages],
    ["Extracted rows", summary.extractedRows],
    ["Clean rows", summary.cleanRows],
    ["Review-required rows", summary.reviewRows],
    ["Blocked rows", summary.blockedRows],
    ["Duplicate groups", summary.duplicateGroups],
    ["Missing-field exceptions", summary.missingFieldCount],
    ["Revision conflicts", summary.revisionConflictCount],
    ["Low-confidence rows", summary.lowConfidenceCount],
    ["QA status", summary.qaStatus],
    ["Engine version", summary.engineVersion],
    ["Validator version", summary.validatorVersion],
    ["Schema version", summary.schemaVersion],
    ["Generated at", summary.generatedAt],
  ];
  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><th scope="row" style="text-align:left;padding:6px 12px;border-bottom:1px solid #E0DDD4;color:#696764;font-weight:500">${escapeHtml(
          String(k),
        )}</th><td style="padding:6px 12px;border-bottom:1px solid #E0DDD4;color:#1A1915">${escapeHtml(
          String(v),
        )}</td></tr>`,
    )
    .join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Processing Summary — ${escapeHtml(
    jobId,
  )}</title></head><body style="font-family:Arial,Helvetica,sans-serif;background:#F0EEE6;color:#1A1915;margin:0;padding:32px"><main style="max-width:720px;margin:0 auto;background:#FFFFFF;border:1px solid #E0DDD4;padding:32px"><h1 style="font-size:20px;margin:0 0 4px">SectorCalc — Maintenance BOM Recovery</h1><p style="margin:0 0 24px;color:#696764">Processing Summary</p><table style="width:100%;border-collapse:collapse;font-size:14px">${tableRows}</table><p style="margin-top:24px;font-size:12px;color:#696764">Technical simulation. Review flagged and business-critical records before ERP import, RFQ, purchasing, maintenance, or engineering use.</p></main></body></html>`;
}

/* ── Orchestrator ──────────────────────────────────────────────────── */

export async function processJob(
  jobId: string,
  processingExecutionId: string,
): Promise<ProcessJobResult> {
  const db = getAdminFirestore();
  if (!db) {
    return { ok: false, status: "failed_terminal", failureCode: "INFRA_UNAVAILABLE", failureMessage: "Firestore not available" };
  }

  const jobRef = db.collection("documentIntelligenceJobs").doc(jobId);

  try {
    const jobSnap = await jobRef.get();
    if (!jobSnap.exists) {
      return { ok: false, status: "failed_terminal", failureCode: "NOT_FOUND", failureMessage: "Job not found" };
    }
    const job = jobSnap.data()!;

    // Idempotent replay: already completed with the same execution id.
    if (job.status === "completed" && job.processingExecutionId === processingExecutionId) {
      return { ok: true, status: "completed", summary: job.summary };
    }

    const nowIso = () => new Date().toISOString();

    // ── Stage: extracting ────────────────────────────────────────
    await jobRef.update({ status: "extracting", startedAt: nowIso(), processingExecutionId, updatedAt: nowIso() });
    await jobRef.collection("events").add({
      type: "processing_started",
      fromStatus: job.status,
      toStatus: "extracting",
      actor: "orchestrator",
      timestamp: nowIso(),
      executionId: processingExecutionId,
    });

    // ── Fetch source PDF (best-effort; pipeline falls back to mock) ─
    let pdfBuffer = new ArrayBuffer(0);
    const storagePath = job.storagePath as string | undefined;
    const storage = getAdminStorage();
    if (storagePath && storage) {
      try {
        const [contents] = await storage.bucket().file(storagePath).download();
        pdfBuffer = new Uint8Array(contents).buffer as ArrayBuffer;
      } catch {
        pdfBuffer = new ArrayBuffer(0);
      }
    }
    const filename = (job.originalFilenameSanitized as string) || (job.originalFilename as string) || "document.pdf";

    // ── Stage: normalizing → pipeline ────────────────────────────
    await jobRef.update({ status: "normalizing", updatedAt: nowIso() });
    const { output, stageResults } = await runFullPipeline({ pdfBuffer, filename });

    const failedStages = stageResults.filter((s) => !s.success).map((s) => `${s.stage}: ${s.error ?? "unknown error"}`);
    if (failedStages.length > 0) {
      const failureMessage = failedStages.join("; ");
      await jobRef.update({
        status: "failed_terminal",
        failureCode: "PIPELINE_ERROR",
        failureMessage,
        updatedAt: nowIso(),
      });
      await jobRef.collection("events").add({
        type: "processing_failed",
        toStatus: "failed_terminal",
        actor: "orchestrator",
        timestamp: nowIso(),
        executionId: processingExecutionId,
        error: failureMessage,
      });
      return { ok: false, status: "failed_terminal", failureCode: "PIPELINE_ERROR", failureMessage };
    }

    // ── Stage: validating ────────────────────────────────────────
    await jobRef.update({ status: "validating", updatedAt: nowIso() });

    // ── Stage: generating_outputs → upload artifacts ─────────────
    await jobRef.update({ status: "generating_outputs", updatedAt: nowIso() });

    const userId = job.userId as string;
    const summaryHtml = buildProcessingSummaryHtml(jobId, output.summary);
    const artifactContentByKind: Record<string, Buffer | string> = {
      workbook: output.workbookBuffer,
      exception_report: output.exceptionReportBuffer,
      source_map: output.sourceMapCsv,
      summary_html: summaryHtml,
    };

    if (storage) {
      const bucket = storage.bucket();
      for (const spec of OUTPUT_ARTIFACT_SPECS) {
        const body = artifactContentByKind[spec.kind];
        if (body === undefined) continue;
        await bucket.file(artifactStoragePath(userId, jobId, spec)).save(body, {
          contentType: spec.contentType,
          metadata: { metadata: { jobId, processingExecutionId } },
        });
      }
    }

    // ── Stage: completed ─────────────────────────────────────────
    const completedAt = nowIso();
    const expiresAt = new Date(Date.now() + MAINTENANCE_BOM_OUTPUT_RETENTION_DAYS * 86_400_000).toISOString();
    const prefix = outputStoragePrefix(userId, jobId);
    const workbookSpec = OUTPUT_ARTIFACT_SPECS.find((s) => s.kind === "workbook")!;
    const exceptionSpec = OUTPUT_ARTIFACT_SPECS.find((s) => s.kind === "exception_report")!;
    const sourceMapSpec = OUTPUT_ARTIFACT_SPECS.find((s) => s.kind === "source_map")!;

    await jobRef.update({
      status: "completed",
      completedAt,
      updatedAt: completedAt,
      expiresAt,
      summary: output.summary,
      workbookUrl: `${prefix}/${artifactFilename(workbookSpec, jobId)}`,
      exceptionReportUrl: `${prefix}/${artifactFilename(exceptionSpec, jobId)}`,
      sourceMapUrl: `${prefix}/${artifactFilename(sourceMapSpec, jobId)}`,
      totalPipelineDurationMs: stageResults.find((s) => s.stage === "total_pipeline")?.durationMs ?? 0,
    });

    await jobRef.collection("events").add({
      type: "processing_completed",
      fromStatus: "generating_outputs",
      toStatus: "completed",
      actor: "orchestrator",
      timestamp: completedAt,
      executionId: processingExecutionId,
      stageCount: stageResults.length,
    });

    return { ok: true, status: "completed", summary: output.summary };
  } catch (err) {
    const failureMessage = err instanceof Error ? err.message : "Unexpected processing error";
    try {
      await jobRef.update({
        status: "failed_terminal",
        failureCode: "ORCHESTRATOR_EXCEPTION",
        failureMessage,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      /* best-effort */
    }
    return { ok: false, status: "failed_terminal", failureCode: "ORCHESTRATOR_EXCEPTION", failureMessage };
  }
}
