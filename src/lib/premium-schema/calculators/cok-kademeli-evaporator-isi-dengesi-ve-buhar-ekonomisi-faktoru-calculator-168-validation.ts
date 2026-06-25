import { z } from "zod";

export const CokKademeliEvaporatorIsiDengesiVeBuharEkonomisiFaktoruCalculator168InputSchema = z.object({
  stagesCount: z.number().min(0),
  liveSteamInputTon: z.number().min(0),
  totalEvapWaterTon: z.number().min(0),
  latentHeatLiveKj: z.number().min(0),
  steamCostTon: z.number().min(0),
});

export type CokKademeliEvaporatorIsiDengesiVeBuharEkonomisiFaktoruCalculator168Input = z.infer<typeof CokKademeliEvaporatorIsiDengesiVeBuharEkonomisiFaktoruCalculator168InputSchema>;
