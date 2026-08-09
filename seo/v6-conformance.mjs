import fs from 'node:fs';
import path from 'node:path';

export const EXIT = Object.freeze({ VIOLATION: 1, NO_DATA: 3, CONFIG: 4 });
export const REQUIRED_META = Object.freeze([
  'artifact', 'schemaVersion', 'generatedAt', 'generatorScript', 'inputWindow',
  'confidence', 'partial', 'siteId', 'coldStart', 'structuralBreaksApplied',
]);
export const GUARANTEE_PATTERN = /(guaranteed|guarantee\s+(?:ranking|traffic|revenue)|#1\s+on\s+google|rank\s*#?1\s+guaranteed)/i;

export const CANONICAL_INVARIANT_CATALOG = Object.freeze([
  ['INV-G.1','BLOCK'],['INV-G.2','BLOCK'],['INV-G.3','BLOCK'],['INV-G.4','BLOCK'],
  ['INV-X.5','BLOCK'],['INV-K.1','BLOCK'],['INV-K.2','INFO'],
  ['INV-0.1','BLOCK'],['INV-0.2','BLOCK'],['INV-0.3','WARN'],['INV-0.4','INFO'],
  ['INV-1.1','BLOCK'],['INV-1.2','BLOCK'],['INV-1.3','BLOCK'],['INV-1.4','WARN'],['INV-1.5','BLOCK'],['INV-1.6','WARN'],['INV-1.7','BLOCK'],['INV-1.8','INFO'],
  ['INV-2.1','BLOCK'],['INV-2.2','BLOCK'],['INV-2.3','BLOCK'],['INV-2.4','WARN'],['INV-2.5','BLOCK'],['INV-2.6','INFO'],
  ['INV-3.1','BLOCK'],['INV-3.2','BLOCK'],['INV-3.3','BLOCK'],['INV-3.4a','BLOCK'],['INV-3.4b','WARN'],['INV-3.5','WARN'],['INV-3.6','INFO'],
  ['INV-4.1','BLOCK'],['INV-4.2','BLOCK'],['INV-4.3','WARN'],['INV-4.4','INFO'],
  ['INV-5.1','BLOCK'],['INV-5.2','BLOCK'],['INV-5.3','WARN'],['INV-5.4','WARN'],['INV-5.5','BLOCK'],['INV-5.6','INFO'],
  ['INV-6.1','BLOCK'],['INV-6.2','BLOCK'],['INV-6.3','WARN'],['INV-6.4','INFO'],
  ['INV-7.1','WARN'],['INV-7.2','BLOCK'],['INV-7.3','WARN'],['INV-7.4','INFO'],
  ['INV-8.1','WARN'],['INV-8.2','INFO'],['INV-8.3','BLOCK'],
  ['INV-9.1','BLOCK'],['INV-9.2','BLOCK'],['INV-9.3','BLOCK'],['INV-9.4','WARN'],['INV-9.5','INFO'],
  ['INV-10.1','BLOCK'],['INV-10.2','BLOCK'],['INV-10.3','INFO'],
  ['INV-11.1','BLOCK'],['INV-11.2','BLOCK'],['INV-11.3','BLOCK'],['INV-11.4','BLOCK'],['INV-11.5','WARN'],['INV-11.6','BLOCK'],['INV-11.7','WARN'],['INV-11.8','INFO'],
  ['INV-12.1','BLOCK'],['INV-12.2','BLOCK'],['INV-12.3','WARN'],['INV-12.4','INFO'],['INV-12.5','BLOCK'],
  ['INV-13.1','BLOCK'],['INV-13.2','BLOCK'],['INV-13.3','WARN'],['INV-13.4','INFO'],['INV-13.5','WARN'],['INV-13.6','INFO'],
  ['INV-14.1','BLOCK'],['INV-14.2','BLOCK'],['INV-14.3','BLOCK'],['INV-14.4','BLOCK'],['INV-14.5','WARN'],['INV-14.6','INFO'],
  ['INV-15.1','BLOCK'],['INV-15.2','BLOCK'],['INV-15.3','WARN'],['INV-15.4','BLOCK'],['INV-15.5','BLOCK'],['INV-15.6','WARN'],['INV-15.7','BLOCK'],['INV-15.8','BLOCK'],['INV-15.9','WARN'],['INV-15.10','BLOCK'],['INV-15.11','WARN'],['INV-15.12','INFO'],['INV-15.13','BLOCK'],['INV-15.14','BLOCK'],['INV-15.15','BLOCK'],['INV-15.16','BLOCK'],['INV-15.17','WARN'],['INV-15.18','INFO'],['INV-15.19','BLOCK'],
  ['INV-16.1','BLOCK'],['INV-16.2','WARN'],['INV-16.3','BLOCK'],['INV-16.4','BLOCK'],['INV-16.5','WARN'],['INV-16.6','INFO'],
  ['INV-17.1','BLOCK'],['INV-17.2','BLOCK'],['INV-17.3','BLOCK'],['INV-17.4','BLOCK'],['INV-17.5','WARN'],['INV-17.6','INFO'],
  ['INV-18.1','BLOCK'],['INV-18.2','BLOCK'],['INV-18.3','BLOCK'],['INV-18.4','WARN'],['INV-18.5','BLOCK'],['INV-18.6','BLOCK'],
  ['INV-19.1','BLOCK'],['INV-19.2','WARN'],['INV-19.3','BLOCK'],['INV-19.4','INFO'],
]);

export function validateInvariantCatalog(value) {
  const actual = (value?.invariants || []).map((item) => [item.id, item.severity]);
  const errors = [];
  if (actual.length !== CANONICAL_INVARIANT_CATALOG.length) errors.push(`count:${actual.length}`);
  for (let i = 0; i < CANONICAL_INVARIANT_CATALOG.length; i += 1) {
    const expected = CANONICAL_INVARIANT_CATALOG[i];
    const found = actual[i];
    if (!found || found[0] !== expected[0] || found[1] !== expected[1]) errors.push(`catalog:${i}:${expected[0]}:${expected[1]}`);
  }
  return errors;
}

export function executeInvariantNegativeFixture(registry, fixture) {
  const item = (registry?.invariants || []).find((value) => value.id === fixture?.invariantId);
  if (!item || item.severity !== 'BLOCK') return EXIT.CONFIG;
  return fixture?.violates === true ? EXIT.VIOLATION : 0;
}

export function validateArtifactEnvelope(value) {
  const meta = value?.meta;
  if (!meta || typeof meta !== 'object') return ['meta'];
  return REQUIRED_META.filter((key) => !(key in meta));
}
export function validateInvariantResults(results) {
  const errors = [];
  for (const [index, result] of (results || []).entries()) {
    if (!['PASS', 'FAIL', 'SKIP_NO_DATA'].includes(result?.status)) errors.push(`result:${index}:status`);
    if (result?.severity === 'BLOCK' && result?.status === 'PASS' && result?.negativeTestPassed !== true) errors.push(`result:${index}:negativeTestPassed`);
  }
  return errors;
}
function globToRegExp(glob) {
  const escaped = String(glob).replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '::ALL::').replace(/\*/g, '[^/]*').replace(/::ALL::/g, '.*');
  return new RegExp(`^${escaped}$`);
}
export function pathMatches(pattern, file) {
  if (pattern.includes('|')) return pattern.split('|').some((part) => pathMatches(part, file));
  return globToRegExp(pattern).test(file);
}
export function phaseWriteViolations(contract, files) {
  const allowed = contract?.writes || [];
  const forbidden = contract?.forbidsWrites || [];
  return (files || []).filter((file) => forbidden.some((pattern) => pathMatches(pattern, file)) || (allowed.length > 0 && !allowed.some((pattern) => pathMatches(pattern, file))));
}
export function validateMoneyMinor(value, pointer = '$') {
  const errors = [];
  if (Array.isArray(value)) { value.forEach((item, index) => errors.push(...validateMoneyMinor(item, `${pointer}[${index}]`))); return errors; }
  if (!value || typeof value !== 'object') return errors;
  for (const [key, child] of Object.entries(value)) {
    const childPointer = `${pointer}.${key}`;
    if (/Minor$/.test(key)) {
      const validNumber = Number.isInteger(child);
      const validPersistedString = typeof child === 'string' && /^-?\d+$/.test(child);
      if (!validNumber && !validPersistedString) errors.push(childPointer);
    }
    errors.push(...validateMoneyMinor(child, childPointer));
  }
  return errors;
}
export function containsGuaranteeLanguage(text) { return GUARANTEE_PATTERN.test(String(text)); }
export function hasApprovalRecord(text, actionId) {
  const source = String(text);
  const escaped = String(actionId).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`${escaped}[\\s\\S]{0,500}(approved|approval|owner-authorized|authorized)`, 'i').test(source);
}
export function registryWriterPhases(contracts) {
  return Object.entries(contracts || {}).filter(([name]) => name !== 'bootstrap').filter(([, contract]) => (contract.writes || []).some((pattern) => String(pattern).startsWith('data/seo/registry/'))).map(([name]) => name);
}
export function missingNegativeTests(invariants, root = process.cwd()) {
  return (invariants?.invariants || []).filter((item) => item.severity === 'BLOCK').filter((item) => !item.negativeTest || !fs.existsSync(path.join(root, item.negativeTest))).map((item) => item.id);
}
export function normalizeDeterministic(value) {
  if (Array.isArray(value)) return value.map(normalizeDeterministic);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'generatedAt').map(([key, child]) => [key, normalizeDeterministic(child)]));
}
export function crossesStructuralBreak(rows, breakDate) {
  const dates = (rows || []).map((row) => row.date).filter(Boolean).sort();
  return dates.length > 1 && dates[0] < breakDate && dates[dates.length - 1] >= breakDate;
}
export function structuralBreakJoinAllowed(artifact, rows, breakDate) {
  if (!crossesStructuralBreak(rows, breakDate)) return true;
  return Array.isArray(artifact?.meta?.structuralBreaksApplied) && artifact.meta.structuralBreaksApplied.includes(breakDate);
}
export function coldStartContract(observedDays, meta, requiredWindowDays) {
  if (!Number.isInteger(requiredWindowDays) || requiredWindowDays < 1) return false;
  if (observedDays >= requiredWindowDays) return true;
  return meta?.coldStart === true && meta?.confidence === 'low';
}
export function portfolioSiteIdsValid(artifact) {
  if (!artifact || typeof artifact !== 'object' || !artifact.meta?.siteId) return false;
  const rows = artifact.sites || artifact.rows || artifact.items || [];
  return !Array.isArray(rows) || rows.every((row) => !row || typeof row !== 'object' || Boolean(row.siteId));
}
export function installedOperationalSeoScripts(root = process.cwd()) {
  const dir = path.join(root, 'scripts', 'seo');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((name) => /\.(?:m?[jt]s)$/.test(name)).filter((name) => name !== 'preflight.ts').map((name) => path.join(dir, name));
}
export function hardcodedConfiguredThresholds(config, files) {
  const values = Object.values(config?.thresholds || {}).filter((value) => typeof value === 'number' && ![0, 1, 100].includes(value));
  const errors = [];
  for (const file of files || []) {
    const source = fs.readFileSync(file, 'utf8');
    for (const value of values) {
      const escaped = String(value).replace('.', '\\.');
      if (new RegExp(`(^|[^\\w.])${escaped}([^\\w.]|$)`).test(source) && !source.includes('config.thresholds')) errors.push(`${path.basename(file)}:${value}`);
    }
  }
  return errors;
}
