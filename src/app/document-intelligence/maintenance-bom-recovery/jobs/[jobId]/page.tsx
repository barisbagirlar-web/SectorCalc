/**
 * Maintenance BOM Recovery — Job Detail
 *
 * Route: /document-intelligence/maintenance-bom-recovery/jobs/[jobId]
 * Client component for job status monitoring, progress tracking,
 * and output artifact downloads.
 *
 * States covered:
 * - Loading (skeleton)
 * - Error (fetch failure / API rejection)
 * - Each processing stage (diagnostic → paid → queued → extracting →
 *   normalizing → validating → generating_outputs)
 * - Completed (summary metrics + download buttons + retention notice)
 * - Failed (retryable / terminal)
 * - Expired / Refunded
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getFirebaseAuth } from "@/lib/infrastructure/firebase/auth";
import type {
  JobStatus,
  PaymentStatus,
  ProcessingSummary,
  OutputManifest,
} from "@/types/document-intelligence";

/* ── Design Tokens ─────────────────────────────────────────────── */

const ACCENT = "#BD5D3A";
const TEXT = "#1A1915";
const MUTED = "#696764";
const BG = "#F0EEE6";
const CARD_BG = "#FFFFFF";
const CARD_BG_ALT = "#FAF8F2";
const BORDER = "rgba(26,25,21,0.10)";
const GREEN = "#22C55E";
const RED = "#EF4444";
const AMBER = "#F59E0B";
const BLUE = "#3B82F6";

/* ── Types ──────────────────────────────────────────────────────── */

interface JobDetailResponse {
  ok: boolean;
  data: {
    jobId: string;
    status: JobStatus;
    paymentStatus: PaymentStatus;
    diagnosticStatus: string | null;
    summary: ProcessingSummary | null;
    outputManifest: OutputManifest | null;
    errorCode: string | null;
    errorMessage: string | null;
    createdAt: string;
    updatedAt: string;
    expiresAt: string | null;
  };
}

type PageState = "loading" | "not_found" | "error" | "ready";

/* ── Human Labels ──────────────────────────────────────────────── */

const STATUS_LABELS: Record<JobStatus, string> = {
  diagnostic_uploaded: "Uploaded",
  diagnostic_scanning: "Scanning Document",
  diagnostic_eligible: "Eligible — Awaiting Payment",
  diagnostic_manual_review: "Manual Review Required",
  diagnostic_rejected: "Document Rejected",
  awaiting_payment: "Awaiting Payment",
  paid: "Payment Confirmed",
  queued: "Queued for Processing",
  extracting: "Extracting Parts Data",
  normalizing: "Normalizing Part Numbers",
  validating: "Validating & Detecting Exceptions",
  generating_outputs: "Generating Output Workbook",
  completed: "Completed",
  failed_retryable: "Processing Failed — Retrying",
  failed_terminal: "Processing Failed",
  expired: "Expired",
  refunded: "Refunded",
};

const STATUS_GROUPS: Record<string, JobStatus[]> = {
  diagnostic: [
    "diagnostic_uploaded",
    "diagnostic_scanning",
    "diagnostic_eligible",
    "diagnostic_manual_review",
    "diagnostic_rejected",
  ],
  payment: ["awaiting_payment", "paid"],
  processing: ["queued", "extracting", "normalizing", "validating", "generating_outputs"],
  terminal: ["completed", "failed_retryable", "failed_terminal", "expired", "refunded"],
};

const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  checkout_pending: "Checkout Pending",
  paid: "Paid",
  refunded: "Refunded",
  chargeback: "Chargeback",
  payment_failed: "Payment Failed",
};

/* ── Helpers ────────────────────────────────────────────────────── */

function isProcessingStatus(s: JobStatus): boolean {
  return STATUS_GROUPS.processing.includes(s);
}

function isTerminalStatus(s: JobStatus): boolean {
  return STATUS_GROUPS.terminal.includes(s);
}

function isFailedStatus(s: JobStatus): boolean {
  return s === "failed_retryable" || s === "failed_terminal";
}

function isCompletedStatus(s: JobStatus): boolean {
  return s === "completed";
}

function statusColor(s: JobStatus): string {
  if (s === "completed") return GREEN;
  if (s === "failed_terminal" || s === "expired" || s === "refunded") return RED;
  if (s === "failed_retryable") return AMBER;
  if (isProcessingStatus(s)) return BLUE;
  return MUTED;
}

