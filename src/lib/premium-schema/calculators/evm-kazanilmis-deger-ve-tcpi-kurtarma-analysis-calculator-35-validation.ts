import { z } from "zod";

export const EvmKazanilmisDegerVeTcpiKurtarmaAnalysisCalculator35InputSchema = z.object({
  bac: z.number().min(0),
  pv: z.number().min(0),
  ev: z.number().min(0),
  ac: z.number().min(0),
  managementReserve: z.number().min(0),
});

export type EvmKazanilmisDegerVeTcpiKurtarmaAnalysisCalculator35Input = z.infer<typeof EvmKazanilmisDegerVeTcpiKurtarmaAnalysisCalculator35InputSchema>;
