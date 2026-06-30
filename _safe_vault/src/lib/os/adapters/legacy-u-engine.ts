/**
 * Legacy U-Engine adapters for MarginCore pipelines.
 */

import {
 auditSeverityToVerdictCode,
 runLegacyDiagnostic,
 type AuditReport,
 type AuditSeverity,
 type ProcessVariables,
} from "@/lib/os/core/audit-gen";
import { UEngine, type AuditMetrics, type UEngineAnalysisResult } from "@/lib/os/core/u-engine";

export type { AuditMetrics, UEngineAnalysisResult, AuditReport, AuditSeverity, ProcessVariables };
export { UEngine, auditSeverityToVerdictCode };

export interface LegacyPerformAuditInput {
 target: number;
 actual: number;
 costImpact: number;
}

export type AuditStatus = "CRITICAL_DRIFT" | "OPERATIONAL_OK";

export interface PerformAuditResult {
 variancePct: string;
 financialLoss: string;
 status: AuditStatus;
 recommendation: string;
}

export function performAudit(
 input: LegacyPerformAuditInput,
 threshold: number
): PerformAuditResult {
 const core = UEngine.analyze({
 target: input.target,
 actual: input.actual,
 unitCost: input.costImpact,
 tolerance: threshold,
 });

 return {
 variancePct: core.variancePct,
 financialLoss: core.financialLoss,
 status: core.severity === "CRITICAL" ? "CRITICAL_DRIFT" : "OPERATIONAL_OK",
 recommendation: core.recommendation,
 };
}

export function runDiagnostic(vars: ProcessVariables): AuditReport {
 const output = runLegacyDiagnostic({
 target: vars.target,
 actual: vars.actual,
 unitCost: vars.costPerUnit,
 tolerance: vars.tolerance,
 });

 return {
 variance: Math.abs(output.variancePct),
 financialLoss: output.financialImpact,
 severity: output.severity,
 recommendation: output.diagnostic,
 };
}

export function auditStatusToVerdictCode(status: AuditStatus): string {
 return status === "CRITICAL_DRIFT"
 ? "CRITICAL_INEFFICIENCY"
 : "WITHIN_OPERATIONAL_LIMIT";
}
