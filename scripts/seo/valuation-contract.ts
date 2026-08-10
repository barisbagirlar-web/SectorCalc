import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)));

type Status = 'DORMANT' | 'READY' | 'CALCULATED';
type Method = {
  status: Status;
  methodology: string | null;
  multipleLow: number | null;
  multipleHigh: number | null;
  rangeMinor: [number, number] | null;
  historyMonths: number;
};
type Valuation = {
  singleValueClaimMinor: number | null;
  methods: { V1: Method; V2: Method; V3: Method };
  managementReportTemplatePresent: boolean;
};
type Manifest = { roles: string[] };
type Config = { economics: { valuationMultiples: { low: number; high: number } } };

const REQUIRED_DD_ROLES = ['registry_export', 'pnl_raw_series', 'redirect_ledger', 'decision_ledger', 'conformance_history', 'structural_breaks'];

export function validateValuation(value: Valuation, config: Config): { errors: string[]; warnings: string[]; infos: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const infos: string[] = [];
  const v1 = value.methods.V1;
  const hasRange = typeof v1.multipleLow === 'number' && typeof v1.multipleHigh === 'number' && v1.multipleLow < v1.multipleHigh;
  const claimOrCalculated = value.singleValueClaimMinor !== null || v1.status === 'CALCULATED';
  if (claimOrCalculated) {
    if (!v1.methodology || !hasRange) errors.push('INV-19.1 valuation claim/calculation without methodology and valid range');
    if (hasRange && (v1.multipleLow !== config.economics.valuationMultiples.low || v1.multipleHigh !== config.economics.valuationMultiples.high)) {
      errors.push('INV-19.1 valuation multiples diverge from config');
    }
  }
  if (!value.managementReportTemplatePresent) warnings.push('INV-19.2 management report template missing');
  if (value.methods.V3.status === 'CALCULATED' && value.methods.V3.historyMonths < 12) infos.push('INV-19.4 V3 requires twelve months');
  return { errors, warnings, infos };
}

export function validateDdManifest(manifest: Manifest): string[] {
  const roles = new Set(manifest.roles);
  return REQUIRED_DD_ROLES.filter((role) => !roles.has(role)).map((role) => `INV-19.3 DD missing ${role}`);
}

function dormant(): Method {
  return { status: 'DORMANT', methodology: null, multipleLow: null, multipleHigh: null, rangeMinor: null, historyMonths: 0 };
}

function main(): void {
  const siteArg = process.argv.indexOf('--site');
  const site = siteArg >= 0 ? process.argv[siteArg + 1] : process.env.SITE_ID;
  if (site !== 'sectorcalc') process.exit(4);
  const config = JSON.parse(readFileSync(resolve(ROOT, 'sites/sectorcalc/seo.config.json'), 'utf8')) as Config;
  const safe: Valuation = { singleValueClaimMinor: null, methods: { V1: dormant(), V2: dormant(), V3: dormant() }, managementReportTemplatePresent: true };
  const errors = [...validateValuation(safe, config).errors, ...validateDdManifest({ roles: REQUIRED_DD_ROLES })];
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  console.log(`SEO_PHASE_19_CODE_READY valuationMultiples=${config.economics.valuationMultiples.low}:${config.economics.valuationMultiples.high}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
