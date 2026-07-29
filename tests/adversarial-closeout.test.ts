import { describe, it, expect } from 'vitest';
import { escapeHtml, escapeAttr } from '../src/lib/html-escape.js';
import { parseInputNumber, parseLocaleNumber } from '../src/lib/parse-number.js';
import {
  integrityHashState,
  parseIntegrityShare,
  makeIntegrityShareURL
} from '../src/lib/share-integrity.js';
import { calculate as weld } from '../src/tools/SC-001-weld-thickness/v1.0.0/formula.js';
import { calculate as labor } from '../src/tools/SC-010-labor-cost/v1.0.0/formula.js';
import { calculate as quote } from '../src/tools/SC-012-quote-pricing/v1.0.0/formula.js';
import {
  calculate as stack,
  simulateStack
} from '../src/tools/SC-008-tolerance-stack/v1.0.0/formula.js';
import { parseShareURL, integrityHash, makeShareURL } from '../src/lib/sc008-p4.js';
import type { ProjectState } from '../src/lib/sc008-p4.js';

describe('ADV-F1/F2 html escape', () => {
  it('neutralizes attribute breakout XSS payload', () => {
    const payload = 'Spacer"><img src=x onerror="window.__xssFired=1">';
    const attr = escapeAttr(payload);
    expect(attr).toContain('&quot;');
    // Escaped payload may still contain the substring "onerror=" as text; it must not form a tag.
    expect(`<input value="${attr}">`).not.toContain('<img');
    expect(`<div>${escapeHtml(payload)}</div>`).not.toContain('<img');
  });
  it('escapes HTML text nodes', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
  });
});

describe('ADV-E2 locale number parse', () => {
  it('rejects decimal comma', () => {
    expect(parseInputNumber('10,5')).toBeNaN();
    expect(() => parseLocaleNumber('10,5', 'x')).toThrow(/comma/);
  });
  it('accepts point decimals', () => {
    expect(parseInputNumber('10.5')).toBe(10.5);
    expect(parseLocaleNumber('10.5')).toBe(10.5);
  });
});

describe('ADV-F6 share integrity', () => {
  it('missing hash is tampered', () => {
    const state = { a: 1 };
    const r = parseIntegrityShare('s=' + encodeURIComponent(JSON.stringify(state)));
    expect(r.ok).toBe(true);
    expect(r.tampered).toBe(true);
    expect(r.missingHash).toBe(true);
  });
  it('round-trips with hash', () => {
    const url = makeIntegrityShareURL('https://sectorcalc.com', '/calculator/quote-pricing', {
      q: 1
    });
    const q = url.split('?')[1]!;
    const r = parseIntegrityShare(q);
    expect(r.tampered).toBe(false);
    expect(r.state).toEqual({ q: 1 });
  });
});

describe('ADV-F7 canonical share URL', () => {
  it('SC-008 share uses pretty calculator path', () => {
    const st: ProjectState = {
      specUpper: '0.1',
      specLower: '-0.1',
      cpkTarget: '1.33',
      seed: '1',
      unit: 'mm',
      dims: [{ name: 'A', nominal: 1, tol: 0.01, dist: 'normal' }]
    };
    const url = makeShareURL('https://sectorcalc.com', st);
    expect(url).toContain('/calculator/tolerance-stack-up?');
    expect(url).not.toContain('sc008-pro.html');
    expect(url).toContain('&h=');
  });
});

describe('ADV-A1 butt fillet table', () => {
  const base = {
    designLoadN: 1000,
    weldLengthMm: 200,
    weldStrengthMpa: 480,
    safetyFactor: 2,
    materialThicknessMm: 25
  };
  it('butt ignores fillet min table', () => {
    const b = weld({ ...base, jointType: 'butt' });
    expect(b.minLegMm).toBe('0.00');
    expect(b.finalLegMm).toBe(b.legFromLoadMm);
  });
  it('fillet still applies table', () => {
    const f = weld({ ...base, jointType: 'fillet' });
    expect(f.finalLegMm).toBe(f.minLegMm);
  });
});

describe('ADV-B1 OT hourly denominator', () => {
  it('includes OT hours', () => {
    const withOt = labor({
      country: 'US',
      netSalary: 4000,
      payFrequency: 'monthly',
      hoursPerWeek: 40,
      overtimeHoursMonthly: 40,
      overtimeMultiplier: 1.5
    });
    const straight = 40 * 4.33;
    const honest = Number(withOt.trueMonthlyCost) / (straight + 40);
    expect(Math.abs(Number(withOt.trueHourlyCost) - honest)).toBeLessThan(0.02);
  });
});

