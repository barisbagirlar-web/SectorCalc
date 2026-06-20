// Auto-generated from horse-riding-calculator-schema.json
import * as z from 'zod';

export interface Horse_riding_calculatorInput {
  lessonDuration: number;
  hourlyRate: number;
  horseMaintenancePerLesson: number;
  equipmentRental: number;
  insurancePerLesson: number;
  travelCost: number;
  numberOfLessons: number;
  dataConfidence?: number;
}

export const Horse_riding_calculatorInputSchema = z.object({
  lessonDuration: z.number().default(1),
  hourlyRate: z.number().default(50),
  horseMaintenancePerLesson: z.number().default(20),
  equipmentRental: z.number().default(10),
  insurancePerLesson: z.number().default(5),
  travelCost: z.number().default(5),
  numberOfLessons: z.number().default(4),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Horse_riding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.hourlyRate * input.lessonDuration + input.horseMaintenancePerLesson + input.equipmentRental + input.insurancePerLesson + input.travelCost) * input.numberOfLessons; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) / input.numberOfLessons; results["costPerLesson"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerLesson"] = Number.NaN; }
  try { const v = input.hourlyRate * input.lessonDuration * input.numberOfLessons; results["instructorCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["instructorCost"] = Number.NaN; }
  try { const v = input.horseMaintenancePerLesson * input.numberOfLessons; results["horseMaintenanceTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["horseMaintenanceTotal"] = Number.NaN; }
  try { const v = input.equipmentRental * input.numberOfLessons; results["equipmentTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["equipmentTotal"] = Number.NaN; }
  try { const v = input.insurancePerLesson * input.numberOfLessons; results["insuranceTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["insuranceTotal"] = Number.NaN; }
  try { const v = input.travelCost * input.numberOfLessons; results["travelTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["travelTotal"] = Number.NaN; }
  return results;
}


export function calculateHorse_riding_calculator(input: Horse_riding_calculatorInput): Horse_riding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Horse_riding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
