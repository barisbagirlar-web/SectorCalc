import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)));

type ThresholdKey = 'lcpP75Ms' | 'inpP75Ms' | 'clsP75';
type Row = { id: string; measured: number | null; thresholdRef: `thresholds.${ThresholdKey}` | null; status: 'PASS' | 'FAIL' | 'SKIP_NO_DATA'; issueOpened: boolean; consecutiveViolations: number; freezeEscalated: boolean; evidenceRef?: string | null };
type Asset = { id: string; suspended: boolean; indexable: boolean };
type Artifact = { rows: Row[]; assets: Asset[] };
type Config = { thresholds: Record<ThresholdKey, number> };

export function thresholdValue(config: Config, ref: Row['thresholdRef']): number | null {
  if (!ref) return null;
  const key = ref.replace('thresholds.', '') as ThresholdKey;
  const value = config.thresholds[key];
  return typeof value === 'number' ? value : null;
}

export function validateSlo(artifact: Artifact, config: Config): { errors: string[]; warnings: string[]; infos: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const infos: string[] = [];
  for (const row of artifact.rows) {
    const threshold = thresholdValue(config, row.thresholdRef);
    if (row.measured !== null && threshold === null) errors.push(`INV-12.2 missing config threshold: ${row.id}`);
    if (row.measured !== null && threshold !== null) {
      const shouldFail = row.measured > threshold;
      if (shouldFail && row.status !== 'FAIL') errors.push(`INV-12.1 silent SLO failure: ${row.id}`);
      if (row.status === 'FAIL' && !row.issueOpened) errors.push(`INV-12.1 failure without issue: ${row.id}`);
      if (!row.evidenceRef) infos.push(`INV-12.4 measured SLO has no evidence reference: ${row.id}`);
    }
    if (row.consecutiveViolations >= 2 && !row.freezeEscalated) warnings.push(`INV-12.3 freeze escalation pending: ${row.id}`);
  }
  for (const asset of artifact.assets) {
    if (asset.suspended && asset.indexable) errors.push(`INV-12.5 suspended asset remains indexable: ${asset.id}`);
  }
  return { errors, warnings, infos };
}

function main(): void {
  const siteArg = process.argv.indexOf('--site');
  const site = siteArg >= 0 ? process.argv[siteArg + 1] : process.env.SITE_ID;
  if (site !== 'sectorcalc') process.exit(4);
  const config = JSON.parse(readFileSync(resolve(ROOT, 'sites/sectorcalc/seo.config.json'), 'utf8')) as Config;
  const safe: Artifact = { rows: [], assets: [] };
  const result = validateSlo(safe, config);
  if (result.errors.length) {
    console.error(result.errors.join('\n'));
    process.exit(1);
  }
  console.log(`SEO_PHASE_12_CODE_READY lcp=${config.thresholds.lcpP75Ms} inp=${config.thresholds.inpP75Ms} cls=${config.thresholds.clsP75}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
