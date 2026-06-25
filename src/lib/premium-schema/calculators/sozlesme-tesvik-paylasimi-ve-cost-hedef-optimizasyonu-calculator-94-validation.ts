import { z } from "zod";

export const SozlesmeTesvikPaylasimiVeCostHedefOptimizasyonuCalculator94InputSchema = z.object({
  targetCost: z.number().min(0),
  targetFee: z.number().min(0),
  contractorShare: z.number().min(0),
  maxFee: z.number().min(0),
  minFee: z.number().min(0),
  actualCost: z.number().min(0),
});

export type SozlesmeTesvikPaylasimiVeCostHedefOptimizasyonuCalculator94Input = z.infer<typeof SozlesmeTesvikPaylasimiVeCostHedefOptimizasyonuCalculator94InputSchema>;
