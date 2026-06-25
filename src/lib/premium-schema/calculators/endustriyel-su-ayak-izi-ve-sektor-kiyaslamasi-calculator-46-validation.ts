import { z } from "zod";

export const EndustriyelSuAyakIziVeSektorKiyaslamasiCalculator46InputSchema = z.object({
  blueWater: z.number().min(0),
  greenWater: z.number().min(0),
  greyWater: z.number().min(0),
  prodVolume: z.number().min(0),
  sectorBenchmark: z.number().min(0),
});

export type EndustriyelSuAyakIziVeSektorKiyaslamasiCalculator46Input = z.infer<typeof EndustriyelSuAyakIziVeSektorKiyaslamasiCalculator46InputSchema>;
