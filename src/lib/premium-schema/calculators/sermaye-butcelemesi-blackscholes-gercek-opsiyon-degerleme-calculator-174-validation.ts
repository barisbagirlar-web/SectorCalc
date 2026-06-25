import { z } from "zod";

export const SermayeButcelemesiBlackscholesGercekOpsiyonDegerlemeCalculator174InputSchema = z.object({
  projectPv: z.number().min(0),
  strikePriceCapex: z.number().min(0),
  riskFreeRate: z.number().min(0),
  optionTimeYrs: z.number().min(0),
  volatilityAnnual: z.number().min(0),
});

export type SermayeButcelemesiBlackscholesGercekOpsiyonDegerlemeCalculator174Input = z.infer<typeof SermayeButcelemesiBlackscholesGercekOpsiyonDegerlemeCalculator174InputSchema>;
