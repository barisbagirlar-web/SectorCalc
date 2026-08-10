import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export type OffpagePlan = {
  disavow: boolean;
  manualAction: boolean;
  provenNegativeSeo: boolean;
  approvalRef: string | null;
  tactics: string[];
  prCampaign: boolean;
  linkableAssetReady: boolean;
  brandDemandMixedWithGeneric: boolean;
  aiCitationMethodologyDeclared: boolean;
};

const BANNED = new Set(['paid-link', 'pbn', 'link-exchange', 'bulk-guest-post', 'automated-link-blast']);

export function validateOffpage(plan: OffpagePlan, ledger: string): { errors: string[]; warnings: string[]; infos: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const infos: string[] = [];
  if (plan.disavow && !(plan.manualAction || (plan.provenNegativeSeo && plan.approvalRef && ledger.includes(plan.approvalRef)))) {
    errors.push('INV-13.1 unconditional disavow');
  }
  for (const tactic of plan.tactics) if (BANNED.has(tactic)) errors.push(`INV-13.2 prohibited link scheme: ${tactic}`);
  if (plan.prCampaign && !plan.linkableAssetReady) warnings.push('INV-13.3 PR campaign without linkable asset');
  if (plan.brandDemandMixedWithGeneric) infos.push('INV-13.4 brand demand must remain separately attributable');
  if (!plan.aiCitationMethodologyDeclared) infos.push('INV-13.6 AI citation methodology not declared');
  return { errors, warnings, infos };
}

function main(): void {
  const siteArg = process.argv.indexOf('--site');
  const site = siteArg >= 0 ? process.argv[siteArg + 1] : process.env.SITE_ID;
  if (site !== 'sectorcalc') process.exit(4);
  const safe: OffpagePlan = { disavow: false, manualAction: false, provenNegativeSeo: false, approvalRef: null, tactics: [], prCampaign: false, linkableAssetReady: false, brandDemandMixedWithGeneric: false, aiCitationMethodologyDeclared: true };
  const result = validateOffpage(safe, '');
  if (result.errors.length) {
    console.error(result.errors.join('\n'));
    process.exit(1);
  }
  console.log('SEO_PHASE_13_CODE_READY offpage-safety-contract');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
