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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Semester_gpa_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.course1Credit * input.course1Grade + input.course2Credit * input.course2Grade + input.course3Credit * input.course3Grade + input.course4Credit * input.course4Grade; results["totalGradePoints"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalGradePoints"] = 0; }
  try { const v = input.course1Credit + input.course2Credit + input.course3Credit + input.course4Credit; results["totalCredits"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCredits"] = 0; }
  try { const v = (asFormulaNumber(results["totalGradePoints"])) / (asFormulaNumber(results["totalCredits"])); results["gpa"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gpa"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSemester_gpa_calculator(input: Semester_gpa_calculatorInput): Semester_gpa_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["gpa"]));
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


export interface Semester_gpa_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
