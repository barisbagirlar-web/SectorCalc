import { describe, it, expect } from 'vitest';
import { validate } from './validator.js';

const schema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  properties: {
    thickness: { type: 'number', minimum: 0.5, maximum: 200 },
    name: { type: 'string' }
  },
  required: ['thickness']
} as const;

describe('validator', () => {
  it('accepts valid data', () => {
    const result = validate(schema, { thickness: 20, name: 'plate' });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects a missing required field', () => {
    const result = validate(schema, { name: 'plate' });
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.field).toBe('thickness');
  });

  it('rejects an out-of-range value', () => {
    const result = validate(schema, { thickness: 999 });
    expect(result.valid).toBe(false);
  });

  it('caches compiled schemas', () => {
    validate(schema, { thickness: 1 });
    const second = validate(schema, { thickness: 2 });
    expect(second.valid).toBe(true);
  });

  it('maps a nested type error to its instance path', () => {
    const result = validate(schema, { thickness: 'thick' });
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.field).toBe('thickness');
  });

  it('maps a root-level type error to field "root"', () => {
    const result = validate(schema, 'not-an-object');
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.field).toBe('root');
  });
});
