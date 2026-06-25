import { z } from "zod";

export const PertcpmProjectDurationVeVaryansZskoruOlasiligiCalculator56InputSchema = z.object({
  tOpt: z.number().min(0),
  tMl: z.number().min(0),
  tPess: z.number().min(0),
  targetDuration: z.number().min(0),
  dailyPenalty: z.number().min(0),
});

export type PertcpmProjectDurationVeVaryansZskoruOlasiligiCalculator56Input = z.infer<typeof PertcpmProjectDurationVeVaryansZskoruOlasiligiCalculator56InputSchema>;
