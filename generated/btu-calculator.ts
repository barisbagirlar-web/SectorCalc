// @ts-nocheck
// Auto-generated from btu-calculator-schema.json
import * as z from 'zod';

export interface Btu_calculatorInput {
  roomLength: number;
  roomWidth: number;
  ceilingHeight: number;
  insulationFactor: number;
  windowArea: number;
  occupants: number;
  applianceHeat: number;
}

export const Btu_calculatorInputSchema = z.object({
  roomLength: z.number().default(20),
  roomWidth: z.number().default(15),
  ceilingHeight: z.number().default(8),
  insulationFactor: z.number().default(1),
  windowArea: z.number().default(20),
  occupants: z.number().default(2),
  applianceHeat: z.number().default(1000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Btu_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.roomLength * input.roomWidth * input.ceilingHeight * 5 * input.insulationFactor + input.windowArea * 30 + input.occupants * 600 + input.applianceHeat; results["totalBTU"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalBTU"] = 0; }
  try { const v = input.roomLength * input.roomWidth * input.ceilingHeight * 5 * input.insulationFactor; results["baseBTU"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["baseBTU"] = 0; }
  try { const v = input.windowArea * 30; results["windowBTU"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["windowBTU"] = 0; }
  try { const v = input.occupants * 600; results["occupantBTU"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["occupantBTU"] = 0; }
  try { const v = input.applianceHeat; results["applianceBTU"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["applianceBTU"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBtu_calculator(input: Btu_calculatorInput): Btu_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalBTU"]);
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


export interface Btu_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
