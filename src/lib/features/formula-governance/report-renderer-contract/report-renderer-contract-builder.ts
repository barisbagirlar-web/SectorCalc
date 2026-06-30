/**
 * Report renderer contract builder — Phase 5I-F no actual file output.
 */

import { buildReportRendererDataContract } from "@/lib/features/formula-governance/report-renderer-contract/report-renderer-data-contract";
import { buildFormatRules } from "@/lib/features/formula-governance/report-renderer-contract/report-renderer-format-contract";
import {
  evaluateRendererReadiness,
  resolveRendererStatus,
} from "@/lib/features/formula-governance/report-renderer-contract/report-renderer-readiness";
import { mapExportSectionsToRendererSections } from "@/lib/features/formula-governance/report-renderer-contract/report-renderer-section-plan";
import type { ReportRendererContract } from "@/lib/features/formula-governance/report-renderer-contract/report-renderer-types";
import type { TrustTraceExportContract } from "@/lib/features/formula-governance/trust-trace-report/export-contract/trust-trace-export-types";

export function buildReportRendererContract(
  exportContract: TrustTraceExportContract,
): ReportRendererContract {
  const status = resolveRendererStatus(exportContract);
  const readiness = evaluateRendererReadiness(exportContract);
  const dataContract = buildReportRendererDataContract(exportContract);
  const blockers = [...exportContract.blockers];
  const warnings = [...exportContract.warnings];

  for (const prohibited of ["secrets", "raw_env", "internal_stack_traces"] as const) {
    if (!dataContract.prohibitedFields.includes(prohibited)) {
      blockers.push(`${exportContract.slug}: missing prohibited field ${prohibited}.`);
    }
  }

  if (dataContract.requiredFields.length === 0) {
    blockers.push(`${exportContract.slug}: dataContract requiredFields cannot be empty.`);
  }

  return {
    slug: exportContract.slug,
    title: exportContract.reportTitle,
    sourceTrustTraceExportContract: {
      slug: exportContract.slug,
      status: exportContract.status,
    },
    supportedFormats: ["pdf", "excel", "word"],
    sections: mapExportSectionsToRendererSections(exportContract),
    formatRules: buildFormatRules(exportContract.slug),
    dataContract,
    readiness,
    status,
    blockers,
    warnings,
  };
}
