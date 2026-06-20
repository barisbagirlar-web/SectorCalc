// Auto-generated from mccabe-thiele-method-schema.json
import * as z from 'zod';

export interface Mccabe_thiele_methodInput {
  xd: number;
  xb: number;
  xf: number;
  r: number;
  alpha: number;
  q: number;
  dataConfidence?: number;
}

export const Mccabe_thiele_methodInputSchema = z.object({
  xd: z.number().default(0.95),
  xb: z.number().default(0.05),
  xf: z.number().default(0.5),
  r: z.number().default(1.5),
  alpha: z.number().default(2.5),
  q: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mccabe_thiele_methodInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.xd - input.xf)/(input.xf - input.xb) * (1 - input.xb)/(1 - input.xd); results["rMin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rMin"] = Number.NaN; }
  try { const v = input.q/(input.q-1); results["feedLineSlope"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["feedLineSlope"] = Number.NaN; }
  try { const v = input.xf/(1-input.q); results["feedLineIntercept"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["feedLineIntercept"] = Number.NaN; }
  try { const v = input.r/(input.r+1); results["operatingLineSlope"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["operatingLineSlope"] = Number.NaN; }
  try { const v = input.xd/(input.r+1); results["operatingLineIntercept"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["operatingLineIntercept"] = Number.NaN; }
  return results;
}


export function calculateMccabe_thiele_method(input: Mccabe_thiele_methodInput): Mccabe_thiele_methodOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["operatingLineIntercept"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Mccabe_thiele_methodOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
