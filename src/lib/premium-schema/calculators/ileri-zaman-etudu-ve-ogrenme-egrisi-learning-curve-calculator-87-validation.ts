import { z } from "zod";

export const IleriZamanEtuduVeOgrenmeEgrisiLearningCurveCalculator87InputSchema = z.object({
  firstUnitTime: z.number().min(0),
  learningRatePct: z.number().min(0),
  targetUnitN: z.number().min(0),
  laborRate: z.number().min(0),
});

export type IleriZamanEtuduVeOgrenmeEgrisiLearningCurveCalculator87Input = z.infer<typeof IleriZamanEtuduVeOgrenmeEgrisiLearningCurveCalculator87InputSchema>;
