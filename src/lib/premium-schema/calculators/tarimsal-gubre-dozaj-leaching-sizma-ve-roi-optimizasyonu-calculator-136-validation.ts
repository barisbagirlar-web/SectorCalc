import { z } from "zod";

export const TarimsalGubreDozajLeachingSizmaVeRoiOptimizasyonuCalculator136InputSchema = z.object({
  targetYieldKgDa: z.number().min(0),
  plantReqNutrient: z.number().min(0),
  soilSupply: z.number().min(0),
  fertilizerEfficiency: z.number().min(0),
  fertilizerContentPct: z.number().min(0),
  fieldArea: z.number().min(0),
  fertilizerPrice: z.number().min(0),
  cropPrice: z.number().min(0),
  leachingCoeff: z.number().min(0),
});

export type TarimsalGubreDozajLeachingSizmaVeRoiOptimizasyonuCalculator136Input = z.infer<typeof TarimsalGubreDozajLeachingSizmaVeRoiOptimizasyonuCalculator136InputSchema>;
