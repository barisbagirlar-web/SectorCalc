// Auto-generated from npv-calculator-schema.json
import * as z from 'zod';

export interface Npv_calculatorInput {
  nakit1: number;
  nakit2: number;
  nakit3: number;
  nakit4: number;
  nakit5: number;
  iskonto: number;
  yatirim: number;
  dataConfidence?: number;
}

export const Npv_calculatorInputSchema = z.object({
  nakit1: z.number().min(0).default(30000),
  nakit2: z.number().min(0).default(40000),
  nakit3: z.number().min(0).default(50000),
  nakit4: z.number().min(0).default(35000),
  nakit5: z.number().min(0).default(30000),
  iskonto: z.number().min(0).default(10),
  yatirim: z.number().min(0).default(100000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Npv_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.nakit1 / Math.pow(1 + input.iskonto / 100, 1); results["bugun1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bugun1"] = Number.NaN; }
  try { const v = input.nakit2 / Math.pow(1 + input.iskonto / 100, 2); results["bugun2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bugun2"] = Number.NaN; }
  try { const v = input.nakit3 / Math.pow(1 + input.iskonto / 100, 3); results["bugun3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bugun3"] = Number.NaN; }
  try { const v = input.nakit4 / Math.pow(1 + input.iskonto / 100, 4); results["bugun4"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bugun4"] = Number.NaN; }
  try { const v = input.nakit5 / Math.pow(1 + input.iskonto / 100, 5); results["bugun5"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bugun5"] = Number.NaN; }
  try { const v = (input.nakit1 / Math.pow(1 + input.iskonto / 100, 1) + input.nakit2 / Math.pow(1 + input.iskonto / 100, 2) + input.nakit3 / Math.pow(1 + input.iskonto / 100, 3) + input.nakit4 / Math.pow(1 + input.iskonto / 100, 4) + input.nakit5 / Math.pow(1 + input.iskonto / 100, 5)) - input.yatirim; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateNpv_calculator(input: Npv_calculatorInput): Npv_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Npv_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Npv_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

