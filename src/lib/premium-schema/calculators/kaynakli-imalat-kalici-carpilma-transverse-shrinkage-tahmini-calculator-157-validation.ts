import { z } from "zod";

export const KaynakliImalatKaliciCarpilmaTransverseShrinkageTahminiCalculator157InputSchema = z.object({
  weldLength: z.number().min(0),
  plateThickness: z.number().min(0),
  weldCrossSection: z.number().min(0),
  heatInput: z.number().min(0),
  materialExpCoeff: z.number().min(0),
  weldPasses: z.number().min(0),
});

export type KaynakliImalatKaliciCarpilmaTransverseShrinkageTahminiCalculator157Input = z.infer<typeof KaynakliImalatKaliciCarpilmaTransverseShrinkageTahminiCalculator157InputSchema>;
