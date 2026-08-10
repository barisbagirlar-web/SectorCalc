import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)));

type Experiment = {
  id: string;
  active: boolean;
  intent: number[];
  primaryMetric: string | null;
  guardrails: string[];
  samplePlan: string | null;
  mde: string | null;
  decisionRule: string | null;
  minFullWeeks: number | null;
  observedFullWeeks: number;
  peeked: boolean;
  variantIndexable: boolean;
  variantCanonicalToControl: boolean;
  consentFresh: boolean;
};
type Artifact = { experiments: Experiment[] };
type Config = { thresholds: { intentScoreMin: number } };

function avg(values: number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function validateCro(artifact: Artifact, config: Config): { errors: string[]; warnings: string[]; infos: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const infos: string[] = [];
  for (const exp of artifact.experiments) {
    if (avg(exp.intent) < config.thresholds.intentScoreMin) errors.push(`INV-14.1 low intent: ${exp.id}`);
    if (exp.active && (!exp.primaryMetric || !exp.guardrails.length || !exp.samplePlan || !exp.mde || !exp.decisionRule || exp.minFullWeeks === null || exp.minFullWeeks < 1)) {
      errors.push(`INV-14.2 preregistration incomplete: ${exp.id}`);
    }
    if (exp.peeked) errors.push(`INV-14.3 peeking prohibited: ${exp.id}`);
    if (exp.variantIndexable || !exp.variantCanonicalToControl) errors.push(`INV-14.4 experiment variant index/canonical violation: ${exp.id}`);
    if (!exp.consentFresh) warnings.push(`INV-14.5 consent freshness warning: ${exp.id}`);
    if (exp.minFullWeeks !== null && exp.observedFullWeeks < exp.minFullWeeks) infos.push(`INV-14.6 minimum duration not yet reached: ${exp.id}`);
  }
  return { errors, warnings, infos };
}

function main(): void {
  const siteArg = process.argv.indexOf('--site');
  const site = siteArg >= 0 ? process.argv[siteArg + 1] : process.env.SITE_ID;
  if (site !== 'sectorcalc') process.exit(4);
  const config = JSON.parse(readFileSync(resolve(ROOT, 'sites/sectorcalc/seo.config.json'), 'utf8')) as Config;
  const result = validateCro({ experiments: [] }, config);
  if (result.errors.length) {
    console.error(result.errors.join('\n'));
    process.exit(1);
  }
  console.log(`SEO_PHASE_14_CODE_READY intentScoreMin=${config.thresholds.intentScoreMin}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
