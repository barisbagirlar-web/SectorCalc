import { describe, it, expect } from 'vitest';
import { UNIT_FAMILIES } from '../src/industrial-suite/engine.js';
import { D } from '../src/core/engine.js';

describe('unit round-trip drift guard (P1)', () => {
  const probe = D('123.4567890123456789012345678901234');
  for (const [familyName, family] of Object.entries(UNIT_FAMILIES)) {
    for (const unit of family.units) {
      it(`${familyName} :: ${unit.label} round-trip`, () => {
        const base = unit.toBase(probe);
        const back = unit.fromBase(base);
        expect(back.minus(probe).abs().lte('1e-30')).toBe(true);
      });
    }
  }
});
