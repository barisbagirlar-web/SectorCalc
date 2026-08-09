#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { missingNegativeTests, phaseWriteViolations, validateInvariantCatalog } from '../../seo/v6-conformance.mjs';

const root = process.cwd();
const args = process.argv.slice(2);
const siteIndex = args.indexOf('--site');
const siteId = siteIndex >= 0 ? args[siteIndex + 1] : '';
const configError = (message) => { console.error(`SEO_PREFLIGHT=CONFIG_ERROR ${message}`); process.exit(4); };
const violation = (message) => { console.error(`SEO_PREFLIGHT=FAIL ${message}`); process.exit(1); };
if (!siteId) configError('missing --site');

const configPath = path.join(root, 'sites', siteId, 'seo.config.json');
const schemaPath = path.join(root, 'seo.config.schema.json');
const invariantsPath = path.join(root, 'data', 'seo', 'invariants.json');
for (const required of [configPath, schemaPath, invariantsPath]) if (!fs.existsSync(required)) configError(`missing ${path.relative(root, required)}`);
const configText = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configText);
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const invariants = JSON.parse(fs.readFileSync(invariantsPath, 'utf8'));

function changedFiles() {
  if (process.env.SEO_CHANGED_FILES) return process.env.SEO_CHANGED_FILES.split(/[\r\n,]+/).map((v) => v.trim()).filter(Boolean);
  const refs = [];
  if (process.env.SEO_BASE_REF) refs.push(process.env.SEO_BASE_REF);
  if (process.env.GITHUB_BASE_REF) refs.push(`origin/${process.env.GITHUB_BASE_REF}`);
  refs.push('origin/main');
  for (const ref of refs) {
    try {
      const output = execFileSync('git', ['diff', '--name-only', `${ref}...HEAD`], { cwd: root, encoding: 'utf8' }).trim();
      return output ? output.split(/\r?\n/).filter(Boolean) : [];
    } catch { /* try next deterministic base */ }
  }
  return [];
}
const changed = changedFiles();

// P-01
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);
if (!validate(config)) configError(`schema ${ajv.errorsText(validate.errors, { separator: '; ' })}`);
// P-02
if (configText.includes('|')) configError('placeholder token detected in site config');
// P-03
let phase = process.env.SEO_PHASE || '';
if (!phase) {
  const branch = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || '';
  const match = branch.match(/(?:^|\/)faz-(\d{2})(?:-|$)/i);
  if (match) phase = `faz-${match[1]}`;
}
if (phase) {
  const contracts = JSON.parse(fs.readFileSync(path.join(root, 'data', 'seo', 'PHASE_CONTRACTS.json'), 'utf8'));
  const contract = contracts[phase];
  if (!contract) configError(`unknown SEO_PHASE ${phase}`);
  const errors = phaseWriteViolations(contract, changed);
  if (errors.length) violation(`phase write scope ${phase}: ${errors.join(', ')}`);
}
// P-04
try { execFileSync(process.execPath, ['scripts/verify-paddle-production-guard.mjs'], { cwd: root, stdio: 'pipe' }); } catch { violation('repository secret guard failed'); }
// P-05: exact Appendix F catalog + BLOCK negative fixture coverage.
if (!Array.isArray(invariants.invariants)) configError('invariant registry missing');
const catalogErrors = validateInvariantCatalog(invariants);
if (catalogErrors.length) configError(`Appendix F invariant mismatch: ${catalogErrors.join(', ')}`);
const ids = invariants.invariants.map((item) => item.id);
if (new Set(ids).size !== ids.length) configError('duplicate invariant id');
const negativeErrors = missingNegativeTests(invariants, root);
if (negativeErrors.length) configError(`BLOCK invariant negative fixture missing: ${negativeErrors.join(', ')}`);
// P-06
for (const artifact of ['data/seo/tam_map.json','data/seo/brand_demand.json','data/seo/linkable_assets.json','data/seo/pnl.json','data/seo/portfolio_board.json','data/seo/valuation.json']) {
  const absolute = path.join(root, artifact);
  if (!fs.existsSync(absolute)) continue;
  const parsed = JSON.parse(fs.readFileSync(absolute, 'utf8'));
  const requiredMeta = ['artifact','schemaVersion','generatedAt','generatorScript','inputWindow','confidence','partial','siteId','coldStart','structuralBreaksApplied'];
  if (!parsed.meta || requiredMeta.some((key) => !(key in parsed.meta))) violation(`artifact envelope incomplete ${artifact}`);
}
// P-07
const split = config.economics.budgetSplit;
if (split.investPct + split.holdPct + split.harvestPct + split.divestPct !== 100) configError('budgetSplit must total 100');
// P-08
if (config.measurement.dataWindowStart < '2025-09-11') configError('dataWindowStart is earlier than V6 lower bound');
// P-09
if (config.site.siteId !== siteId) configError('siteId mismatch');
// P-10
const promisePattern = /(guaranteed|guarantee ranking|guarantee traffic|guarantee revenue|#1 on google|kesin \u00e7\u0131kar|1\. s\u0131ra garant)/i;
for (const file of changed) {
  if (!/^(docs\/seo|data\/seo)\//.test(file) || /MANDATE(?:_ERRATA)?\.md$/.test(file)) continue;
  const absolute = path.join(root, file);
  if (fs.existsSync(absolute) && promisePattern.test(fs.readFileSync(absolute, 'utf8'))) violation(`promise-language pattern in ${file}`);
}
console.log(`SEO_PREFLIGHT=PASS site=${siteId} profile=${config.profile}${phase ? ` phase=${phase}` : ''} invariants=127 blocks=75`);
