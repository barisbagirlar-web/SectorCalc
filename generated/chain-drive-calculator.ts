// Auto-generated from chain-drive-calculator-schema.json
import * as z from 'zod';

export interface Chain_drive_calculatorInput {
  Z1: number;
  Z2: number;
  adim: number;
  merkezC: number;
  dataConfidence?: number;
}

export const Chain_drive_calculatorInputSchema = z.object({
  Z1: z.number().min(6).default(17),
  Z2: z.number().min(6).default(45),
  adim: z.number().min(0).default(12.7),
  merkezC: z.number().min(0).default(500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Chain_drive_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Z2 / Math.max(1, input.Z1); results["oran"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["oran"] = Number.NaN; }
  try { const v = 2*input.merkezC + (input.Z1+input.Z2)*input.adim/2 + Math.pow(((input.Z2-input.Z1)*input.adim)/(2*Math.PI), 2)/Math.max(0.0001, input.merkezC); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateChain_drive_calculator(input: Chain_drive_calculatorInput): Chain_drive_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["High fuel/energy consumption indicates efficiency losses."];
  const suggestedActions: string[] = ["Regular maintenance improves overall equipment efficiency.","Simulate real-world driving conditions for accurate range estimates."];
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
    unit: "mm",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Chain_drive_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Chain_drive_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "mm",
  breakdownKeys: ["sonuc"],
} as const;

