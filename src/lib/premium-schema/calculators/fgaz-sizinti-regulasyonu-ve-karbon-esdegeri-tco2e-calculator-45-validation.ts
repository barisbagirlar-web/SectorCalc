import { z } from "zod";

export const FgazSizintiRegulasyonuVeKarbonEsdegeriTco2eCalculator45InputSchema = z.object({
  gwpValue: z.number().min(0),
  chargeKg: z.number().min(0),
  deviceCount: z.number().min(0),
  leakRatePct: z.number().min(0),
  testCost: z.number().min(0),
  gasPrice: z.number().min(0),
});

export type FgazSizintiRegulasyonuVeKarbonEsdegeriTco2eCalculator45Input = z.infer<typeof FgazSizintiRegulasyonuVeKarbonEsdegeriTco2eCalculator45InputSchema>;
