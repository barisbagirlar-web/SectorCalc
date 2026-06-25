import { z } from "zod";

export const IsiEsanjoruKirlenmeFoulingVePompaCezaMaliyetiCalculator120InputSchema = z.object({
  uClean: z.number().min(0),
  uDirty: z.number().min(0),
  area: z.number().min(0),
  lmtd: z.number().min(0),
  flowRate: z.number().min(0),
  dpClean: z.number().min(0),
  dpDirty: z.number().min(0),
  cleaningCost: z.number().min(0),
  pumpEff: z.number().min(0),
  boilerEff: z.number().min(0),
  fuelCost: z.number().min(0),
  elecRate: z.number().min(0),
  opHours: z.number().min(0),
});

export type IsiEsanjoruKirlenmeFoulingVePompaCezaMaliyetiCalculator120Input = z.infer<typeof IsiEsanjoruKirlenmeFoulingVePompaCezaMaliyetiCalculator120InputSchema>;
