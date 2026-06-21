// Auto-generated from teslimat-maliyeti-schema.json
import * as z from 'zod';

export interface Teslimat_maliyetiInput {
  TotalRouteCost: number;
  NumberOfDrops: number;
  TotalDistance: number;
  FailedDrops: number;
  ReturnFreight: number;
  RestockingFee: number;
  AdminCost: number;
  BaseFreight: number;
  FuelIndexPct: number;
  Linehaul: number;
  LastMile: number;
  Surcharges: number;
  SuccessfulDrops: number;
  TotalPlannedDrops: number;
  dataConfidence?: number;
}

export const Teslimat_maliyetiInputSchema = z.object({
  TotalRouteCost: z.number().min(0).default(0),
  NumberOfDrops: z.number().min(0).default(0),
  TotalDistance: z.number().min(0).default(0),
  FailedDrops: z.number().min(0).default(0),
  ReturnFreight: z.number().min(0).default(0),
  RestockingFee: z.number().min(0).default(0),
  AdminCost: z.number().min(0).default(0),
  BaseFreight: z.number().min(0).default(0),
  FuelIndexPct: z.number().min(0).default(0),
  Linehaul: z.number().min(0).default(0),
  LastMile: z.number().min(0).default(0),
  Surcharges: z.number().min(0).default(0),
  SuccessfulDrops: z.number().min(0).default(0),
  TotalPlannedDrops: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Teslimat_maliyetiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.TotalRouteCost / input.NumberOfDrops; results["CostPerDrop"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostPerDrop"] = Number.NaN; }
  try { const v = input.TotalRouteCost / input.TotalDistance; results["CostPerKm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostPerKm"] = Number.NaN; }
  try { const v = input.FailedDrops * (input.ReturnFreight + input.RestockingFee + input.AdminCost); results["FailedDeliveryCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FailedDeliveryCost"] = Number.NaN; }
  try { const v = input.BaseFreight * input.FuelIndexPct; results["FuelSurcharge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["FuelSurcharge"] = Number.NaN; }
  try { const v = input.Linehaul + input.LastMile + (toNumericFormulaValue(results["FailedDeliveryCost"])) + input.Surcharges; results["TotalDeliveryCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalDeliveryCost"] = Number.NaN; }
  try { const v = input.SuccessfulDrops / input.TotalPlannedDrops; results["DeliveryEfficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["DeliveryEfficiency"] = Number.NaN; }
  return results;
}


export function calculateTeslimat_maliyeti(input: Teslimat_maliyetiInput): Teslimat_maliyetiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["DeliveryEfficiency"]);
  const breakdown = {
    CostPerDrop: toNumericFormulaValue(values["CostPerDrop"]),
    CostPerKm: toNumericFormulaValue(values["CostPerKm"]),
    FailedDeliveryCost: toNumericFormulaValue(values["FailedDeliveryCost"]),
    FuelSurcharge: toNumericFormulaValue(values["FuelSurcharge"]),
    TotalDeliveryCost: toNumericFormulaValue(values["TotalDeliveryCost"]),
    DeliveryEfficiency: toNumericFormulaValue(values["DeliveryEfficiency"])
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


export interface Teslimat_maliyetiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { CostPerDrop: number; CostPerKm: number; FailedDeliveryCost: number; FuelSurcharge: number; TotalDeliveryCost: number; DeliveryEfficiency: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Teslimat_maliyetiOutputMeta = {
  primaryKey: "DeliveryEfficiency",
  unit: "USD",
  breakdownKeys: ["CostPerDrop","CostPerKm","FailedDeliveryCost","FuelSurcharge","TotalDeliveryCost","DeliveryEfficiency"],
} as const;

