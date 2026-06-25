import { z } from "zod";

export const PlastikEnjeksiyonYollukKesmeHiziShearRateVeBasincDusumuCalculator183InputSchema = z.object({
  runnerDiameterMm: z.number().min(0),
  flowRateCm3S: z.number().min(0),
  meltViscosityPas: z.number().min(0),
  runnerLengthMm: z.number().min(0),
});

export type PlastikEnjeksiyonYollukKesmeHiziShearRateVeBasincDusumuCalculator183Input = z.infer<typeof PlastikEnjeksiyonYollukKesmeHiziShearRateVeBasincDusumuCalculator183InputSchema>;
