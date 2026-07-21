import { describe, it, expect } from 'vitest';
import { qty, qadd, qsub, qmulScalar, qdivScalar, qconvert, qeq, qcompare } from './quantity.js';
import { CalcError } from './guards.js';

describe('quantity', () => {
  it('creates a quantity', () => {
    const q = qty(20, 'mm', 'length');
    expect(q.value.toString()).toBe('20');
    expect(q.unit).toBe('mm');
  });
  it('adds same unit', () => {
    expect(qadd(qty(10, 'mm', 'length'), qty(5, 'mm', 'length')).value.toString()).toBe('15');
  });
  it('adds cross unit (in to mm)', () => {
    const r = qadd(qty(10, 'mm', 'length'), qty(1, 'in', 'length'));
    expect(r.value.toString()).toBe('35.4');
    expect(r.unit).toBe('mm');
  });
  it('throws on dimension mismatch add', () => {
    expect(() => qadd(qty(1, 'mm', 'length'), qty(1, 'g', 'mass'))).toThrow(CalcError);
  });
  it('subtracts', () => {
    expect(qsub(qty(10, 'mm', 'length'), qty(3, 'mm', 'length')).value.toString()).toBe('7');
  });
  it('multiplies by scalar', () => {
    expect(qmulScalar(qty(4, 'mm', 'length'), 3).value.toString()).toBe('12');
  });
  it('divides by scalar', () => {
    expect(qdivScalar(qty(12, 'mm', 'length'), 4).value.toString()).toBe('3');
  });
  it('throws divide by zero', () => {
    expect(() => qdivScalar(qty(1, 'mm', 'length'), 0)).toThrow(CalcError);
  });
  it('converts unit', () => {
    expect(qconvert(qty(1, 'in', 'length'), 'mm').value.toString()).toBe('25.4');
  });
  it('eq true and false', () => {
    expect(qeq(qty(25.4, 'mm', 'length'), qty(1, 'in', 'length'))).toBe(true);
    expect(qeq(qty(1, 'mm', 'length'), qty(2, 'mm', 'length'))).toBe(false);
  });
  it('compare cross unit', () => {
    expect(qcompare(qty(1, 'in', 'length'), qty(10, 'mm', 'length'))).toBe(1);
  });
});
