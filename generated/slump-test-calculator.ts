// Auto-generated from slump-test-calculator-schema.json
import * as z from 'zod';

export interface Slump_test_calculatorInput {
  moldHeight: number;
  topDiameter: number;
  bottomDiameter: number;
  measuredHeight: number;
  specMin: number;
  specMax: number;
}

export const Slump_test_calculatorInputSchema = z.object({
  moldHeight: z.number().default(300),
  topDiameter: z.number().default(100),
  bottomDiameter: z.number().default(200),
  measuredHeight: z.number().default(150),
  specMin: z.number().default(50),
  specMax: z.number().default(100),
});

function evaluateAllFormulas(input: Slump_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.topDiameter / 2; results["topRadius"] = Number.isFinite(v) ? v : 0; } catch { results["topRadius"] = 0; }
  try { const v = input.bottomDiameter / 2; results["bottomRadius"] = Number.isFinite(v) ? v : 0; } catch { results["bottomRadius"] = 0; }
  try { const v = (Math.PI / 3) * input.moldHeight * (Math.pow((results["bottomRadius"] ?? 0), 2) + Math.pow((results["topRadius"] ?? 0), 2) + (results["bottomRadius"] ?? 0) * (results["topRadius"] ?? 0)); results["coneVolume"] = Number.isFinite(v) ? v : 0; } catch { results["coneVolume"] = 0; }
  try { const v = (results["coneVolume"] ?? 0) / 1000000; results["coneVolumeLiters"] = Number.isFinite(v) ? v : 0; } catch { results["coneVolumeLiters"] = 0; }
  try { const v = input.moldHeight - input.measuredHeight; results["slump"] = Number.isFinite(v) ? v : 0; } catch { results["slump"] = 0; }
  try { const v = (results["slump"] ?? 0) >= input.specMin && (results["slump"] ?? 0) <= input.specMax ? 'Pass' : 'Fail'; results["passFail"] = Number.isFinite(v) ? v : 0; } catch { results["passFail"] = 0; }
  return results;
}


export function calculateSlump_test_calculator(input: Slump_test_calculatorInput): Slump_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Slump"] ?? 0;
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


export interface Slump_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
