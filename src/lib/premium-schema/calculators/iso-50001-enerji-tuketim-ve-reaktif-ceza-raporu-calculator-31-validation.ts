import { z } from "zod";

export const Iso50001EnerjiTuketimVeReaktifCezaRaporuCalculator31InputSchema = z.object({
  activeKwh: z.number().min(0),
  reactiveIndKvarh: z.number().min(0),
  reactiveCapKvarh: z.number().min(0),
  peakDemandKw: z.number().min(0),
  activeRate: z.number().min(0),
  reactiveRate: z.number().min(0),
  demandRate: z.number().min(0),
  penaltyLimitInd: z.number().min(0),
  penaltyLimitCap: z.number().min(0),
});

export type Iso50001EnerjiTuketimVeReaktifCezaRaporuCalculator31Input = z.infer<typeof Iso50001EnerjiTuketimVeReaktifCezaRaporuCalculator31InputSchema>;
