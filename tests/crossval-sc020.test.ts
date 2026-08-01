import { describe, it, expect } from 'vitest';
import { calculate as officialCalc } from '../src/tools/SC-020-feeds-speeds/v1.0.0/formula.js';

/**
 * Cross-validation: official SC-020 formula.ts (Decimal, FS-ENGINE v1.0.0)
 * vs the LIVE inline engine embedded in machining-pro.html (FS-ENGINE v2.1.0,
 * plain floats). Both are evaluated on identical inputs.
 */

// Defaults on the live page (material 0-1 = medium-carbon steel C45/1045)
const PAGE = {
  materialId: 'P-1',
  D: 12,
  z: 4,
  L: 30,
  r: 0.8,
  Vc: 180,
  fz: 0.08,
  ap: 6,
  ae: 4,
  engAng: 0,
  nmax: 12000,
  pmax: 11,
  vfmax: 8000,
  eta: 0.85,
  tqmax: 95,
  taylorC: 420,
  taylorN: 0.25,
  targetT: 45,
  toolCost: 18,
  tChange: 3,
  mRate: 1.2,
  kCool: 1.0,
  kInt: 1.0,
  op: 'mill',
  substrate: 'carbide',
  shape: 'flat'
};

// Material constants — TWO variants:
// INLINE_PAGE = what the live page's MATS table uses for medium-carbon steel.
// OFFICIAL_P2 = what the official formula.ts reference.ts uses (P2).
const INLINE_MAT = {
  nm: 'Medium-carbon steel (C45 / 1045), HB 200',
  kc1: 1980,
  mc: 0.25,
  C: 420,
  n: 0.25
};
const OFFICIAL_P2 = {
  nm: 'Medium-carbon steel (C 0.25-0.55%)',
  kc1: 2100,
  mc: 0.25,
  C: 240,
  n: 0.25
};

/** Faithful re-implementation of the LIVE inline engine (machining-pro.html). */
function inlineEngine(p: typeof PAGE, m: typeof INLINE_MAT) {
  const Deff =
    p.shape === 'ball' && p.op !== 'turn'
      ? (() => {
          const R = p.D / 2;
          const a = Math.min(p.ap, R);
          return 2 * Math.sqrt(Math.max(R * R - (R - a) * (R - a), 0.0001));
        })()
      : p.D;
  const n = (1000 * p.Vc) / (Math.PI * Deff);
  const nEff = Math.min(n, p.nmax);
  const VcEff = (nEff * Math.PI * Deff) / 1000;

  let hm = p.fz;
  if (p.op === 'mill' || p.op === 'face') {
    if (p.engAng > 0) {
      hm = p.fz * Math.sin((p.engAng * Math.PI) / 180);
    } else if (p.ae / p.D < 0.5) {
      const ratio = p.ae / p.D;
      const cf = 2 * Math.sqrt(ratio * (1 - ratio));
      hm = p.fz * cf;
    }
  }
  const vf = p.fz * p.z * nEff;
  const MRR = p.op === 'drill' ? (Math.PI * (p.D / 2) ** 2 * vf) / 1000 : (p.ap * p.ae * vf) / 1000;
  const h = Math.max(hm, 0.01);
  const kc = m.kc1 * h ** -m.mc;
  const Pc = (kc * MRR) / 60000;
  const Psp = Pc / p.eta;
  const M = (Pc * 9550) / Math.max(nEff, 1);
  const pUtil = (Psp / p.pmax) * 100;
  const tqUtil = (M / p.tqmax) * 100;
  const Traw = (m.C / VcEff) ** (1 / p.taylorN);
  const T = Traw * p.kCool * p.kInt;
  const Fc = Pc > 0 ? (Pc * 60000) / VcEff : 0;
  const E = p.substrate === 'carbide' ? 580000 : 200000;
  const I = (Math.PI * p.D ** 4) / 64;
  const delta = (Fc * p.L ** 3) / (3 * E * I);
  const fRev = p.op === 'turn' ? p.fz : p.fz * p.z;
  const Ra = p.r > 0 ? (32 * fRev * fRev) / p.r : NaN;
  const TeconRaw = (1 / p.taylorN - 1) * (p.toolCost / p.mRate + p.tChange);
  const TeconCorr = TeconRaw * p.kCool * p.kInt;
  const Vecon = m.C * TeconRaw ** -p.taylorN;
  const costNow = p.mRate + (p.toolCost + p.tChange * p.mRate) / T;
  const costEco = p.mRate + (p.toolCost + p.tChange * p.mRate) / TeconCorr;
  const savings = (1 - costEco / costNow) * 100;
  return {
    n,
    nEff,
    VcEff,
    vf,
    MRR,
    kc,
    hm,
    Fc,
    Pc,
    Psp,
    M,
    pUtil,
    tqUtil,
    T,
    Traw,
    Vecon,
    delta,
    Ra,
    costNow,
    costEco,
    savings
  };
}

