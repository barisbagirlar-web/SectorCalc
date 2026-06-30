// Auto-generated from discounted-payback-calculator-schema.json
import * as z from 'zod';

export interface Discounted_payback_calculatorInput {
  dataConfidence?: number;
  yatirim: number;
  nakit1: number;
  nakit2: number;
  nakit3: number;
  iskonto: number;
}

export const Discounted_payback_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  yatirim: z.number().min(0).default(100000),
  nakit1: z.number().min(0).default(30000),
  nakit2: z.number().min(0).default(30000),
  nakit3: z.number().min(0).default(30000),
  iskonto: z.number().min(0).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Discounted_payback_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["nakit1"] / Math.pow(1 + input["iskonto"] / 100, 1); results["bd1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bd1"] = Number.NaN; }
  try { const v = input["nakit2"] / Math.pow(1 + input["iskonto"] / 100, 2); results["bd2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bd2"] = Number.NaN; }
  try { const v = input["nakit3"] / Math.pow(1 + input["iskonto"] / 100, 3); results["bd3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bd3"] = Number.NaN; }
  try { const v = input["nakit1"] / Math.pow(1 + input["iskonto"] / 100, 1); results["kum1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["kum1"] = Number.NaN; }
  try { const v = input["nakit1"] / Math.pow(1 + input["iskonto"] / 100, 1) + input["nakit2"] / Math.pow(1 + input["iskonto"] / 100, 2); results["kum2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["kum2"] = Number.NaN; }
  try { const v = input["nakit1"] / Math.pow(1 + input["iskonto"] / 100, 1) + input["nakit2"] / Math.pow(1 + input["iskonto"] / 100, 2) + input["nakit3"] / Math.pow(1 + input["iskonto"] / 100, 3); results["kum3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["kum3"] = Number.NaN; }
  try { const v = input["yatirim"] > 0 ? (input["nakit1"] / Math.pow(1 + input["iskonto"]/100, 1) + input["nakit2"] / Math.pow(1 + input["iskonto"]/100, 2) + input["nakit3"] / Math.pow(1 + input["iskonto"]/100, 3) >= input["yatirim"] ? (input["nakit1"] / Math.pow(1 + input["iskonto"]/100, 1) >= input["yatirim"] ? 1 : input["nakit1"] / Math.pow(1 + input["iskonto"]/100, 1) + input["nakit2"] / Math.pow(1 + input["iskonto"]/100, 2) >= input["yatirim"] ? 2 : 3) : 99) : 0; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateDiscounted_payback_calculator(input: Discounted_payback_calculatorInput): Discounted_payback_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["sonuc"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "years",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Discounted_payback_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const Discounted_payback_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "years",
  breakdownKeys: ["bd1","bd2","bd3","kum1","kum2","kum3"],
} as const;
