// Auto-generated from 1031-exchange-cash-out-calculator-schema.json
import * as z from 'zod';

export interface _1031_exchange_cash_out_calculatorInput {
  dataConfidence?: number;
  salePrice: number;
  remainingDebt: number;
  newInvestment: number;
}

export const _1031_exchange_cash_out_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  salePrice: z.number().min(0).default(2000000),
  remainingDebt: z.number().min(0).default(500000),
  newInvestment: z.number().min(0).default(1800000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: _1031_exchange_cash_out_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try {
    const v = input["salePrice"] - input["remainingDebt"];
    results["netSaleProceeds"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN;
  } catch {
    results["netSaleProceeds"] = Number.NaN;
  }
  
  try {
    const v = Math.max(0, (input["salePrice"] - input["remainingDebt"]) - input["newInvestment"]);
    results["cashBoot"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN;
  } catch {
    results["cashBoot"] = Number.NaN;
  }

  try {
    const v = Math.max(0, input["remainingDebt"] - input["newInvestment"]);
    results["mortgageBoot"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN;
  } catch {
    results["mortgageBoot"] = Number.NaN;
  }

  try {
    const v = (Number.isNaN(results["cashBoot"]) ? 0 : results["cashBoot"]) + (Number.isNaN(results["mortgageBoot"]) ? 0 : results["mortgageBoot"]);
    results["totalBoot"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN;
  } catch {
    results["totalBoot"] = Number.NaN;
  }

  try {
    const v = Math.max(0, input["newInvestment"] - (Number.isNaN(results["netSaleProceeds"]) ? 0 : results["netSaleProceeds"]));
    results["deferralAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN;
  } catch {
    results["deferralAmount"] = Number.NaN;
  }

  try {
    const v = input["newInvestment"] >= (Number.isNaN(results["netSaleProceeds"]) ? 0 : results["netSaleProceeds"]) ? 1 : 0;
    results["qualifiedFor1031"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN;
  } catch {
    results["qualifiedFor1031"] = Number.NaN;
  }
  
  return results;
}

export function calculate_1031_exchange_cash_out_calculator(input: _1031_exchange_cash_out_calculatorInput): _1031_exchange_cash_out_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalBoot"]);
  const breakdown: Record<string, number> = {
    "netSaleProceeds": toNumericFormulaValue(values["netSaleProceeds"]),
    "cashBoot": toNumericFormulaValue(values["cashBoot"]),
    "mortgageBoot": toNumericFormulaValue(values["mortgageBoot"]),
    "totalBoot": toNumericFormulaValue(values["totalBoot"]),
    "deferralAmount": toNumericFormulaValue(values["deferralAmount"]),
    "qualifiedFor1031": toNumericFormulaValue(values["qualifiedFor1031"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [
    "Verify inputs before making financial decisions.",
    "Consult a licensed financial advisor for personalized advice."
  ];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["totalBoot"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface _1031_exchange_cash_out_calculatorOutput {
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

export const _1031_exchange_cash_out_calculatorOutputMeta = {
  primaryKey: "totalBoot",
  unit: "USD",
  breakdownKeys: ["netSaleProceeds", "cashBoot", "mortgageBoot", "totalBoot", "deferralAmount", "qualifiedFor1031"],
} as const;
