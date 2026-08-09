import { evaluateSeoIndexable } from './indexability.mjs';

export const PAGE_STATES = Object.freeze({
  DRAFT: 'DRAFT',
  PUBLISHED_INDEXABLE: 'PUBLISHED_INDEXABLE',
  PUBLISHED_NOINDEX: 'PUBLISHED_NOINDEX',
  REDIRECTED: 'REDIRECTED',
  GONE: 'GONE',
});

export function pageState(record) {
  const status = String(record?.publicationStatus ?? '').toLowerCase();
  if (record?.httpStatus === 301 || record?.httpStatus === 308 || status === 'redirected') return PAGE_STATES.REDIRECTED;
  if ([404, 410].includes(record?.httpStatus) || status === 'gone') return PAGE_STATES.GONE;
  if (status !== 'published') return PAGE_STATES.DRAFT;
  const evaluation = evaluateSeoIndexable(record);
  if (evaluation.indexable) return PAGE_STATES.PUBLISHED_INDEXABLE;
  return PAGE_STATES.PUBLISHED_NOINDEX;
}
