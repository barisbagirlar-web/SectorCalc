import { describe, it, expect } from 'vitest';
import { validate, toJson, fromJson } from './validate.js';

describe('schema (JSON Schema 2020-12)', () => {
  it('accepts money amount decimal strings', () => {
    const result = validate('money-amount.json', {
      amount: '19.99',
      currency: 'USD'
    });
    expect(result.ok).toBe(true);
  });

  it('rejects JSON numbers for amount', () => {
    const result = validate('money-amount.json', {
      amount: 19.99,
      currency: 'USD'
    });
    expect(result.ok).toBe(false);
  });

  it('document envelope round-trips as JSON text', () => {
    const doc = {
      schemaVersion: '1',
      kind: 'example',
      payload: { hello: 'world' }
    };
    const text = toJson(doc);
    expect(typeof text).toBe('string');
    expect(fromJson(text)).toEqual(doc);
    expect(validate('sectorcal-document.json', doc).ok).toBe(true);
  });
});
