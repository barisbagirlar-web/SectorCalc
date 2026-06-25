import { z } from "zod";

export const DogalHavalandirmaAchIsilBacaOptimizasyonuCalculator48InputSchema = z.object({
  vol: z.number().min(0),
  tIn: z.number().min(0),
  tOut: z.number().min(0),
  targetAch: z.number().min(0),
  cd: z.number().min(0),
  deltaH: z.number().min(0),
});

export type DogalHavalandirmaAchIsilBacaOptimizasyonuCalculator48Input = z.infer<typeof DogalHavalandirmaAchIsilBacaOptimizasyonuCalculator48InputSchema>;
