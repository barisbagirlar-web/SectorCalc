import { readFileSync } from 'node:fs';

export function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function shingles(value: string, size = 5): Set<string> {
  const words = normalizeText(value).split(' ').filter(Boolean);
  const out = new Set<string>();
  if (words.length < size) {
    if (words.length) out.add(words.join(' '));
    return out;
  }
  for (let i = 0; i <= words.length - size; i += 1) out.add(words.slice(i, i + size).join(' '));
  return out;
}

export function jaccardSimilarity(a: string, b: string, size = 5): number {
  const left = shingles(a, size);
  const right = shingles(b, size);
  if (left.size === 0 && right.size === 0) return 1;
  const union = new Set([...left, ...right]);
  let intersection = 0;
  for (const item of left) if (right.has(item)) intersection += 1;
  return union.size === 0 ? 0 : intersection / union.size;
}

export function assertSimilarityBelow(a: string, b: string, max: number): void {
  const score = jaccardSimilarity(a, b);
  if (score > max) throw new Error(`CONTENT_SIMILARITY_BLOCK score=${score.toFixed(4)} max=${max}`);
}

export function assertSingleQueryOwner(records: Array<{ primaryQuery: string; owner: string }>): void {
  const seen = new Map<string, string>();
  for (const record of records) {
    const query = normalizeText(record.primaryQuery);
    const previous = seen.get(query);
    if (previous && previous !== record.owner) throw new Error(`DUPLICATE_PRIMARY_QUERY_OWNER ${query}`);
    seen.set(query, record.owner);
  }
}

if (process.argv[1]?.endsWith('content-entity-audit.ts')) {
  const config = JSON.parse(readFileSync('sites/sectorcalc/seo.config.json', 'utf8')) as { thresholds: { similarityMax: number } };
  if (!(config.thresholds.similarityMax > 0 && config.thresholds.similarityMax <= 1)) process.exit(4);
  console.log(`[PASS] content/entity audit contract loaded; similarityMax=${config.thresholds.similarityMax}`);
}
