import { z } from "zod";

export const KwhEnerjiCostAnalysisVeReaktifCezaKalkaniCalculator75InputSchema = z.object({
  activeKwh: z.number().min(0),
  reactiveKvarh: z.number().min(0),
  peakDemandKw: z.number().min(0),
  activeRate: z.number().min(0),
  reactiveRate: z.number().min(0),
  demandRate: z.number().min(0),
  penaltyThreshold: z.number().min(0),
  taxRate: z.number().min(0),
});

export type KwhEnerjiCostAnalysisVeReaktifCezaKalkaniCalculator75Input = z.infer<typeof KwhEnerjiCostAnalysisVeReaktifCezaKalkaniCalculator75InputSchema>;
