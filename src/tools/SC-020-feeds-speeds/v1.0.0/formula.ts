/**
 * SC-020 CNC Feeds & Speeds + Tool Life - FS-ENGINE SI core.
 * Version 1.0.0. Deterministic, Decimal-only, pure.
 * Constants are reference-grade mid-band; calibrate to supplier datasheets for contract work.
 */
import { D, Decimal, CalcError } from '../../../core/engine.js';
import { requirePositive, requireNonNegative, requireInRange } from '../../../core/guards.js';
import { fix } from '../../../core/engine.js';
import {
  FS_ENGINE_VERSION,
  FS_ENGINE_BUILD_DATE,
  FS_ENGINE_ID,
  integrityHash
} from '../../../core/fs-engine.js';
import {
  MATERIALS,
  COOLANT_FACTORS,
  INTERRUPTION_FACTORS
} from './reference.js';

const PI = D('3.1415926535897932384626433832795');

export interface MachiningInputs {
  /** Material id from ISO 513 table. */
  materialId: string;
  /** Tool diameter, mm (SI). */
  diameterMm: Decimal.Value;
  /** Number of teeth / flutes. */
  teeth: Decimal.Value;
  /** Cutting speed, m/min (SI). */
  vcMPerMin: Decimal.Value;
  /** Feed per tooth, mm (SI). */
  fzMm: Decimal.Value;
  /** Axial depth of cut, mm. */
  apMm: Decimal.Value;
  /** Radial width of cut, mm. */
  aeMm: Decimal.Value;
  /** Spindle available power, kW. */
  spindleKw: Decimal.Value;
  /** Spindle max torque, N·m. */
  spindleTorqueNm: Decimal.Value;
  /** Stick-out / overhang length, mm. */
  stickOutMm: Decimal.Value;
  /** Nose / corner radius, mm. */
  noseRadiusMm: Decimal.Value;
  /** Machine efficiency 0-1. */
  efficiency: Decimal.Value;
  /** Coolant key. */
  coolant: string;
  /** Interruption key. */
  interruption: string;
  /** Tool cost (currency units). */
  toolCost: Decimal.Value;
  /** Machine cost per minute. */
  machineCostPerMin: Decimal.Value;
  /** Currency symbol only (no FX). */
  currency: string;
  /** Young modulus override MPa (optional). */
  youngModulusMPa?: Decimal.Value;
}

export interface Step {
  step: number;
  description: string;
  formula: string;
  result: string;
}

export type Verdict = 'RELEASED TO PRODUCTION' | 'RUN WITH CAUTION' | 'DO NOT RUN';

export interface MachiningResult {
  engineId: string;
  engineVersion: string;
  buildDate: string;
  materialName: string;
  isoGroup: string;
  nRpm: string;
  vfMmMin: string;
  hmMm: string;
  fzCompMm: string;
  vfCompMmMin: string;
  engagementDeg: string;
  mrrCm3Min: string;
  toolLifeMin: string;
  kcNPerMm2: string;
  fcN: string;
  powerKw: string;
  torqueNm: string;
  powerUtilPct: string;
  torqueUtilPct: string;
  deflectionUm: string;
  raUm: string;
  gilbertVcMPerMin: string;
  gilbertSavingsPct: string;
  costPerPartIndex: string;
  verdict: Verdict;
  integrity: string;
  steps: Step[];
  assumptions: string[];
}

function engagementAngleRad(ae: Decimal, Dtool: Decimal): Decimal {
  // phi = acos(1 - 2*ae/D) for ae <= D; full slot = pi
  if (ae.gte(Dtool)) return PI;
  const ratio = ae.div(Dtool);
  const arg = D(1).minus(ratio.times(2));
  const clamped = arg.gt(1) ? D(1) : arg.lt(-1) ? D(-1) : arg;
  // Decimal.js has acos via Number fallback for transcendental - keep deterministic via Number for acos only
  const n = Number(clamped.toString());
  if (!Number.isFinite(n)) throw new CalcError('E_DOMAIN', 'engagement angle domain error');
  return D(Math.acos(n).toString());
}

