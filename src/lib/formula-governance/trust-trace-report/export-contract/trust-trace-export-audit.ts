/**
 * Trust trace export contract audit — Phase 5I-C single contract validation.
 */

import { buildTrustTraceExportContract } from "@/lib/formula-governance/trust-trace-report/export-contract/trust-trace-export-contract-builder";
import { DEFAULT_REDACTION_RULES } from "@/lib/formula-governance/trust-trace-report/export-contract/trust-trace-export-section-map";
import type { TrustTraceExportContract } from "@/lib/formula-governance/trust-trace-report/export-contract/trust-trace-export-types";
import type { TrustTraceReport } from "@/lib/formula-governance/trust-trace-report/trust-trace-types";

export function auditTrustTraceExportContract(report: TrustTraceReport): TrustTraceExportContract {
  const contract = buildTrustTraceExportContract(report);
  const blockers = [...contract.blockers];

  if (!contract.disclaimerRequired) {
    blockers.push(`${contract.slug}: disclaimerRequired must be true.`);
  }

  for (const rule of ["no_secrets", "no_raw_env"] as const) {
    if (!contract.redactionRules.includes(rule)) {
      blockers.push(`${contract.slug}: missing redaction rule ${rule}.`);
    }
  }

  if (!contract.sections.includes("audit_appendix")) {
    blockers.push(`${contract.slug}: audit_appendix section required.`);
  }

  if (contract.redactionRules.length !== DEFAULT_REDACTION_RULES.length) {
    blockers.push(`${contract.slug}: redaction rules must be deterministic and complete.`);
  }

  return {
    ...contract,
    blockers: [...new Set(blockers)],
  };
}
