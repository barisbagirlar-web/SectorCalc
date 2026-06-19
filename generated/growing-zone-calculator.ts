// Auto-generated from growing-zone-calculator-schema.json
import * as z from 'zod';

export interface Growing_zone_calculatorInput {
  length: number;
  width: number;
  plantSpacing: number;
  rowSpacing: number;
  edgeOffset: number;
  dataConfidence?: number;
}

export const Growing_zone_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(1),
  plantSpacing: z.number().default(30),
  rowSpacing: z.number().default(40),
  edgeOffset: z.number().default(15),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Growing_zone_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.plantSpacing / 100; results["plantSpacingM"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["plantSpacingM"] = 0; }
  try { const v = input.rowSpacing / 100; results["rowSpacingM"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rowSpacingM"] = 0; }
  try { const v = input.edgeOffset / 100; results["edgeOffsetM"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["edgeOffsetM"] = 0; }
  try { const v = input.length - 2 * (asFormulaNumber(results["edgeOffsetM"])); results["effectiveLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveLength"] = 0; }
  try { const v = input.width - 2 * (asFormulaNumber(results["edgeOffsetM"])); results["effectiveWidth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveWidth"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveLength"])) / (asFormulaNumber(results["plantSpacingM"])); results["columns"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["columns"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveWidth"])) / (asFormulaNumber(results["rowSpacingM"])); results["rows"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rows"] = 0; }
  try { const v = (asFormulaNumber(results["columns"])) * (asFormulaNumber(results["rows"])); results["totalPlants"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPlants"] = 0; }
  try { const v = input.length * input.width; results["totalArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalArea"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGrowing_zone_calculator(input: Growing_zone_calculatorInput): Growing_zone_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalPlants"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Growing_zone_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