export function calculate(inputs: MachiningInputs): MachiningResult {
  const steps: Step[] = [];
  let n = 0;

  const mat = MATERIALS[inputs.materialId];
  if (!mat) throw new CalcError('E_INVALID_INPUT', `unknown material: ${inputs.materialId}`, 'SC-020');

  const diam = requirePositive(inputs.diameterMm, 'diameterMm');
  const teeth = requirePositive(inputs.teeth, 'teeth');
  if (!teeth.isInteger()) throw new CalcError('E_INVALID_INPUT', 'teeth must be an integer', 'SC-020');
  const vc = requirePositive(inputs.vcMPerMin, 'vcMPerMin');
  const fz = requirePositive(inputs.fzMm, 'fzMm');
  const ap = requirePositive(inputs.apMm, 'apMm');
  const ae = requirePositive(inputs.aeMm, 'aeMm');
  if (ae.gt(diam)) throw new CalcError('E_OUT_OF_RANGE', 'aeMm must be <= diameterMm', 'SC-020');
  const spindleKw = requirePositive(inputs.spindleKw, 'spindleKw');
  const spindleTq = requirePositive(inputs.spindleTorqueNm, 'spindleTorqueNm');
  const stick = requirePositive(inputs.stickOutMm, 'stickOutMm');
  const re = requirePositive(inputs.noseRadiusMm, 'noseRadiusMm');
  const eta = requireInRange(inputs.efficiency, '0.3', '1', 'efficiency');
  const toolCost = requireNonNegative(inputs.toolCost, 'toolCost');
  const cm = requirePositive(inputs.machineCostPerMin, 'machineCostPerMin');

  const coolKey = inputs.coolant in COOLANT_FACTORS ? inputs.coolant : 'flood';
  const intKey = inputs.interruption in INTERRUPTION_FACTORS ? inputs.interruption : 'continuous';
  const fCool = D(COOLANT_FACTORS[coolKey]);
  const fInt = D(INTERRUPTION_FACTORS[intKey]);

  const kc1 = D(mat.kc1);
  const mc = D(mat.mc);
  const C = D(mat.taylorC);
  const tn = D(mat.taylorN);
  const E = inputs.youngModulusMPa !== undefined && inputs.youngModulusMPa !== ''
    ? requirePositive(inputs.youngModulusMPa, 'youngModulusMPa')
    : D(mat.E);

  // 1. Spindle speed
  const nRpm = vc.times(1000).div(PI.times(diam));
  steps.push({
    step: ++n,
    description: 'Spindle speed from cutting speed',
    formula: 'n = (1000 * Vc) / (pi * D)',
    result: `${fix(nRpm, 2)} rpm`
  });

  // 2. Table feed (uncorrected)
  const vf = nRpm.times(fz).times(teeth);
  steps.push({
    step: ++n,
    description: 'Table feed (programmed fz)',
    formula: 'Vf = n * fz * z',
    result: `${fix(vf, 2)} mm/min`
  });

  // 3. Engagement + mean chip thickness (radial thinning)
  const phi = engagementAngleRad(ae, diam);
  const phiDeg = phi.times(180).div(PI);
  // hm = fz * (ae/D) for slot approximation; partial: hm = fz * sin(phi/2) * (2/phi)*... use Sandvik-style hm = fz * sqrt(ae/D)
  const hm = fz.times(ae.div(diam).sqrt());
  steps.push({
    step: ++n,
    description: 'Mean chip thickness (radial thinning)',
    formula: 'hm = fz * sqrt(ae/D)',
    result: `${fix(hm, 4)} mm`
  });

  // 4. Chip-thinning compensated feed (keep hm target = fz programmed intent)
  const fzComp = hm.gt(0) ? fz.times(fz).div(hm) : fz;
  const vfComp = nRpm.times(fzComp).times(teeth);
  steps.push({
    step: ++n,
    description: 'Chip-thinning / HEM feed compensation',
    formula: 'fz_comp = fz^2 / hm; Vf_comp = n * fz_comp * z',
    result: `${fix(vfComp, 2)} mm/min`
  });

  // 5. MRR
  const mrr = ae.times(ap).times(vfComp).div(1000);
  steps.push({
    step: ++n,
    description: 'Material removal rate',
    formula: 'Q = ae * ap * Vf_comp / 1000',
    result: `${fix(mrr, 3)} cm3/min`
  });

  // 6. Extended Taylor tool life
  // T = (C/Vc)^(1/n) * f_cool * f_int
  if (tn.lte(0) || tn.gte(1)) throw new CalcError('E_DOMAIN', 'taylor n must be in (0,1)', 'SC-020');
  const Tbase = C.div(vc).pow(D(1).div(tn));
  const Tlife = Tbase.times(fCool).times(fInt);
  steps.push({
    step: ++n,
    description: 'Extended Taylor tool life',
    formula: 'T = (C/Vc)^(1/n) * f_coolant * f_interrupt',
    result: `${fix(Tlife, 2)} min`
  });

  // 7. Kienzle cutting force
  const kc = kc1.times(hm.pow(mc.neg()));
  const Ap = ap.times(hm); // effective chip section proxy
  const Fc = kc.times(Ap);
  steps.push({
    step: ++n,
    description: 'Kienzle specific force and cutting force',
    formula: 'kc = kc1 * hm^(-mc); Fc = kc * ap * hm',
    result: `${fix(Fc, 1)} N`
  });

  // 8. Spindle power and torque
  // Pc = Fc * Vc / (60e3 * eta)  [kW] with Fc[N], Vc[m/min]
  const Pc = Fc.times(vc).div(D('60000').times(eta));
  const Mc = nRpm.gt(0) ? Pc.times(9550).div(nRpm) : D(0);
  const pUtil = Pc.div(spindleKw).times(100);
  const tUtil = Mc.div(spindleTq).times(100);
  steps.push({
    step: ++n,
    description: 'Spindle power and torque',
    formula: 'Pc = Fc*Vc/(60e3*eta); Mc = 9550*Pc/n',
    result: `${fix(Pc, 3)} kW / ${fix(Mc, 2)} N·m`
  });

  // 9. Tool deflection (cantilever round tool)
  // I = pi * D^4 / 64; delta = F*L^3 / (3*E*I)  [mm if consistent N, mm, MPa]
  const I = PI.times(diam.pow(4)).div(64);
  const deltaMm = Fc.times(stick.pow(3)).div(D(3).times(E).times(I));
  const deltaUm = deltaMm.times(1000);
  steps.push({
    step: ++n,
    description: 'Cantilever tool deflection',
    formula: 'delta = Fc * L^3 / (3 * E * I), I = pi*D^4/64',
    result: `${fix(deltaUm, 2)} um`
  });

  // 10. Theoretical Ra (turning/facing style nose model)
  const Ra = fz.pow(2).div(D(32).times(re));
  steps.push({
    step: ++n,
    description: 'Theoretical arithmetic roughness',
    formula: 'Ra ~ fz^2 / (32 * r_epsilon)',
    result: `${fix(Ra, 4)} um`
  });

  // 11. Gilbert minimum-cost speed
  // T_opt = ((1-n)/n) * (Ct / Cm)   [min]; Vc_opt = C / T_opt^n
  const Topt = tn.gt(0) && tn.lt(1)
    ? D(1).minus(tn).div(tn).times(toolCost.div(cm))
    : Tlife;
  const VcGilbert = Topt.gt(0) ? C.div(Topt.pow(tn)) : vc;
  // Index: machine + tool amortization per minute at current vs Gilbert
  const costCurrentPerMin = cm.plus(Tlife.gt(0) ? toolCost.div(Tlife) : D(0));
  const costGilbertPerMin = cm.plus(Topt.gt(0) ? toolCost.div(Topt) : D(0));
  const savings = costCurrentPerMin.gt(0)
    ? costCurrentPerMin.minus(costGilbertPerMin).div(costCurrentPerMin).times(100)
    : D(0);
  steps.push({
    step: ++n,
    description: 'Gilbert minimum-cost cutting speed',
    formula: 'T_opt=(1-n)/n*(Ct/Cm); Vc_opt=C/T_opt^n',
    result: `${fix(VcGilbert, 2)} m/min (savings ${fix(savings, 1)}%)`
  });

  // Verdict
  let verdict: Verdict = 'RELEASED TO PRODUCTION';
  if (pUtil.gt(100) || tUtil.gt(100) || deltaUm.gt(100) || Tlife.lt(1)) {
    verdict = 'DO NOT RUN';
  } else if (pUtil.gt(85) || tUtil.gt(85) || deltaUm.gt(50) || Tlife.lt(5) || hm.lt('0.01')) {
    verdict = 'RUN WITH CAUTION';
  }

  const assumptions = [
    'ISO 513 kc1/mc and Taylor C/n are reference-grade mid-band values, not measured data.',
    'Calibrate constants against tooling-supplier datasheets before contract or production approval.',
    `Coolant factor ${coolKey}=${fCool.toString()}; interruption factor ${intKey}=${fInt.toString()}.`,
    'Chip thinning uses hm = fz * sqrt(ae/D); HEM compensation raises feed to hold mean chip thickness.',
    'Kienzle force uses Ap = ap * hm; spindle power includes machine efficiency.',
    'Deflection model is cantilever round tool (fixed-free); holders and taper stiffness are ignored.',
    'Ra model is geometric nose-radius approximation; ignores vibration, built-up edge, and wear.',
    'Currency is a display symbol only - no FX conversion.',
    'Engineering preview: not for production approval and not a substitute for measured data or a licensed engineer.'
  ];

  const resultCore = {
    nRpm: fix(nRpm, 2),
    vfMmMin: fix(vf, 2),
    hmMm: fix(hm, 4),
    fzCompMm: fix(fzComp, 4),
    vfCompMmMin: fix(vfComp, 2),
    engagementDeg: fix(phiDeg, 2),
    mrrCm3Min: fix(mrr, 3),
    toolLifeMin: fix(Tlife, 2),
    kcNPerMm2: fix(kc, 1),
    fcN: fix(Fc, 1),
    powerKw: fix(Pc, 3),
    torqueNm: fix(Mc, 2),
    powerUtilPct: fix(pUtil, 1),
    torqueUtilPct: fix(tUtil, 1),
    deflectionUm: fix(deltaUm, 2),
    raUm: fix(Ra, 4),
    gilbertVcMPerMin: fix(VcGilbert, 2),
    gilbertSavingsPct: fix(savings, 1),
    costPerPartIndex: fix(costCurrentPerMin, 4),
    verdict
  };

  const integrity = integrityHash({
    engine: FS_ENGINE_ID,
    material: inputs.materialId,
    D: diam.toString(),
    z: teeth.toString(),
    Vc: vc.toString(),
    fz: fz.toString(),
    ap: ap.toString(),
    ae: ae.toString(),
    n: resultCore.nRpm,
    Vf: resultCore.vfCompMmMin,
    T: resultCore.toolLifeMin,
    Pc: resultCore.powerKw,
    verdict
  });

  return {
    engineId: FS_ENGINE_ID,
    engineVersion: FS_ENGINE_VERSION,
    buildDate: FS_ENGINE_BUILD_DATE,
    materialName: mat.name,
    isoGroup: mat.isoGroup,
    ...resultCore,
    integrity,
    steps,
    assumptions
  };
}
