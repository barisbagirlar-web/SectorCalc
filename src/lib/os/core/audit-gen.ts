/**
 * Audit generator - premium report generator (global).
 */

import type { IndustrySlug } from "@/lib/features/tools/industry-registry";
import type { IndustryDiagnosticConfig, PremiumRuleSeverity } from "@/lib/os/config/industry-config";
import { UEngine, type AuditMetrics, type UEngineAnalysisResult } from "@/lib/os/core/u-engine";
import {
 costBasisForUnitType,
 getSectorEntry,
 industrySlugToSectorKey,
 SectorRegistry,
 type SectorEntry,
 type SectorRegistryKey,
} from "@/lib/os/registry/sectors";
import { formatCurrency, formatNumber } from "@/lib/os/utils/formatters";

export type AuditSeverity = "OPTIMAL" | "WARNING" | "CRITICAL";

export interface ProcessMetrics {
 target: number;
 actual: number;
 unitCost: number;
 tolerance: number;
}

export interface AuditOutput {
 variance: number;
 variancePct: number;
 financialImpact: number;
 severity: AuditSeverity;
 diagnostic: string;
}

export interface AuditReport {
 variance: number;
 financialLoss: number;
 severity: AuditSeverity;
 recommendation: string;
}

export interface PremiumAuditReport extends AuditReport {
 sectorKey: string;
 sectorId: string;
 verdictCode: string;
 premiumAdvice: string | null;
 variancePctFormatted: string;
 financialLossFormatted: string;
}

export interface ProcessVariables {
 target: number;
 actual: number;
 costPerUnit: number;
 tolerance: number;
}

const OPTIMAL_DIAGNOSTIC = "Process stable. Standards maintained.";
const INVALID_DIAGNOSTIC =
 "Invalid input: target, actual, unit cost and tolerance must be numeric.";

export function auditSeverityToVerdictCode(severity: AuditSeverity): string {
 switch (severity) {
 case "CRITICAL":
 return "CRITICAL_INEFFICIENCY";
 case "WARNING":
 return "MARGIN_LEAK_WARNING";
 default:
 return "WITHIN_OPERATIONAL_LIMIT";
 }
}

export function runLegacyDiagnostic(m: ProcessMetrics): AuditOutput {
 if (
 !Number.isFinite(m.target) ||
 !Number.isFinite(m.actual) ||
 !Number.isFinite(m.unitCost) ||
 !Number.isFinite(m.tolerance)
 ) {
 return {
 variance: 0,
 variancePct: 0,
 financialImpact: 0,
 severity: "WARNING",
 diagnostic: INVALID_DIAGNOSTIC,
 };
 }

 const safeTolerance = m.tolerance > 0 ? m.tolerance : 0.05;
 const diff = m.actual - m.target;
 const varianceRatio =
 m.target === 0
 ? diff === 0
 ? 0
 : Math.sign(diff) || 1
 : diff / m.target;
 const variancePct = varianceRatio * 100;

 const core = UEngine.analyze({
 target: m.target,
 actual: m.actual,
 unitCost: m.unitCost,
 tolerance: safeTolerance,
 });
 const financialImpact = Number.parseFloat(core.financialLoss);

 let severity: AuditSeverity = "OPTIMAL";
 let diagnostic = core.recommendation;

 if (core.severity === "CRITICAL") {
 severity = "CRITICAL";
   diagnostic = `CRITICAL DEVIATION: Deviation of ${variancePct.toFixed(2)}% from target value of ${m.target}. 
This operational inefficiency costs you ${formatNumber(financialImpact)} units in value loss. 
Action: Optimize resource allocation and review calibration tolerances.`;
 } else if (Math.abs(varianceRatio) > safeTolerance / 2) {
 severity = "WARNING";
  diagnostic =
   "System at tolerance threshold. A small adjustment can yield 5% efficiency gain.";
 } else {
 diagnostic = OPTIMAL_DIAGNOSTIC;
 }

 return { variance: diff, variancePct, financialImpact, severity, diagnostic };
}

function severityToPremiumKey(severity: AuditSeverity): PremiumRuleSeverity {
 switch (severity) {
 case "CRITICAL":
 return "Critical";
 case "WARNING":
 return "Warning";
 default:
 return "Optimal";
 }
}

function resolveFinancialLoss(
 deviation: number,
 costPerUnit: number,
 costBasis: IndustryDiagnosticConfig["costBasis"]
): number {
 if (costBasis === "per-hour-on-minute-delta") {
 return deviation * (costPerUnit / 60);
 }
 if (costBasis === "per-hour-on-second-delta") {
 return deviation * (costPerUnit / 3600);
 }
 return deviation * costPerUnit;
}

function sectorToDiagnosticConfig(sector: SectorEntry): IndustryDiagnosticConfig {
 const [target, actual, cost] = sector.params;
 return {
 industry: sector.key,
 defaultTolerance: sector.defaultTolerance,
 params: { target, actual, cost },
 premiumRules: {},
 costBasis: costBasisForUnitType(sector.unitType, sector.params),
 };
}

