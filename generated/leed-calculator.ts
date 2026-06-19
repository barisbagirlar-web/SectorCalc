// Auto-generated from leed-calculator-schema.json
import * as z from 'zod';

export interface Leed_calculatorInput {
  ss: number;
  we: number;
  ea: number;
  mr: number;
  eq: number;
  dataConfidence?: number;
}

export const Leed_calculatorInputSchema = z.object({
  ss: z.number().default(0),
  we: z.number().default(0),
  ea: z.number().default(0),
  mr: z.number().default(0),
  eq: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Leed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ss + input.we + input.ea + input.mr + input.eq; results["total"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  try { const v = 'Sustainable Sites: ' + input.ss + ' points'; results["ssBreakdown"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ssBreakdown"] = 0; }
  try { const v = 'Water Efficiency: ' + input.we + ' points'; results["weBreakdown"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weBreakdown"] = 0; }
  try { const v = 'Energy & Atmosphere: ' + input.ea + ' points'; results["eaBreakdown"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["eaBreakdown"] = 0; }
  try { const v = 'Materials & Resources: ' + input.mr + ' points'; results["mrBreakdown"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mrBreakdown"] = 0; }
  try { const v = 'Indoor Environmental Quality: ' + input.eq + ' points'; results["eqBreakdown"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["eqBreakdown"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLeed_calculator(input: Leed_calculatorInput): Leed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["eqBreakdown"]);
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


export interface Leed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
