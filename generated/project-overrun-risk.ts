// Auto-generated from project-overrun-risk-schema.json
import * as z from 'zod';

export interface Project_overrun_riskInput {
  bAC: number;
  eV: number;
  aC: number;
  pV: number;
  planliGercekSureGun: number;
  gecikmeCezasiCurrencygun: number;
  gecikmeMaliyetAsimOlasiligi: number;
  hizlandirmaMaliyeti: number;
  dataConfidence?: number;
}

export const Project_overrun_riskInputSchema = z.object({
  bAC: z.number().min(0).default(0),
  eV: z.number().min(0).default(0),
  aC: z.number().min(0).default(0),
  pV: z.number().min(0).default(0),
  planliGercekSureGun: z.number().min(0).default(0),
  gecikmeCezasiCurrencygun: z.number().min(0).default(0),
  gecikmeMaliyetAsimOlasiligi: z.number().min(0).default(0),
  hizlandirmaMaliyeti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(_input: Project_overrun_riskInput): Record<string, number> {
  return {};
}


export function calculateProject_overrun_risk(input: Project_overrun_riskInput): Project_overrun_riskOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total"]);
  const breakdown = {

  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
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
    unit: "currency",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Project_overrun_riskOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Project_overrun_riskOutputMeta = {
  primaryKey: "total",
  unit: "currency",
  breakdownKeys: [],
} as const;

