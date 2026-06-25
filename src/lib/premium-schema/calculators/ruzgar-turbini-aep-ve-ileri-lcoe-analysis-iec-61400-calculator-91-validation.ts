import { z } from "zod";

export const RuzgarTurbiniAepVeIleriLcoeAnalysisIec61400Calculator91InputSchema = z.object({
  nominalKw: z.number().min(0),
  capacityFactor: z.number().min(0),
  capex: z.number().min(0),
  opexYr: z.number().min(0),
  degradation: z.number().min(0),
  systemLife: z.number().min(0),
  wacc: z.number().min(0),
  gridRate: z.number().min(0),
});

export type RuzgarTurbiniAepVeIleriLcoeAnalysisIec61400Calculator91Input = z.infer<typeof RuzgarTurbiniAepVeIleriLcoeAnalysisIec61400Calculator91InputSchema>;
