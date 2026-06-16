// Auto-generated from leed-calculator-schema.json
import * as z from 'zod';

export interface Leed_calculatorInput {
  ss: number;
  we: number;
  ea: number;
  mr: number;
  eq: number;
}

export const Leed_calculatorInputSchema = z.object({
  ss: z.number().default(0),
  we: z.number().default(0),
  ea: z.number().default(0),
  mr: z.number().default(0),
  eq: z.number().default(0),
});

function evaluateAllFormulas(input: Leed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ss + input.we + input.ea + input.mr + input.eq; results["total"] = Number.isFinite(v) ? v : 0; } catch { results["total"] = 0; }
  try { const v = (results["total"] ?? 0) >= 80 ? 'Platinum' : (results["total"] ?? 0) >= 60 ? 'Gold' : (results["total"] ?? 0) >= 50 ? 'Silver' : (results["total"] ?? 0) >= 40 ? 'Certified' : 'Not Certified'; results["level"] = Number.isFinite(v) ? v : 0; } catch { results["level"] = 0; }
  try { const v = 'Total: ' + (results["total"] ?? 0) + ' points (' + (results["level"] ?? 0) + ')'; results["totalScore"] = Number.isFinite(v) ? v : 0; } catch { results["totalScore"] = 0; }
  try { const v = 'Sustainable Sites: ' + input.ss + ' points'; results["ssBreakdown"] = Number.isFinite(v) ? v : 0; } catch { results["ssBreakdown"] = 0; }
  try { const v = 'Water Efficiency: ' + input.we + ' points'; results["weBreakdown"] = Number.isFinite(v) ? v : 0; } catch { results["weBreakdown"] = 0; }
  try { const v = 'Energy & Atmosphere: ' + input.ea + ' points'; results["eaBreakdown"] = Number.isFinite(v) ? v : 0; } catch { results["eaBreakdown"] = 0; }
  try { const v = 'Materials & Resources: ' + input.mr + ' points'; results["mrBreakdown"] = Number.isFinite(v) ? v : 0; } catch { results["mrBreakdown"] = 0; }
  try { const v = 'Indoor Environmental Quality: ' + input.eq + ' points'; results["eqBreakdown"] = Number.isFinite(v) ? v : 0; } catch { results["eqBreakdown"] = 0; }
  return results;
}


export function calculateLeed_calculator(input: Leed_calculatorInput): Leed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalScore"] ?? 0;
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


export interface Leed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
