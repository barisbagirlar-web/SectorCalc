import { z } from "zod";

export const NioshBiyomekanikKaldirmaDenklemiVeRiskIndeksiCalculator81InputSchema = z.object({
  loadWeightL: z.number().min(0),
  horizontalDistH: z.number().min(0),
  verticalHeightV: z.number().min(0),
  verticalTravelD: z.number().min(0),
  asymmetryAngleA: z.number().min(0),
  frequencyF: z.number().min(0),
  couplingC: z.number().min(0),
  frequencyMultiplierFm: z.number().min(0),
});

export type NioshBiyomekanikKaldirmaDenklemiVeRiskIndeksiCalculator81Input = z.infer<typeof NioshBiyomekanikKaldirmaDenklemiVeRiskIndeksiCalculator81InputSchema>;
