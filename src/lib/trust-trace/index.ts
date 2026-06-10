/**
 * Trust Trace — Approved Reports & Validation Stamp
 * Public API index
 */

// Types
export type {
  ApprovedReportStatus,
  ApprovedReportVisibility,
  ApprovedReportPayload,
  CreateApprovedReportInput,
  VerifyReportPublicResult,
  VerifyReportErrorResult,
  VerifyReportResult,
} from "./types";

// Hash service
export {
  canonicalizeReportPayload,
  createCalculationHash,
  verifyCalculationHash,
} from "./hash";

// Report ID service
export {
  createReportId,
  createValidationStampId,
  parseReportId,
} from "./report-id";

// Snapshot sanitizer
export {
  sanitizeSnapshot,
  isSafeSnapshotValue,
  isSecretLikeKey,
} from "./snapshot";

// Public summary
export { buildPublicReportSummary } from "./public-summary";

// Approved report service
export {
  buildApprovedReportPayload,
  createApprovedReport,
  getApprovedReportForVerify,
} from "./approved-report-service";

// Export helpers
export {
  buildApprovedReportHtml,
  buildApprovedReportCsv,
  buildApprovedReportWordHtml,
} from "./export";