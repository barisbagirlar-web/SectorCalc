import { z } from "zod";

export const CpkppmDonusturucuVeKaliteLossFinansiCalculator21InputSchema = z.object({
  usl: z.number().min(0),
  lsl: z.number().min(0),
  processMean: z.number().min(0),
  stdDev: z.number().min(0),
  dailyVolume: z.number().min(0),
  costPerDefect: z.number().min(0),
});

export type CpkppmDonusturucuVeKaliteLossFinansiCalculator21Input = z.infer<typeof CpkppmDonusturucuVeKaliteLossFinansiCalculator21InputSchema>;
