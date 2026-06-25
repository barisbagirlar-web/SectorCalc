import { z } from "zod";

export const AiIntelligenceTokenCostVeLatencyCalculator1InputSchema = z.object({
  dailyRequests: z.number().min(0),
  promptTokens: z.number().min(0),
  completionTokens: z.number().min(0),
  cacheHitRatio: z.number().min(0),
  promptPrice1m: z.number().min(0),
  completionPrice1m: z.number().min(0),
  cacheReadPrice1m: z.number().min(0),
  cacheWritePrice1m: z.number().min(0),
  vectorQueryCost: z.number().min(0),
  contextVectors: z.number().min(0),
  vectorDbMonthly: z.number().min(0),
  egressCostGb: z.number().min(0),
  avgTtftSec: z.number().min(0),
  customerHourlyValue: z.number().min(0),
  failRate429: z.number().min(0),
  retryMultiplier: z.number().min(0),
});

export type AiIntelligenceTokenCostVeLatencyCalculator1Input = z.infer<typeof AiIntelligenceTokenCostVeLatencyCalculator1InputSchema>;
