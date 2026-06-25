import { z } from "zod";

export const YalinUretimHucreselDuzenOnepieceFlowVeOperatorVerimiCalculator186InputSchema = z.object({
  manualTimeSec: z.number().min(0),
  walkingTimeSec: z.number().min(0),
  taktTimeSec: z.number().min(0),
  operatorsCount: z.number().min(0),
});

export type YalinUretimHucreselDuzenOnepieceFlowVeOperatorVerimiCalculator186Input = z.infer<typeof YalinUretimHucreselDuzenOnepieceFlowVeOperatorVerimiCalculator186InputSchema>;
