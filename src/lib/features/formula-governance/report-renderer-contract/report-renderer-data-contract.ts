/**
 * Report renderer data contract - Phase 5I-F field requirements.
 */

import type { ReportRendererDataContract } from "@/lib/features/formula-governance/report-renderer-contract/report-renderer-types";
import type { TrustTraceExportContract } from "@/lib/features/formula-governance/trust-trace-report/export-contract/trust-trace-export-types";

export const PROHIBITED_RENDERER_FIELDS = [
  "secrets",
  "raw_env",
  "firebase_credentials",
  "internal_stack_traces",
  "llm_formula_claims",
  "user_pii_unapproved",
] as const;

export function buildReportRendererDataContract(
  exportContract: TrustTraceExportContract,
): ReportRendererDataContract {
  const requiredFields = [
    "slug",
    "reportTitle",
    "trustScore",
    "disclaimerRequired",
    ...exportContract.requiredDataSources,
  ];

  const optionalFields = [
    "warningTrace",
    "limitationTrace",
    "oracleCoverage",
    "scenarioCoverage",
    "propertyCoverage",
  ];

  const redactedFields = [...exportContract.redactionRules];

  const missingRequired = exportContract.missingDataSources.filter((source) =>
    requiredFields.includes(source),
  );

  return {
    requiredFields: requiredFields.filter((field) => !missingRequired.includes(field)),
    optionalFields,
    redactedFields,
    prohibitedFields: [...PROHIBITED_RENDERER_FIELDS],
  };
}
