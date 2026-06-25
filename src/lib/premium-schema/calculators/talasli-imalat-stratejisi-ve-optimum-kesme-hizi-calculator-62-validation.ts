import { z } from "zod";

export const TalasliImalatStratejisiVeOptimumKesmeHiziCalculator62InputSchema = z.object({
  currentVc: z.number().min(0),
  taylorC: z.number().min(0),
  taylorN: z.number().min(0),
  toolChangeTime: z.number().min(0),
  insertCost: z.number().min(0),
  edges: z.number().min(0),
  machineRate: z.number().min(0),
});

export type TalasliImalatStratejisiVeOptimumKesmeHiziCalculator62Input = z.infer<typeof TalasliImalatStratejisiVeOptimumKesmeHiziCalculator62InputSchema>;
