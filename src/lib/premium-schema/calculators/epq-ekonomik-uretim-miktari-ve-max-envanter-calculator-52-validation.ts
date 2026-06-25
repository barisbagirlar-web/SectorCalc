import { z } from "zod";

export const EpqEkonomikUretimMiktariVeMaxEnvanterCalculator52InputSchema = z.object({
  annualDemand: z.number().min(0),
  dailyProduction: z.number().min(0),
  dailyDemand: z.number().min(0),
  setupCost: z.number().min(0),
  holdingCost: z.number().min(0),
});

export type EpqEkonomikUretimMiktariVeMaxEnvanterCalculator52Input = z.infer<typeof EpqEkonomikUretimMiktariVeMaxEnvanterCalculator52InputSchema>;
