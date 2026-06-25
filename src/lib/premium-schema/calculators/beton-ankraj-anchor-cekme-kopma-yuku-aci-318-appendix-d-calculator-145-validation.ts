import { z } from "zod";

export const BetonAnkrajAnchorCekmeKopmaYukuAci318AppendixDCalculator145InputSchema = z.object({
  concreteFc: z.number().min(0),
  embedDepthHef: z.number().min(0),
  anchorDiaD: z.number().min(0),
  steelUts: z.number().min(0),
  edgeDistance: z.number().min(0),
  concreteCondition: z.number().min(0),
});

export type BetonAnkrajAnchorCekmeKopmaYukuAci318AppendixDCalculator145Input = z.infer<typeof BetonAnkrajAnchorCekmeKopmaYukuAci318AppendixDCalculator145InputSchema>;
