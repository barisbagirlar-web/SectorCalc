// Auto-generated from hdl-calculator-schema.json
import * as z from 'zod';

export interface Hdl_calculatorInput {
  totalCholesterol: number;
  hdlCholesterol: number;
  ldlCholesterol: number;
  triglycerides: number;
  dataConfidence?: number;
}

export const Hdl_calculatorInputSchema = z.object({
  totalCholesterol: z.number().default(200),
  hdlCholesterol: z.number().default(50),
  ldlCholesterol: z.number().default(100),
  triglycerides: z.number().default(150),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hdl_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalCholesterol - input.hdlCholesterol; results["nonHDL"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["nonHDL"] = 0; }
  try { const v = input.totalCholesterol / input.hdlCholesterol; results["cholHDLratio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cholHDLratio"] = 0; }
  try { const v = input.ldlCholesterol / input.hdlCholesterol; results["ldlHDLratio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ldlHDLratio"] = 0; }
  try { const v = input.triglycerides / input.hdlCholesterol; results["trigsHDLratio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["trigsHDLratio"] = 0; }
  try { const v = input.triglycerides / 5; results["vldl"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vldl"] = 0; }
  try { const v = input.totalCholesterol - input.hdlCholesterol - (input.triglycerides / 5); results["calculatedLdl"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["calculatedLdl"] = 0; }
  try { const v = input.ldlCholesterol - (input.totalCholesterol - input.hdlCholesterol - (input.triglycerides / 5)); results["ldlDifference"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ldlDifference"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHdl_calculator(input: Hdl_calculatorInput): Hdl_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["cholHDLratio"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
