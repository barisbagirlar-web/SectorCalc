import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)));

type Decision = 'INVEST' | 'HOLD' | 'HARVEST' | 'DIVEST' | null;
type BudgetSplit = { investPct: number; holdPct: number; harvestPct: number; divestPct: number };
type Artifact = {
  decision: Decision;
  approvalRef: string | null;
  valueSharePct: number;
  diversificationPlan: boolean;
  divestSteps: boolean[];
  proposedBudgetSplit: BudgetSplit;
  configChangeApproved: boolean;
  paybackMonths: number | null;
  paybackCalibrated: boolean;
  harvestInvestmentScanDone: boolean;
};
type Config = { thresholds: { concentrationWarnPct: number }; economics: { paybackMaxMonths: number; budgetSplit: BudgetSplit } };

function budgetDiverges(a: BudgetSplit, b: BudgetSplit): boolean {
  return a.investPct !== b.investPct || a.holdPct !== b.holdPct || a.harvestPct !== b.harvestPct || a.divestPct !== b.divestPct;
}

export function validatePortfolio(artifact: Artifact, config: Config, ledger: string): { errors: string[]; warnings: string[]; infos: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const infos: string[] = [];
  if (artifact.valueSharePct > config.thresholds.concentrationWarnPct && !artifact.diversificationPlan) {
    errors.push('INV-17.1 concentration without diversification plan');
  }
  if (artifact.decision === 'DIVEST') {
    if (artifact.divestSteps.length !== 4 || artifact.divestSteps.some((done) => !done)) errors.push('INV-17.2 DIVEST four-step execution incomplete');
  }
  if (budgetDiverges(artifact.proposedBudgetSplit, config.economics.budgetSplit) && !artifact.configChangeApproved) {
    errors.push('INV-17.3 budget deviation without approved config change');
  }
  if (artifact.decision !== null && (!artifact.approvalRef || !ledger.includes(artifact.approvalRef))) {
    errors.push('INV-17.4 portfolio decision approval missing');
  }
  if (artifact.paybackMonths !== null && artifact.paybackMonths > config.economics.paybackMaxMonths && !artifact.paybackCalibrated) {
    warnings.push('INV-17.5 payback calibration required');
  }
  if (artifact.decision === 'HARVEST' && !artifact.harvestInvestmentScanDone) infos.push('INV-17.6 HARVEST investment scan pending');
  return { errors, warnings, infos };
}

function main(): void {
  const siteArg = process.argv.indexOf('--site');
  const site = siteArg >= 0 ? process.argv[siteArg + 1] : process.env.SITE_ID;
  if (site !== 'sectorcalc') process.exit(4);
  const config = JSON.parse(readFileSync(resolve(ROOT, 'sites/sectorcalc/seo.config.json'), 'utf8')) as Config;
  const safe: Artifact = { decision: null, approvalRef: null, valueSharePct: 0, diversificationPlan: true, divestSteps: [false, false, false, false], proposedBudgetSplit: config.economics.budgetSplit, configChangeApproved: false, paybackMonths: null, paybackCalibrated: false, harvestInvestmentScanDone: false };
  const result = validatePortfolio(safe, config, '');
  if (result.errors.length) {
    console.error(result.errors.join('\n'));
    process.exit(1);
  }
  console.log(`SEO_PHASE_17_CODE_READY concentrationWarnPct=${config.thresholds.concentrationWarnPct}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
