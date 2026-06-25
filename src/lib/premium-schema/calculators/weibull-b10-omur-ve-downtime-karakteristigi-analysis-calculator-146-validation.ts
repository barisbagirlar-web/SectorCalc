import { z } from "zod";

export const WeibullB10OmurVeDowntimeKarakteristigiAnalysisCalculator146InputSchema = z.object({
  betaShape: z.number().min(0),
  etaScale: z.number().min(0),
  targetTime: z.number().min(0),
  targetReliability: z.number().min(0),
  populationSize: z.number().min(0),
  warrantyCostPerUnit: z.number().min(0),
});

export type WeibullB10OmurVeDowntimeKarakteristigiAnalysisCalculator146Input = z.infer<typeof WeibullB10OmurVeDowntimeKarakteristigiAnalysisCalculator146InputSchema>;
