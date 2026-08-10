import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)));

type Recommendation = 'INVEST' | 'HOLD' | 'HARVEST' | 'DIVEST' | null;
type Cluster = {
  clusterId: string;
  primaryQuery: string;
  ownerRoute: string | null;
  sourceCtrModel: string | null;
  similarityToExisting: number | null;
  portfolioRecommendation: Recommendation;
  decisionEligible: boolean;
  approvalRef?: string | null;
  decisionAt?: string | null;
};
type Artifact = {
  partial: boolean;
  activeActions: number;
  issueStateSeparation: boolean;
  openFormulaRecord: boolean;
  clusters: Cluster[];
};
type Config = {
  site: { maxConcurrentKacActions: number };
  thresholds: { similarityMax: number; divestPendingMaxDays: number };
};

function daysBetween(a: string, b: string): number {
  return Math.floor((Date.parse(b) - Date.parse(a)) / 86400000);
}

export function validateKac(artifact: Artifact, config: Config, ledger: string, now = new Date().toISOString()): { errors: string[]; warnings: string[]; infos: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const infos: string[] = [];
  const owners = new Map<string, string | null>();

  if (artifact.activeActions > config.site.maxConcurrentKacActions) {
    errors.push(`KAC_CONCURRENCY_EXCEEDED:${artifact.activeActions}>${config.site.maxConcurrentKacActions}`);
  }
  if (!artifact.issueStateSeparation) warnings.push('INV-11.7 open/resolved states are not separated');
  if (!artifact.openFormulaRecord) infos.push('INV-11.8 open formula record missing');

  for (const cluster of artifact.clusters) {
    const query = cluster.primaryQuery.trim().toLocaleLowerCase('en-US');
    const priorOwner = owners.get(query);
    if (owners.has(query) && priorOwner !== cluster.ownerRoute) errors.push(`INV-11.1 multiple owners for query: ${cluster.primaryQuery}`);
    else owners.set(query, cluster.ownerRoute);

    if ((cluster.sourceCtrModel ?? '').toLocaleLowerCase('en-US').includes('industry')) {
      errors.push(`INV-11.2 industry CTR model prohibited: ${cluster.clusterId}`);
    }
    if (typeof cluster.similarityToExisting === 'number' && cluster.similarityToExisting > config.thresholds.similarityMax) {
      errors.push(`INV-11.3 similarity gate: ${cluster.clusterId}`);
    }
    if (cluster.portfolioRecommendation !== null) {
      if (!cluster.approvalRef || !ledger.includes(cluster.approvalRef)) errors.push(`INV-11.4 decision approval missing: ${cluster.clusterId}`);
      if ((artifact.partial || !cluster.decisionEligible) && cluster.portfolioRecommendation === 'INVEST') {
        errors.push(`INV-11.6 partial evidence cannot INVEST: ${cluster.clusterId}`);
      }
    }
    if (cluster.portfolioRecommendation === 'DIVEST' && cluster.decisionAt) {
      const ageDays = daysBetween(cluster.decisionAt, now);
      if (ageDays < config.thresholds.divestPendingMaxDays) warnings.push(`INV-11.5 DIVEST waiting period active: ${cluster.clusterId}`);
    }
  }
  return { errors, warnings, infos };
}

function main(): void {
  const siteArg = process.argv.indexOf('--site');
  const site = siteArg >= 0 ? process.argv[siteArg + 1] : process.env.SITE_ID;
  if (site !== 'sectorcalc') process.exit(4);
  const config = JSON.parse(readFileSync(resolve(ROOT, 'sites/sectorcalc/seo.config.json'), 'utf8')) as Config;
  const safe: Artifact = { partial: true, activeActions: 0, issueStateSeparation: true, openFormulaRecord: true, clusters: [] };
  const result = validateKac(safe, config, '');
  if (result.errors.length) {
    console.error(result.errors.join('\n'));
    process.exit(1);
  }
  console.log(`SEO_PHASE_11_CODE_READY maxConcurrent=${config.site.maxConcurrentKacActions} similarityMax=${config.thresholds.similarityMax}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
