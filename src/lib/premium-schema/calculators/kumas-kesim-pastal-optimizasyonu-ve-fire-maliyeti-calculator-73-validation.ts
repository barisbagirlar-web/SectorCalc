import { z } from "zod";

export const KumasKesimPastalOptimizasyonuVeFireMaliyetiCalculator73InputSchema = z.object({
  fabricWidth: z.number().min(0),
  markerLength: z.number().min(0),
  patternAreaTotal: z.number().min(0),
  fabricPriceM: z.number().min(0),
  layers: z.number().min(0),
  endWasteCm: z.number().min(0),
  annualCuts: z.number().min(0),
});

export type KumasKesimPastalOptimizasyonuVeFireMaliyetiCalculator73Input = z.infer<typeof KumasKesimPastalOptimizasyonuVeFireMaliyetiCalculator73InputSchema>;
