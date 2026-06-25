import { z } from "zod";

export const KompresorHavaKacagiEnerjiIsrafiSonikAkisIso4414Calculator70InputSchema = z.object({
  leakDiameter: z.number().min(0),
  leakCount: z.number().min(0),
  gaugePressure: z.number().min(0),
  ambientTemp: z.number().min(0),
  specificPower: z.number().min(0),
  opHours: z.number().min(0),
  elecRate: z.number().min(0),
  cdFactor: z.number().min(0),
});

export type KompresorHavaKacagiEnerjiIsrafiSonikAkisIso4414Calculator70Input = z.infer<typeof KompresorHavaKacagiEnerjiIsrafiSonikAkisIso4414Calculator70InputSchema>;
