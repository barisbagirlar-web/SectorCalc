/**
 * SectorCalc crawler policy — loads data/seo/ai-crawler-policy.json.
 * Public robots artifacts and verification gates must agree with this registry.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const policyPath = join(dirname(fileURLToPath(import.meta.url)), '../data/seo/ai-crawler-policy.json');
const POLICY = JSON.parse(readFileSync(policyPath, 'utf8'));

export const CRAWLER_POLICY = Object.freeze(POLICY.bots);
export const CRAWLER_PRIVATE_PATHS = Object.freeze(POLICY.privatePaths);
export const CRAWLER_SITEMAPS = Object.freeze(POLICY.sitemaps);

export function discoveryAllowBots() {
  return CRAWLER_POLICY
    .filter((bot) => bot.allowPublic && ['search-retrieval', 'user-retrieval'].includes(bot.policyClass))
    .map((bot) => bot.userAgent);
}

export function requiredPublicBots() {
  return CRAWLER_POLICY.filter((bot) => bot.allowPublic).map((bot) => bot.userAgent);
}

export function blockedPublicBots() {
  return CRAWLER_POLICY.filter((bot) => !bot.allowPublic).map((bot) => bot.userAgent);
}
