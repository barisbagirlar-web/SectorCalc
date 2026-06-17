// @ts-nocheck
// Auto-generated from equivalent-dose-calculator-schema.json
import * as z from 'zod';

export interface Equivalent_dose_calculatorInput {
  betaGammaDose: number;
  alphaDose: number;
  neutronDose: number;
  wR_betaGamma: number;
  wR_alpha: number;
  wR_neutron: number;
}

export const Equivalent_dose_calculatorInputSchema = z.object({
  betaGammaDose: z.number().default(0),
  alphaDose: z.number().default(0),
  neutronDose: z.number().default(0),
  wR_betaGamma: z.number().default(1),
  wR_alpha: z.number().default(20),
  wR_neutron: z.number().default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Equivalent_dose_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.betaGammaDose * input.wR_betaGamma + input.alphaDose * input.wR_alpha + input.neutronDose * input.wR_neutron; results["totalH"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalH"] = 0; }
  try { const v = input.betaGammaDose * input.wR_betaGamma; results["betaGammaContrib"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["betaGammaContrib"] = 0; }
  try { const v = input.alphaDose * input.wR_alpha; results["alphaContrib"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["alphaContrib"] = 0; }
  try { const v = input.neutronDose * input.wR_neutron; results["neutronContrib"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["neutronContrib"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateEquivalent_dose_calculator(input: Equivalent_dose_calculatorInput): Equivalent_dose_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalH"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Equivalent_dose_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
