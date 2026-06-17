// @ts-nocheck
// Auto-generated from vsm-financial-converter-calculator-schema.json
import * as z from 'zod';

export interface Vsm_financial_converter_calculatorInput {
  annualDemand: number;
  sellingPrice: number;
  materialCostPerUnit: number;
  laborCostPerHour: number;
  totalCycleTime: number;
  totalValueAddedTime: number;
  defectRate: number;
  reworkCostPerUnit: number;
}

export const Vsm_financial_converter_calculatorInputSchema = z.object({
  annualDemand: z.number().min(1000).max(10000000).default(100000),
  sellingPrice: z.number().min(1).max(10000).default(50),
  materialCostPerUnit: z.number().min(0).max(5000).default(20),
  laborCostPerHour: z.number().min(5).max(200).default(25),
  totalCycleTime: z.number().min(0.1).max(1000).default(45),
  totalValueAddedTime: z.number().min(0).max(1000).default(15),
  defectRate: z.number().min(0).max(100).default(2),
  reworkCostPerUnit: z.number().min(0).max(1000).default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vsm_financial_converter_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.annualDemand + input.sellingPrice + input.materialCostPerUnit; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.annualDemand + input.sellingPrice + input.materialCostPerUnit; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateVsm_financial_converter_calculator(input: Vsm_financial_converter_calculatorInput): Vsm_financial_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Multi-scenario simulation"],
  };
}


export interface Vsm_financial_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
