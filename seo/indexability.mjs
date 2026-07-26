/**
 * Single indexability decision engine for SectorCalc SEO registry records.
 * Fail-closed: missing quality flags or forbidden states => not indexable.
 */

const FORBIDDEN_STATUSES = new Set([
  'draft',
  'placeholder',
  'regeneration-pending',
  'test',
  'staging',
  'incomplete-locale',
  'broken',
  'preview-only',
  'internal',
]);

/**
 * @param {Record<string, any>} record
 * @returns {{ indexable: boolean, reasons: string[] }}
 */
export function evaluateSeoIndexable(record) {
  const reasons = [];
  if (!record) {
    return { indexable: false, reasons: ['missing-record'] };
  }
  if (record.publicationStatus !== 'published') reasons.push('not-published');
  if (FORBIDDEN_STATUSES.has(String(record.publicationStatus || '').toLowerCase())) {
    reasons.push(`forbidden-status:${record.publicationStatus}`);
  }
  if (record.locale && record.locale !== 'en' && record.indexDirective !== 'index,follow') {
    reasons.push('non-en-locale-not-fully-released');
  }
  if (!record.canonicalPath || typeof record.canonicalPath !== 'string') reasons.push('missing-canonical');
  if (record.canonicalPath && /[?#]/.test(record.canonicalPath)) reasons.push('canonical-has-query-or-fragment');
  if (record.canonicalPath && /\/[a-z0-9-]+-pro\.html$/i.test(record.canonicalPath)) {
    reasons.push('legacy-source-url');
  }
  if (!String(record.indexDirective || '').includes('index')) reasons.push('robots-not-index');

  const q = record.quality || {};
  for (const key of [
    'formulaVerified',
    'contentReviewed',
    'canonicalVerified',
    'sourceVerified',
    'languageVerified',
    'noPlaceholder',
    'noRegenerationPending',
  ]) {
    if (q[key] !== true) reasons.push(`quality.${key}-not-true`);
  }
  if (record.role === 'calculator' && q.calculatorWorks !== true && q.demoVerified !== true) {
    reasons.push('calculator-not-verified');
  }
  if (!record.title || !record.description) reasons.push('missing-metadata');
  if (!record.primaryIntent || !record.queryCluster) reasons.push('missing-query-ownership');

  return { indexable: reasons.length === 0, reasons };
}

/** @param {Record<string, any>} record */
export function isSeoIndexable(record) {
  return evaluateSeoIndexable(record).indexable;
}
