import { z } from "zod";

export const KondenserAdiyabatikOnSogutmaEnerjiTasarrufuCalculator43InputSchema = z.object({
  chillerCap: z.number().min(0),
  currentCop: z.number().min(0),
  tDry: z.number().min(0),
  tWet: z.number().min(0),
  padEff: z.number().min(0),
  opHours: z.number().min(0),
  elecRate: z.number().min(0),
  systemCapex: z.number().min(0),
  systemOpex: z.number().min(0),
});

export type KondenserAdiyabatikOnSogutmaEnerjiTasarrufuCalculator43Input = z.infer<typeof KondenserAdiyabatikOnSogutmaEnerjiTasarrufuCalculator43InputSchema>;
