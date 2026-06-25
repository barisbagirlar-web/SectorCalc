import { z } from "zod";

export const KaynakIslemEkonomisiVeArkVerimiCalculator66InputSchema = z.object({
  travelSpeed: z.number().min(0),
  weldLength: z.number().min(0),
  arcOnFactor: z.number().min(0),
  laborRate: z.number().min(0),
  powerKw: z.number().min(0),
  elecRate: z.number().min(0),
  gasFlow: z.number().min(0),
  gasPrice: z.number().min(0),
  fillerRequiredKg: z.number().min(0),
  fillerPrice: z.number().min(0),
});

export type KaynakIslemEkonomisiVeArkVerimiCalculator66Input = z.infer<typeof KaynakIslemEkonomisiVeArkVerimiCalculator66InputSchema>;
