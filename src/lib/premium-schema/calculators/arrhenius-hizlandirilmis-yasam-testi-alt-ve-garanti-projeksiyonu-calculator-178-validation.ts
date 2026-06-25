import { z } from "zod";

export const ArrheniusHizlandirilmisYasamTestiAltVeGarantiProjeksiyonuCalculator178InputSchema = z.object({
  useTempC: z.number().min(0),
  stressTempC: z.number().min(0),
  activationEnergyEv: z.number().min(0),
  testHoursToFailure: z.number().min(0),
  targetWarrantyYrs: z.number().min(0),
});

export type ArrheniusHizlandirilmisYasamTestiAltVeGarantiProjeksiyonuCalculator178Input = z.infer<typeof ArrheniusHizlandirilmisYasamTestiAltVeGarantiProjeksiyonuCalculator178InputSchema>;
