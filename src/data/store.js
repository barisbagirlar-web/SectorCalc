/**
 * JSON-only persistence boundary (Decision #5).
 * No binary codecs — ever.
 */
import { fromJson, toJson, validate } from '../schema/validate.js';

const KEY = 'sectorcal.document.v1';

/**
 * @returns {unknown | null}
 */
export function loadDocument() {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  const data = fromJson(raw);
  const result = validate('sectorcal-document.json', data);
  if (!result.ok) {
    console.warn('SECTORCAL: stored document failed schema', result.errors);
    return null;
  }
  return data;
}

/**
 * @param {{ schemaVersion: string, kind: string, payload: object }} doc
 */
export function saveDocument(doc) {
  const result = validate('sectorcal-document.json', doc);
  if (!result.ok) {
    throw new Error(`invalid document: ${toJson(result.errors)}`);
  }
  localStorage.setItem(KEY, toJson(doc));
}
