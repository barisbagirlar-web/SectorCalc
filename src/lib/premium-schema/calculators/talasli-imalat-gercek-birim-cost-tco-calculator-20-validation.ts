import { z } from "zod";

export const TalasliImalatGercekBirimCostTcoCalculator20InputSchema = z.object({
  matVolM3: z.number().min(0),
  matDensity: z.number().min(0),
  matPriceKg: z.number().min(0),
  machineRateHr: z.number().min(0),
  cycleTimeMin: z.number().min(0),
  toolCost: z.number().min(0),
  cuttingEdges: z.number().min(0),
  toolLifeMin: z.number().min(0),
  scrapRate: z.number().min(0),
  overheadRate: z.number().min(0),
});

export type TalasliImalatGercekBirimCostTcoCalculator20Input = z.infer<typeof TalasliImalatGercekBirimCostTcoCalculator20InputSchema>;
