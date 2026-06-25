import { z } from "zod";

export const IleriMalzemeDegisimHafifletmeMaliyetfaydaAnalysisCalculator99InputSchema = z.object({
  currentPrice: z.number().min(0),
  altPrice: z.number().min(0),
  currentWeight: z.number().min(0),
  altWeight: z.number().min(0),
  processingDelta: z.number().min(0),
  fuelFactor: z.number().min(0),
  lifeDistance: z.number().min(0),
  fuelPrice: z.number().min(0),
  annualVolume: z.number().min(0),
  toolingCapex: z.number().min(0),
  qualificationCost: z.number().min(0),
});

export type IleriMalzemeDegisimHafifletmeMaliyetfaydaAnalysisCalculator99Input = z.infer<typeof IleriMalzemeDegisimHafifletmeMaliyetfaydaAnalysisCalculator99InputSchema>;
