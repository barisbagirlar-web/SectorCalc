import { z } from "zod";

export const PariserdoganYasasiIleYorulmaCatlagiIlerlemesiVeOmurAnalysisCalculator184InputSchema = z.object({
  initialCrackA0: z.number().min(0),
  criticalCrackAc: z.number().min(0),
  deltaSigmaMpa: z.number().min(0),
  geometryFactorY: z.number().min(0),
  parisConstantM: z.number().min(0),
  parisExponentM: z.number().min(0),
  fractureToughnessK1c: z.number().min(0),
});

export type PariserdoganYasasiIleYorulmaCatlagiIlerlemesiVeOmurAnalysisCalculator184Input = z.infer<typeof PariserdoganYasasiIleYorulmaCatlagiIlerlemesiVeOmurAnalysisCalculator184InputSchema>;
