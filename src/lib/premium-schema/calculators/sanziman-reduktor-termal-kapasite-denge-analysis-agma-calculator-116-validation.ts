import { z } from "zod";

export const SanzimanReduktorTermalKapasiteDengeAnalysisAgmaCalculator116InputSchema = z.object({
  inputPower: z.number().min(0),
  gearEfficiency: z.number().min(0),
  surfaceArea: z.number().min(0),
  ambientTemp: z.number().min(0),
  maxOilTemp: z.number().min(0),
  heatTransferCoeff: z.number().min(0),
});

export type SanzimanReduktorTermalKapasiteDengeAnalysisAgmaCalculator116Input = z.infer<typeof SanzimanReduktorTermalKapasiteDengeAnalysisAgmaCalculator116InputSchema>;
