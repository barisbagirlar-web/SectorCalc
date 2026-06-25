import { z } from "zod";

export const CelikYapilardaEksantrikYukluCivataGruplariAnlikDonmeMerkeziIcrCalculator164InputSchema = z.object({
  boltCount: z.number().min(0),
  eccentricityMm: z.number().min(0),
  boltShearCapacityKn: z.number().min(0),
  appliedLoadKn: z.number().min(0),
  rSquaredSumMm2: z.number().min(0),
  maxDistanceRMm: z.number().min(0),
});

export type CelikYapilardaEksantrikYukluCivataGruplariAnlikDonmeMerkeziIcrCalculator164Input = z.infer<typeof CelikYapilardaEksantrikYukluCivataGruplariAnlikDonmeMerkeziIcrCalculator164InputSchema>;
