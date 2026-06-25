import { z } from "zod";

export const HeliselBaskiYayiYorulmaGoodmanVeRezonansAnalysisCalculator129InputSchema = z.object({
  wireDiaD: z.number().min(0),
  coilDiaD: z.number().min(0),
  activeCoilsN: z.number().min(0),
  fMax: z.number().min(0),
  fMin: z.number().min(0),
  shearModulusG: z.number().min(0),
  density: z.number().min(0),
  utsShear: z.number().min(0),
  fatigueLimit: z.number().min(0),
  safetyFactor: z.number().min(0),
  opFreqHz: z.number().min(0),
});

export type HeliselBaskiYayiYorulmaGoodmanVeRezonansAnalysisCalculator129Input = z.infer<typeof HeliselBaskiYayiYorulmaGoodmanVeRezonansAnalysisCalculator129InputSchema>;
