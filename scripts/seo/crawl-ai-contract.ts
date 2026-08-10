export type CrawlerPolicyRecord = {
  userAgent: string;
  allowPublic: boolean;
  policyClass: string;
};

export type VerifiedBotEvidence = {
  userAgent?: string;
  verified?: boolean;
  verificationMethod?: 'published-ip-range' | 'reverse-dns' | 'provider-verified-edge';
};

export function expectedBotPolicy(records: CrawlerPolicyRecord[], bot: string): 'allow' | 'block' | 'unknown' {
  const record = records.find((item) => item.userAgent.toLowerCase() === bot.toLowerCase());
  if (!record) return 'unknown';
  return record.allowPublic ? 'allow' : 'block';
}

export function assertDiscoveryParity(llm: string, llms: string): void {
  if (llm !== llms) throw new Error('LLM_DISCOVERY_DRIFT');
  if (!llm.includes('https://sectorcalc.com/sitemap.xml')) throw new Error('LLM_DISCOVERY_MISSING_SITEMAP');
  if (/https:\/\/sectorcalc\.com\/[a-z0-9-]+-pro\.html/i.test(llm)) throw new Error('LLM_DISCOVERY_LEGACY_PRIMARY_URL');
}

export function assertVerifiedBotEvidence(evidence: VerifiedBotEvidence): void {
  if (!evidence?.userAgent?.trim()) throw new Error('VERIFIED_BOT_EVIDENCE_MISSING_USER_AGENT');
  if (evidence.verified !== true) throw new Error('VERIFIED_BOT_EVIDENCE_NOT_VERIFIED');
  if (!evidence.verificationMethod) throw new Error('VERIFIED_BOT_EVIDENCE_MISSING_METHOD');
}

export function changedUrlsForIndexNow(before: string[], after: string[]): string[] {
  const oldSet = new Set(before);
  return [...new Set(after)].filter((url) => !oldSet.has(url)).sort();
}
