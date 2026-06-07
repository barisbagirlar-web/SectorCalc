/**
 * Industry diagnostic configuration — maps semantic param keys to U-Engine.
 */

export interface IndustryDiagnosticParamMap {
 target: string;
 actual: string;
 cost: string;
}

export type PremiumRuleSeverity = "Critical" | "Warning" | "Optimal";

export interface IndustryDiagnosticConfig {
 industry: string;
 defaultTolerance: number;
 params: IndustryDiagnosticParamMap;
 premiumRules: Partial<Record<PremiumRuleSeverity, string>>;
 costBasis?: "direct" | "per-hour-on-minute-delta" | "per-hour-on-second-delta";
}

export const CNC_MANUFACTURING_DIAGNOSTIC_CONFIG: IndustryDiagnosticConfig = {
 industry: "CNC Manufacturing",
 defaultTolerance: 0.02,
 params: {
 target: "ideal_cycle_time",
 actual: "measured_cycle_time",
 cost: "machine_hourly_rate",
 },
 premiumRules: {
 Critical: "Takım aşınması veya makine duruşu (downtime) tespit edildi.",
 Warning: "Çevrim süresi tolerans sınırında — takım kalibrasyonunu gözden geçirin.",
 Optimal: "Çevrim süresi hedef bandında; marj sızıntısı düşük.",
 },
 costBasis: "per-hour-on-minute-delta",
};

export type CncCycleDiagnosticValues = {
 ideal_cycle_time: number;
 measured_cycle_time: number;
 machine_hourly_rate: number;
};

export function buildCncCycleDiagnosticValues(
 idealCycleMinutes: number,
 measuredCycleMinutes: number,
 machineHourlyRate: number
): CncCycleDiagnosticValues {
 return {
 ideal_cycle_time: idealCycleMinutes,
 measured_cycle_time: measuredCycleMinutes,
 machine_hourly_rate: machineHourlyRate,
 };
}
