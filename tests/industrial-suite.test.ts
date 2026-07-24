import { describe, expect, it } from 'vitest';
import { Decimal } from '../src/core/engine.js';
import { CanonicalInput, fnv1a, stableStringify, unitOption } from '../src/industrial-suite/engine.js';
import { INDUSTRIAL_TOOLS } from '../src/industrial-suite/registry.js';

function defaultInput(code: string): CanonicalInput {
  const tool = INDUSTRIAL_TOOLS.find((x) => x.code === code);
  if (!tool) throw new Error(`missing ${code}`);
  const values: Record<string, Decimal|string> = {};
  const display: Record<string,string> = {};
  const units: Record<string,string> = {};
  for (const field of tool.fields) {
    if (field.kind === 'select') {
      values[field.id] = field.defaultValue;
      display[field.id] = field.defaultValue;
      units[field.id] = '—';
    } else {
      const raw = new Decimal(field.defaultValue);
      const u = unitOption(field.family, field.defaultUnit);
      values[field.id] = u.toBase(raw);
      display[field.id] = `${field.defaultValue} ${u.label}`;
      units[field.id] = field.defaultUnit;
    }
  }
  return { values, display, units };
}

function outputSignature(code: string): string {
  const tool = INDUSTRIAL_TOOLS.find((x) => x.code === code);
  if (!tool) throw new Error(`missing ${code}`);
  const result = tool.calculate(defaultInput(code));
  const out = Object.fromEntries(result.outputs.map((x) => [x.id, x.value instanceof Decimal ? x.value.toString() : x.value]));
  return fnv1a(stableStringify(out));
}

describe('Industrial suite registry', () => {
  it('contains all 15 formerly planned tools with unique codes/slugs', () => {
    expect(INDUSTRIAL_TOOLS).toHaveLength(15);
    expect(new Set(INDUSTRIAL_TOOLS.map((x) => x.code)).size).toBe(15);
    expect(new Set(INDUSTRIAL_TOOLS.map((x) => x.slug)).size).toBe(15);
  });

  for (const tool of INDUSTRIAL_TOOLS) {
    it(`${tool.code} default case is deterministic and finite`, () => {
      const input = defaultInput(tool.code);
      const a = tool.calculate(input);
      const b = tool.calculate(input);
      expect(a.warnings.filter((x) => x.severity === 'error')).toHaveLength(0);
      expect(a.outputs.length).toBeGreaterThan(3);
      expect(outputSignature(tool.code)).toBe(outputSignature(tool.code));
      expect(a.outputs.map((x) => x.value instanceof Decimal ? x.value.toString() : x.value))
        .toEqual(b.outputs.map((x) => x.value instanceof Decimal ? x.value.toString() : x.value));
      for (const row of a.outputs) if (row.value instanceof Decimal) expect(row.value.isFinite()).toBe(true);
    });
  }
});
