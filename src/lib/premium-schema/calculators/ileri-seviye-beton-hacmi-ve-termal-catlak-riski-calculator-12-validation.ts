import { z } from "zod";

export const IleriSeviyeBetonHacmiVeTermalCatlakRiskiCalculator12InputSchema = z.object({
  volSlab: z.number().min(0),
  volFooting: z.number().min(0),
  volColumn: z.number().min(0),
  rebarPct: z.number().min(0),
  wastePct: z.number().min(0),
  ambientTemp: z.number().min(0),
  cementContent: z.number().min(0),
  cementType: z.number().min(0),
  unitPrice: z.number().min(0),
  pumpFee: z.number().min(0),
});

export type IleriSeviyeBetonHacmiVeTermalCatlakRiskiCalculator12Input = z.infer<typeof IleriSeviyeBetonHacmiVeTermalCatlakRiskiCalculator12InputSchema>;
