import { z } from "zod";

export const EndustriyelCatiYapisalYukVeCostCalculator23InputSchema = z.object({
  bldgLength: z.number().min(0),
  bldgWidth: z.number().min(0),
  roofPitchDeg: z.number().min(0),
  overhang: z.number().min(0),
  groundSnowLoad: z.number().min(0),
  exposureFactor: z.number().min(0),
  thermalFactor: z.number().min(0),
  materialCostM2: z.number().min(0),
  wastePct: z.number().min(0),
});

export type EndustriyelCatiYapisalYukVeCostCalculator23Input = z.infer<typeof EndustriyelCatiYapisalYukVeCostCalculator23InputSchema>;
