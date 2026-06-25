import { z } from "zod";

export const KalibrasyonSapmaVeIso17025DecisionRiskiCalculator13InputSchema = z.object({
  currentErr: z.number().min(0),
  prevErr: z.number().min(0),
  daysBetween: z.number().min(0),
  nextInterval: z.number().min(0),
  tolerance: z.number().min(0),
  baseU: z.number().min(0),
  deltaT: z.number().min(0),
  tempCoeff: z.number().min(0),
});

export type KalibrasyonSapmaVeIso17025DecisionRiskiCalculator13Input = z.infer<typeof KalibrasyonSapmaVeIso17025DecisionRiskiCalculator13InputSchema>;
