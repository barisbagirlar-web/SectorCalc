import { performance } from 'node:perf_hooks';
import { D, Decimal } from '../src/core/engine.js';
import { calculate, simulateStack } from '../src/tools/SC-008-tolerance-stack/v1.0.0/formula.js';
import { lcg, sampleNormal, sampleUniform, sampleTruncatedNormal, sampleTriangular } from '../src/core/monte-carlo.js';

const MC_RUNS = 10000;

function sampleComponent(rng, c) {
  const nom = D(c.nominal), tol = D(c.tol ?? c.tolerance);
  if (c.dist === 'uniform') return sampleUniform(rng, nom.minus(tol), nom.plus(tol));
  if (c.dist === 'triangular') return sampleTriangular(rng, nom.minus(tol), nom, nom.plus(tol));
  if (c.dist === 'truncated_normal') return sampleTruncatedNormal(rng, nom, tol.div(3), nom.minus(tol), nom.plus(tol));
  return sampleNormal(rng, nom, tol.div(3));
}
function mySimulate(comps, seed, n) {
  const rng = lcg(seed);
  const out = [];
  for (let i = 0; i < n; i++) {
    let s = D(0);
    for (const c of comps) s = s.plus(sampleComponent(rng, c));
    out.push(s);
  }
  return out;
}

const dims = [
  { name: 'A', nominal: '10.000', tol: '0.050', dist: 'normal' },
  { name: 'B', nominal: '20.000', tol: '0.080', dist: 'normal' },
  { name: 'C', nominal: '5.000', tol: '0.030', dist: 'truncated_normal' }
];

const stackInput = {
  components: dims.map((d) => ({ name: d.name, nominal: d.nominal, tol: d.tol, distribution: d.dist })),
  usl: 35.13,
  lsl: 34.87,
  seed: 12345,
  iterations: MC_RUNS
};

const t0 = performance.now();
const samples = mySimulate(dims, 12345, MC_RUNS);
const t1 = performance.now();
const result = calculate(stackInput, samples);
const t2 = performance.now();
console.log(`mySimulate(10000): ${Math.round(t1 - t0)}ms`);
console.log(`calculate(+samples): ${Math.round(t2 - t1)}ms`);
console.log(`TOTAL: ${Math.round(t2 - t0)}ms`);

// Simulate what generateReport does: 3 what-if simulations on top.
const pareto = result.pareto.slice(0, 3);
const t3 = performance.now();
for (const p of pareto) {
  const tighter = stackInput.components.map((c) => (c.name === p.name ? { ...c, tol: Number(c.tol) * 0.9 } : c));
  const s = mySimulate(tighter.map((c) => ({ name: c.name, nominal: c.nominal, tol: String(c.tol), dist: c.distribution })), 12345, MC_RUNS);
  calculate({ ...stackInput, components: tighter }, s);
}
const t4 = performance.now();
console.log(`3x what-if (simulate+calculate): ${Math.round(t4 - t3)}ms`);
console.log(`FULL generateReport engine cost: ${Math.round(t4 - t0)}ms`);

// Also time the stats core: sort + percentile (heaviest part of calculate)
const t5 = performance.now();
const sorted = samples.slice().sort((a, b) => a.cmp(b));
const t6 = performance.now();
console.log(`sort 10000 Decimals: ${Math.round(t6 - t5)}ms`);
