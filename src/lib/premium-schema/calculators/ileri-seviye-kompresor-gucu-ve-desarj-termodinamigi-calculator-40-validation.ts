import { z } from "zod";

export const IleriSeviyeKompresorGucuVeDesarjTermodinamigiCalculator40InputSchema = z.object({
  fadFlow: z.number().min(0),
  gaugePressure: z.number().min(0),
  inletTemp: z.number().min(0),
  polyIndex: z.number().min(0),
  isEff: z.number().min(0),
  mechEff: z.number().min(0),
  motorEff: z.number().min(0),
  stages: z.number().min(0),
  annualHours: z.number().min(0),
  elecRate: z.number().min(0),
});

export type IleriSeviyeKompresorGucuVeDesarjTermodinamigiCalculator40Input = z.infer<typeof IleriSeviyeKompresorGucuVeDesarjTermodinamigiCalculator40InputSchema>;
