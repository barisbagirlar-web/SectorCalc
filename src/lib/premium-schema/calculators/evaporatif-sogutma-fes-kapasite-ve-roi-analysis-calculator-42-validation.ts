import { z } from "zod";

export const EvaporatifSogutmaFesKapasiteVeRoiAnalysisCalculator42InputSchema = z.object({
  len: z.number().min(0),
  wid: z.number().min(0),
  hei: z.number().min(0),
  ach: z.number().min(0),
  tDry: z.number().min(0),
  tWet: z.number().min(0),
  padEff: z.number().min(0),
  devFlow: z.number().min(0),
  devKw: z.number().min(0),
  convKw: z.number().min(0),
  waterLph: z.number().min(0),
  elecRate: z.number().min(0),
  waterRate: z.number().min(0),
  opHours: z.number().min(0),
});

export type EvaporatifSogutmaFesKapasiteVeRoiAnalysisCalculator42Input = z.infer<typeof EvaporatifSogutmaFesKapasiteVeRoiAnalysisCalculator42InputSchema>;
