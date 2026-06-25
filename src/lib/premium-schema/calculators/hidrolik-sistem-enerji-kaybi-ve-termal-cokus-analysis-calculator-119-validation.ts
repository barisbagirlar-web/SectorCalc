import { z } from "zod";

export const HidrolikSistemEnerjiKaybiVeTermalCokusAnalysisCalculator119InputSchema = z.object({
  supplyPressure: z.number().min(0),
  tankPressure: z.number().min(0),
  pumpFlow: z.number().min(0),
  leakFlow: z.number().min(0),
  pipeDp: z.number().min(0),
  valveDp: z.number().min(0),
  coolingCop: z.number().min(0),
  fluidVolume: z.number().min(0),
  fluidPrice: z.number().min(0),
  opHours: z.number().min(0),
  elecRate: z.number().min(0),
});

export type HidrolikSistemEnerjiKaybiVeTermalCokusAnalysisCalculator119Input = z.infer<typeof HidrolikSistemEnerjiKaybiVeTermalCokusAnalysisCalculator119InputSchema>;
