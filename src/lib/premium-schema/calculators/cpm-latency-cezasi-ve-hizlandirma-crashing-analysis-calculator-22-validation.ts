import { z } from "zod";

export const CpmLatencyCezasiVeHizlandirmaCrashingAnalysisCalculator22InputSchema = z.object({
  plannedDuration: z.number().min(0),
  actualDuration: z.number().min(0),
  excusableDelay: z.number().min(0),
  dailyPenalty: z.number().min(0),
  accelerationCost: z.number().min(0),
  maxCrashDays: z.number().min(0),
});

export type CpmLatencyCezasiVeHizlandirmaCrashingAnalysisCalculator22Input = z.infer<typeof CpmLatencyCezasiVeHizlandirmaCrashingAnalysisCalculator22InputSchema>;
