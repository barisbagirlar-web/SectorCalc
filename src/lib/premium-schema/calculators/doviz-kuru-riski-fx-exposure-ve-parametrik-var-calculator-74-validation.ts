import { z } from "zod";

export const DovizKuruRiskiFxExposureVeParametrikVarCalculator74InputSchema = z.object({
  fxRevenue: z.number().min(0),
  fxExpense: z.number().min(0),
  spotRate: z.number().min(0),
  forwardRate: z.number().min(0),
  volatilityAnnual: z.number().min(0),
  horizonDays: z.number().min(0),
  hedgeRatio: z.number().min(0),
  zScore: z.number().min(0),
});

export type DovizKuruRiskiFxExposureVeParametrikVarCalculator74Input = z.infer<typeof DovizKuruRiskiFxExposureVeParametrikVarCalculator74InputSchema>;
