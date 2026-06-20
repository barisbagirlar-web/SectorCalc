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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Growing_zone_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.plantSpacing / 100; results["plantSpacingM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["plantSpacingM"] = Number.NaN; }
  try { const v = input.rowSpacing / 100; results["rowSpacingM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rowSpacingM"] = Number.NaN; }
  try { const v = input.edgeOffset / 100; results["edgeOffsetM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["edgeOffsetM"] = Number.NaN; }
  try { const v = input.length - 2 * (toNumericFormulaValue(results["edgeOffsetM"])); results["effectiveLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveLength"] = Number.NaN; }
  try { const v = input.width - 2 * (toNumericFormulaValue(results["edgeOffsetM"])); results["effectiveWidth"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveWidth"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["effectiveLength"])) / (toNumericFormulaValue(results["plantSpacingM"])); results["columns"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["columns"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["effectiveWidth"])) / (toNumericFormulaValue(results["rowSpacingM"])); results["rows"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rows"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["columns"])) * (toNumericFormulaValue(results["rows"])); results["totalPlants"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPlants"] = Number.NaN; }
  try { const v = input.length * input.width; results["totalArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalArea"] = Number.NaN; }
  return results;
}


export function calculateGrowing_zone_calculator(input: Growing_zone_calculatorInput): Growing_zone_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalPlants"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
