import { z } from "zod";

export const TekstilkimyaBoyaReceteVeRftIlkSeferdeDogruMaliyetiCalculator30InputSchema = z.object({
  fabricWeightKg: z.number().min(0),
  liquorRatio: z.number().min(0),
  dyeChemCostKg: z.number().min(0),
  waterTariffM3: z.number().min(0),
  energyCostBatch: z.number().min(0),
  rftPct: z.number().min(0),
  reworkPenaltyMultiplier: z.number().min(0),
});

export type TekstilkimyaBoyaReceteVeRftIlkSeferdeDogruMaliyetiCalculator30Input = z.infer<typeof TekstilkimyaBoyaReceteVeRftIlkSeferdeDogruMaliyetiCalculator30InputSchema>;
