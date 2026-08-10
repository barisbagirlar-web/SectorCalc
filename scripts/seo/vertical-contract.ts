import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)));

type Finding = { kind: string; value?: number };
type Config = { business: { verticals: string[] }; thresholds: { similarityMax: number } };

export function validateVerticalFinding(finding: Finding | null, config: Config): string[] {
  if (!finding) return [];
  switch (finding.kind) {
    case 'ecom-oos-404': return ['INV-15.1 exhausted product incorrectly 404s'];
    case 'ecom-indexed-variant': return ['INV-15.2 variant indexed without demand proof'];
    case 'local-nap-mismatch': return ['INV-15.4 local NAP mismatch'];
    case 'local-doorway': return (finding.value ?? 0) > config.thresholds.similarityMax ? ['INV-15.5 local doorway similarity breach'] : [];
    case 'saas-js-methodology': return ['INV-15.7 SaaS methodology is not SSR'];
    case 'saas-false-offer': return ['INV-15.8 SaaS offer/price truthfulness violation'];
    case 'news-old': return (finding.value ?? 0) > 48 ? ['INV-15.10 news sitemap older than 48 hours'] : [];
    case 'hreflang-oneway': return ['INV-15.13 reciprocal hreflang missing'];
    case 'xdefault-invalid': return ['INV-15.14 x-default cardinality invalid'];
    case 'ip-redirect': return ['INV-15.15 IP-based redirect prohibited'];
    case 'hreflang-canonical-mismatch': return ['INV-15.16 hreflang/canonical registry mismatch'];
    case 'weaken-general-rule': return ['INV-15.19 vertical rule weakens global rule'];
    default: throw new Error(`UNKNOWN_VERTICAL_FINDING:${finding.kind}`);
  }
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
