/**
 * Document Intelligence — Type Contracts
 *
 * Versioned internal schema for Maintenance BOM Recovery.
 * All boundary payloads require runtime validation.
 */

/* ── Product & Pricing ──────────────────────────────────────────── */

export const MAINTENANCE_BOM_PRODUCT_CODE = "maintenance_bom_recovery_v1" as const;
export const MAINTENANCE_BOM_PRICE_USD = 149 as const;

export const MAINTENANCE_BOM_MAX_PAGES = 50;
export const MAINTENANCE_BOM_MAX_ROWS = 500;
export const MAINTENANCE_BOM_MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB
export const MAINTENANCE_BOM_SOURCE_RETENTION_HOURS = 24;
export const MAINTENANCE_BOM_OUTPUT_RETENTION_DAYS = 7;
export const MAINTENANCE_BOM_SIGNED_URL_TTL_SECONDS = 300;

/* ── Job Statuses ──────────────────────────────────────────────── */

export const JOB_STATUSES = [
  "diagnostic_uploaded",
  "diagnostic_scanning",
  "diagnostic_eligible",
  "diagnostic_manual_review",
  "diagnostic_rejected",
  "awaiting_payment",
  "paid",
  "queued",
  "extracting",
  "normalizing",
  "validating",
  "generating_outputs",
  "completed",
  "failed_retryable",
  "failed_terminal",
  "expired",
  "refunded",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const VALID_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  diagnostic_uploaded: ["diagnostic_scanning", "failed_terminal"],
  diagnostic_scanning: ["diagnostic_eligible", "diagnostic_manual_review", "diagnostic_rejected", "failed_terminal"],
  diagnostic_eligible: ["awaiting_payment", "failed_terminal"],
  diagnostic_manual_review: ["failed_terminal"],
  diagnostic_rejected: ["failed_terminal"],
  awaiting_payment: ["paid", "failed_terminal"],
  paid: ["queued", "failed_terminal"],
  queued: ["extracting", "failed_terminal"],
  extracting: ["normalizing", "failed_retryable", "failed_terminal"],
  normalizing: ["validating", "failed_retryable", "failed_terminal"],
  validating: ["generating_outputs", "failed_retryable", "failed_terminal"],
  generating_outputs: ["completed", "failed_retryable", "failed_terminal"],
  completed: ["expired", "refunded"],
  failed_retryable: ["queued", "expired"],
  failed_terminal: ["expired"],
  expired: [],
  refunded: [],
};

/* ── Diagnostic ────────────────────────────────────────────────── */

export type DiagnosticStatus = "eligible" | "manual_review_required" | "rejected" | "diagnostic_failed";

export interface DiagnosticResult {
  status: DiagnosticStatus;
  readable: boolean;
  passwordProtected: boolean;
  pageCount: number;
  nativeTextAvailable: boolean;
  probableBomFound: boolean;
  probableLanguage: string;
  estimatedRowCount: number;
  rejectionReasons: string[];
  previewRows: BomPreviewRow[];
  detectedColumns: string[];
  detectedRisks: string[];
}

export interface BomPreviewRow {
  rowIndex: number;
  sourcePage: number;
  columns: Record<string, string>;
}

/* ── Payment States ────────────────────────────────────────────── */

export type PaymentStatus = "unpaid" | "checkout_pending" | "paid" | "refunded" | "chargeback" | "payment_failed";
export type EntitlementStatus = "none" | "reserved" | "consumed" | "released" | "compensated";

/* ── Canonical BOM Schema ──────────────────────────────────────── */

export interface BomRow {
  itemNumber: number;
  partNumberRaw: string | null;
  partNumberNormalized: string | null;
  descriptionRaw: string | null;
  descriptionNormalized: string | null;
  quantity: number | null;
  unit: string | null;
  material: string | null;
  manufacturer: string | null;
  manufacturerPartNumber: string | null;
  revision: string | null;
  equipment: string | null;
  subassembly: string | null;
  sourceDocument: string;
  sourcePage: number;
  sourceTable: string;
  sourceRow: number;
  confidence: number;
  validationStatus: ValidationStatus;
  validationFlags: string[];
  reviewRequired: boolean;
  exportDisposition: ExportDisposition;
}

export type ValidationStatus = "clean" | "review_required" | "blocked";
export type ExportDisposition = "clean" | "review_required" | "excluded_duplicate";

/* ── Part Normalization ────────────────────────────────────────── */

export interface NormalizedPart {
  displayValue: string;
  comparisonKey: string;
  appliedRules: string[];
  warnings: string[];
}

/* ── Duplicate Detection ───────────────────────────────────────── */

export type DuplicateType =
  | "exact_normalized"
  | "conflicting_description"
  | "conflicting_revision"
  | "conflicting_manufacturer"
  | "probable_formatting"
  | "same_description_different_part"
  | "duplicate_source_row";

export type DuplicateSeverity = "critical" | "high" | "medium" | "low" | "information";

