// Auto-generated from fiyat-esnekligi-schema.json
import * as z from 'zod';

export interface Fiyat_esnekligiInput {
  PctChange_Dem: number;
  PctChange_Price: number;
  CurrDem: number;
  Elast: number;
  NewPrice: number;
  VarCost: number;
  Fixed: number;
  CannibRate: number;
  Margin_Other: number;
  CurrMargin: number;
  Cannib: number;
  dataConfidence?: number;
}

export const Fiyat_esnekligiInputSchema = z.object({
  PctChange_Dem: z.number().min(0).default(0),
  PctChange_Price: z.number().min(0).default(0),
  CurrDem: z.number().min(0).default(0),
  Elast: z.number().min(0).default(0),
  NewPrice: z.number().min(0).default(0),
  VarCost: z.number().min(0).default(0),
  Fixed: z.number().min(0).default(0),
  CannibRate: z.number().min(0).default(0),
  Margin_Other: z.number().min(0).default(0),
  CurrMargin: z.number().min(0).default(0),
  Cannib: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fiyat_esnekligiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.PctChange_Dem / input.PctChange_Price; results["Elasticity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Elasticity"] = Number.NaN; }
  try { const v = input.CurrDem * (1 + input.Elast * input.PctChange_Price); results["NewDem"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NewDem"] = Number.NaN; }
  try { const v = input.NewPrice * (toNumericFormulaValue(results["NewDem"])); results["NewRev"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NewRev"] = Number.NaN; }
  try { const v = (input.NewPrice - input.VarCost) * (toNumericFormulaValue(results["NewDem"])) - input.Fixed; results["NewMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NewMargin"] = Number.NaN; }
  try { const v = (input.Elast / (input.Elast + 1)) * input.VarCost; results["MaxPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MaxPrice"] = Number.NaN; }
  try { const v = -1 / (input.Elast + 1); results["Markup"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Markup"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["NewDem"])) * input.CannibRate * input.Margin_Other; results["CannibLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CannibLoss"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["NewMargin"])) - input.CurrMargin - input.Cannib; results["NetImpact"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["NetImpact"] = Number.NaN; }
  return results;
}


export function calculateFiyat_esnekligi(input: Fiyat_esnekligiInput): Fiyat_esnekligiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["NetImpact"]);
  const breakdown = {
    Elasticity: toNumericFormulaValue(values["Elasticity"]),
    NewDem: toNumericFormulaValue(values["NewDem"]),
    NewRev: toNumericFormulaValue(values["NewRev"]),
    NewMargin: toNumericFormulaValue(values["NewMargin"]),
    MaxPrice: toNumericFormulaValue(values["MaxPrice"]),
    Markup: toNumericFormulaValue(values["Markup"]),
    CannibLoss: toNumericFormulaValue(values["CannibLoss"]),
    NetImpact: toNumericFormulaValue(values["NetImpact"])
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


export interface Fiyat_esnekligiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Elasticity: number; NewDem: number; NewRev: number; NewMargin: number; MaxPrice: number; Markup: number; CannibLoss: number; NetImpact: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Fiyat_esnekligiOutputMeta = {
  primaryKey: "NetImpact",
  unit: "USD",
  breakdownKeys: ["Elasticity","NewDem","NewRev","NewMargin","MaxPrice","Markup","CannibLoss","NetImpact"],
} as const;

