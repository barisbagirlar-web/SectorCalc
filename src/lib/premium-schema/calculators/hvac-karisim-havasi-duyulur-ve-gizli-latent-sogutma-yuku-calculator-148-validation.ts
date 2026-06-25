import { z } from "zod";

export const HvacKarisimHavasiDuyulurVeGizliLatentSogutmaYukuCalculator148InputSchema = z.object({
  outdoorFlowCfm: z.number().min(0),
  outdoorTDb: z.number().min(0),
  outdoorW: z.number().min(0),
  returnFlowCfm: z.number().min(0),
  returnTDb: z.number().min(0),
  returnW: z.number().min(0),
  supplyTDb: z.number().min(0),
  supplyW: z.number().min(0),
});

export type HvacKarisimHavasiDuyulurVeGizliLatentSogutmaYukuCalculator148Input = z.infer<typeof HvacKarisimHavasiDuyulurVeGizliLatentSogutmaYukuCalculator148InputSchema>;