function statusIcon(status: JobStatus): string {
  if (status === "completed") {
    return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
  }
  if (isFailedStatus(status)) {
    return "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
  }
  if (isProcessingStatus(status)) {
    return "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15";
  }
  if (status === "expired" || status === "refunded") {
    return "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z";
  }
  return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
}

function processingStageIndex(status: JobStatus): number {
  const stages: JobStatus[] = ["queued", "extracting", "normalizing", "validating", "generating_outputs"];
  return stages.indexOf(status);
}

/* ── Component ──────────────────────────────────────────────────── */

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  const [pageState, setPageState] = useState<PageState>("loading");
  const [job, setJob] = useState<JobDetailResponse["data"] | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchJob = useCallback(async () => {
    setPageState("loading");
    setErrorMessage("");

    const auth = getFirebaseAuth();
    const currentUser = auth?.currentUser;

    try {
      const headers: Record<string, string> = { accept: "application/json" };
      if (currentUser) {
        const token = await currentUser.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(
        `/api/document-intelligence/maintenance-bom/jobs/${encodeURIComponent(jobId)}`,
        { headers }
      );

      if (!res.ok) {
        if (res.status === 404) {
          setPageState("not_found");
          return;
        }
        throw new Error(`Server returned ${res.status}`);
      }

      const body: JobDetailResponse = await res.json();

      if (!body.ok || !body.data) {
        throw new Error(body.data?.errorMessage ?? "Invalid response from server.");
      }

      setJob(body.data);
      setPageState("ready");
    } catch (err) {
      setPageState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load job details."
      );
    }
  }, [jobId]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  /* ── Render helpers ──────────────────────────────────────────── */

  function renderSkeleton() {
    return (
      <div className="space-y-6">
        <div className="h-4 w-64" style={{ background: BORDER }} />
        <div className="h-8 w-96" style={{ background: BORDER }} />
        <div className="p-8" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full" style={{ background: BORDER }} />
            <div className="h-6 w-48" style={{ background: BORDER }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12" style={{ background: BORDER }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderStatusBadge(status: JobStatus) {
    const color = statusColor(status);
    return (
      <span
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold"
        style={{
          background: `${color}18`,
          color,
          border: `1px solid ${color}40`,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d={statusIcon(status)} />
        </svg>
        {STATUS_LABELS[status]}
      </span>
    );
  }

  function renderPaymentBadge(paymentStatus: PaymentStatus) {
    const colorMap: Record<PaymentStatus, string> = {
      unpaid: MUTED,
      checkout_pending: AMBER,
      paid: GREEN,
      refunded: RED,
      chargeback: RED,
      payment_failed: RED,
    };
    const bgMap: Record<PaymentStatus, string> = {
      unpaid: `${MUTED}18`,
      checkout_pending: `${AMBER}18`,
      paid: `${GREEN}18`,
      refunded: `${RED}18`,
      chargeback: `${RED}18`,
      payment_failed: `${RED}18`,
    };
    const c = colorMap[paymentStatus];
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium"
        style={{ background: bgMap[paymentStatus], color: c, border: `1px solid ${c}40` }}
      >
        {PAYMENT_LABELS[paymentStatus]}
      </span>
    );
  }

  function renderProgressBar(status: JobStatus) {
    if (!isProcessingStatus(status) && !isCompletedStatus(status)) return null;
    const stages: JobStatus[] = ["queued", "extracting", "normalizing", "validating", "generating_outputs"];
    const stageLabels = ["Queued", "Extracting", "Normalizing", "Validating", "Generating"];
    const currentIdx = isCompletedStatus(status) ? stages.length : processingStageIndex(status);

    return (
      <div className="mb-8 p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
        <h3 className="font-semibold mb-4 text-sm" style={{ color: MUTED }}>
          Processing Progress
        </h3>
        <div className="flex items-center gap-0">
          {stages.map((s, idx) => {
            const isActive = idx === currentIdx;
            const isDone = idx < currentIdx;
            const isPending = idx > currentIdx;
            const circleColor = isDone ? GREEN : isActive ? ACCENT : BORDER;
            const lineColor = idx > 0 && stages[idx - 1] && idx <= currentIdx ? GREEN : BORDER;

            return (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                {/* Connector line */}
                {idx > 0 && (
                  <div
                    className="flex-1 h-0.5"
                    style={{
                      background: lineColor,
                      transition: "background 0.3s ease",
                    }}
                  />
                )}
                {/* Circle + label */}
                <div className="flex flex-col items-center min-w-[72px]">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: isDone || isActive ? circleColor : "transparent",
                      color: isDone || isActive ? "#FFFFFF" : MUTED,
                      border: isPending ? `2px solid ${BORDER}` : "none",
                    }}
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`Stage ${idx + 1}: ${stageLabels[idx]}`}
                  >
                    {isDone ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span
                    className="text-xs mt-1.5 text-center leading-tight"
                    style={{
                      color: isActive ? ACCENT : isDone ? GREEN : MUTED,
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {stageLabels[idx]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderSummaryMetrics(summary: ProcessingSummary) {
    const metrics: Array<{ label: string; value: number | string; color?: string }> = [
      { label: "Extracted Rows", value: summary.extractedRows, color: BLUE },
      { label: "Clean Rows", value: summary.cleanRows, color: GREEN },
      { label: "Review Required", value: summary.reviewRows, color: AMBER },
      { label: "Blocked Rows", value: summary.blockedRows, color: RED },
      { label: "Duplicate Groups", value: summary.duplicateGroups, color: AMBER },
      { label: "Missing Fields", value: summary.missingFieldCount, color: AMBER },
      { label: "Revision Conflicts", value: summary.revisionConflictCount, color: RED },
      { label: "Low Confidence", value: summary.lowConfidenceCount, color: AMBER },
    ];

    return (
      <div className="mb-8">
        <h3 className="font-semibold mb-4 text-sm" style={{ color: MUTED }}>
          Processing Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="p-4 border"
              style={{ background: CARD_BG, borderColor: BORDER }}
            >
              <div
                className="text-2xl font-bold mb-1"
                style={{ color: m.color ?? TEXT }}
              >
                {typeof m.value === "number" ? m.value.toLocaleString() : m.value}
              </div>
              <div className="text-xs leading-tight" style={{ color: MUTED }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderDownloadSection(outputManifest: OutputManifest) {
    const fileIcons: Record<string, string> = {
      xlsx:
        "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6",
      csv: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z M12 3v6h6",
      html:
        "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    };

    return (
      <div className="mb-8 p-6 border" style={{ background: CARD_BG, borderColor: BORDER }}>
        <h3 className="font-semibold mb-4">Download Outputs</h3>
        <div className="space-y-3">
          {outputManifest.files.map((file) => {
            const ext = file.filename.split(".").pop() ?? "file";
            const icon = fileIcons[ext] ?? "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z";
            const sizeKB = Math.round(file.sizeBytes / 1024);

            return (
              <div
                key={file.filename}
                className="flex items-center justify-between p-3"
                style={{ background: CARD_BG_ALT }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth="1.5"
                    className="flex-shrink-0"
                    aria-hidden="true"
                  >
                    <path d={icon} />
                  </svg>
                  <div className="min-w-0">
                    <code className="text-sm font-mono block truncate">
                      {file.filename}
                    </code>
                    <span className="text-xs" style={{ color: MUTED }}>
                      {sizeKB} KB · {file.contentType}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium"
                  style={{
                    background: ACCENT,
                    color: "#FFFFFF",
                    border: "none",
                    cursor: "pointer",
                    minHeight: 44,
                    minWidth: 44,
                  }}
                  onClick={async () => {
                    const auth = getFirebaseAuth();
                    const user = auth?.currentUser;
                    if (!user) return;
                    try {
                      const token = await user.getIdToken();
                      const res = await fetch(
                        `/api/document-intelligence/maintenance-bom/jobs/${encodeURIComponent(outputManifest.jobId)}/downloads`,
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      if (!res.ok) return;
                      const body = await res.json();
                      if (!body.ok || !body.data?.artifacts) return;
                      const match = body.data.artifacts.find(
                        (a: { filename: string }) => a.filename === file.filename
                      );
                      if (match?.url) window.open(match.url, "_blank");
                    } catch {
                      // Silent fail — user can retry
                    }
                  }}
                  aria-label={`Download ${file.filename}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3" />
                  </svg>
                  Download
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderRetentionNotice(expiresAt: string) {
    const expiresMs = new Date(expiresAt).getTime() - Date.now();
    const remainingDays = Math.max(0, Math.ceil(expiresMs / 86400000));

    return (
      <div
        className="p-4 mb-8 text-sm flex items-start gap-3"
        style={{
          background: `${AMBER}10`,
          border: `1px solid ${AMBER}30`,
          color: "#92400E",
        }}
        role="alert"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="flex-shrink-0 mt-0.5"
          aria-hidden="true"
        >
          <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <strong className="block mb-0.5">Retention Notice</strong>
          <span>
            Output artifacts are automatically deleted{" "}
            {remainingDays > 0
              ? `in ${remainingDays} day${remainingDays !== 1 ? "s" : ""} (${new Date(expiresAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })})`
              : "today"}. Download all required files before they expire.
          </span>
        </div>
      </div>
    );
  }

  function renderFailureMessage() {
    if (!job || !isFailedStatus(job.status)) return null;

    const isRetryable = job.status === "failed_retryable";
    const icon = isRetryable
      ? "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      : "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";

    return (
      <div
        className="p-6 mb-8 border"
        style={{
          background: CARD_BG,
          borderColor: isRetryable ? `${AMBER}50` : `${RED}50`,
          borderLeft: `4px solid ${isRetryable ? AMBER : RED}`,
        }}
        role="alert"
      >
        <div className="flex items-start gap-3">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isRetryable ? AMBER : RED}
            strokeWidth="2"
            className="flex-shrink-0 mt-0.5"
            aria-hidden="true"
          >
            <path d={icon} />
          </svg>
          <div>
            <h3 className="font-bold mb-1" style={{ color: isRetryable ? AMBER : RED }}>
              {isRetryable ? "Transient Processing Error" : "Processing Failed"}
            </h3>
            <p className="text-sm mb-3" style={{ color: MUTED }}>
              {job.errorMessage ?? "An unexpected error occurred during processing."}
            </p>
            {job.errorCode && (
              <code className="text-xs px-2 py-1" style={{ background: `${MUTED}18`, color: MUTED }}>
                Error code: {job.errorCode}
              </code>
            )}
            {isRetryable && (
              <p className="text-xs mt-3" style={{ color: MUTED }}>
                The system will retry automatically. If the issue persists, contact support.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Main Render ──────────────────────────────────────────────── */

  return (
    <main className="min-h-screen" style={{ background: BG, color: TEXT }}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8" style={{ color: MUTED }}>
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/document-intelligence" className="hover:underline">Document Intelligence</Link>
          <span className="mx-2">›</span>
          <Link href="/document-intelligence/maintenance-bom-recovery" className="hover:underline">Maintenance BOM Recovery</Link>
          <span className="mx-2">›</span>
          <span>Job {jobId}</span>
        </nav>

        {/* Loading */}
        {pageState === "loading" && renderSkeleton()}

        {/* Not Found */}
        {pageState === "not_found" && (
          <div className="p-8 text-center border" style={{ background: CARD_BG, borderColor: BORDER }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke={MUTED}
              strokeWidth="1.5"
              className="mx-auto mb-4"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h2 className="text-xl font-bold mb-2">Job Not Found</h2>
            <p className="mb-6" style={{ color: MUTED }}>
              The job <code className="font-mono">{jobId}</code> does not exist or has expired.
            </p>
            <Link
              href="/document-intelligence/maintenance-bom-recovery"
              className="inline-flex items-center px-6 py-3 font-medium"
              style={{
                background: ACCENT,
                color: "#FFFFFF",
              }}
            >
              Back to Maintenance BOM Recovery
            </Link>
          </div>
        )}

        {/* Error */}
        {pageState === "error" && (
          <div className="p-8 text-center border" style={{ background: CARD_BG, borderColor: BORDER }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke={RED}
              strokeWidth="1.5"
              className="mx-auto mb-4"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <h2 className="text-xl font-bold mb-2" style={{ color: RED }}>
              Failed to Load Job
            </h2>
            <p className="mb-6" style={{ color: MUTED }}>
              {errorMessage}
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                className="px-6 py-3 font-medium"
                style={{
                  background: ACCENT,
                  color: "#FFFFFF",
                  border: "none",
                  cursor: "pointer",
                  minHeight: 44,
                  minWidth: 44,
                }}
                onClick={fetchJob}
              >
                Retry
              </button>
              <Link
                href="/document-intelligence/maintenance-bom-recovery"
                className="inline-flex items-center px-6 py-3 font-medium border"
                style={{ borderColor: BORDER, color: TEXT, minHeight: 44 }}
              >
                Go Back
              </Link>
            </div>
          </div>
        )}

        {/* Ready State */}
        {pageState === "ready" && job && (
          <>
            {/* Header Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Job {jobId}
                </h1>
                <p className="mt-1 text-sm" style={{ color: MUTED }}>
                  Created {new Date(job.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {renderStatusBadge(job.status)}
                {renderPaymentBadge(job.paymentStatus)}
              </div>
            </div>

            {/* Review link for completed jobs */}
            {isCompletedStatus(job.status) && (
              <div className="mb-6">
                <Link
                  href={`/document-intelligence/maintenance-bom-recovery/jobs/${encodeURIComponent(jobId)}/review`}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium"
                  style={{
                    background: CARD_BG,
                    color: ACCENT,
                    border: `1px solid ${ACCENT}`,
                    minHeight: 44,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Review Exceptions
                </Link>
              </div>
            )}

            {/* Processing Progress Bar */}
            {renderProgressBar(job.status)}

            {/* Failure Message */}
            {renderFailureMessage()}

            {/* Completed: Summary Metrics + Downloads */}
            {isCompletedStatus(job.status) && job.summary && (
              <>
                {renderSummaryMetrics(job.summary)}

                {/* Source info card */}
                <div className="mb-8 p-4 text-sm" style={{ background: CARD_BG_ALT, border: `1px solid ${BORDER}` }}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span style={{ color: MUTED }}>Source file: </span>
                      <span className="font-medium">{job.summary.inputFilename}</span>
                    </div>
                    <div>
                      <span style={{ color: MUTED }}>Pages processed: </span>
                      <span className="font-medium">{job.summary.processedPages}</span>
                    </div>
                    <div>
                      <span style={{ color: MUTED }}>Engine: </span>
                      <span className="font-medium">{job.summary.engineVersion}</span>
                    </div>
                    <div>
                      <span style={{ color: MUTED }}>Schema: </span>
                      <span className="font-medium">{job.summary.schemaVersion}</span>
                    </div>
                  </div>
                </div>

                {/* Downloads */}
                {job.outputManifest && renderDownloadSection(job.outputManifest)}

                {/* Retention Notice */}
                {job.expiresAt && renderRetentionNotice(job.expiresAt)}
              </>
            )}

            {/* Pre-completion informational states */}
            {!isTerminalStatus(job.status) && !isFailedStatus(job.status) && (
              <div className="p-8 text-center border" style={{ background: CARD_BG, borderColor: BORDER }}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={BLUE}
                  strokeWidth="1.5"
                  className="mx-auto mb-4"
                  aria-hidden="true"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                <h3 className="text-lg font-semibold mb-2">Processing in Progress</h3>
                <p className="text-sm mb-4" style={{ color: MUTED }}>
                  {STATUS_LABELS[job.status]}.
                  {job.status === "awaiting_payment" && (
                    <span className="block mt-2">
                      Complete payment to start processing.
                    </span>
                  )}
                </p>
                {job.status === "awaiting_payment" && (
                  <Link
                    href="/pricing"
                    className="inline-flex items-center px-6 py-3 font-semibold text-white"
                    style={{ background: ACCENT, minHeight: 44 }}
                  >
                    Pay 149 Credits
                  </Link>
                )}
                {(isProcessingStatus(job.status)) && (
                  <button
                    type="button"
                    className="mt-4 px-6 py-2 text-sm font-medium border"
                    style={{ borderColor: BORDER, color: MUTED, cursor: "pointer", minHeight: 44 }}
                    onClick={fetchJob}
                  >
                    Refresh Status
                  </button>
                )}
              </div>
            )}

            {/* Expired / Refunded terminal states */}
            {(job.status === "expired" || job.status === "refunded") && (
              <div className="p-8 text-center border" style={{ background: CARD_BG, borderColor: BORDER }}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={MUTED}
                  strokeWidth="1.5"
                  className="mx-auto mb-4"
                  aria-hidden="true"
                >
                  <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold mb-2">
                  Job {job.status === "expired" ? "Expired" : "Refunded"}
                </h3>
                <p className="text-sm mb-6" style={{ color: MUTED }}>
                  {job.status === "expired"
                    ? "This job has expired. Output artifacts are no longer available."
                    : "This job has been refunded. Output artifacts are no longer available."}
                </p>
                <Link
                  href="/document-intelligence/maintenance-bom-recovery/new"
                  className="inline-flex items-center px-6 py-3 font-semibold text-white"
                  style={{ background: ACCENT, minHeight: 44 }}
                >
                  Start New Job
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
