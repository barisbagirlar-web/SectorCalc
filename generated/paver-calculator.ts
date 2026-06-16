// Auto-generated from paver-calculator-schema.json
import * as z from 'zod';

export interface Paver_calculatorInput {
  areaLength: number;
  areaWidth: number;
  paverLength: number;
  paverWidth: number;
  jointWidth: number;
  wasteFactor: number;
}

export const Paver_calculatorInputSchema = z.object({
  areaLength: z.number().default(5),
  areaWidth: z.number().default(4),
  paverLength: z.number().default(200),
  paverWidth: z.number().default(100),
  jointWidth: z.number().default(5),
  wasteFactor: z.number().default(10),
});

function evaluateAllFormulas(input: Paver_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.areaLength * input.areaWidth; results["totalArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalArea"] = 0; }
  try { const v = ((input.paverLength + input.jointWidth) * (input.paverWidth + input.jointWidth)) / 1e6; results["paverCoverageArea"] = Number.isFinite(v) ? v : 0; } catch { results["paverCoverageArea"] = 0; }
  try { const v = Math.ceil((results["totalArea"] ?? 0) / (results["paverCoverageArea"] ?? 0)); results["paversWithoutWaste"] = Number.isFinite(v) ? v : 0; } catch { results["paversWithoutWaste"] = 0; }
  try { const v = Math.ceil((results["paversWithoutWaste"] ?? 0) * input.wasteFactor / 100); results["wastePavers"] = Number.isFinite(v) ? v : 0; } catch { results["wastePavers"] = 0; }
  try { const v = (results["paversWithoutWaste"] ?? 0) + (results["wastePavers"] ?? 0); results["totalPavers"] = Number.isFinite(v) ? v : 0; } catch { results["totalPavers"] = 0; }
  return results;
}


export function calculatePaver_calculator(input: Paver_calculatorInput): Paver_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalPavers"] ?? 0;
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


export interface Paver_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
