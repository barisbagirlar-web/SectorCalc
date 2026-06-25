import { z } from "zod";

export const PadMediaPsikrometrikVeBasincDusumuAnalysisCalculator44InputSchema = z.object({
  padThickness: z.number().min(0),
  airVelocity: z.number().min(0),
  padArea: z.number().min(0),
  tDb: z.number().min(0),
  rhIn: z.number().min(0),
  pAtm: z.number().min(0),
});

export type PadMediaPsikrometrikVeBasincDusumuAnalysisCalculator44Input = z.infer<typeof PadMediaPsikrometrikVeBasincDusumuAnalysisCalculator44InputSchema>;
