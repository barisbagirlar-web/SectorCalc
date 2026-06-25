import { z } from "zod";

export const IstatistikselProsesKontrolSpcSinyalLatencyMaliyetiCalculator93InputSchema = z.object({
  alpha: z.number().min(0),
  beta: z.number().min(0),
  samplingInt: z.number().min(0),
  prodRate: z.number().min(0),
  defectRateOoc: z.number().min(0),
  defectCost: z.number().min(0),
});

export type IstatistikselProsesKontrolSpcSinyalLatencyMaliyetiCalculator93Input = z.infer<typeof IstatistikselProsesKontrolSpcSinyalLatencyMaliyetiCalculator93InputSchema>;
