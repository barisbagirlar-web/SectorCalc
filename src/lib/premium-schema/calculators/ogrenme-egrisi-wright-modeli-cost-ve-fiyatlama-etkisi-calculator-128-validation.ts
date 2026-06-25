import { z } from "zod";

export const OgrenmeEgrisiWrightModeliCostVeFiyatlamaEtkisiCalculator128InputSchema = z.object({
  timeUnit1: z.number().min(0),
  learningRatePct: z.number().min(0),
  targetUnitN: z.number().min(0),
  totalBatchSize: z.number().min(0),
  laborRateHr: z.number().min(0),
});

export type OgrenmeEgrisiWrightModeliCostVeFiyatlamaEtkisiCalculator128Input = z.infer<typeof OgrenmeEgrisiWrightModeliCostVeFiyatlamaEtkisiCalculator128InputSchema>;
