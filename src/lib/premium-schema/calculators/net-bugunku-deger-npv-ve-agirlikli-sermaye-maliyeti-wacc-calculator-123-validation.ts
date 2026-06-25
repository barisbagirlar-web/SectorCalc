import { z } from "zod";

export const NetBugunkuDegerNpvVeAgirlikliSermayeMaliyetiWaccCalculator123InputSchema = z.object({
  totalDebt: z.number().min(0),
  totalEquity: z.number().min(0),
  costOfDebt: z.number().min(0),
  costOfEquity: z.number().min(0),
  taxRate: z.number().min(0),
  initialInvestment: z.number().min(0),
  cashFlows: z.number().min(0),
  terminalGrowthRate: z.number().min(0),
});

export type NetBugunkuDegerNpvVeAgirlikliSermayeMaliyetiWaccCalculator123Input = z.infer<typeof NetBugunkuDegerNpvVeAgirlikliSermayeMaliyetiWaccCalculator123InputSchema>;
