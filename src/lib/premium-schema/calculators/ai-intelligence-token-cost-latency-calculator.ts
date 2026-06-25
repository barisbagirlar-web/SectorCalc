import { AiIntelligenceTokenCostVeLatencyCalculator1InputSchema, type AiIntelligenceTokenCostVeLatencyCalculator1Input } from "./ai-intelligence-token-cost-ve-latency-calculator-1-validation";

export const calculateAiIntelligenceTokenCostVeLatencyCalculator1Contract: any = {
  id: "ai-intelligence-token-cost-ve-latency-calculator-1",
  version: "1.0.0",
  category: "cost",
  inputSchema: AiIntelligenceTokenCostVeLatencyCalculator1InputSchema,
  
  execute: async (input: any) => {
    try {
      const {
        dailyRequests,
        promptTokens,
        completionTokens,
        cacheHitRatio,
        promptPrice1m,
        completionPrice1m,
        cacheReadPrice1m,
        cacheWritePrice1m,
        vectorQueryCost,
        contextVectors,
        vectorDbMonthly,
        egressCostGb,
        avgTtftSec,
        customerHourlyValue,
        failRate429,
        retryMultiplier
      } = input;

      // Formula: NetRequests = daily_requests * (1 + ((fail_rate_429/100) * retry_multiplier))
      const netRequests = dailyRequests * (1 + ((failRate429 / 100) * retryMultiplier));

      // Formula: RAG_Cost_Daily = NetRequests * context_vectors * vector_query_cost
      const rAGCostDaily = netRequests * contextVectors * vectorQueryCost;

      // Formula: PromptCost = (prompt_tokens * prompt_price_1m) / 1e6
      const promptCost = (promptTokens * promptPrice1m) / 1e6;

      // Formula: CompletionCost = (completion_tokens * completion_price_1m) / 1e6
      const completionCost = (completionTokens * completionPrice1m) / 1e6;

      // Formula: CacheHitCost = (prompt_tokens * (cache_hit_ratio/100) * cache_read_price_1m) / 1e6
      const cacheHitCost = (promptTokens * (cacheHitRatio / 100) * cacheReadPrice1m) / 1e6;

      // Formula: CacheMissCost = (prompt_tokens * (1 - (cache_hit_ratio/100)) * cache_write_price_1m) / 1e6
      const cacheMissCost = (promptTokens * (1 - (cacheHitRatio / 100)) * cacheWritePrice1m) / 1e6;

      // Formula: LatencyOpportunityCost = (avg_ttft_sec / 3600) * customer_hourly_value * daily_requests
      const latencyOpportunityCost = (avgTtftSec / 3600) * customerHourlyValue * dailyRequests;

      // Formula: EgressCost_Daily = ((completion_tokens * 4) / 1073741824) * daily_requests * egress_cost_gb
      // 4 bytes per token approximation, 1073741824 bytes per GB
      const egressCostDaily = ((completionTokens * 4) / 1073741824) * dailyRequests * egressCostGb;

      // Formula: DailyTotalOpEx = ((PromptCost + CompletionCost + CacheHitCost + CacheMissCost) * NetRequests) + RAG_Cost_Daily + EgressCost_Daily
      const dailyTotalOpEx = ((promptCost + completionCost + cacheHitCost + cacheMissCost) * netRequests) + rAGCostDaily + egressCostDaily;

      // Formula: MonthlyTCO = (DailyTotalOpEx * 30) + vector_db_monthly + LatencyOpportunityCost
      const monthlyTCO = (dailyTotalOpEx * 30) + vectorDbMonthly + latencyOpportunityCost;

      return {
        netRequests,
        rAGCostDaily,
        promptCost,
        completionCost,
        cacheHitCost,
        cacheMissCost,
        latencyOpportunityCost,
        egressCostDaily,
        dailyTotalOpEx,
        monthlyTCO
      };
    } catch (error) {
      throw new Error("Failed to calculate: " + String(error));
    }
  },
};