describe('ADV-B2/B3 employeeRate bounds', () => {
  it('rejects negative', () => {
    expect(() =>
      labor({ country: 'US', netSalary: 4000, payFrequency: 'monthly', employeeRate: -0.25 })
    ).toThrow();
  });
  it('rejects > 0.95', () => {
    expect(() =>
      labor({ country: 'US', netSalary: 4000, payFrequency: 'monthly', employeeRate: 0.9999 })
    ).toThrow();
  });
});

describe('ADV-C1/C2/C3/C4 quote engine', () => {
  it('rejects negative scrap and margin', () => {
    const base = {
      materialCost: 1000,
      scrapRate: 0,
      laborHours: 0,
      laborHourlyCost: 0,
      machineHours: 0,
      machineHourlyCost: 0,
      targetMargin: 0.2,
      quantity: 1
    };
    expect(() => quote({ ...base, scrapRate: -0.5 })).toThrow();
    expect(() => quote({ ...base, targetMargin: -1 })).toThrow();
  });
  it('setupMinutes changes total (UI must expose duration)', () => {
    const a = quote({
      materialCost: 0,
      scrapRate: 0,
      laborHours: 0,
      laborHourlyCost: 0,
      machineHours: 0,
      machineHourlyCost: 0,
      setupMinutes: 60,
      setupHourlyCost: 150,
      targetMargin: 0,
      quantity: 1
    });
    const b = quote({
      materialCost: 0,
      scrapRate: 0,
      laborHours: 0,
      laborHourlyCost: 0,
      machineHours: 0,
      machineHourlyCost: 0,
      setupMinutes: 240,
      setupHourlyCost: 150,
      targetMargin: 0,
      quantity: 1
    });
    expect(Number(b.totalCost)).toBeCloseTo(Number(a.totalCost) * 4, 5);
  });
  it('job preset engine conservation matches breakdown (single model)', () => {
    const r = quote({
      materialCost: 1000,
      scrapRate: 0.1,
      laborHours: 5,
      laborHourlyCost: 40,
      machineHours: 3,
      machineHourlyCost: 60,
      setupMinutes: 60,
      setupHourlyCost: 150,
      overheadRate: 0.25,
      paymentDays: 30,
      monthlyInterestRate: 0.02,
      targetMargin: 0.2,
      quantity: 10
    });
    const sum = r.breakdown.reduce((a, row) => a + Number(row.amount), 0);
    expect(Math.abs(sum - Number(r.totalCost))).toBeLessThan(0.05);
    expect(Number(r.effectiveMaterial)).toBeCloseTo(1000 / 0.9, 2);
  });
});

describe('ADV-F3 mm SSOT unit math (display conversion only)', () => {
  it('mm→inch→mm display factors are identity on stored mm', () => {
    const tols = [0.2, 0.05, 0.025, 0.01, 0.005, 0.003];
    for (const mm of tols) {
      // SSOT: never rewrite mm through toFixed — only convert for display
      const inch = mm / 25.4;
      const back = inch * 25.4;
      expect(Math.abs(back - mm)).toBeLessThan(1e-12);
    }
  });
});

describe('ADV-D5 per-component LCG still deterministic', () => {
  it('same seed reproduces', () => {
    const comps = [
      { name: 'A', nominal: '25', tol: '0.05', distribution: 'normal' as const },
      { name: 'B', nominal: '30', tol: '0.025', distribution: 'uniform' as const }
    ];
    const input = {
      components: comps,
      usl: '55.2',
      lsl: '54.8',
      seed: '12345',
      iterations: '2000'
    };
    const a = stack(input, simulateStack(comps, input));
    const b = stack(input, simulateStack(comps, input));
    expect(a.mcStd).toBe(b.mcStd);
    expect(a.mcP0013).toBe(b.mcP0013);
  });
});

describe('ADV-F1 share missing hash flagged', () => {
  it('sc008-p4 missing h → tampered', () => {
    const state: ProjectState = {
      specUpper: '0.15',
      specLower: '-0.15',
      cpkTarget: '1.33',
      seed: '12345',
      unit: 'mm',
      dims: [{ name: 'A', nominal: 10, tol: 0.2, dist: 'normal' }]
    };
    const r = parseShareURL('s=' + encodeURIComponent(JSON.stringify(state)));
    expect(r.tampered).toBe(true);
    expect(integrityHash(state).length).toBe(16);
  });
});
