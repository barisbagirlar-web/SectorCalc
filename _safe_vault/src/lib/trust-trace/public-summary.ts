/**
 * Public summary builder — safe limited data for public verify endpoint
 */
import type { ApprovedReportPayload } from "./types";

/**
 * Build a safe public summary from an approved report.
 * Contains ONLY non-private metadata safe for public exposure.
 * Never includes: full snapshots, userEmail, userId, auditTrail, secrets.
 */
export function buildPublicReportSummary(
  report: ApprovedReportPayload
): ApprovedReportPayload["publicSummary"] {
  return {
    toolSlug: report.toolSlug,
    toolType: report.toolType,
    formulaVersion: report.formulaVersion,
    issuedAt: report.issuedAt,
    validationStampId: report.validationStampId,
  };
}