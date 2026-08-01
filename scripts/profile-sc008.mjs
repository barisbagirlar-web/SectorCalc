import { performance } from 'node:perf_hooks';
import { D, Decimal } from '../src/core/engine.js';
import { lcg, sampleNormal, sampleUniform, sampleTruncatedNormal, sampleTriangular } from '../src/core/monte-carlo.js';

const MC_RUNS = 10000;

// Mimic sc008-pro.ts mySimulate + sampleComponent
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

// A typical 3-dimension stack (like the standard preset).
const dims = [
  { name: 'A', nominal: '10.000', tol: '0.050', dist: 'normal' },
  { name: 'B', nominal: '20.000', tol: '0.080', dist: 'normal' },
  { name: 'C', nominal: '5.000', tol: '0.030', dist: 'truncated_normal' }
];

for (let run = 0; run < 3; run++) {
  const t0 = performance.now();
  const samples = mySimulate(dims, 12345, MC_RUNS);
  const t1 = performance.now();
  console.log(`mySimulate n=${MC_RUNS} dims=${dims.length} run=${run}: ${Math.round(t1 - t0)}ms (${((t1 - t0) / MC_RUNS).toFixed(4)}ms/sample)`);
}

// Measure invNormCdf cost alone
import { invNormCdf } from '../src/core/monte-carlo.js';
const rng = lcg(99);
const t2 = performance.now();
for (let i = 0; i < 10000; i++) invNormCdf(rng());
const t3 = performance.now();
console.log(`invNormCdf x10000: ${Math.round(t3 - t2)}ms`);

// What does the browser Decimal do per sample? Measure a single sampleNormal chain.
const rng2 = lcg(7);
const t4 = performance.now();
for (let i = 0; i < 10000; i++) sampleNormal(rng2, '10.000', '0.016667');
const t5 = performance.now();
console.log(`sampleNormal x10000: ${Math.round(t5 - t4)}ms`);

// And truncated-normal rejection (worst case: how many rejections?)
let acceptTotal = 0;
const rng3 = lcg(5);
for (let i = 0; i < 10000; i++) {
  let acc = 0;
  for (let j = 0; j < 1000; j++) {
    const x = sampleNormal(rng3, '10.000', '0.016667');
    acc++;
    if (x.gte('9.95') && x.lte('10.05')) { break; }
  }
  acceptTotal += acc;
}
console.log(`truncated-normal avg accept iterations: ${(acceptTotal / 10000).toFixed(1)}`);
