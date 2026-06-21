// Auto-generated from beton-hacmi-schema.json
import * as z from 'zod';

export interface Beton_hacmiInput {
  Length: number;
  Width: number;
  Thickness: number;
  Depth: number;
  Count: number;
  Diameter: number;
  Height: number;
  V_geometric: number;
  WasteFactor: number;
  Density: number;
  TruckCapacity: number;
  UnitPrice: number;
  PumpCost: number;
  dataConfidence?: number;
}

export const Beton_hacmiInputSchema = z.object({
  Length: z.number().min(0).default(0),
  Width: z.number().min(0).default(0),
  Thickness: z.number().min(0).default(0),
  Depth: z.number().min(0).default(0),
  Count: z.number().min(0).default(0),
  Diameter: z.number().min(0).default(0),
  Height: z.number().min(0).default(0),
  V_geometric: z.number().min(0).default(0),
  WasteFactor: z.number().min(0).default(0),
  Density: z.number().min(0).default(0),
  TruckCapacity: z.number().min(0).default(0),
  UnitPrice: z.number().min(0).default(0),
  PumpCost: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Beton_hacmiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.Length * input.Width * input.Thickness; results["V_slab"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["V_slab"] = Number.NaN; }
  try { const v = input.Length * input.Width * input.Depth * input.Count; results["V_footing"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["V_footing"] = Number.NaN; }
  try { const v = Math.PI * (input.Diameter/2)**2 * input.Height * input.Count; results["V_column"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["V_column"] = Number.NaN; }
  try { const v = input.Length * input.Height * input.Thickness; results["V_wall"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["V_wall"] = Number.NaN; }
  try { const v = input.V_geometric * (1 + input.WasteFactor); results["V_total"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["V_total"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["V_total"])) * input.Density; results["Weight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Weight"] = Number.NaN; }
  try { const v = Math.ceil((toNumericFormulaValue(results["V_total"])) / input.TruckCapacity); results["TruckLoads"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TruckLoads"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["V_total"])) * input.UnitPrice + input.PumpCost; results["TotalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalCost"] = Number.NaN; }
  return results;
}


export function calculateBeton_hacmi(input: Beton_hacmiInput): Beton_hacmiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["TotalCost"]);
  const breakdown = {
    V_slab: toNumericFormulaValue(values["V_slab"]),
    V_footing: toNumericFormulaValue(values["V_footing"]),
    V_column: toNumericFormulaValue(values["V_column"]),
    V_wall: toNumericFormulaValue(values["V_wall"]),
    V_total: toNumericFormulaValue(values["V_total"]),
    Weight: toNumericFormulaValue(values["Weight"]),
    TruckLoads: toNumericFormulaValue(values["TruckLoads"]),
    TotalCost: toNumericFormulaValue(values["TotalCost"])
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


export interface Beton_hacmiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { V_slab: number; V_footing: number; V_column: number; V_wall: number; V_total: number; Weight: number; TruckLoads: number; TotalCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Beton_hacmiOutputMeta = {
  primaryKey: "TotalCost",
  unit: "USD",
  breakdownKeys: ["V_slab","V_footing","V_column","V_wall","V_total","Weight","TruckLoads","TotalCost"],
} as const;

