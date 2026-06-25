import { z } from "zod";

export const YalinUretimMudaYediIsrafCostHacimAlgoritmasiCalculator102InputSchema = z.object({
  overproductionUnits: z.number().min(0),
  waitingHours: z.number().min(0),
  transportDistanceM: z.number().min(0),
  transportCostM: z.number().min(0),
  overprocessingHours: z.number().min(0),
  excessInventoryValue: z.number().min(0),
  holdingRate: z.number().min(0),
  motionHours: z.number().min(0),
  defectUnits: z.number().min(0),
  reworkCostPerUnit: z.number().min(0),
  unitMargin: z.number().min(0),
  laborRate: z.number().min(0),
  machineRate: z.number().min(0),
});

export type YalinUretimMudaYediIsrafCostHacimAlgoritmasiCalculator102Input = z.infer<typeof YalinUretimMudaYediIsrafCostHacimAlgoritmasiCalculator102InputSchema>;
