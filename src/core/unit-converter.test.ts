import { describe, it, expect } from 'vitest';
import { convert, listUnits } from './unit-converter.js';

describe('unit-converter', () => {
  it('1 inch = 25.4 mm', () => {
    expect(convert(1, 'in', 'mm', 'length').toString()).toBe('25.4');
  });

  it('1000 mm = 1 m', () => {
    expect(convert(1000, 'mm', 'm', 'length').toString()).toBe('1');
  });

  it('throws on unknown dimension', () => {
    expect(() => convert(1, 'mm', 'in', 'banana')).toThrow();
  });

  it('conversion is deterministic (1000 runs identical)', () => {
    const first = convert('12.345', 'in', 'mm', 'length').toString();
    for (let i = 0; i < 1000; i++) {
      expect(convert('12.345', 'in', 'mm', 'length').toString()).toBe(first);
    }
  });

  it('lists available units for a dimension', () => {
    const units = listUnits('length');
    expect(units).toContain('mm');
    expect(units).toContain('in');
  });

  it('returns an empty array for an unknown dimension', () => {
    expect(listUnits('banana')).toEqual([]);
  });

  it('throws on an unknown source unit', () => {
    expect(() => convert(1, 'lightyear', 'mm', 'length')).toThrow();
  });

  it('throws on an unknown target unit', () => {
    expect(() => convert(1, 'mm', 'lightyear', 'length')).toThrow();
  });
});
