// Auto-generated from hacimsel-agirlik-schema.json
import * as z from 'zod';

export interface Hacimsel_agirlikInput {
  L: number;
  W: number;
  H: number;
  Gross: number;
  VolWeight: number;
  Vol: number;
  ActualLoad: number;
  MaxCont: number;
  dataConfidence?: number;
}

export const Hacimsel_agirlikInputSchema = z.object({
  L: z.number().min(0).default(0),
  W: z.number().min(0).default(0),
  H: z.number().min(0).default(0),
  Gross: z.number().min(0).default(0),
  VolWeight: z.number().min(0).default(0),
  Vol: z.number().min(0).default(0),
  ActualLoad: z.number().min(0).default(0),
  MaxCont: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hacimsel_agirlikInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.L * input.W * input.H) / 6000; results["VolWeight_Air"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["VolWeight_Air"] = Number.NaN; }
  try { const v = (input.L * input.W * input.H) / 5000; results["VolWeight_Road"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["VolWeight_Road"] = Number.NaN; }
  try { const v = (input.L * input.W * input.H) / 1000; results["VolWeight_Sea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["VolWeight_Sea"] = Number.NaN; }
  try { const v = Math.max(input.Gross, input.VolWeight); results["Chargeable"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Chargeable"] = Number.NaN; }
  results["Freight"] = Number.NaN;
  try { const v = input.Gross / input.Vol; results["Density"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Density"] = Number.NaN; }
  try { const v = 1 - (input.ActualLoad / input.MaxCont); results["StackLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["StackLoss"] = Number.NaN; }
  results["Ineff"] = Number.NaN;
  return results;
}


export function calculateHacimsel_agirlik(input: Hacimsel_agirlikInput): Hacimsel_agirlikOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Ineff"]);
  const breakdown = {
    VolWeight_Air: toNumericFormulaValue(values["VolWeight_Air"]),
    VolWeight_Road: toNumericFormulaValue(values["VolWeight_Road"]),
    VolWeight_Sea: toNumericFormulaValue(values["VolWeight_Sea"]),
    Chargeable: toNumericFormulaValue(values["Chargeable"]),
    Freight: toNumericFormulaValue(values["Freight"]),
    Density: toNumericFormulaValue(values["Density"]),
    StackLoss: toNumericFormulaValue(values["StackLoss"]),
    Ineff: toNumericFormulaValue(values["Ineff"])
  };
  const hiddenLossDrivers: string[] = ["Verify assumptions with real data","Cross-check with industry benchmarks"];
  const suggestedActions: string[] = ["Run sensitivity analysis","Review assumptions with domain expert"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report","Action plan"],
  };
}


export interface Hacimsel_agirlikOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { VolWeight_Air: number; VolWeight_Road: number; VolWeight_Sea: number; Chargeable: number; Freight: number; Density: number; StackLoss: number; Ineff: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Hacimsel_agirlikOutputMeta = {
  primaryKey: "Ineff",
  unit: "USD",
  breakdownKeys: ["VolWeight_Air","VolWeight_Road","VolWeight_Sea","Chargeable","Freight","Density","StackLoss","Ineff"],
} as const;

