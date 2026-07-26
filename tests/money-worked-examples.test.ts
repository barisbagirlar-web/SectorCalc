/**
 * Worked-example fixtures must match production TS engines (no second math stack).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { calculate as calcStack, simulateStack } from '../src/tools/SC-008-tolerance-stack/v1.0.0/formula.js';
import { calculate as calcLabor } from '../src/tools/SC-010-labor-cost/v1.0.0/formula.js';
import { calculate as calcQuote } from '../src/tools/SC-012-quote-pricing/v1.0.0/formula.js';
import { calculate as calcOee } from '../src/tools/SC-014-oee/v1.0.0/formula.js';
import { calculate as calcMachining } from '../src/tools/SC-020-feeds-speeds/v1.0.0/formula.js';

function load(entity: string) {
  return JSON.parse(readFileSync(join(process.cwd(), 'seo/worked-examples', `${entity}.json`), 'utf8'));
}

describe('money worked-example fixtures ↔ production engines', () => {
  it('tolerance-stack-up', () => {
    const fx = load('tolerance-stack-up');
    const samples = simulateStack(fx.inputs.components, fx.inputs);
    const r = calcStack(fx.inputs, samples);
    expect(r.worstPlus).toBe(fx.outputs.worstPlus);
    expect(r.rssPlus).toBe(fx.outputs.rssPlus);
    expect(r.cpk).toBe(fx.outputs.cpk);
  });

  it('true-labor-cost', () => {
    const fx = load('true-labor-cost');
    const r = calcLabor(fx.inputs);
    expect(r.trueMonthlyCost).toBe(fx.outputs.trueMonthlyCost);
    expect(r.trueHourlyCost).toBe(fx.outputs.trueHourlyCost);
  });

  it('quote-pricing', () => {
    const fx = load('quote-pricing');
    const r = calcQuote(fx.inputs);
    expect(r.sellPrice).toBe(fx.outputs.sellPrice);
    expect(r.unitPrice).toBe(fx.outputs.unitPrice);
  });

  it('oee-teep', () => {
    const fx = load('oee-teep');
    const r = calcOee(fx.inputs);
    expect(r.oeePct).toBe(fx.outputs.oeePct);
  });

  it('cnc-feeds-speeds', () => {
    const fx = load('cnc-feeds-speeds');
    const r = calcMachining(fx.inputs);
    expect(r.nRpm).toBe(fx.outputs.nRpm);
    expect(r.vfMmMin).toBe(fx.outputs.vfMmMin);
  });
});
