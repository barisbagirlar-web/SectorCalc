import { z } from "zod";

export const BilesikFaizEnflasyonVeReelGetiriSurekliBilesikCalculator49InputSchema = z.object({
  pv: z.number().min(0),
  pmt: z.number().min(0),
  annualRate: z.number().min(0),
  compoundingFreq: z.number().min(0),
  inflationRate: z.number().min(0),
  taxRate: z.number().min(0),
});

export type BilesikFaizEnflasyonVeReelGetiriSurekliBilesikCalculator49Input = z.infer<typeof BilesikFaizEnflasyonVeReelGetiriSurekliBilesikCalculator49InputSchema>;
