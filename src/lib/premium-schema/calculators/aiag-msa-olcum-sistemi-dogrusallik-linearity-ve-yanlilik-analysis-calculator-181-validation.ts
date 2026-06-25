import { z } from "zod";

export const AiagMsaOlcumSistemiDogrusallikLinearityVeYanlilikAnalysisCalculator181InputSchema = z.object({
  referenceValues: z.number().min(0),
  observedMeans: z.number().min(0),
  stdDevRepeatability: z.number().min(0),
  toleranceBand: z.number().min(0),
});

export type AiagMsaOlcumSistemiDogrusallikLinearityVeYanlilikAnalysisCalculator181Input = z.infer<typeof AiagMsaOlcumSistemiDogrusallikLinearityVeYanlilikAnalysisCalculator181InputSchema>;
