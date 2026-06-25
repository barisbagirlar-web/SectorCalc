import { z } from "zod";

export const MmcKuyrukTeorisiVeSunucuOptimizasyonuCalculator57InputSchema = z.object({
  arrivalRate: z.number().min(0),
  serviceRate: z.number().min(0),
  servers: z.number().min(0),
  waitCostHr: z.number().min(0),
  serverCostHr: z.number().min(0),
});

export type MmcKuyrukTeorisiVeSunucuOptimizasyonuCalculator57Input = z.infer<typeof MmcKuyrukTeorisiVeSunucuOptimizasyonuCalculator57InputSchema>;
