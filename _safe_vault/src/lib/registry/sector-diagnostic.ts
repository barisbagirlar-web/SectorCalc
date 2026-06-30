import type { VarianceType } from "@/lib/registry/sector-registry";
import { runDiagnostic, type ProcessVariables } from "@/lib/os/adapters/legacy-u-engine";

/** Map sector variance type to U-Engine tolerance scaling (future: exponential path). */
export function defaultToleranceForVarianceType(varianceType: VarianceType): number {
 switch (varianceType) {
 case "linear":
 return 0.05;
 case "exponential":
 return 0.03;
 default:
 return 0.02;
 }
}

export interface SectorMetricValues {
 target: number;
 actual: number;
 costPerUnit: number;
 tolerance?: number;
}

/**
 * Run U-Engine from sector registry metric keys + numeric values.
 */
export function runSectorDiagnostic(
 varianceType: VarianceType,
 values: SectorMetricValues
) {
 const tolerance =
 values.tolerance ?? defaultToleranceForVarianceType(varianceType);

 const vars: ProcessVariables = {
 target: values.target,
 actual: values.actual,
 costPerUnit: values.costPerUnit,
 tolerance,
 };

 return runDiagnostic(vars);
}
