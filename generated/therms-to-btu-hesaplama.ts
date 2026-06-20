// Auto-generated from therms-to-btu-hesaplama-schema.json
import * as z from 'zod';

export interface Therms_to_btu_hesaplamaInput {
  powerValue: number;
  timeDuration: number;
  dataConfidence?: number;
}

export const Therms_to_btu_hesaplamaInputSchema = z.object({
  powerValue: z.number().min(0).default(100),
  timeDuration: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Therms_to_btu_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.powerValue * input.timeDuration / (input.powerValue + input.timeDuration + 1) * 100 + Math.sqrt(Math.abs(input.powerValue - input.timeDuration)); results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.powerValue * input.timeDuration / (input.powerValue + input.timeDuration + 1) * 100 + Math.sqrt(Math.abs(input.powerValue - input.timeDuration)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateTherms_to_btu_hesaplama(input: Therms_to_btu_hesaplamaInput): Therms_to_btu_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult with a professional.","Review assumptions regularly."];
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
    unit: "W",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Therms_to_btu_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Therms_to_btu_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "W",
  breakdownKeys: ["result"],
} as const;

