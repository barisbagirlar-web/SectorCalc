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

function evaluateAllFormulas(input: Horse_riding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.hourlyRate * input.lessonDuration + input.horseMaintenancePerLesson + input.equipmentRental + input.insurancePerLesson + input.travelCost) * input.numberOfLessons; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / input.numberOfLessons; results["costPerLesson"] = Number.isFinite(v) ? v : 0; } catch { results["costPerLesson"] = 0; }
  try { const v = input.hourlyRate * input.lessonDuration * input.numberOfLessons; results["instructorCost"] = Number.isFinite(v) ? v : 0; } catch { results["instructorCost"] = 0; }
  try { const v = input.horseMaintenancePerLesson * input.numberOfLessons; results["horseMaintenanceTotal"] = Number.isFinite(v) ? v : 0; } catch { results["horseMaintenanceTotal"] = 0; }
  try { const v = input.equipmentRental * input.numberOfLessons; results["equipmentTotal"] = Number.isFinite(v) ? v : 0; } catch { results["equipmentTotal"] = 0; }
  try { const v = input.insurancePerLesson * input.numberOfLessons; results["insuranceTotal"] = Number.isFinite(v) ? v : 0; } catch { results["insuranceTotal"] = 0; }
  try { const v = input.travelCost * input.numberOfLessons; results["travelTotal"] = Number.isFinite(v) ? v : 0; } catch { results["travelTotal"] = 0; }
  return results;
}


export function calculateHorse_riding_calculator(input: Horse_riding_calculatorInput): Horse_riding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
