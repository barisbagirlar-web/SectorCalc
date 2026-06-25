import { z } from "zod";

export const FabrikaYerlesimMesafeVeTikaniklikMaliyetiCalculator36InputSchema = z.object({
  totalFlowVolume: z.number().min(0),
  avgDistanceM: z.number().min(0),
  unitMoveCost: z.number().min(0),
  crossFlowVolume: z.number().min(0),
  aisleCapacity: z.number().min(0),
});

export type FabrikaYerlesimMesafeVeTikaniklikMaliyetiCalculator36Input = z.infer<typeof FabrikaYerlesimMesafeVeTikaniklikMaliyetiCalculator36InputSchema>;
