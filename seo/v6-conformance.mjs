import fs from 'node:fs';
import path from 'node:path';

export const EXIT = Object.freeze({ VIOLATION: 1, NO_DATA: 3, CONFIG: 4 });
export const REQUIRED_META = Object.freeze([
  'artifact', 'schemaVersion', 'generatedAt', 'generatorScript', 'inputWindow',
  'confidence', 'partial', 'siteId', 'coldStart', 'structuralBreaksApplied',
]);

export const GUARANTEE_PATTERN = /(guaranteed|guarantee\s+(?:ranking|traffic|revenue)|#1\s+on\s+google|rank\s*#?1\s+guaranteed)/i;

export function validateArtifactEnvelope(value) {
  const meta = value?.meta;
  if (!meta || typeof meta !== 'object') return ['meta'];
  return REQUIRED_META.filter((key) => !(key in meta));
}

export function validateInvariantResults(results) {
  const errors = [];
  for (const [index, result] of (results || []).entries()) {
    if (!['PASS', 'FAIL', 'SKIP_NO_DATA'].includes(result?.status)) errors.push(`result:${index}:status`);
    if (result?.severity === 'BLOCK' && result?.status === 'PASS' && result?.negativeTestPassed !== true) {
      errors.push(`result:${index}:negativeTestPassed`);
    }
  }
  return errors;
}

function globToRegExp(glob) {
  const escaped = String(glob)
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '::ALL::')
    .replace(/\*/g, '[^/]*')
    .replace(/::ALL::/g, '.*');
  return new RegExp(`^${escaped}$`);
}

export function pathMatches(pattern, file) {
  if (pattern.includes('|')) return pattern.split('|').some((part) => pathMatches(part, file));
  return globToRegExp(pattern).test(file);
}

export function phaseWriteViolations(contract, files) {
  const allowed = contract?.writes || [];
  const forbidden = contract?.forbidsWrites || [];
  return (files || []).filter((file) =>
    forbidden.some((pattern) => pathMatches(pattern, file)) ||
    (allowed.length > 0 && !allowed.some((pattern) => pathMatches(pattern, file))),
  );
}

export function validateMoneyMinor(value, pointer = '$') {
  const errors = [];
  if (Array.isArray(value)) {
    value.forEach((item, index) => errors.push(...validateMoneyMinor(item, `${pointer}[${index}]`)));
    return errors;
  }
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

export function containsGuaranteeLanguage(text) {
  return GUARANTEE_PATTERN.test(String(text));
}

export function hasApprovalRecord(text, actionId) {
  const source = String(text);
  const escaped = String(actionId).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`${escaped}[\\s\\S]{0,500}(approved|approval|owner-authorized|authorized)`, 'i').test(source);
}

export function registryWriterPhases(contracts) {
  return Object.entries(contracts || {})
    .filter(([name]) => name !== 'bootstrap')
    .filter(([, contract]) => (contract.writes || []).some((pattern) => String(pattern).startsWith('data/seo/registry/')))
    .map(([name]) => name);
}

export function missingNegativeTests(invariants, root = process.cwd()) {
  return (invariants?.invariants || [])
    .filter((item) => item.severity === 'BLOCK')
    .filter((item) => !item.negativeTest || !fs.existsSync(path.join(root, item.negativeTest)))
    .map((item) => item.id);
}

export function normalizeDeterministic(value) {
  if (Array.isArray(value)) return value.map(normalizeDeterministic);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => key !== 'generatedAt')
    .map(([key, child]) => [key, normalizeDeterministic(child)]));
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
  if (!artifact || typeof artifact !== 'object') return false;
  if (!artifact.meta?.siteId) return false;
  const rows = artifact.sites || artifact.rows || artifact.items || [];
  return !Array.isArray(rows) || rows.every((row) => !row || typeof row !== 'object' || Boolean(row.siteId));
}

export function installedOperationalSeoScripts(root = process.cwd()) {
  const dir = path.join(root, 'scripts', 'seo');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => /\.(?:m?[jt]s)$/.test(name))
    .filter((name) => name !== 'preflight.ts')
    .map((name) => path.join(dir, name));
}

export function hardcodedConfiguredThresholds(config, files) {
  const values = Object.values(config?.thresholds || {})
    .filter((value) => typeof value === 'number' && ![0, 1, 100].includes(value));
  const errors = [];
  for (const file of files || []) {
    const source = fs.readFileSync(file, 'utf8');
    for (const value of values) {
      const escaped = String(value).replace('.', '\\.');
      if (new RegExp(`(^|[^\\w.])${escaped}([^\\w.]|$)`).test(source) && !source.includes('config.thresholds')) {
        errors.push(`${path.basename(file)}:${value}`);
      }
    }
  }
  return errors;
}
