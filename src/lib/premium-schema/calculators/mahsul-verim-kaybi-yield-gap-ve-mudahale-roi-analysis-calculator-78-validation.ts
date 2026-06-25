import { z } from "zod";

export const MahsulVerimKaybiYieldGapVeMudahaleRoiAnalysisCalculator78InputSchema = z.object({
  geneticPotential: z.number().min(0),
  envFactor: z.number().min(0),
  actualHarvest: z.number().min(0),
  fieldArea: z.number().min(0),
  lossPest: z.number().min(0),
  lossDisease: z.number().min(0),
  lossWeed: z.number().min(0),
  cropPrice: z.number().min(0),
  interventionCost: z.number().min(0),
  recoveryPct: z.number().min(0),
});

export type MahsulVerimKaybiYieldGapVeMudahaleRoiAnalysisCalculator78Input = z.infer<typeof MahsulVerimKaybiYieldGapVeMudahaleRoiAnalysisCalculator78InputSchema>;
