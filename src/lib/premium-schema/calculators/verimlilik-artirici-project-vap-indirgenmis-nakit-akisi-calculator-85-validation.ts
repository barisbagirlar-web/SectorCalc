import { z } from "zod";

export const VerimlilikArtiriciProjectVapIndirgenmisNakitAkisiCalculator85InputSchema = z.object({
  currentEnergyKwh: z.number().min(0),
  targetReductionPct: z.number().min(0),
  elecTariff: z.number().min(0),
  vapCapex: z.number().min(0),
  vapOpexYr: z.number().min(0),
  projectLifeYr: z.number().min(0),
  discountRate: z.number().min(0),
});

export type VerimlilikArtiriciProjectVapIndirgenmisNakitAkisiCalculator85Input = z.infer<typeof VerimlilikArtiriciProjectVapIndirgenmisNakitAkisiCalculator85InputSchema>;
