// Auto-generated from hdl-calculator-schema.json
import * as z from 'zod';

export interface Hdl_calculatorInput {
  totalCholesterol: number;
  hdlCholesterol: number;
  ldlCholesterol: number;
  triglycerides: number;
}

export const Hdl_calculatorInputSchema = z.object({
  totalCholesterol: z.number().default(200),
  hdlCholesterol: z.number().default(50),
  ldlCholesterol: z.number().default(100),
  triglycerides: z.number().default(150),
});

function evaluateAllFormulas(input: Hdl_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalCholesterol - input.hdlCholesterol; results["nonHDL"] = Number.isFinite(v) ? v : 0; } catch { results["nonHDL"] = 0; }
  try { const v = input.totalCholesterol / input.hdlCholesterol; results["cholHDLratio"] = Number.isFinite(v) ? v : 0; } catch { results["cholHDLratio"] = 0; }
  try { const v = input.ldlCholesterol / input.hdlCholesterol; results["ldlHDLratio"] = Number.isFinite(v) ? v : 0; } catch { results["ldlHDLratio"] = 0; }
  try { const v = input.triglycerides / input.hdlCholesterol; results["trigsHDLratio"] = Number.isFinite(v) ? v : 0; } catch { results["trigsHDLratio"] = 0; }
  try { const v = input.triglycerides / 5; results["vldl"] = Number.isFinite(v) ? v : 0; } catch { results["vldl"] = 0; }
  try { const v = input.totalCholesterol - input.hdlCholesterol - (input.triglycerides / 5); results["calculatedLdl"] = Number.isFinite(v) ? v : 0; } catch { results["calculatedLdl"] = 0; }
  try { const v = input.ldlCholesterol - (input.totalCholesterol - input.hdlCholesterol - (input.triglycerides / 5)); results["ldlDifference"] = Number.isFinite(v) ? v : 0; } catch { results["ldlDifference"] = 0; }
  return results;
}


export function calculateHdl_calculator(input: Hdl_calculatorInput): Hdl_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cholHDLratio"] ?? 0;
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


export interface Hdl_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
