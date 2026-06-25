import { z } from "zod";

export const GuvenilirlikBlokDiyagramiRbdVeSistemMtbfCalculator80InputSchema = z.object({
  failureRatesLambda: z.number().min(0),
  configType: z.number().min(0),
  targetReliability: z.number().min(0),
});

export type GuvenilirlikBlokDiyagramiRbdVeSistemMtbfCalculator80Input = z.infer<typeof GuvenilirlikBlokDiyagramiRbdVeSistemMtbfCalculator80InputSchema>;
