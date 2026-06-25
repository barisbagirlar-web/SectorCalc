import { z } from "zod";

export const KesimdolguEarthworkDengeVeNakliyeMaliyetiCalculator68InputSchema = z.object({
  cutVolume: z.number().min(0),
  fillVolume: z.number().min(0),
  swellFactor: z.number().min(0),
  shrinkFactor: z.number().min(0),
  haulRate: z.number().min(0),
  haulDistance: z.number().min(0),
  borrowRate: z.number().min(0),
  disposalRate: z.number().min(0),
});

export type KesimdolguEarthworkDengeVeNakliyeMaliyetiCalculator68Input = z.infer<typeof KesimdolguEarthworkDengeVeNakliyeMaliyetiCalculator68InputSchema>;
