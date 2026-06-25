import { z } from "zod";

export const EndustriyelSogutmaKuleleriYaklasimApproachVeIsilVerimAnalysisCalculator163InputSchema = z.object({
  waterInletTempC: z.number().min(0),
  waterOutletTempC: z.number().min(0),
  ambientWetBulbC: z.number().min(0),
  waterFlowM3H: z.number().min(0),
});

export type EndustriyelSogutmaKuleleriYaklasimApproachVeIsilVerimAnalysisCalculator163Input = z.infer<typeof EndustriyelSogutmaKuleleriYaklasimApproachVeIsilVerimAnalysisCalculator163InputSchema>;
