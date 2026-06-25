import { z } from "zod";

export const IsgGurultuOshaVeTitresimIso5349MaruziyetFinansiCalculator105InputSchema = z.object({
  noiseLevelDba: z.number().min(0),
  exposureHrs: z.number().min(0),
  vibAcceleration: z.number().min(0),
  workersExposed: z.number().min(0),
  ppeCost: z.number().min(0),
  medicalScreening: z.number().min(0),
  fatigueDefectRate: z.number().min(0),
  annualVolume: z.number().min(0),
  costPerDefect: z.number().min(0),
});

export type IsgGurultuOshaVeTitresimIso5349MaruziyetFinansiCalculator105Input = z.infer<typeof IsgGurultuOshaVeTitresimIso5349MaruziyetFinansiCalculator105InputSchema>;
