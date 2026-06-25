import { z } from "zod";

export const MakineEkonomikOmruVeSermayeYikimiEuacAnalysisCalculator98InputSchema = z.object({
  currentEuac: z.number().min(0),
  challengerEuac: z.number().min(0),
  marginalCost: z.number().min(0),
  salvage: z.number().min(0),
});

export type MakineEkonomikOmruVeSermayeYikimiEuacAnalysisCalculator98Input = z.infer<typeof MakineEkonomikOmruVeSermayeYikimiEuacAnalysisCalculator98InputSchema>;
