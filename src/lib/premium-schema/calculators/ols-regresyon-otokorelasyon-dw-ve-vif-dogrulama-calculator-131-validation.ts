import { z } from "zod";

export const OlsRegresyonOtokorelasyonDwVeVifDogrulamaCalculator131InputSchema = z.object({
  nSamples: z.number().min(0),
  pPredictors: z.number().min(0),
  rSquared: z.number().min(0),
  maxVifValue: z.number().min(0),
  durbinWatsonStat: z.number().min(0),
  conditionNumber: z.number().min(0),
});

export type OlsRegresyonOtokorelasyonDwVeVifDogrulamaCalculator131Input = z.infer<typeof OlsRegresyonOtokorelasyonDwVeVifDogrulamaCalculator131InputSchema>;
