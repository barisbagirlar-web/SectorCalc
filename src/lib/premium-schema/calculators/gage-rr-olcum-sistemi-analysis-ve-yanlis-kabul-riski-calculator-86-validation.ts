import { z } from "zod";

export const GageRrOlcumSistemiAnalysisVeYanlisKabulRiskiCalculator86InputSchema = z.object({
  evEquipmentVariation: z.number().min(0),
  avAppraiserVariation: z.number().min(0),
  pvPartVariation: z.number().min(0),
  toleranceBand: z.number().min(0),
});

export type GageRrOlcumSistemiAnalysisVeYanlisKabulRiskiCalculator86Input = z.infer<typeof GageRrOlcumSistemiAnalysisVeYanlisKabulRiskiCalculator86InputSchema>;
