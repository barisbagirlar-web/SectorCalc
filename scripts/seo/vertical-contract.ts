import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)));

type Finding = { kind: string; value?: number };
type Config = { business: { verticals: string[] }; thresholds: { similarityMax: number } };
type Result = { errors: string[]; warnings: string[]; infos: string[] };
const empty = (): Result => ({ errors: [], warnings: [], infos: [] });

export function validateVerticalFinding(finding: Finding | null, config: Config): Result {
  const result = empty();
  if (!finding) return result;
  switch (finding.kind) {
    case 'ecom-oos-404': result.errors.push('INV-15.1 exhausted product incorrectly 404s'); break;
    case 'ecom-indexed-variant': result.errors.push('INV-15.2 variant indexed without demand proof'); break;
    case 'ecom-schema-visible-mismatch': result.warnings.push('INV-15.3 Product schema diverges from visible content'); break;
    case 'local-nap-mismatch': result.errors.push('INV-15.4 local NAP mismatch'); break;
    case 'local-doorway': if ((finding.value ?? 0) > config.thresholds.similarityMax) result.errors.push('INV-15.5 local doorway similarity breach'); break;
    case 'local-gbp-stale': result.warnings.push('INV-15.6 local GBP/site freshness warning'); break;
    case 'saas-js-methodology': result.errors.push('INV-15.7 SaaS methodology is not SSR'); break;
    case 'saas-false-offer': result.errors.push('INV-15.8 SaaS offer/price truthfulness violation'); break;
    case 'saas-comparison-stale': result.warnings.push('INV-15.9 SaaS comparison sourcing freshness warning'); break;
    case 'news-old': if ((finding.value ?? 0) > 48) result.errors.push('INV-15.10 news sitemap older than 48 hours'); break;
    case 'media-author-policy-missing': result.warnings.push('INV-15.11 media author/correction policy missing'); break;
    case 'media-evergreen-registry-missing': result.infos.push('INV-15.12 evergreen/news registry type missing'); break;
    case 'hreflang-oneway': result.errors.push('INV-15.13 reciprocal hreflang missing'); break;
    case 'xdefault-invalid': result.errors.push('INV-15.14 x-default cardinality invalid'); break;
    case 'ip-redirect': result.errors.push('INV-15.15 IP-based redirect prohibited'); break;
    case 'hreflang-canonical-mismatch': result.errors.push('INV-15.16 hreflang/canonical registry mismatch'); break;
    case 'i18n-human-edit-missing': result.warnings.push('INV-15.17 i18n human editing record missing'); break;
    case 'out-of-module-unqueued': result.infos.push('INV-15.18 out-of-module finding is not queued'); break;
    case 'weaken-general-rule': result.errors.push('INV-15.19 vertical rule weakens global rule'); break;
    default: throw new Error(`UNKNOWN_VERTICAL_FINDING:${finding.kind}`);
  }
  return result;
}

export function validateVerticalActivation(config: Config): string[] {
  const errors: string[] = [];
  const allowed = new Set(['ecommerce', 'local', 'saas', 'media', 'i18n']);
  for (const vertical of config.business.verticals) if (!allowed.has(vertical)) errors.push(`UNKNOWN_VERTICAL:${vertical}`);
  return errors;
}

function main(): void {
  const siteArg = process.argv.indexOf('--site');
  const site = siteArg >= 0 ? process.argv[siteArg + 1] : process.env.SITE_ID;
  if (site !== 'sectorcalc') process.exit(4);
  const config = JSON.parse(readFileSync(resolve(ROOT, 'sites/sectorcalc/seo.config.json'), 'utf8')) as Config;
  const errors = validateVerticalActivation(config);
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  console.log(`SEO_PHASE_15_CODE_READY verticals=${config.business.verticals.join(',')}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
