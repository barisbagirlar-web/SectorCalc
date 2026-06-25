import { z } from "zod";

export const TemaAkisKaynakliEsanjorRezonansVeAkiskanElastigiSiniriCalculator172InputSchema = z.object({
  shellFluidVelocity: z.number().min(0),
  tubeOuterDia: z.number().min(0),
  tubeNaturalFreq: z.number().min(0),
  strouhalNumber: z.number().min(0),
  shellFluidDensity: z.number().min(0),
  fluidDampingRatio: z.number().min(0),
  connorsConstant: z.number().min(0),
  totalMassKgM: z.number().min(0),
});

export type TemaAkisKaynakliEsanjorRezonansVeAkiskanElastigiSiniriCalculator172Input = z.infer<typeof TemaAkisKaynakliEsanjorRezonansVeAkiskanElastigiSiniriCalculator172InputSchema>;
