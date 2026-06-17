// @ts-nocheck
// Auto-generated from cost-estimation-calculator-schema.json
import * as z from 'zod';

export interface Cost_estimation_calculatorInput {
  materialCost: number;
  laborCost: number;
  machineCost: number;
  overheadPercent: number;
  markupPercent: number;
  units: number;
}

export const Cost_estimation_calculatorInputSchema = z.object({
  materialCost: z.number().default(0),
  laborCost: z.number().default(0),
  machineCost: z.number().default(0),
  overheadPercent: z.number().default(10),
  markupPercent: z.number().default(20),
  units: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cost_estimation_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.materialCost + input.laborCost + input.machineCost; results["totalDirectCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDirectCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalDirectCost"])) * (input.overheadPercent / 100); results["overheadAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overheadAmount"] = 0; }
  try { const v = (asFormulaNumber(results["totalDirectCost"])) + (asFormulaNumber(results["overheadAmount"])); results["totalCostBeforeMarkup"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCostBeforeMarkup"] = 0; }
  try { const v = (asFormulaNumber(results["totalCostBeforeMarkup"])) * (1 + input.markupPercent / 100); results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) / input.units; results["costPerUnit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costPerUnit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCost_estimation_calculator(input: Cost_estimation_calculatorInput): Cost_estimation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["costPerUnit"]);
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Cost_estimation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
