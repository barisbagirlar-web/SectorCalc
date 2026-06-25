import { z } from "zod";

export const MagazaservisSaatlikUcretBurdenedRateCalculator77InputSchema = z.object({
  techWages: z.number().min(0),
  adminWages: z.number().min(0),
  statutoryBurden: z.number().min(0),
  fixedOverhead: z.number().min(0),
  techCount: z.number().min(0),
  availableHrsPerTech: z.number().min(0),
  utilizationRate: z.number().min(0),
  targetProfitMargin: z.number().min(0),
});

export type MagazaservisSaatlikUcretBurdenedRateCalculator77Input = z.infer<typeof MagazaservisSaatlikUcretBurdenedRateCalculator77InputSchema>;
