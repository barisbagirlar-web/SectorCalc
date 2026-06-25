import { z } from "zod";

export const GazTurbinleriBraytonCevrimiIsilVerimVeSpesifikIsCalculator166InputSchema = z.object({
  t1InletK: z.number().min(0),
  t3TurbineInletK: z.number().min(0),
  pressureRatioRp: z.number().min(0),
  specificHeatRatioGamma: z.number().min(0),
  compEfficiency: z.number().min(0),
  turbEfficiency: z.number().min(0),
});

export type GazTurbinleriBraytonCevrimiIsilVerimVeSpesifikIsCalculator166Input = z.infer<typeof GazTurbinleriBraytonCevrimiIsilVerimVeSpesifikIsCalculator166InputSchema>;
