import { z } from "zod";

export const IstatistikselProsesKontrolSpcXbarrSinirlariCalculator61InputSchema = z.object({
  meanOfMeans: z.number().min(0),
  meanOfRanges: z.number().min(0),
  subgroupSize: z.number().min(0),
  a2Factor: z.number().min(0),
  d3Factor: z.number().min(0),
  d4Factor: z.number().min(0),
  d2Factor: z.number().min(0),
  usl: z.number().min(0),
  lsl: z.number().min(0),
});

export type IstatistikselProsesKontrolSpcXbarrSinirlariCalculator61Input = z.infer<typeof IstatistikselProsesKontrolSpcXbarrSinirlariCalculator61InputSchema>;
