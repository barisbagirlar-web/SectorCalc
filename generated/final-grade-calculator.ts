// Auto-generated from final-grade-calculator-schema.json
import * as z from 'zod';

export interface Final_grade_calculatorInput {
  homeworkScore: number;
  homeworkWeight: number;
  midtermScore: number;
  midtermWeight: number;
  finalExamScore: number;
  finalExamWeight: number;
  projectScore: number;
  projectWeight: number;
}

export const Final_grade_calculatorInputSchema = z.object({
  homeworkScore: z.number().default(0),
  homeworkWeight: z.number().default(25),
  midtermScore: z.number().default(0),
  midtermWeight: z.number().default(30),
  finalExamScore: z.number().default(0),
  finalExamWeight: z.number().default(35),
  projectScore: z.number().default(0),
  projectWeight: z.number().default(10),
});

function evaluateAllFormulas(input: Final_grade_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.homeworkScore * input.homeworkWeight; results["weightedHomework"] = Number.isFinite(v) ? v : 0; } catch { results["weightedHomework"] = 0; }
  try { const v = input.midtermScore * input.midtermWeight; results["weightedMidterm"] = Number.isFinite(v) ? v : 0; } catch { results["weightedMidterm"] = 0; }
  try { const v = input.finalExamScore * input.finalExamWeight; results["weightedFinalExam"] = Number.isFinite(v) ? v : 0; } catch { results["weightedFinalExam"] = 0; }
  try { const v = input.projectScore * input.projectWeight; results["weightedProject"] = Number.isFinite(v) ? v : 0; } catch { results["weightedProject"] = 0; }
  try { const v = (input.homeworkScore * input.homeworkWeight + input.midtermScore * input.midtermWeight + input.finalExamScore * input.finalExamWeight + input.projectScore * input.projectWeight) / (input.homeworkWeight + input.midtermWeight + input.finalExamWeight + input.projectWeight); results["finalGrade"] = Number.isFinite(v) ? v : 0; } catch { results["finalGrade"] = 0; }
  return results;
}


export function calculateFinal_grade_calculator(input: Final_grade_calculatorInput): Final_grade_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalGrade"] ?? 0;
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


export interface Final_grade_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
