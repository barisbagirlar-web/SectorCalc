import { z } from "zod";

export const BasincliHavaSizintiMaliyetiSonikAkisEntegrasyonuCalculator10InputSchema = z.object({
  fad: z.number().min(0),
  opHrs: z.number().min(0),
  leakD: z.number().min(0),
  pSys: z.number().min(0),
  nPoly: z.number().min(0),
  tIn: z.number().min(0),
  elecRate: z.number().min(0),
  mechEff: z.number().min(0),
});

export type BasincliHavaSizintiMaliyetiSonikAkisEntegrasyonuCalculator10Input = z.infer<typeof BasincliHavaSizintiMaliyetiSonikAkisEntegrasyonuCalculator10InputSchema>;
