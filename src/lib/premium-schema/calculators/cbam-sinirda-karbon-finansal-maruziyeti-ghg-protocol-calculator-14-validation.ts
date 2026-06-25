import { z } from "zod";

export const CbamSinirdaKarbonFinansalMaruziyetiGhgProtocolCalculator14InputSchema = z.object({
  fuelQty: z.number().min(0),
  fuelEf: z.number().min(0),
  processEmissions: z.number().min(0),
  elecKwh: z.number().min(0),
  gridEf: z.number().min(0),
  prodVolume: z.number().min(0),
  euExportVol: z.number().min(0),
  sectorBenchmark: z.number().min(0),
  euEtsPrice: z.number().min(0),
  localCarbonTax: z.number().min(0),
});

export type CbamSinirdaKarbonFinansalMaruziyetiGhgProtocolCalculator14Input = z.infer<typeof CbamSinirdaKarbonFinansalMaruziyetiGhgProtocolCalculator14InputSchema>;
