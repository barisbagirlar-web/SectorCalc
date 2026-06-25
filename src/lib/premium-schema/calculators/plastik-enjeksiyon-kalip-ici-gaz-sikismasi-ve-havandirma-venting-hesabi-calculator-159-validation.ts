import { z } from "zod";

export const PlastikEnjeksiyonKalipIciGazSikismasiVeHavandirmaVentingHesabiCalculator159InputSchema = z.object({
  cavityVolumeCm3: z.number().min(0),
  injectionTimeSec: z.number().min(0),
  meltTempK: z.number().min(0),
  ventDepthUm: z.number().min(0),
  ventWidthMm: z.number().min(0),
  polymerType: z.number().min(0),
});

export type PlastikEnjeksiyonKalipIciGazSikismasiVeHavandirmaVentingHesabiCalculator159Input = z.infer<typeof PlastikEnjeksiyonKalipIciGazSikismasiVeHavandirmaVentingHesabiCalculator159InputSchema>;
