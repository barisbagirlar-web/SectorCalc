import { z } from "zod";

export const StandartZamanEtuduVeOrneklemGecerlilikAnalysisCalculator127InputSchema = z.object({
  observedTimes: z.number().min(0),
  performanceRating: z.number().min(0),
  allowancePfd: z.number().min(0),
  zScore: z.number().min(0),
  accuracyMargin: z.number().min(0),
});

export type StandartZamanEtuduVeOrneklemGecerlilikAnalysisCalculator127Input = z.infer<typeof StandartZamanEtuduVeOrneklemGecerlilikAnalysisCalculator127InputSchema>;
