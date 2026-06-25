import { z } from "zod";

export const DisliCarklardaTemasYorulmasiPittingVeHertzianGerilmesiCalculator162InputSchema = z.object({
  tangentialLoadN: z.number().min(0),
  pinionDiaMm: z.number().min(0),
  faceWidthMm: z.number().min(0),
  elasticCoefficientZe: z.number().min(0),
  geometryFactorI: z.number().min(0),
  overloadFactorKo: z.number().min(0),
  dynamicFactorKv: z.number().min(0),
  allowableContactStress: z.number().min(0),
});

export type DisliCarklardaTemasYorulmasiPittingVeHertzianGerilmesiCalculator162Input = z.infer<typeof DisliCarklardaTemasYorulmasiPittingVeHertzianGerilmesiCalculator162InputSchema>;
