import { z } from "zod";

export const SaatlikUcretTamYukluBurdenedRateVeServisMarjiCalculator97InputSchema = z.object({
  baseSalary: z.number().min(0),
  benefits: z.number().min(0),
  statutory: z.number().min(0),
  idlePct: z.number().min(0),
  marginPct: z.number().min(0),
});

export type SaatlikUcretTamYukluBurdenedRateVeServisMarjiCalculator97Input = z.infer<typeof SaatlikUcretTamYukluBurdenedRateVeServisMarjiCalculator97InputSchema>;
