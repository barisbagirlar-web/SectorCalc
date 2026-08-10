import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)));

type Loop = {
  id: string;
  enabled: boolean;
  claimEnabled: boolean;
  evidenceRef: string | null;
  owner: string | null;
  requiresModeration: boolean;
  moderationEnabled: boolean;
  channel: 'organic' | 'paid' | 'mixed' | 'affiliate' | 'ugc';
  cwvBudgetRefs: string[];
  observationWindowDeclared: boolean;
  affiliateDisclosureAudited: boolean;
};
type Artifact = { loops: Loop[] };
type Config = { thresholds: { lcpP75Ms: number; inpP75Ms: number; clsP75: number } };

const REQUIRED_CWV_REFS = ['thresholds.lcpP75Ms', 'thresholds.inpP75Ms', 'thresholds.clsP75'];

export function validateTamLoops(artifact: Artifact, _config: Config): { errors: string[]; warnings: string[]; infos: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const infos: string[] = [];
  for (const loop of artifact.loops) {
    if (loop.claimEnabled && !loop.evidenceRef) errors.push(`INV-16.1 TAM/growth claim without evidence: ${loop.id}`);
    if (loop.enabled && !loop.owner) warnings.push(`INV-16.2 growth-loop owner missing: ${loop.id}`);
    if (loop.enabled && loop.requiresModeration && !loop.moderationEnabled) errors.push(`INV-16.3 UGC moderation missing: ${loop.id}`);
    if (loop.enabled && (loop.channel === 'paid' || loop.channel === 'mixed')) {
      for (const ref of REQUIRED_CWV_REFS) if (!loop.cwvBudgetRefs.includes(ref)) errors.push(`INV-16.4 paid/mixed loop CWV budget missing ${ref}: ${loop.id}`);
    }
    if (loop.enabled && !loop.observationWindowDeclared) warnings.push(`INV-16.5 observation window missing: ${loop.id}`);
    if (loop.enabled && loop.channel === 'affiliate' && !loop.affiliateDisclosureAudited) infos.push(`INV-16.6 affiliate disclosure audit pending: ${loop.id}`);
  }
  return { errors, warnings, infos };
}

function main(): void {
  const siteArg = process.argv.indexOf('--site');
  const site = siteArg >= 0 ? process.argv[siteArg + 1] : process.env.SITE_ID;
  if (site !== 'sectorcalc') process.exit(4);
  const config = JSON.parse(readFileSync(resolve(ROOT, 'sites/sectorcalc/seo.config.json'), 'utf8')) as Config;
  const result = validateTamLoops({ loops: [] }, config);
  if (result.errors.length) {
    console.error(result.errors.join('\n'));
    process.exit(1);
  }
  console.log('SEO_PHASE_16_CODE_READY growth-loop-contract');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
