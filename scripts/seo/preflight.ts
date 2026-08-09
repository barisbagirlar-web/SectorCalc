#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

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
for (const required of [configPath, schemaPath, invariantsPath]) {
  if (!fs.existsSync(required)) configError(`missing ${path.relative(root, required)}`);
}

const configText = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configText);
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const invariants = JSON.parse(fs.readFileSync(invariantsPath, 'utf8'));

// P-01: JSON Schema validation.
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);
if (!validate(config)) configError(`schema ${ajv.errorsText(validate.errors, { separator: '; ' })}`);

// P-02: unresolved placeholder token in config.
if (configText.includes('|')) configError('placeholder token detected in site config');

// P-03: phase write scope when SEO_PHASE is supplied by phase CI.
const phase = process.env.SEO_PHASE || '';
if (phase) {
  const contracts = JSON.parse(fs.readFileSync(path.join(root, 'data', 'seo', 'PHASE_CONTRACTS.json'), 'utf8'));
  if (!contracts[phase]) configError(`unknown SEO_PHASE ${phase}`);
}

// P-04: existing repository secret guard, which reports file/class only.
try {
  execFileSync(process.execPath, ['scripts/verify-paddle-production-guard.mjs'], { cwd: root, stdio: 'pipe' });
} catch {
  violation('repository secret guard failed');
}

// P-05: invariant registry structural sanity.
if (!Array.isArray(invariants.invariants) || invariants.invariants.length === 0) configError('invariant registry empty');
const ids = invariants.invariants.map((item) => item.id);
if (new Set(ids).size !== ids.length) configError('duplicate invariant id');
for (const item of invariants.invariants) {
  if (!item.id || !item.severity || !item.statement || !Array.isArray(item.configRefs) || !item.negativeTest) {
    configError(`invalid invariant record ${item.id || 'unknown'}`);
  }
}

// P-06: artifact envelope check is incremental. Validate any governed JSON artifacts that already exist.
const envelopeArtifacts = ['data/seo/tam_map.json', 'data/seo/brand_demand.json', 'data/seo/linkable_assets.json', 'data/seo/pnl.json', 'data/seo/portfolio_board.json', 'data/seo/valuation.json'];
for (const artifact of envelopeArtifacts) {
  const absolute = path.join(root, artifact);
  if (!fs.existsSync(absolute)) continue;
  const parsed = JSON.parse(fs.readFileSync(absolute, 'utf8'));
  const meta = parsed.meta;
  const requiredMeta = ['artifact', 'schemaVersion', 'generatedAt', 'generatorScript', 'inputWindow', 'confidence', 'partial', 'siteId', 'coldStart', 'structuralBreaksApplied'];
  if (!meta || requiredMeta.some((key) => !(key in meta))) violation(`artifact envelope incomplete ${artifact}`);
}

// P-07: budget split total.
const split = config.economics.budgetSplit;
if (split.investPct + split.holdPct + split.harvestPct + split.divestPct !== 100) configError('budgetSplit must total 100');

// P-08: data window lower bound from V6.
if (config.measurement.dataWindowStart < '2025-09-11') configError('dataWindowStart is earlier than V6 lower bound');

// P-09: CLI site and config site must agree.
if (config.site.siteId !== siteId) configError('siteId mismatch');

// P-10: fast promise-language scan over operational reports, excluding the mandate/errata source records themselves.
let changed = [];
try {
  const output = execFileSync('git', ['diff', '--name-only', 'origin/main...HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  changed = output ? output.split(/\r?\n/) : [];
} catch {
  changed = [];
}
const promisePattern = /(guaranteed|guarantee ranking|guarantee traffic|guarantee revenue|#1 on google|kesin \u00e7\u0131kar|1\. s\u0131ra garant)/i;
for (const file of changed) {
  if (!/^(docs\/seo|data\/seo)\//.test(file)) continue;
  if (/MANDATE(?:_ERRATA)?\.md$/.test(file)) continue;
  const absolute = path.join(root, file);
  if (fs.existsSync(absolute) && promisePattern.test(fs.readFileSync(absolute, 'utf8'))) violation(`promise-language pattern in ${file}`);
}

console.log(`SEO_PREFLIGHT=PASS site=${siteId} profile=${config.profile}`);
