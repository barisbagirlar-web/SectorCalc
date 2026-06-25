import { z } from "zod";

export const FaizOraniKurRiskiVeVarHedgeMaliyetiCalculator37InputSchema = z.object({
  floatingDebt: z.number().min(0),
  hedgeRatio: z.number().min(0),
  bpsShock: z.number().min(0),
  volatilityAnnual: z.number().min(0),
  var99Z: z.number().min(0),
  swapPremium: z.number().min(0),
  ebitda: z.number().min(0),
});

export type FaizOraniKurRiskiVeVarHedgeMaliyetiCalculator37Input = z.infer<typeof FaizOraniKurRiskiVeVarHedgeMaliyetiCalculator37InputSchema>;
