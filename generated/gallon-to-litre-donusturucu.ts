// Auto-generated from gallon-to-litre-donusturucu-schema.json
import * as z from 'zod';

export interface Gallon_to_litre_donusturucuInput {
  volumeValue: number;
  param2: number;
  dataConfidence?: number;
}

export const Gallon_to_litre_donusturucuInputSchema = z.object({
  volumeValue: z.number().min(0).default(100),
  param2: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gallon_to_litre_donusturucuInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.volumeValue * input.param2 / (input.volumeValue + input.param2 + 1) * 100 + Math.sqrt(Math.abs(input.volumeValue - input.param2)); results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.volumeValue * input.param2 / (input.volumeValue + input.param2 + 1) * 100 + Math.sqrt(Math.abs(input.volumeValue - input.param2)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateGallon_to_litre_donusturucu(input: Gallon_to_litre_donusturucuInput): Gallon_to_litre_donusturucuOutput {
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
    unit: "m³",
    premiumRequired: false,
    premiumFeatures: ["Detailed PDF report","Scenario comparison","Multi-year projections"],
  };
}


export interface Gallon_to_litre_donusturucuOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Gallon_to_litre_donusturucuOutputMeta = {
  primaryKey: "result",
  unit: "m³",
  breakdownKeys: ["result"],
} as const;

