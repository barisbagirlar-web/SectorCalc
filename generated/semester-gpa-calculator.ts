// Auto-generated from semester-gpa-calculator-schema.json
import * as z from 'zod';

export interface Semester_gpa_calculatorInput {
  course1Credit: number;
  course1Grade: number;
  course2Credit: number;
  course2Grade: number;
  course3Credit: number;
  course3Grade: number;
  course4Credit: number;
  course4Grade: number;
  dataConfidence?: number;
}

export const Semester_gpa_calculatorInputSchema = z.object({
  course1Credit: z.number().default(0),
  course1Grade: z.number().default(0),
  course2Credit: z.number().default(0),
  course2Grade: z.number().default(0),
  course3Credit: z.number().default(0),
  course3Grade: z.number().default(0),
  course4Credit: z.number().default(0),
  course4Grade: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Semester_gpa_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.course1Credit * input.course1Grade + input.course2Credit * input.course2Grade + input.course3Credit * input.course3Grade + input.course4Credit * input.course4Grade; results["totalGradePoints"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalGradePoints"] = Number.NaN; }
  try { const v = input.course1Credit + input.course2Credit + input.course3Credit + input.course4Credit; results["totalCredits"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCredits"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalGradePoints"])) / (toNumericFormulaValue(results["totalCredits"])); results["gpa"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gpa"] = Number.NaN; }
  return results;
}


export function calculateSemester_gpa_calculator(input: Semester_gpa_calculatorInput): Semester_gpa_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["gpa"]);
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


export interface Semester_gpa_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