export interface DuplicateGroup {
  duplicateGroupId: string;
  duplicateType: DuplicateType;
  severity: DuplicateSeverity;
  records: number[];
  sourcePages: number[];
  recommendedDisposition: string;
  autoMergeAllowed: boolean;
}

/* ── Missing Field Detection ───────────────────────────────────── */

export type MissingFieldType =
  | "missing_part_number"
  | "missing_description"
  | "missing_quantity"
  | "invalid_quantity"
  | "missing_revision"
  | "missing_material"
  | "missing_manufacturer"
  | "unresolved_equipment"
  | "unresolved_subassembly";

export interface MissingFieldException {
  type: MissingFieldType;
  rowIndex: number;
  severity: DuplicateSeverity;
  exportBlocking: boolean;
}

/* ── Revision Conflict Detection ───────────────────────────────── */

export type RevisionConflictType =
  | "multiple_revisions"
  | "title_block_mismatch"
  | "partial_missing_revision"
  | "ocr_confusion"
  | "mixed_revision_schemes";

export interface RevisionConflict {
  partNumber: string;
  observedRevisions: string[];
  sourcePages: number[];
  conflictType: RevisionConflictType;
  severity: DuplicateSeverity;
  reviewRequired: boolean;
}

/* ── Exception Report ──────────────────────────────────────────── */

export type ExceptionSeverity = "critical" | "high" | "medium" | "low" | "information";

export interface ProcurementException {
  type: string;
  severity: ExceptionSeverity;
  description: string;
  rowIndex: number | null;
  partNumber: string | null;
  sourcePage: number;
  recommendation: string;
}

/* ── Processing Summary ────────────────────────────────────────── */

export interface ProcessingSummary {
  inputFilename: string;
  processedPages: number;
  extractedRows: number;
  cleanRows: number;
  reviewRows: number;
  blockedRows: number;
  duplicateGroups: number;
  missingFieldCount: number;
  revisionConflictCount: number;
  lowConfidenceCount: number;
  engineVersion: string;
  validatorVersion: string;
  schemaVersion: string;
  generatedAt: string;
}

/* ── Output Manifest ───────────────────────────────────────────── */

export interface OutputManifest {
  jobId: string;
  outputGenerationId: string;
  files: OutputFileEntry[];
  summary: ProcessingSummary;
  generatedAt: string;
}

export interface OutputFileEntry {
  filename: string;
  contentType: string;
  sizeBytes: number;
  sha256: string;
  storagePath: string;
}

/* ── State Machine Errors ──────────────────────────────────────── */

export type ErrorCode =
  | "INPUT_REJECTED"
  | "AUTHORIZATION_FAILED"
  | "PAYMENT_NOT_CONFIRMED"
  | "ENTITLEMENT_CONFLICT"
  | "STORAGE_FAILURE"
  | "PROVIDER_TRANSIENT"
  | "PROVIDER_INVALID_OUTPUT"
  | "NORMALIZATION_FAILURE"
  | "VALIDATION_FAILURE"
  | "OUTPUT_GENERATION_FAILURE"
  | "OUTPUT_INTEGRITY_FAILURE"
  | "TASK_AUTH_FAILURE"
  | "RETENTION_DELETE_FAILURE"
  | "INTERNAL_CONTRACT_VIOLATION";

export const ERROR_TAXONOMY: Record<ErrorCode, { retryable: boolean; maxRetries: number }> = {
  INPUT_REJECTED: { retryable: false, maxRetries: 0 },
  AUTHORIZATION_FAILED: { retryable: false, maxRetries: 0 },
  PAYMENT_NOT_CONFIRMED: { retryable: false, maxRetries: 0 },
  ENTITLEMENT_CONFLICT: { retryable: false, maxRetries: 0 },
  STORAGE_FAILURE: { retryable: true, maxRetries: 3 },
  PROVIDER_TRANSIENT: { retryable: true, maxRetries: 3 },
  PROVIDER_INVALID_OUTPUT: { retryable: false, maxRetries: 0 },
  NORMALIZATION_FAILURE: { retryable: true, maxRetries: 2 },
  VALIDATION_FAILURE: { retryable: true, maxRetries: 2 },
  OUTPUT_GENERATION_FAILURE: { retryable: true, maxRetries: 3 },
  OUTPUT_INTEGRITY_FAILURE: { retryable: true, maxRetries: 2 },
  TASK_AUTH_FAILURE: { retryable: false, maxRetries: 0 },
  RETENTION_DELETE_FAILURE: { retryable: true, maxRetries: 3 },
  INTERNAL_CONTRACT_VIOLATION: { retryable: false, maxRetries: 0 },
};

/* ── Feature Flag ──────────────────────────────────────────────── */

export function isDocumentIntelligenceEnabled(): boolean {
  return process.env.DOCUMENT_INTELLIGENCE_ENABLED === "true";
}

export function getProductVersion(): string {
  return process.env.MAINTENANCE_BOM_ENGINE_VERSION ?? "1.0.0";
}