export function toIndustryDiagnosticConfig(
 sector: SectorEntry
): IndustryDiagnosticConfig {
 return sectorToDiagnosticConfig(sector);
}

export interface IndustryAuditReport extends AuditReport {
 industry: string;
 verdictCode: string;
 premiumAdvice: string | null;
}

export function runIndustryDiagnostic(
 config: IndustryDiagnosticConfig,
 values: Record<string, number>
): IndustryAuditReport {
 const target = values[config.params.target];
 const actual = values[config.params.actual];
 const costPerUnit = values[config.params.cost];

 if (
 !Number.isFinite(target) ||
 !Number.isFinite(actual) ||
 !Number.isFinite(costPerUnit)
 ) {
 return {
 industry: config.industry,
 variance: 0,
 financialLoss: 0,
 severity: "WARNING",
 recommendation:
  "Missing or invalid risk variables. Target, actual and unit cost required.",
 verdictCode: "MARGIN_LEAK_WARNING",
 premiumAdvice: config.premiumRules.Warning ?? null,
 };
 }

 const vars: ProcessVariables = {
 target,
 actual,
 costPerUnit,
 tolerance: config.defaultTolerance,
 };

 const base = runLegacyDiagnostic({
 target: vars.target,
 actual: vars.actual,
 unitCost: vars.costPerUnit,
 tolerance: vars.tolerance,
 });

 const premiumKey = severityToPremiumKey(base.severity);
 const premiumAdvice = config.premiumRules[premiumKey] ?? null;
 const deviation = Math.abs(vars.actual - vars.target);
 const financialLoss = resolveFinancialLoss(
 deviation,
 vars.costPerUnit,
 config.costBasis ?? "direct"
 );

 const recommendation = premiumAdvice
 ? `${base.diagnostic} ${premiumAdvice}`
 : base.diagnostic;

 return {
 industry: config.industry,
 variance: Math.abs(base.variancePct),
 financialLoss,
 severity: base.severity,
 recommendation,
 verdictCode: auditSeverityToVerdictCode(base.severity),
 premiumAdvice,
 };
}

function extractSectorMetrics(
 sector: SectorEntry,
 values: Record<string, number>
): AuditMetrics | null {
 const [targetKey, actualKey, costKey] = sector.params;
 const target = values[targetKey];
 const actual = values[actualKey];
 const unitCost = values[costKey];

 if (
 !Number.isFinite(target) ||
 !Number.isFinite(actual) ||
 !Number.isFinite(unitCost)
 ) {
 return null;
 }

 return {
 target,
 actual,
 unitCost,
 tolerance: sector.defaultTolerance,
 };
}

export function runSectorAnalysis(
 key: SectorRegistryKey,
 values: Record<string, number>
): UEngineAnalysisResult {
 const sector = getSectorEntry(key);
 const metrics = extractSectorMetrics(sector, values);

 if (!metrics) {
 return UEngine.analyze({
 target: 0,
 actual: 0,
 unitCost: 0,
 tolerance: sector.defaultTolerance,
 });
 }

 return UEngine.analyze(metrics);
}

export function runSectorAnalysisBySlug(
 slug: IndustrySlug,
 values: Record<string, number>
): UEngineAnalysisResult {
 return runSectorAnalysis(industrySlugToSectorKey(slug), values);
}

export function generatePremiumAuditReport(
 key: SectorRegistryKey,
 values: Record<string, number>
): PremiumAuditReport {
 const sector = SectorRegistry[key];
 const industry = runIndustryDiagnostic(sectorToDiagnosticConfig(sector), values);
 const analysis = runSectorAnalysis(key, values);

 return {
 sectorKey: key,
 sectorId: sector.key,
 variance: industry.variance,
 financialLoss: industry.financialLoss,
 severity: industry.severity,
 recommendation: industry.recommendation,
 verdictCode: industry.verdictCode,
 premiumAdvice: industry.premiumAdvice,
 variancePctFormatted: `${analysis.variancePct}%`,
 financialLossFormatted: formatCurrency(industry.financialLoss),
 };
}

export function generatePremiumAuditReportBySlug(
 slug: IndustrySlug,
 values: Record<string, number>
): PremiumAuditReport {
 return generatePremiumAuditReport(industrySlugToSectorKey(slug), values);
}

export function runSectorRegistryDiagnostic(
 key: SectorRegistryKey,
 values: Record<string, number>
): IndustryAuditReport {
 return runIndustryDiagnostic(
 sectorToDiagnosticConfig(SectorRegistry[key]),
 values
 );
}

export function runSectorRegistryDiagnosticBySlug(
 slug: IndustrySlug,
 values: Record<string, number>
): IndustryAuditReport {
 return runSectorRegistryDiagnostic(industrySlugToSectorKey(slug), values);
}

/** @deprecated Use {@link runLegacyDiagnostic}. */
export const runDiagnostic = runLegacyDiagnostic;