/** Official SC-020 formula.ts inputs (SI). */
function officialInputs(p: typeof PAGE) {
  return {
    materialId: 'P2',
    diameterMm: String(p.D),
    teeth: String(p.z),
    vcMPerMin: String(p.Vc),
    fzMm: String(p.fz),
    apMm: String(p.ap),
    aeMm: String(p.ae),
    spindleKw: String(p.pmax),
    spindleTorqueNm: String(p.tqmax),
    stickOutMm: String(p.L),
    noseRadiusMm: String(p.r),
    efficiency: String(p.eta),
    coolant: 'flood',
    interruption: 'continuous',
    toolCost: String(p.toolCost),
    machineCostPerMin: String(p.mRate),
    currency: 'USD'
  };
}

describe('SC-020 engine cross-validation: official vs live inline', () => {
  it('compares headline KPIs on page defaults (each engine, its own constants)', () => {
    const live = inlineEngine(PAGE, INLINE_MAT);
    const off = officialCalc(officialInputs(PAGE));
    const rows: Array<[string, string, string]> = [
      ['n (rpm)', String(live.nEff), off.nRpm],
      ['vf (mm/min)', String(live.vf), off.vfMmMin],
      ['hm (mm)', String(live.hm), off.hmMm],
      ['MRR (cm3/min)', String(live.MRR), off.mrrCm3Min],
      ['kc (N/mm2)', String(live.kc), off.kcNPerMm2],
      ['Fc (N)', String(live.Fc), off.fcN],
      ['Pc (kW)', String(live.Pc), off.powerKw],
      ['T (min)', String(live.T), off.toolLifeMin],
      ['delta (um)', String(live.delta * 1000), off.deflectionUm],
      ['Ra (um)', String(live.Ra), off.raUm],
      ['V_econ (m/min)', String(live.Vecon), off.gilbertVcMPerMin],
      ['savings (%)', String(live.savings), off.gilbertSavingsPct]
    ];
    console.log('KPI-as-deployed | inline (live page, own constants) | official (formula.ts, P2)');
    for (const [name, a, b] of rows) console.log(`${name.padEnd(16)} | ${a.padEnd(28)} | ${b}`);
  });

  it('isolates FORMULA differences with matched constants', () => {
    const live = inlineEngine(PAGE, OFFICIAL_P2); // inline formulas + official constants
    const off = officialCalc(officialInputs(PAGE));
    const hmLive = live.hm;
    const hmOff = parseFloat(off.hmMm);
    console.log('FORMULA-ONLY (matched constants)');
    console.log(
      `  hm  inline=${hmLive.toFixed(5)} vs official=${off.hmMm} (ratio ${(hmOff / hmLive).toFixed(3)})`
    );
    console.log(`  Fc  inline=${live.Fc.toFixed(1)} N vs official=${off.fcN} N`);
    console.log(`  Pc  inline=${live.Pc.toFixed(3)} kW vs official=${off.powerKw} kW`);
    console.log(`  T   inline=${live.T.toFixed(2)} min vs official=${off.toolLifeMin} min`);
    console.log(`  Vecon inline=${live.Vecon.toFixed(1)} vs official=${off.gilbertVcMPerMin}`);
    expect(Math.abs(hmOff / hmLive - 1)).toBeGreaterThan(0.15); // hm differs by >15%
    expect(Math.abs(parseFloat(off.powerKw) / live.Pc - 1)).toBeGreaterThan(0.15); // power differs >15%
  });

  it('documents the material-constant drift', () => {
    const pct = (a: number, b: number) => ((b - a) / a) * 100;
    console.log('CONSTANT DRIFT inline→official for medium-carbon steel:');
    console.log(
      `  kc1: ${INLINE_MAT.kc1} → ${OFFICIAL_P2.kc1}  (${pct(INLINE_MAT.kc1, OFFICIAL_P2.kc1).toFixed(0)}%)`
    );
    console.log(
      `  Taylor C: ${INLINE_MAT.C} → ${OFFICIAL_P2.C}  (${pct(INLINE_MAT.C, OFFICIAL_P2.C).toFixed(0)}%)`
    );
  });
});
