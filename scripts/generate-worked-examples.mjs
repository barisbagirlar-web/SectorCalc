/**
 * Generate engine-backed worked-example fixtures for Tier-A money pages.
 * Run: npx vite-node scripts/generate-worked-examples.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'seo/worked-examples');
mkdirSync(OUT, { recursive: true });

function write(entity, payload) {
  const path = join(OUT, `${entity}.json`);
  writeFileSync(path, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`[OK] ${entity} → ${path}`);
}

// --- TS engines ---
import { calculate as calcStack, simulateStack } from '../src/tools/SC-008-tolerance-stack/v1.0.0/formula.ts';
import { calculate as calcLabor } from '../src/tools/SC-010-labor-cost/v1.0.0/formula.ts';
import { calculate as calcQuote } from '../src/tools/SC-012-quote-pricing/v1.0.0/formula.ts';
import { calculate as calcOee } from '../src/tools/SC-014-oee/v1.0.0/formula.ts';
import { calculate as calcMachining } from '../src/tools/SC-020-feeds-speeds/v1.0.0/formula.ts';

{
  const inputs = {
    components: [
      { name: 'Housing bore depth', nominal: '50', tol: '0.05', distribution: 'normal' },
      { name: 'Bearing width', nominal: '20', tol: '0.02', distribution: 'normal' },
      { name: 'Spacer', nominal: '10', tol: '0.03', distribution: 'normal' },
    ],
    usl: '80.20',
    lsl: '79.80',
    seed: '42',
    iterations: '2000',
  };
  const samples = simulateStack(inputs.components, inputs);
  const r = calcStack(inputs, samples);
  write('tolerance-stack-up', {
    toolId: 'SC-008',
    primaryEntity: 'tolerance-stack-up',
    engineSource: 'src/tools/SC-008-tolerance-stack/v1.0.0/formula.ts',
    title: 'Three-contributor gap stack (seeded)',
    narrative:
      'A housing depth, bearing width, and spacer close a 80.00 mm target gap band of ±0.20 mm. Worst-case, RSS, and seeded Monte Carlo are taken from the production SC-008 engine.',
    inputs,
    outputs: {
      worstPlus: r.worstPlus,
      rssPlus: r.rssPlus,
      cpk: r.cpk,
      mcStd: r.mcStd,
    },
  });
}

{
  const inputs = {
    country: 'DE',
    netSalary: '3200',
    payFrequency: 'monthly',
    hoursPerWeek: '40',
    healthMonthly: '120',
    mealMonthly: '80',
    transportMonthly: '50',
    annualBonus: '2400',
    recruitmentCost: '4500',
    tenureYears: '3',
  };
  const r = calcLabor(inputs);
  write('true-labor-cost', {
    toolId: 'SC-010',
    primaryEntity: 'true-labor-cost',
    engineSource: 'src/tools/SC-010-labor-cost/v1.0.0/formula.ts',
    title: 'German monthly net €3,200 fully loaded',
    narrative:
      'Production SC-010 converts net pay into true employer cost including employer social charges, benefits, severance accrual, and amortized recruitment.',
    inputs,
    outputs: {
      trueMonthlyCost: r.trueMonthlyCost,
      trueHourlyCost: r.trueHourlyCost,
      costMultiplier: r.costMultiplier,
      hiddenCostPct: r.hiddenCostPct,
      currency: r.currency,
    },
  });
}

{
  const inputs = {
    materialCost: '42',
    scrapRate: '0.05',
    laborHours: '1.2',
    laborHourlyCost: '48',
    machineHours: '0.8',
    machineHourlyCost: '85',
    setupMinutes: '30',
    setupHourlyCost: '95',
    overheadRate: '0.18',
    energyCost: '4.5',
    consumablesCost: '6',
    shippingCost: '12',
    paymentDays: '45',
    monthlyInterestRate: '0.01',
    targetMargin: '0.25',
    quantity: '50',
    currency: 'EUR',
  };
  const r = calcQuote(inputs);
  write('quote-pricing', {
    toolId: 'SC-012',
    primaryEntity: 'quote-pricing',
    engineSource: 'src/tools/SC-012-quote-pricing/v1.0.0/formula.ts',
    title: '50-piece job quote at 25% target margin',
    narrative:
      'SC-012 builds full cost (material with scrap, labor, machine, setup, overhead, finance) then marks up to the target margin. Outputs are production-engine sell and unit prices.',
    inputs,
    outputs: {
      sellPrice: r.sellPrice,
      unitPrice: r.unitPrice,
      totalCost: r.totalCost,
      profit: r.profit,
      currency: r.currency,
    },
  });
}

{
  const inputs = {
    plannedProductionTime: '480',
    runTime: '420',
    idealCycleTime: '1.2',
    totalCount: '300',
    goodCount: '291',
  };
  const r = calcOee(inputs);
  write('oee-teep', {
    toolId: 'SC-037',
    primaryEntity: 'oee-teep',
    engineSource: 'src/tools/SC-014-oee/v1.0.0/formula.ts',
    title: 'One-shift cell OEE with scrap',
    narrative:
      'Availability, performance, and quality multiply to OEE. The production engine (SC-014 formula module used by SC-037 UI) does not clamp rates above 100%.',
    inputs,
    outputs: {
      oeePct: r.oeePct,
      availabilityPct: r.availabilityPct,
      performancePct: r.performancePct,
      qualityPct: r.qualityPct,
    },
  });
}

{
  const inputs = {
    materialId: 'P1',
    diameterMm: '12',
    teeth: '4',
    vcMPerMin: '180',
    fzMm: '0.08',
    apMm: '8',
    aeMm: '3',
    spindleKw: '11',
    spindleTorqueNm: '80',
    stickOutMm: '40',
    noseRadiusMm: '0.4',
    efficiency: '0.85',
    coolant: 'emulsion',
    interruption: 'continuous',
    toolCost: '85',
    machineCostPerMin: '1.4',
    currency: 'EUR',
  };
  const r = calcMachining(inputs);
  write('cnc-feeds-speeds', {
    toolId: 'SC-020',
    primaryEntity: 'cnc-feeds-speeds',
    engineSource: 'src/tools/SC-020-feeds-speeds/v1.0.0/formula.ts',
    title: 'Ø12 mm 4-flute end mill in ISO P1 steel',
    narrative:
      'Production SC-020 returns spindle speed, table feed, chip thickness, power/torque demand, and a release verdict from the FS-ENGINE core.',
    inputs,
    outputs: {
      nRpm: r.nRpm,
      vfMmMin: r.vfMmMin,
      hmMm: r.hmMm,
      materialName: r.materialName,
      verdict: r.verdict,
    },
  });
}

// --- HTML-page engines extracted as pure functions (must match *-pro.html calculate) ---

function machineHourRate(inp) {
  const dep = (inp.price - inp.resid) / inp.life;
  const interest = ((inp.price + inp.resid) / 2) * (inp.interest / 100);
  const space = inp.space * inp.spaceRate;
  const maint = (inp.maintPct / 100) * inp.price;
  const fixedYr = dep + interest + space + maint + inp.tools + inp.other;
  const fixedH = fixedYr / inp.hours;
  const energyH = inp.powerKW * (inp.duty / 100) * inp.tariff;
  const machineH = fixedH + energyH;
  const laborH = inp.wage / inp.share;
  const totalH = (machineH + laborH) * (1 + inp.oh / 100);
  const costPart = inp.cycleS > 0 ? (totalH * inp.cycleS) / 3600 : 0;
  return {
    dep: +dep.toFixed(4),
    interest: +interest.toFixed(4),
    fixedYr: +fixedYr.toFixed(4),
    machineH: +machineH.toFixed(4),
    laborH: +laborH.toFixed(4),
    totalH: +totalH.toFixed(4),
    costPart: +costPart.toFixed(6),
  };
}

{
  const inputs = {
    price: 185000,
    resid: 25000,
    life: 10,
    hours: 3200,
    interest: 6,
    space: 18,
    spaceRate: 95,
    powerKW: 22,
    duty: 55,
    tariff: 0.18,
    maintPct: 5,
    tools: 4200,
    other: 1800,
    wage: 42,
    share: 1.5,
    oh: 18,
    cycleS: 95,
  };
  write('machine-hour-rate', {
    toolId: 'SC-038',
    primaryEntity: 'machine-hour-rate',
    engineSource: 'machine-rate-pro.html#calculate (extracted pure)',
    title: 'CNC cell fully loaded €/h',
    narrative:
      'Ownership, space, maintenance, energy, attended labor, and overhead dilute into a total hourly rate and optional cost/part at the stated cycle time.',
    inputs,
    outputs: machineHourRate(inputs),
  });
}

function bearingL10(inp) {
  // ISO 281 basic rating life L10h = (C/P)^p * 1e6 / (60*n) with aISO approx via kappa/eC screening constants
  const p = inp.bearingType === 'roller' ? 10 / 3 : 3;
  const ratio = inp.C / inp.P;
  const L10rev = Math.pow(ratio, p) * 1e6;
  const L10h = L10rev / (60 * inp.n);
  const aISO = Math.max(0.1, Math.min(50, inp.aISO));
  const Lnmh = L10h * aISO;
  return {
    L10h: +L10h.toFixed(2),
    Lnmh: +Lnmh.toFixed(2),
    lifeRatio: +ratio.toFixed(4),
    exponent: p,
  };
}

{
  const inputs = { C: 62000, P: 8500, n: 1800, bearingType: 'ball', aISO: 1.2 };
  write('bearing-life-l10', {
    toolId: 'SC-021',
    primaryEntity: 'bearing-life-l10',
    engineSource: 'bearing-pro.html ISO 281 core (extracted pure; aISO supplied)',
    title: 'Deep-groove ball bearing L10 / Lnm',
    narrative:
      'Basic rating life from dynamic capacity and equivalent load, then modified life with the supplied aISO factor. Manufacturer catalog values remain authoritative for contract selection.',
    inputs,
    outputs: bearingL10(inputs),
  });
}

function boltTorque(inp) {
  // T = K * F * d  (assembly torque estimate)
  const T = inp.K * inp.F * inp.d;
  const sigma = (inp.F * 4) / (Math.PI * inp.d * inp.d);
  return { torqueNm: +T.toFixed(3), meanStressMPa: +sigma.toFixed(2) };
}

{
  const inputs = { K: 0.18, F: 32000, d: 0.01 };
  write('bolt-torque-preload', {
    toolId: 'SC-035',
    primaryEntity: 'bolt-torque-preload',
    engineSource: 'bolt-pro.html assembly torque core (extracted pure)',
    title: 'M10 assembly torque from target preload',
    narrative:
      'Assembly torque from nut factor K, target preload, and nominal diameter. Friction scatter dominates — treat as screening, not a substitute for VDI 2230 joint design.',
    inputs,
    outputs: boltTorque(inputs),
  });
}

function boltedJoint(inp) {
  const Phi = inp.Ck / (inp.Ck + inp.Cp);
  const Fadd = Phi * inp.Fext;
  const Fmax = inp.Fpre + Fadd;
  const Fmin = inp.Fpre - (1 - Phi) * inp.Fext;
  return {
    loadFactor: +Phi.toFixed(4),
    FmaxN: +Fmax.toFixed(1),
    FminN: +Fmin.toFixed(1),
  };
}

{
  const inputs = { Ck: 2.1e5, Cp: 8.4e5, Fpre: 28000, Fext: 9000 };
  write('bolted-joint', {
    toolId: 'SC-036',
    primaryEntity: 'bolted-joint',
    engineSource: 'bolted-joint-pro.html load-factor core (extracted pure)',
    title: 'Eccentric joint load factor screening',
    narrative:
      'Force ratio Φ splits external load between bolt and clamped parts. Outputs max/min bolt force under working load for first-pass VDI-style screening.',
    inputs,
    outputs: boltedJoint(inputs),
  });
}

function pipeWall(inp) {
  // ASME B31.3 straight pipe under internal pressure (basic): t = P*D / (2*(S*E*W + P*Y))
  const t = (inp.P * inp.D) / (2 * (inp.S * inp.E * inp.W + inp.P * inp.Y));
  const tmin = t + inp.CA;
  return { tDesignMm: +(t * 1000).toFixed(3), tMinMm: +(tmin * 1000).toFixed(3) };
}

{
  const inputs = { P: 2.5e6, D: 0.1683, S: 137.9e6, E: 1, W: 1, Y: 0.4, CA: 0.0015 };
  write('pipe-wall-thickness', {
    toolId: 'SC-034',
    primaryEntity: 'pipe-wall-thickness',
    engineSource: 'pipe-wall-pro.html B31.3 internal-pressure core (extracted pure)',
    title: 'DN150 process line internal pressure',
    narrative:
      'Basic B31.3 internal-pressure thickness plus corrosion allowance. External pressure, branch reinforcement, and material certificates are out of scope.',
    inputs,
    outputs: pipeWall(inputs),
  });
}

function vesselShell(inp) {
  // ASME VIII Div.1 circ. stress screening: t = P*R / (S*E - 0.6*P)
  const t = (inp.P * inp.R) / (inp.S * inp.E - 0.6 * inp.P);
  return { tShellMm: +(t * 1000).toFixed(3) };
}

{
  const inputs = { P: 1.2e6, R: 0.6, S: 137.9e6, E: 1 };
  write('pressure-vessel-shell', {
    toolId: 'SC-033',
    primaryEntity: 'pressure-vessel-shell',
    engineSource: 'pressure-vessel-pro.html VIII Div.1 circ. core (extracted pure)',
    title: 'Cylindrical shell under internal pressure',
    narrative:
      'Circumferential stress screening thickness for a cylindrical shell. Heads, nozzles, wind/seismic, and external pressure procedures are not included.',
    inputs,
    outputs: vesselShell(inputs),
  });
}

function heatInput(inp) {
  // kJ/mm = (V * I * 60) / (1000 * travel_mm_per_min) * efficiency
  const HI = ((inp.V * inp.I * 60) / (1000 * inp.travel)) * inp.eta;
  return { heatInputKJperMm: +HI.toFixed(4) };
}

{
  const inputs = { V: 24, I: 180, travel: 280, eta: 0.8 };
  write('weld-heat-input', {
    toolId: 'SC-029',
    primaryEntity: 'weld-heat-input',
    engineSource: 'heat-input-pro.html arc energy core (extracted pure)',
    title: 'GMAW pass heat input',
    narrative:
      'Arc energy from voltage, current, and travel speed with process efficiency. This does not replace WPS/PQR qualification or cooling-time metallurgy checks.',
    inputs,
    outputs: heatInput(inputs),
  });
}

console.log('[PASS] worked-example fixtures generated');
