import { z } from "zod";

export const KaynakMukavemetiVeBirlesikGerilmeAwsD11Calculator67InputSchema = z.object({
  legSize: z.number().min(0),
  weldLength: z.number().min(0),
  loadShear: z.number().min(0),
  momentBend: z.number().min(0),
  baseMetalYield: z.number().min(0),
  electrodeTensile: z.number().min(0),
  safetyFactor: z.number().min(0),
});

export type KaynakMukavemetiVeBirlesikGerilmeAwsD11Calculator67Input = z.infer<typeof KaynakMukavemetiVeBirlesikGerilmeAwsD11Calculator67InputSchema>;
