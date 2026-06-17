// @ts-nocheck
// Auto-generated from mccabe-thiele-method-schema.json
import * as z from 'zod';

export interface Mccabe_thiele_methodInput {
  xd: number;
  xb: number;
  xf: number;
  r: number;
  alpha: number;
  q: number;
}

export const Mccabe_thiele_methodInputSchema = z.object({
  xd: z.number().default(0.95),
  xb: z.number().default(0.05),
  xf: z.number().default(0.5),
  r: z.number().default(1.5),
  alpha: z.number().default(2.5),
  q: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mccabe_thiele_methodInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.xd - input.xf)/(input.xf - input.xb) * (1 - input.xb)/(1 - input.xd); results["rMin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rMin"] = 0; }
  try { const v = input.q/(input.q-1); results["feedLineSlope"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["feedLineSlope"] = 0; }
  try { const v = input.xf/(1-input.q); results["feedLineIntercept"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["feedLineIntercept"] = 0; }
  try { const v = input.r/(input.r+1); results["operatingLineSlope"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["operatingLineSlope"] = 0; }
  try { const v = input.xd/(input.r+1); results["operatingLineIntercept"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["operatingLineIntercept"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMccabe_thiele_method(input: Mccabe_thiele_methodInput): Mccabe_thiele_methodOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["operatingLineIntercept"]);
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


export interface Mccabe_thiele_methodOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
