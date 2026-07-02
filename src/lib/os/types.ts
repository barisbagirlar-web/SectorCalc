/**
 * Manufacturing OS - industry tool schema types.
 *
 * Declarative sector modules: risk variables, variance formulas,
 * loss metrics and threshold-based verdict interpretation.
 * Complements MarginCore stochastic engine (`margincore-engine.ts`).
 */

/** Supported verticals - extend as sectors ship. */
export type ManufacturingIndustry =
 | "cnc"
 | "agriculture"
 | "logistics"
 | "construction"
 | "cleaning"
 | "restaurant"
 | "ecommerce"
 | string;

export type IndustryToolType =
 | "efficiency"
 | "calibration"
 | "cost-management"
 | "process-optimization";

export type IndustryInputUnit =
 | "kg"
 | "hour"
 | "currency"
 | "percent"
 | "unit";

/** Target vs actual vs fixed constant in variance analysis. */
export type IndustryInputRole = "target" | "actual" | "constant";

export interface IndustryToolInputParam {
 id: string;
 label: string;
 unit: IndustryInputUnit;
 role: IndustryInputRole;
 /** Maps to margin leak driver copy (see `margincore-identity`). */
 riskDriverKey?: string;
 min?: number;
 max?: number;
 defaultValue?: number;
}

/** Expression strings evaluated by the sector formula runner (not arbitrary JS). */
export interface IndustryToolFormulas {
 /** Variance expression, e.g. "(actual - target) / target" */
 variance: string;
 /** Loss metric expression - currency or hours lost */
 lossMetric: string;
}

export interface InterpretationThreshold {
 /** Safe expression, e.g. "variance > 0.05" */
 condition: string;
 /** Machine verdict code, e.g. "CRITICAL_INEFFICIENCY" */
 verdict: string;
 /** Operator-facing mitigation guidance */
 advice: string;
}

export interface IndustryInterpretationRules {
 thresholds: InterpretationThreshold[];
}

export interface IndustryToolSchema {
 id: string;
 industry: ManufacturingIndustry;
 toolType: IndustryToolType;

 /** Dynamic risk variables per sector */
 inputs: IndustryToolInputParam[];

 /** Analytic engine - variance + loss unit */
 formulas: IndustryToolFormulas;

 /** Premium reporting - threshold → verdict → advice */
 interpretationRules: IndustryInterpretationRules;
}

/** Runtime values keyed by `IndustryToolInputParam.id`. */
export type IndustryToolInputValues = Record<string, number>;

export interface IndustryAnalysisResult {
 schemaId: string;
 variance: number;
 lossMetric: number;
 matchedVerdict: string | null;
 advice: string | null;
}
