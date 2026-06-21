// Auto-generated from konteyner-yuku-schema.json
import * as z from 'zod';

export interface Konteyner_yukuInput {
  ItemVolume_i: number;
  ContainerMaxVolume: number;
  ItemWeight_i: number;
  ContainerMaxPayload: number;
  GrossWeight: number;
  VolumetricWeight: number;
  FreightCost: number;
  ContainerHeight: number;
  PalletHeight: number;
  FloorArea_Pallets: number;
  WeightLimit: number;
  PalletWeight: number;
  dataConfidence?: number;
}

export const Konteyner_yukuInputSchema = z.object({
  ItemVolume_i: z.number().min(0).default(0),
  ContainerMaxVolume: z.number().min(0).default(0),
  ItemWeight_i: z.number().min(0).default(0),
  ContainerMaxPayload: z.number().min(0).default(0),
  GrossWeight: z.number().min(0).default(0),
  VolumetricWeight: z.number().min(0).default(0),
  FreightCost: z.number().min(0).default(0),
  ContainerHeight: z.number().min(0).default(0),
  PalletHeight: z.number().min(0).default(0),
  FloorArea_Pallets: z.number().min(0).default(0),
  WeightLimit: z.number().min(0).default(0),
  PalletWeight: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Konteyner_yukuInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["Volume_Utilization"] = Number.NaN;
  results["Weight_Utilization"] = Number.NaN;
  try { const v = Math.max(input.GrossWeight, input.VolumetricWeight); results["ChargeableWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ChargeableWeight"] = Number.NaN; }
  try { const v = Math.min((toNumericFormulaValue(results["Volume_Utilization"])), (toNumericFormulaValue(results["Weight_Utilization"]))); results["LoadEfficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LoadEfficiency"] = Number.NaN; }
  try { const v = (1 - (toNumericFormulaValue(results["LoadEfficiency"]))) * input.FreightCost; results["WastedSpaceCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["WastedSpaceCost"] = Number.NaN; }
  try { const v = Math.floor(input.ContainerHeight / input.PalletHeight); results["PalletStacking"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["PalletStacking"] = Number.NaN; }
  try { const v = Math.min((toNumericFormulaValue(results["PalletStacking"])) * input.FloorArea_Pallets, input.WeightLimit / input.PalletWeight); results["MaxPallets"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["MaxPallets"] = Number.NaN; }
  return results;
}


export function calculateKonteyner_yuku(input: Konteyner_yukuInput): Konteyner_yukuOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["MaxPallets"]);
  const breakdown = {
    Volume_Utilization: toNumericFormulaValue(values["Volume_Utilization"]),
    Weight_Utilization: toNumericFormulaValue(values["Weight_Utilization"]),
    ChargeableWeight: toNumericFormulaValue(values["ChargeableWeight"]),
    LoadEfficiency: toNumericFormulaValue(values["LoadEfficiency"]),
    WastedSpaceCost: toNumericFormulaValue(values["WastedSpaceCost"]),
    PalletStacking: toNumericFormulaValue(values["PalletStacking"]),
    MaxPallets: toNumericFormulaValue(values["MaxPallets"])
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


export interface Konteyner_yukuOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { Volume_Utilization: number; Weight_Utilization: number; ChargeableWeight: number; LoadEfficiency: number; WastedSpaceCost: number; PalletStacking: number; MaxPallets: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Konteyner_yukuOutputMeta = {
  primaryKey: "MaxPallets",
  unit: "USD",
  breakdownKeys: ["Volume_Utilization","Weight_Utilization","ChargeableWeight","LoadEfficiency","WastedSpaceCost","PalletStacking","MaxPallets"],
} as const;

