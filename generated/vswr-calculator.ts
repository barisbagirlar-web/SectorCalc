// Auto-generated from vswr-calculator-schema.json
import * as z from 'zod';

export interface Vswr_calculatorInput {
  dataConfidence?: number;
  yukEmpedans: number;
  hatEmpedans: number;
}

export const Vswr_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  yukEmpedans: z.number().min(0).default(100),
  hatEmpedans: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vswr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["yukEmpedans"] - input["hatEmpedans"]) / Math.max(0.0001, (input["yukEmpedans"] + input["hatEmpedans"])); results["yansima"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yansima"] = Number.NaN; }
  try { const v = (1 + Math.abs((input["yukEmpedans"] - input["hatEmpedans"]) / Math.max(0.0001, (input["yukEmpedans"] + input["hatEmpedans"])))) / Math.max(0.0001, (1 - Math.abs((input["yukEmpedans"] - input["hatEmpedans"]) / Math.max(0.0001, (input["yukEmpedans"] + input["hatEmpedans"]))))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateVswr_calculator(input: Vswr_calculatorInput): Vswr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Low Q factor indicates broader frequency response."];
  const suggestedActions: string[] = ["Verify component tolerances affect circuit performance.","Use proper safety equipment for high voltage/current work."];
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
    unit: "VSWR",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Vswr_calculatorOutput {
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

export const Vswr_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "VSWR",
  breakdownKeys: ["yansima"],
} as const;
