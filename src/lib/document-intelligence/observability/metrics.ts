/**
 * Document Intelligence — Observability & Metrics
 *
 * Structured logging, metrics definitions, and alert configuration.
 * No private document content is written to logs or metrics.
 */

/* ── Structured Log Fields ────────────────────────────────────── */

export interface StructuredLogFields {
  requestId?: string;
  jobId?: string;
  userIdHash?: string; // SHA-256 prefix of userId, never full userId
  processingExecutionId?: string;
  stage?: string;
  durationMs?: number;
  retryCount?: number;
  provider?: string;
  errorCode?: string;
  engineVersion?: string;
  pageCount?: number;
  rowCount?: number;
}

export function sanitizeLogFields(fields: StructuredLogFields): Record<string, unknown> {
  // Strip any potential PII
  const safe: Record<string, unknown> = {};
  if (fields.requestId) safe.requestId = fields.requestId;
  if (fields.jobId) safe.jobId = fields.jobId;
  if (fields.userIdHash) safe.userIdHash = fields.userIdHash;
  if (fields.processingExecutionId) safe.processingExecutionId = fields.processingExecutionId;
  if (fields.stage) safe.stage = fields.stage;
  if (fields.durationMs !== undefined) safe.durationMs = fields.durationMs;
  if (fields.retryCount !== undefined) safe.retryCount = fields.retryCount;
  if (fields.provider) safe.provider = fields.provider;
  if (fields.errorCode) safe.errorCode = fields.errorCode;
  if (fields.engineVersion) safe.engineVersion = fields.engineVersion;
  if (fields.pageCount !== undefined) safe.pageCount = fields.pageCount;
  if (fields.rowCount !== undefined) safe.rowCount = fields.rowCount;
  return safe;
}

/* ── Metric Definitions ──────────────────────────────────────── */

export interface MetricDefinition {
  name: string;
  type: "counter" | "histogram" | "gauge";
  description: string;
  unit?: string;
}

export const DI_METRICS: MetricDefinition[] = [
  { name: "di_diagnostic_eligibility_rate", type: "counter", description: "Diagnostic eligibility rate by reason", unit: "count" },
  { name: "di_rejection_reasons", type: "counter", description: "Rejection reasons distribution", unit: "count" },
  { name: "di_processing_success_rate", type: "counter", description: "Processing success vs failure", unit: "count" },
  { name: "di_stage_duration_ms", type: "histogram", description: "Duration per processing stage", unit: "ms" },
  { name: "di_retry_rate", type: "counter", description: "Retry rate per stage", unit: "count" },
  { name: "di_terminal_failure_rate", type: "counter", description: "Terminal failure rate", unit: "count" },
  { name: "di_manual_review_rate", type: "counter", description: "Manual review rate", unit: "count" },
  { name: "di_rows_per_job", type: "histogram", description: "Rows per completed job", unit: "rows" },
  { name: "di_source_deletion_success", type: "counter", description: "Source deletion success rate", unit: "count" },
  { name: "di_output_download_rate", type: "counter", description: "Output download rate", unit: "count" },
  { name: "di_refund_rate", type: "counter", description: "Refund rate", unit: "count" },
  { name: "di_job_queue_depth", type: "gauge", description: "Current processing queue depth", unit: "jobs" },
  { name: "di_stuck_jobs", type: "gauge", description: "Jobs stuck beyond stage SLA", unit: "jobs" },
];

/* ── Alert Definitions ────────────────────────────────────────── */

export interface AlertDefinition {
  name: string;
  condition: string;
  severity: "critical" | "warning" | "info";
  description: string;
  runbookRef: string;
}

export const DI_ALERTS: AlertDefinition[] = [
  {
    name: "PaymentWithoutEntitlement",
    condition: "payment_succeeded_but_entitlement_missing",
    severity: "critical",
    description: "Payment succeeded but no entitlement record found",
    runbookRef: "INCIDENT_RUNBOOK.md#payment-without-entitlement",
  },
  {
    name: "PaidJobNotQueued",
    condition: "paid_job_not_queued_within_5_minutes",
    severity: "critical",
    description: "Paid job not queued for processing within SLA",
    runbookRef: "INCIDENT_RUNBOOK.md#job-stuck-beyond-sla",
  },
  {
    name: "JobStuckBeyondSLA",
    condition: "job_in_processing_state_beyond_stage_sla",
    severity: "warning",
    description: "Job stuck in processing state beyond expected duration",
    runbookRef: "INCIDENT_RUNBOOK.md#job-stuck-beyond-sla",
  },
  {
    name: "SourceDeletionFailed",
    condition: "source_deletion_cron_failed",
    severity: "warning",
    description: "Scheduled source deletion task failed",
    runbookRef: "INCIDENT_RUNBOOK.md#source-deletion-failure",
  },
  {
    name: "WebhookVerificationSpike",
    condition: "webhook_verification_failures_spike",
    severity: "critical",
    description: "Paddle webhook verification failures exceed threshold",
    runbookRef: "INCIDENT_RUNBOOK.md#paddle-webhook-failure",
  },
  {
    name: "TerminalFailureRateExceeded",
    condition: "terminal_failure_rate_exceeds_5_percent",
    severity: "warning",
    description: "Terminal failure rate exceeds launch threshold",
    runbookRef: "INCIDENT_RUNBOOK.md#terminal-failure-spike",
  },
  {
    name: "OutputCorruption",
    condition: "output_generation_corruption_detected",
    severity: "critical",
    description: "Output generation integrity check failed",
    runbookRef: "INCIDENT_RUNBOOK.md#corrupted-workbook",
  },
];
