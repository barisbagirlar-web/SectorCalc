// Auto-generated from navlun-maliyeti-schema.json
import * as z from 'zod';

export interface Navlun_maliyetiInput {
  GrossWeight: number;
  VolumetricWeight: number;
  RatePerKg: number;
  BAF_Pct: number;
  SecurityRate: number;
  Units: number;
  THC_Rate: number;
  FixedFee: number;
  Value: number;
  DutyPct: number;
  TotalUnits: number;
  dataConfidence?: number;
}

export const Navlun_maliyetiInputSchema = z.object({
  GrossWeight: z.number().min(0).default(0),
  VolumetricWeight: z.number().min(0).default(0),
  RatePerKg: z.number().min(0).default(0),
  BAF_Pct: z.number().min(0).default(0),
  SecurityRate: z.number().min(0).default(0),
  Units: z.number().min(0).default(0),
  THC_Rate: z.number().min(0).default(0),
  FixedFee: z.number().min(0).default(0),
  Value: z.number().min(0).default(0),
  DutyPct: z.number().min(0).default(0),
  TotalUnits: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Navlun_maliyetiInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(input.GrossWeight, input.VolumetricWeight); results["ChargeableWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ChargeableWeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ChargeableWeight"])) * input.RatePerKg; results["BaseFreight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["BaseFreight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["BaseFreight"])) * input.BAF_Pct; results["BunkerSurcharge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["BunkerSurcharge"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["ChargeableWeight"])) * input.SecurityRate; results["SecurityFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["SecurityFee"] = Number.NaN; }
  try { const v = input.Units * input.THC_Rate; results["TerminalHandling"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TerminalHandling"] = Number.NaN; }
  try { const v = input.FixedFee + (input.Value * input.DutyPct); results["CustomsClearance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CustomsClearance"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["BaseFreight"])) + (toNumericFormulaValue(results["BunkerSurcharge"])) + (toNumericFormulaValue(results["SecurityFee"])) + (toNumericFormulaValue(results["TerminalHandling"])) + (toNumericFormulaValue(results["CustomsClearance"])); results["TotalFreightCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["TotalFreightCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["TotalFreightCost"])) / input.TotalUnits; results["CostPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["CostPerUnit"] = Number.NaN; }
  return results;
}


export function calculateNavlun_maliyeti(input: Navlun_maliyetiInput): Navlun_maliyetiOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["CostPerUnit"]);
  const breakdown = {
    ChargeableWeight: toNumericFormulaValue(values["ChargeableWeight"]),
    BaseFreight: toNumericFormulaValue(values["BaseFreight"]),
    BunkerSurcharge: toNumericFormulaValue(values["BunkerSurcharge"]),
    SecurityFee: toNumericFormulaValue(values["SecurityFee"]),
    TerminalHandling: toNumericFormulaValue(values["TerminalHandling"]),
    CustomsClearance: toNumericFormulaValue(values["CustomsClearance"]),
    TotalFreightCost: toNumericFormulaValue(values["TotalFreightCost"]),
    CostPerUnit: toNumericFormulaValue(values["CostPerUnit"])
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


export interface Navlun_maliyetiOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { ChargeableWeight: number; BaseFreight: number; BunkerSurcharge: number; SecurityFee: number; TerminalHandling: number; CustomsClearance: number; TotalFreightCost: number; CostPerUnit: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Navlun_maliyetiOutputMeta = {
  primaryKey: "CostPerUnit",
  unit: "USD",
  breakdownKeys: ["ChargeableWeight","BaseFreight","BunkerSurcharge","SecurityFee","TerminalHandling","CustomsClearance","TotalFreightCost","CostPerUnit"],
} as const;

