import { z } from "zod";

export const ToleransYigilmasiToleranceStackupOlasiliksalRssAnalysisCalculator153InputSchema = z.object({
  tolArray: z.number().min(0),
  gapNominal: z.number().min(0),
  processCpk: z.number().min(0),
  assemblyVolume: z.number().min(0),
  costPerScrap: z.number().min(0),
});

export type ToleransYigilmasiToleranceStackupOlasiliksalRssAnalysisCalculator153Input = z.infer<typeof ToleransYigilmasiToleranceStackupOlasiliksalRssAnalysisCalculator153InputSchema>;
