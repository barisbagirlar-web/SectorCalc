import { z } from "zod";

export const FmeaRiskOncelikSayisiRpnVeAksiyonMatrisiCalculator58InputSchema = z.object({
  severity: z.number().min(0),
  occurrence: z.number().min(0),
  detection: z.number().min(0),
  mitigationCost: z.number().min(0),
  newSeverity: z.number().min(0),
  newOccurrence: z.number().min(0),
  newDetection: z.number().min(0),
});

export type FmeaRiskOncelikSayisiRpnVeAksiyonMatrisiCalculator58Input = z.infer<typeof FmeaRiskOncelikSayisiRpnVeAksiyonMatrisiCalculator58InputSchema>;
