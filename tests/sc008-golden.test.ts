import { describe, it, expect } from 'vitest';
import { calculate, simulateStack } from '../src/tools/SC-008-tolerance-stack/v1.0.0/formula.js';
import { D } from '../src/core/engine.js';

// Golden benchmarks: closed-form expected values. These pin the single engine
// so the UI, PDF and share link can never silently drift from the tested math.
function run(components: {name:string;nominal:number;tol:number}[], usl:number, lsl:number, seed=1) {
  const input = { components: components.map(c => ({ name:c.name, nominal:String(c.nominal), tol:String(c.tol), distribution:'normal' as const })), usl:String(usl), lsl:String(lsl), seed:String(seed), iterations:'2000' };
  const samples = simulateStack(input.components, input);
  return calculate(input, samples);
}

describe('SC-008 golden benchmarks', () => {
  it('GB1 closed-form worst & RSS for two components', () => {
    const r = run([{name:'A',nominal:10,tol:0.2},{name:'B',nominal:20,tol:0.3}], 31.5, 28.5);
    expect(r.worstPlus).toBe('0.5000');                                   // 0.2 + 0.3
    expect(D(r.rssPlus).minus(D('0.3606')).abs().lt('0.001')).toBe(true); // sqrt(0.04+0.09)
  });

  it('GB2 wide spec -> predicted capable', () => {
    const r = run([{name:'A',nominal:10,tol:0.1},{name:'B',nominal:20,tol:0.1}], 32, 28);
    expect(Number(r.cpk)).toBeGreaterThan(1.33);
  });

  it('GB3 tight spec -> predicted not capable', () => {
    const r = run([{name:'A',nominal:10,tol:0.2},{name:'B',nominal:20,tol:0.3}], 30.1, 29.9);
    expect(Number(r.cpk)).toBeLessThan(1);
  });

  it('GB4 nominal-sum != 0 is handled (the old inline-engine bug)', () => {
    // nominal sum = 30; absolute limits built around 30, NOT compared against 0.3.
    const r = run([{name:'P',nominal:50,tol:0.1},{name:'Q',nominal:-20,tol:0.1}], 30.3, 29.7);
    expect(r.worstPlus).toBe('0.2000');
    expect(D(r.rssPlus).minus(D('0.1414')).abs().lt('0.001')).toBe(true); // sqrt(0.01+0.01)
    expect(Number(r.cpk)).toBeGreaterThan(1);                            // would be CRITICAL under the bug
  });

  it('GB5 deterministic: same seed -> identical Monte Carlo std', () => {
    const a = run([{name:'A',nominal:10,tol:0.2},{name:'B',nominal:20,tol:0.3}], 31.5, 28.5, 42);
    const b = run([{name:'A',nominal:10,tol:0.2},{name:'B',nominal:20,tol:0.3}], 31.5, 28.5, 42);
    expect(a.mcStd).toBe(b.mcStd);
    expect(a.pareto.map(p=>p.pct).join(',')).toBe(b.pareto.map(p=>p.pct).join(','));
  });
});
