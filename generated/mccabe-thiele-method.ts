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

function evaluateAllFormulas(input: Mccabe_thiele_methodInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.log((input.xd*(1-input.xb))/(input.xb*(1-input.xd)))/Math.log(input.alpha); results["nMin"] = Number.isFinite(v) ? v : 0; } catch { results["nMin"] = 0; }
  try { const v = (input.xd - input.xf)/(input.xf - input.xb) * (1 - input.xb)/(1 - input.xd); results["rMin"] = Number.isFinite(v) ? v : 0; } catch { results["rMin"] = 0; }
  try { const v = (input.r - (results["rMin"] ?? 0))/(input.r + 1) * (results["nMin"] ?? 0) + (results["nMin"] ?? 0); results["nActual"] = Number.isFinite(v) ? v : 0; } catch { results["nActual"] = 0; }
  try { const v = input.q/(input.q-1); results["feedLineSlope"] = Number.isFinite(v) ? v : 0; } catch { results["feedLineSlope"] = 0; }
  try { const v = input.xf/(1-input.q); results["feedLineIntercept"] = Number.isFinite(v) ? v : 0; } catch { results["feedLineIntercept"] = 0; }
  try { const v = input.r/(input.r+1); results["operatingLineSlope"] = Number.isFinite(v) ? v : 0; } catch { results["operatingLineSlope"] = 0; }
  try { const v = input.xd/(input.r+1); results["operatingLineIntercept"] = Number.isFinite(v) ? v : 0; } catch { results["operatingLineIntercept"] = 0; }
  results["Slope_of_operating_line__rectifying_sect"] = 0;
  results["Intercept_of_operating_line__rectifying_"] = 0;
  return results;
}


export function calculateMccabe_thiele_method(input: Mccabe_thiele_methodInput): Mccabe_thiele_methodOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["nActual"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
