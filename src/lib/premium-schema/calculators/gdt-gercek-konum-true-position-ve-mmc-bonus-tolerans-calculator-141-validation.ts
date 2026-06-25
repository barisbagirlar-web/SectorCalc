import { z } from "zod";

export const GdtGercekKonumTruePositionVeMmcBonusToleransCalculator141InputSchema = z.object({
  nomX: z.number().min(0),
  nomY: z.number().min(0),
  measX: z.number().min(0),
  measY: z.number().min(0),
  featureMmc: z.number().min(0),
  measDiameter: z.number().min(0),
  posTolerance: z.number().min(0),
});

export type GdtGercekKonumTruePositionVeMmcBonusToleransCalculator141Input = z.infer<typeof GdtGercekKonumTruePositionVeMmcBonusToleransCalculator141InputSchema>;
