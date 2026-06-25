import { z } from "zod";

export const EndustriyelDepreciationVeYenilemeReelEuacCalculator4InputSchema = z.object({
  acqCost: z.number().min(0),
  salvage: z.number().min(0),
  life: z.number().min(0),
  taxRate: z.number().min(0),
  nominalWacc: z.number().min(0),
  inflation: z.number().min(0),
  baseMaint: z.number().min(0),
  maintGradient: z.number().min(0),
  baseEnergy: z.number().min(0),
  degRate: z.number().min(0),
  elecPrice: z.number().min(0),
});

export type EndustriyelDepreciationVeYenilemeReelEuacCalculator4Input = z.infer<typeof EndustriyelDepreciationVeYenilemeReelEuacCalculator4InputSchema>;
