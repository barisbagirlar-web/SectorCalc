import { z } from "zod";

export const ProjectEnflasyonEskalasyonuVeGercekIskontoNpvCalculator32InputSchema = z.object({
  baseMatCost: z.number().min(0),
  baseLabCost: z.number().min(0),
  inflMatPct: z.number().min(0),
  inflLabPct: z.number().min(0),
  projectDurationYr: z.number().min(0),
  nominalDiscountRate: z.number().min(0),
  genInflationRate: z.number().min(0),
  riskContingencyPct: z.number().min(0),
});

export type ProjectEnflasyonEskalasyonuVeGercekIskontoNpvCalculator32Input = z.infer<typeof ProjectEnflasyonEskalasyonuVeGercekIskontoNpvCalculator32InputSchema>;
