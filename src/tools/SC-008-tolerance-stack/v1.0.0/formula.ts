/**
 * SC-008 Statistical Tolerance Stack-Up — built ON the universal engine.
 * Version 1.0.0. Deterministic, full-Decimal, pure.
 * Three accumulation methods compared: worst-case, RSS, and seeded Decimal
 * Monte Carlo. Capability (Cp/Cpk), empirical defect ppm, and a contribution
 * pareto round out the analysis. Monte Carlo sampling is deterministic via a
 * seeded LCG (same seed -> identical distribution -> reproducible report).
 */
import { D, Decimal } from '../../../core/engine.js';
import { CalcError } from '../../../core/guards.js';
import { roundHalfUp } from '../../../core/rounding.js';
import { tol, worstCaseSum, rssSum } from '../../../core/tolerance.js';
import { mean as statsMean, stddev as statsStddev, percentile } from '../../../core/stats.js';
import { lcg, sampleNormal, sampleUniform } from '../../../core/monte-carlo.js';

const PLACES = 4;
function num(d: Decimal): string { return roundHalfUp(d, PLACES).toFixed(PLACES); }

export interface Component {
  name: string;
  nominal: Decimal.Value;
  tol: Decimal.Value;
  distribution: 'normal' | 'uniform';
  cpk?: Decimal.Value;
}

export interface StackInput {
  components: Component[];
  usl: Decimal.Value;
  lsl: Decimal.Value;
  target?: Decimal.Value;
  seed?: number;
  iterations?: number;
}

export interface ParetoRow { name: string; pct: string; }
export interface Step { step: number; description: string; formula: string; result: string; }
export interface StackResult {
  nominalSum: string;
  worstPlus: string;
  rssPlus: string;
  mcMean: string;
  mcStd: string;
  mcMin: string;
  mcMax: string;
  mcP0013: string;
  mcP9987: string;
  cp: string;
  cpk: string;
  ppm: string;
  pareto: ParetoRow[];
  iterations: number;
  seed: number;
  steps: Step[];
}

function normalStd(t: Decimal, cpk: Decimal | null): Decimal {
  const k = cpk !== null && cpk.gt(0) ? cpk.times(3) : D(3);
  return t.div(k);
}

export function simulateStack(components: Component[], input: StackInput): Decimal[] {
  const iterations = input.iterations ?? 5000;
  if (iterations < 1) throw new CalcError('E_INVALID_INPUT', 'iterations must be >= 1');
  const seed = input.seed ?? 12345;
  const rng = lcg(seed);
  const out: Decimal[] = [];
  for (let i = 0; i < iterations; i++) {
    let sum = D(0);
    for (const c of components) {
      const nom = D(c.nominal);
      const t = D(c.tol);
      if (t.lt(0)) throw new CalcError('E_NEGATIVE', `tol of ${c.name} must be >= 0`);
      if (c.distribution === 'uniform') {
        sum = sum.plus(sampleUniform(rng, nom.minus(t), nom.plus(t)));
      } else {
        const cpk = c.cpk !== undefined && c.cpk !== null ? D(c.cpk) : null;
        sum = sum.plus(sampleNormal(rng, nom, normalStd(t, cpk)));
      }
    }
    out.push(sum);
  }
  return out;
}

export function calculate(input: StackInput, samples?: Decimal[]): StackResult {
  const steps: Step[] = [];
  let n = 0;
  const components = input.components;
  if (!components || components.length === 0) throw new CalcError('E_INVALID_INPUT', 'stack needs >= 1 component');
  const usl = D(input.usl);
  const lsl = D(input.lsl);
  if (usl.lte(lsl)) throw new CalcError('E_INVALID_INPUT', 'USL must be > LSL');

  // 1. worst-case + RSS (tolerance.ts)
  const tols = components.map((c) => tol(c.nominal, c.tol, c.tol));
  const worst = worstCaseSum(tols);
  const rss = rssSum(tols);
  steps.push({ step: ++n, description: 'Worst-case stack', formula: 'sum(tol)', result: num(worst.plus) });
  steps.push({ step: ++n, description: 'RSS stack', formula: 'sqrt(sum(tol^2))', result: num(rss.plus) });

  // 2. Monte Carlo (seeded Decimal); optional samples avoids a second simulation in the UI.
  const iterations = input.iterations ?? 5000;
  const seed = input.seed ?? 12345;
  const usedSamples = samples ?? simulateStack(components, input);
  const sorted = usedSamples.slice().sort((a, b) => a.cmp(b));
  const mean = statsMean(usedSamples);
  const std = statsStddev(usedSamples);
  // iterations >= 1 and components.length >= 1 are guarded above; ! is safe.
  const min = sorted[0]!;
  const max = sorted[sorted.length - 1]!;
  const p0013 = percentile(usedSamples, '0.0013');
  const p9987 = percentile(usedSamples, '0.9987');
  steps.push({ step: ++n, description: `Monte Carlo (${iterations} runs, seed ${seed})`, formula: 'seeded LCG + inverse-CDF', result: `mean ${num(mean)}, std ${num(std)}` });

  // 3. capability
  const cp = std.gt(0) ? usl.minus(lsl).div(std.times(6)) : D(0);
  const cpu = std.gt(0) ? usl.minus(mean).div(std.times(3)) : D(0);
  const cpl = std.gt(0) ? mean.minus(lsl).div(std.times(3)) : D(0);
  const cpk = cpu.lt(cpl) ? cpu : cpl;
  steps.push({ step: ++n, description: 'Capability', formula: 'Cp=(USL-LSL)/6s, Cpk=min(CPU,CPL)', result: `Cp ${num(cp)}, Cpk ${num(cpk)}` });

  // 4. empirical defect ppm (no CDF needed)
  let outCount = 0;
  for (const s of usedSamples) if (s.gt(usl) || s.lt(lsl)) outCount++;
  const ppm = D(outCount).div(usedSamples.length).times(D('1000000'));
  steps.push({ step: ++n, description: 'Empirical defect rate', formula: 'out-of-spec / runs * 1e6', result: `${num(ppm)} ppm` });

  // 5. contribution pareto (RSS-based)
  const totalSq = tols.reduce((acc, t) => acc.plus(t.plus.pow(2)), D(0));
  const pareto: ParetoRow[] = components
    .map((c, i) => ({ name: c.name, pct: totalSq.gt(0) ? D(tols[i]!.plus).pow(2).div(totalSq).times(100) : D(0) }))
    .sort((a, b) => b.pct.cmp(a.pct))
    .map((r) => ({ name: r.name, pct: roundHalfUp(r.pct, 1).toFixed(1) }));

  return {
    nominalSum: num(worst.nominal),
    worstPlus: num(worst.plus),
    rssPlus: num(rss.plus),
    mcMean: num(mean),
    mcStd: num(std),
    mcMin: num(min),
    mcMax: num(max),
    mcP0013: num(p0013),
    mcP9987: num(p9987),
    cp: num(cp),
    cpk: num(cpk),
    ppm: num(ppm),
    pareto,
    iterations,
    seed,
    steps
  };
}
