export type AiPolicy = {
  aiTraining: 'allow' | 'block';
  aiSearch: 'allow' | 'block';
  custom?: Record<string, 'allow' | 'block'>;
};

export const SEARCH_BOTS = ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot'] as const;
export const TRAINING_BOTS = ['GPTBot', 'ClaudeBot', 'CCBot'] as const;

export function expectedBotPolicy(policy: AiPolicy, bot: string): 'allow' | 'block' {
  const custom = policy.custom?.[bot];
  if (custom) return custom;
  if (SEARCH_BOTS.includes(bot as (typeof SEARCH_BOTS)[number])) return policy.aiSearch;
  if (TRAINING_BOTS.includes(bot as (typeof TRAINING_BOTS)[number])) return policy.aiTraining;
  return 'allow';
}

export function assertDiscoveryParity(llm: string, llms: string): void {
  if (llm !== llms) throw new Error('LLM_DISCOVERY_DRIFT');
  if (!llm.includes('https://sectorcalc.com/sitemap.xml')) throw new Error('LLM_DISCOVERY_MISSING_SITEMAP');
  if (/https:\/\/sectorcalc\.com\/[a-z0-9-]+-pro\.html/i.test(llm)) throw new Error('LLM_DISCOVERY_LEGACY_PRIMARY_URL');
}

export function assertVerifiedBotEvidence(userAgent: string | undefined): void {
  if (!userAgent || !userAgent.trim()) throw new Error('VERIFIED_BOT_EVIDENCE_MISSING');
}

export function changedUrlsForIndexNow(before: string[], after: string[]): string[] {
  const oldSet = new Set(before);
  return [...new Set(after)].filter((url) => !oldSet.has(url)).sort();
}
