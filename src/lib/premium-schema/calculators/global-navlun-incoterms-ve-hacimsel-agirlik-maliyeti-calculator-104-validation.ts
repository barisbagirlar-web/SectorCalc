import { z } from "zod";

export const GlobalNavlunIncotermsVeHacimselAgirlikMaliyetiCalculator104InputSchema = z.object({
  grossWeightKg: z.number().min(0),
  lengthCm: z.number().min(0),
  widthCm: z.number().min(0),
  heightCm: z.number().min(0),
  transportMode: z.number().min(0),
  bafPct: z.number().min(0),
  thcFee: z.number().min(0),
  customsValue: z.number().min(0),
  dutyPct: z.number().min(0),
  insurancePct: z.number().min(0),
});

export type GlobalNavlunIncotermsVeHacimselAgirlikMaliyetiCalculator104Input = z.infer<typeof GlobalNavlunIncotermsVeHacimselAgirlikMaliyetiCalculator104InputSchema>;
