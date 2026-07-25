#!/usr/bin/env node
/**
 * Apply engineering drawing theme v2.0:
 * - root CSS + index/pricing/calculator-template already copied by operator
 * - rewrite tools.html (theme chrome + accurate SC codes + live:true catalog)
 * - generate themed source shells for each *-pro.html (title/meta/formulas)
 * - SC-008 keeps dedicated module script
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const TEMPLATE = readFileSync(join(ROOT, 'calculator-template.html'), 'utf8');

const TOOLS = [
  { file: 'sc008-pro.html', code: 'SC-008', name: 'Tolerance Stack-Up', engine: 'SC-008-ENGINE v1.1.0', sector: 'Tolerances & Metrology', standard: 'ISO 286 / ASME Y14.5', summary: 'Worst-case, RSS and seeded Decimal Monte Carlo with predicted Cpk.', formulas: [
    ['T<sub>WC</sub> = Σ t<sub>i</sub>', 'Worst-case arithmetic sum of contributor tolerances.'],
    ['T<sub>RSS</sub> = √(Σ t<sub>i</sub>²)', 'Root-sum-square envelope under independent ±3σ assumptions.'],
    ['Cpk = min[(USL − μ)/3σ , (μ − LSL)/3σ]', 'Capability from simulated or analytical sigma.'],
    ['PPM = out-of-spec / n × 1e6', 'Empirical defect rate from seeded Monte Carlo.']
  ], assumptions: ['1D linear stacks.', 'Per-part sigma derived from tolerance unless measured.', 'Seeded LCG + Decimal arithmetic → reproducible.'], live: true, keepModule: true },
  { file: 'weld-pro.html', code: 'SC-001', name: 'Weld Thickness', engine: 'SC-001-ENGINE v1.0.0', sector: 'Welding & Fabrication', standard: 'AWS D1.1 / EN ISO 2553', summary: 'Fillet weld leg, throat and utilization against design load.', formulas: [
    ['a = 0.707 × z', 'Throat from leg for equal-leg fillet.'],
    ['F = τ × a × L', 'Allowable load from throat stress and length.'],
    ['U = F_applied / F_allow', 'Utilization ratio.']
  ], assumptions: ['Equal-leg fillet unless stated.', 'Code minimums disclosed in A4/A5.'], live: true },
  { file: 'labor-pro.html', code: 'SC-010', name: 'True Labor Cost', engine: 'SC-010-ENGINE v1.0.0', sector: 'Costing & Business', standard: 'Loaded burden model', summary: 'Loaded labor burden from net, taxes, benefits and overhead.', formulas: [
    ['C_loaded = C_net × (1 + b)', 'Burden multiplier on net wage.'],
    ['C_hour = C_loaded / h_productive', 'True productive hour rate.']
  ], assumptions: ['Statutory rates are jurisdiction inputs.', 'Not payroll advice.'], live: true },
  { file: 'quote-pro.html', code: 'SC-012', name: 'Quote Pricing / Full-Cost Margin', engine: 'SC-012-ENGINE v1.0.0', sector: 'Costing & Business', standard: 'Full-absorption quote', summary: 'Material, labor, scrap and margin into sell price.', formulas: [
    ['C_total = C_mat + C_labor + C_oh + C_risk', 'Full absorption cost.'],
    ['P_sell = C_total / (1 − m)', 'Sell from target margin.']
  ], assumptions: ['Risk buffer is an estimator input.', 'Governing commercial terms remain authoritative.'], live: true },
  { file: 'machining-pro.html', code: 'SC-020', name: 'CNC Feeds & Speeds + Tool Life', engine: 'FS-ENGINE v2.1.0', sector: 'Machining & Manufacturing', standard: 'ISO 513 / Taylor / Kienzle', summary: 'Taylor tool life, chip thinning, Kienzle force, power and deflection.', formulas: [
    ['V × Tⁿ = C', 'Extended Taylor tool life.'],
    ['F_c = k_c1 × h_m^(1−m_c) × a_p × a_e', 'Kienzle cutting force.'],
    ['P = F_c × V / 60000', 'Spindle power (kW).']
  ], assumptions: ['Calibrate C/n and kc1 to tooling supplier data.', 'Engineering preview — not a CAM post.'], live: true },
  { file: 'bearing-pro.html', code: 'SC-021', name: 'Bearing Life L10 / Lnm — ISO 281', engine: 'BL-ENGINE v1.0.0', sector: 'Rotating Equipment', standard: 'ISO 281:2007', summary: 'Basic and modified rating life with aISO, κ and contamination.', formulas: [
    ['L10 = (C/P)^p × 1e6 / (60n)', 'Basic rating life.'],
    ['Lnm = a1 × aISO × L10', 'Modified rating life.']
  ], assumptions: ['One operating point per run.', 'Spectra reduced to equivalent values.'], live: true },
  { file: 'tap-thread-pro.html', code: 'SC-022', name: 'Tap & Thread Milling', engine: 'SC-022-ENGINE v1.0.0', sector: 'Machining & Manufacturing', standard: 'ISO 261 / ISO 965', summary: 'Tap drill, engagement and tapping torque screening.', formulas: [
    ['d_drill = d − P', 'Metric coarse drill estimate.'],
    ['%eng = (d − d_drill) / (1.0825P)', 'Thread engagement.']
  ], assumptions: ['Material-specific tap charts may override.'], live: true },
  { file: 'cycle-cost-pro.html', code: 'SC-023', name: 'Cycle Time & Cost per Good Part', engine: 'SC-023-ENGINE v1.0.0', sector: 'Machining & Manufacturing', standard: 'Shop cycle cost', summary: 'Cycle time and cost per good part with scrap.', formulas: [
    ['t_cycle = t_cut + t_idle + t_tool', 'Cycle build-up.'],
    ['C_good = C_batch / N_good', 'Cost per good part.']
  ], assumptions: ['Scrap and rework are explicit inputs.'], live: true },
  { file: 'bearing-freq-pro.html', code: 'SC-024', name: 'Bearing Defect Frequencies', engine: 'SC-024-ENGINE v1.0.0', sector: 'Rotating Equipment', standard: 'BPFO/BPFI/BSF/FTF', summary: 'Defect frequencies from geometry and shaft speed.', formulas: [
    ['BPFO = (n/2)·N_b·(1 − d/D·cosα)·f_r', 'Outer race.'],
    ['BPFI = (n/2)·N_b·(1 + d/D·cosα)·f_r', 'Inner race.']
  ], assumptions: ['Geometry must match manufacturer data.'], live: true },
  { file: 'belt-chain-pro.html', code: 'SC-025', name: 'Belt & Chain Drive Sizing', engine: 'SC-025-ENGINE v1.0.0', sector: 'Rotating Equipment', standard: 'ISO 1081 / ISO 606', summary: 'Power rating, service factor and center distance.', formulas: [
    ['P_design = P × SF', 'Service-factored power.'],
    ['L = 2C + (π/2)(D1+D2) + (D1−D2)²/(4C)', 'Belt length.']
  ], assumptions: ['Manufacturer catalogs remain authoritative.'], live: true },
  { file: 'shaft-pro.html', code: 'SC-026', name: 'Shaft Design — Torsion + Bending', engine: 'SC-026-ENGINE v1.0.0', sector: 'Rotating Equipment', standard: 'ASME / ISO shaft', summary: 'Combined bending and torsion diameter screening.', formulas: [
    ['τ = 16T / (πd³)', 'Torsional shear.'],
    ['σ = 32M / (πd³)', 'Bending stress.'],
    ['d = ∛(16/(πσ_a)·√( (K_f M)² + (3/4)(K_fs T)² ))', 'ASME elliptic.']
  ], assumptions: ['Keyways and shoulders require separate factors.'], live: true },
  { file: 'fits-pro.html', code: 'SC-027', name: 'ISO 286 Fits & Clearances', engine: 'SC-027-ENGINE v1.0.0', sector: 'Tolerances & Metrology', standard: 'ISO 286', summary: 'Hole/shaft fit families with clearance or interference.', formulas: [
    ['ES, EI = f(IT, fundamental deviation)', 'Hole limits.'],
    ['es, ei = f(IT, fundamental deviation)', 'Shaft limits.']
  ], assumptions: ['Unsupported zones are blocked, not guessed.'], live: true },
  { file: 'surface-finish-pro.html', code: 'SC-028', name: 'Surface Finish Converter', engine: 'SC-028-ENGINE v1.0.0', sector: 'Tolerances & Metrology', standard: 'ISO 4287 / ISO 1302', summary: 'Ra/Rz/N-grade conversion and process bands.', formulas: [
    ['Ra ≈ f² / (32·R)', 'Theoretical feed-mark roughness.'],
    ['Rz ≈ k · Ra', 'Empirical conversion band.']
  ], assumptions: ['Measured profilometry remains authoritative.'], live: true },
  { file: 'heat-input-pro.html', code: 'SC-029', name: 'Weld Heat Input & t8/5', engine: 'SC-029-ENGINE v1.0.0', sector: 'Welding & Fabrication', standard: 'ISO 1011 / AWS D1.1', summary: 'Arc heat input and cooling estimate.', formulas: [
    ['Q = k · U · I / v', 'Heat input.'],
    ['t8/5 ≈ f(Q, T0, thickness)', 'Cooling time estimate.']
  ], assumptions: ['Not a WPS/PQR replacement.'], live: true },
  { file: 'bend-pro.html', code: 'SC-030', name: 'Sheet Metal Bend & K-Factor', engine: 'SC-030-ENGINE v1.0.0', sector: 'Welding & Fabrication', standard: 'ISO 9013 / shop K-factor', summary: 'Bend allowance, setback and flat pattern.', formulas: [
    ['BA = α·(R + K·T)', 'Bend allowance.'],
    ['BD = 2(R+T)·tan(α/2) − BA', 'Bend deduction.']
  ], assumptions: ['K-factor is process/material dependent.'], live: true },
  { file: 'sling-pro.html', code: 'SC-031', name: 'Sling Capacity & Angle Verification', engine: 'SC-031-ENGINE v1.0.0', sector: 'Lifting & Rigging', standard: 'ASME B30.9', summary: 'WLL with angle factor and share assumptions.', formulas: [
    ['T = W / (n_eff · sinθ)', 'Leg tension.'],
    ['SF = WLL / T', 'Utilization against WLL.']
  ], assumptions: ['Conservative sharing unless equalization proven.'], live: true },
  { file: 'shackle-eyebolt-pro.html', code: 'SC-032', name: 'Shackle & Eye-Bolt Verification', engine: 'SC-032-ENGINE v1.0.0', sector: 'Lifting & Rigging', standard: 'EN 13889 / DIN 580', summary: 'Angular derating of lifting hardware.', formulas: [
    ['WLL_eff = WLL · f_angle · f_temp', 'Derated capacity.'],
    ['U = demand / WLL_eff', 'Utilization.']
  ], assumptions: ['Manufacturer ratings not invented.'], live: true },
  { file: 'pressure-vessel-pro.html', code: 'SC-033', name: 'ASME VIII Pressure Vessel Shell', engine: 'SC-033-ENGINE v1.0.0', sector: 'Pressure Equipment', standard: 'ASME VIII / EN 13445', summary: 'Internal-pressure shell thickness screening.', formulas: [
    ['t = PR / (SE − 0.6P) + CA', 'Cylindrical shell (ASME form).']
  ], assumptions: ['External pressure charts are out of scope.'], live: true },
  { file: 'pipe-wall-pro.html', code: 'SC-034', name: 'ASME B31.3 Pipe Wall / MAWP', engine: 'SC-034-ENGINE v1.0.0', sector: 'Pressure Equipment', standard: 'ASME B31.3', summary: 'Straight-pipe wall and MAWP in validated region.', formulas: [
    ['t = P·D / (2(SE + P·Y)) + CA', 'B31.3 wall.'],
    ['MAWP = 2·S·E·(t−CA) / (D − 2Y(t−CA))', 'Allowable pressure.']
  ], assumptions: ['Blocked outside validated applicability.'], live: true },
  { file: 'bolt-pro.html', code: 'SC-035', name: 'Bolt Torque & Preload', engine: 'SC-035-ENGINE v1.0.0', sector: 'Fasteners', standard: 'ISO 898 / VDI guidance', summary: 'Torque-preload relationship screening.', formulas: [
    ['F_p = k · A_s · R_p0.2', 'Target preload band.'],
    ['T = K · F_p · d', 'Nut factor torque.']
  ], assumptions: ['Friction K dominates uncertainty.'], live: true },
  { file: 'bolted-joint-pro.html', code: 'SC-036', name: 'Bolted Joint Verification', engine: 'SC-036-ENGINE v1.0.0', sector: 'Fasteners', standard: 'VDI 2230 scope', summary: 'Axial stiffness and preload verification.', formulas: [
    ['Φ = k_b / (k_b + k_m)', 'Load factor.'],
    ['F_max = F_p + Φ·F_ext', 'Max bolt force.']
  ], assumptions: ['No silent eccentricity/prying claim.'], live: true },
  { file: 'oee-pro.html', code: 'SC-037', name: 'OEE / TEEP / Capacity Loss', engine: 'SC-037-ENGINE v1.0.0', sector: 'Costing & Business', standard: 'ISO 22400', summary: 'Availability × performance × quality.', formulas: [
    ['OEE = A × P × Q', 'Overall equipment effectiveness.'],
    ['TEEP = OEE × utilization', 'Total effective equipment performance.']
  ], assumptions: ['Definitions follow plant data dictionary.'], live: true },
  { file: 'machine-rate-pro.html', code: 'SC-038', name: 'True Machine Hour Rate', engine: 'SC-038-ENGINE v1.0.0', sector: 'Costing & Business', standard: 'Full absorption', summary: 'Depreciation, energy, maintenance and overhead rate.', formulas: [
    ['R = (C_cap + C_energy + C_maint + C_oh) / h', 'Hour rate.']
  ], assumptions: ['Utilization and life years are estimator inputs.'], live: true },
  { file: 'punching-pro.html', code: 'SC-039', name: 'Punching Force & Die Clearance', engine: 'SC-039-ENGINE v1.0.0', sector: 'Welding & Fabrication', standard: 'DIN / shop practice', summary: 'Blanking force and clearance guidance.', formulas: [
    ['F = L · T · τ', 'Punch force.'],
    ['c = k · T', 'Die clearance band.']
  ], assumptions: ['Press capacity must include stripper.'], live: true },
  { file: 'hydraulic-pro.html', code: 'SC-040', name: 'Hydraulic Cylinder Sizing', engine: 'SC-040-ENGINE v1.0.0', sector: 'Pressure Equipment', standard: 'ISO 6020 / ISO 3320', summary: 'Bore, rod, pressure and buckling screen.', formulas: [
    ['F = P · A', 'Force from pressure and area.'],
    ['v = Q / A', 'Extension speed from flow.']
  ], assumptions: ['Buckling check is screening-level.'], live: true }
];

function extractGuide(file) {
  const path = join(ROOT, file);
  if (!existsSync(path)) return '';
  const html = readFileSync(path, 'utf8');
  return html.match(/<!--SC-GUIDE-START-->[\s\S]*?<!--SC-GUIDE-END-->/i)?.[0] ?? '';
}

function buildCalculatorSource(tool) {
  const dwg = `${tool.code}-001`;
  const formulaHtml = tool.formulas.map(([f, d]) =>
    `<div class="cs-formula-block"><div class="formula">${f}</div><div class="formula-desc">${d}</div></div>`
  ).join('\n    ');
  const assumptions = tool.assumptions.map((a) => `<li>${a}</li>`).join('\n      ');
  const guide = extractGuide(tool.file);
  const moduleScript = tool.keepModule
    ? '<script type="module" src="/src/sc008-pro.ts"></script>'
    : `<script type="module" src="/src/industrial-tool.ts"></script>`;

  // Preserve title/description/guide for unified-tool-html extractor; body is thematic source of truth for SC-008,
  // and a themed placeholder shell for shared-runtime tools (Vite plugin rewrites those at build).
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${tool.code} · ${tool.name} — SectorCalc</title>
<meta name="description" content="${tool.summary} Deterministic SI engine, visible formulas, A1–A5 audit trail.">
<link rel="canonical" href="https://sectorcalc.com/${tool.file}">
<link rel="stylesheet" href="sectorcalc-engineering.css">
<style>
.theme-calc-sheet { min-height: 100vh; padding: 2rem 1rem; }
.cs-sheet { padding: 0; position: relative; }
.cs-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 2rem 2.5rem; border-bottom: 2px solid var(--cs-border); background: #FAFBFC; }
.cs-header-left h1 { font-size: 1.6rem; font-weight: 700; color: var(--cs-border); margin-bottom: 0.35rem; }
.cs-header-left .cs-subtitle { font-family: var(--font-mono); font-size: 0.7rem; color: #888; text-transform: uppercase; letter-spacing: 0.1em; }
.cs-header-right { text-align: right; font-family: var(--font-mono); font-size: 0.65rem; color: #888; }
.cs-header-right .cs-engine { font-size: 0.9rem; font-weight: 700; color: var(--cs-accent); margin-bottom: 0.25rem; }
.cs-nav { display: flex; gap: 0; background: var(--cs-accent); padding: 0 2.5rem; flex-wrap: wrap; }
.cs-nav a { color: #FFFFFF; text-decoration: none; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; padding: 0.75rem 1.25rem; border-right: 1px solid rgba(255,255,255,0.15); }
.cs-nav a:hover { background: rgba(255,255,255,0.1); }
.cs-main { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
.cs-inputs-panel { padding: 2rem 2.5rem; border-right: 1px solid rgba(26,58,92,0.1); }
.cs-results-panel { padding: 2rem 2.5rem; background: #FAFBFC; }
.cs-section-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(26,58,92,0.1); }
.cs-section-header h2 { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--cs-accent); font-weight: 600; }
.cs-section-header .sh-line { flex: 1; height: 1px; background: rgba(26,58,92,0.1); }
.cs-formula-section, .cs-assumptions { padding: 2rem 2.5rem; border-top: 1px solid rgba(26,58,92,0.1); }
.cs-mount { min-height: 120px; border: 1px dashed rgba(26,58,92,0.25); padding: 1rem; background: #fff; font-family: var(--font-mono); font-size: 0.75rem; color: #666; }
@media (max-width: 900px) { .cs-main { grid-template-columns: 1fr; } }
</style>
</head>
<body class="theme-calc-sheet" data-tool-code="${tool.keepModule ? '' : tool.code}" data-tool-badge="${tool.code} · ${tool.name}">
<div class="cs-sheet">
  <div class="cs-header">
    <div class="cs-header-left">
      <h1>${tool.code} · ${tool.name}</h1>
      <div class="cs-subtitle">Deterministic · ISO 3864 · Audit Trail · Engineering preview</div>
    </div>
    <div class="cs-header-right">
      <div class="cs-engine">${tool.engine}</div>
      <div>DWG NO: ${dwg}</div>
      <div>SCALE: NTS · REV: A</div>
      <div>DATE: 2026-07-25</div>
      <div>ENGINE VERSION: ${tool.engine}</div>
    </div>
  </div>
  <nav class="cs-nav">
    <a href="index.html">← Home</a>
    <a href="tools.html">Tools Index</a>
    <a href="sc008-pro.html">SC-008</a>
    <a href="machining-pro.html">SC-020</a>
    <a href="labor-pro.html">SC-010</a>
    <a href="weld-pro.html">SC-001</a>
    <a href="pricing.html">Pricing</a>
  </nav>
  <div class="cs-main">
    <div class="cs-inputs-panel">
      <div class="cs-section-header"><h2>Inputs</h2><span class="sh-line"></span><span style="font-family:var(--font-mono);font-size:0.65rem;color:#888;">DWG: ${tool.code}-SEC-A</span></div>
      <div class="cs-ref-box">Reference: ${tool.standard}. ${tool.summary}</div>
      <div class="cs-mount" id="theme-input-mount">Production runtime mounts engineering inputs here (universal units · fail-closed validation).</div>
    </div>
    <div class="cs-results-panel">
      <div class="cs-section-header"><h2>Results</h2><span class="sh-line"></span><span style="font-family:var(--font-mono);font-size:0.65rem;color:#888;">DWG: ${tool.code}-SEC-B</span></div>
      <div class="cs-mount" id="theme-result-mount">Engine-owned outputs, sensitivity and normalized risk charts render here.</div>
    </div>
  </div>
  <div class="cs-formula-section">
    <div class="cs-section-header"><h2>Formulas</h2><span class="sh-line"></span><span style="font-family:var(--font-mono);font-size:0.65rem;color:#888;">DWG: ${tool.code}-SEC-C</span></div>
    ${formulaHtml}
  </div>
  <div class="cs-assumptions">
    <h3>Assumptions & Warnings</h3>
    <ul>
      ${assumptions}
      <li>Results are deterministic for identical canonical inputs and engine version.</li>
      <li>Governing code edition, certified material data and competent review remain authoritative.</li>
    </ul>
  </div>
  <div class="cs-audit-footer">
    <div class="audit-item"><div class="audit-label">DWG NO</div><div class="audit-value">${dwg}</div></div>
    <div class="audit-item"><div class="audit-label">SCALE</div><div class="audit-value">NTS</div></div>
    <div class="audit-item"><div class="audit-label">REV</div><div class="audit-value">A</div></div>
    <div class="audit-item"><div class="audit-label">ENGINE VERSION</div><div class="audit-value">${tool.engine}</div></div>
    <div class="audit-item"><div class="audit-label">ISO 3864</div><div class="audit-value">Safety colors</div></div>
    <div class="audit-item"><div class="audit-label">Audit Trail</div><div class="audit-value">A1–A5</div></div>
    <div class="audit-item"><div class="audit-label">Deterministic</div><div class="audit-value">YES</div></div>
    <div class="audit-item"><div class="audit-label">Sector</div><div class="audit-value">${tool.sector}</div></div>
  </div>
</div>
${guide}
${moduleScript}
</body>
</html>
`;
}

function buildToolsHtml() {
  const cards = TOOLS.map((t) => `      <a href="${t.file}" class="ds-tool-card" data-dwg="${t.code}">
        <div class="tool-sector">${t.sector}</div>
        <div class="tool-name">${t.code} · ${t.name}</div>
        <div class="tool-desc">${t.summary}</div>
        <div class="tool-meta"><span>◈ ${t.standard}</span><span>◈ Deterministic</span><span>◈ Audit Trail</span></div>
        <span class="tool-status status-live">● Live</span>
      </a>`).join('\n');

  const rows = TOOLS.map((t) =>
    `<tr><td class="dwg-no">${t.code}</td><td>${t.name}</td><td>${t.sector}</td><td>${t.standard}</td><td><span class="rev">LIVE</span></td><td>A</td></tr>`
  ).join('\n        ');

  const toolsArray = TOOLS.map((t) => {
    const cat = t.sector.toLowerCase().includes('machin') ? 'machining'
      : t.sector.toLowerCase().includes('rotat') ? 'rotating'
      : t.sector.toLowerCase().includes('toler') ? 'tolerance'
      : t.sector.toLowerCase().includes('weld') || t.sector.toLowerCase().includes('fabric') ? 'welding'
      : t.sector.toLowerCase().includes('lift') ? 'lifting'
      : t.sector.toLowerCase().includes('pressure') ? 'pressure'
      : t.sector.toLowerCase().includes('fasten') ? 'fasteners'
      : 'costing';
    return ` {c:'${cat}',code:'${t.code}',name:'${t.name.replace(/'/g, "\\'")}',live:true,url:'/${t.file}',kw:'${t.code.toLowerCase()} ${t.name.toLowerCase()}'}`;
  }).join(',\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SectorCalc — Engineering Calculator Index</title>
<meta name="description" content="25 live deterministic industrial calculators with DWG index, ISO references and A1–A5 audit trail.">
<link rel="stylesheet" href="sectorcalc-engineering.css">
<style>
.theme-drawing-index { min-height: 100vh; padding: 2rem 1rem; }
.ds-sheet { padding: 3rem; position: relative; }
.ds-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3rem; padding-bottom: 1.5rem; border-bottom: 2px solid var(--ds-border); }
.ds-header-left h1 { font-size: 1.8rem; font-weight: 700; color: var(--ds-border); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
.ds-header-left .ds-subtitle { font-family: var(--font-mono); font-size: 0.75rem; color: #666; text-transform: uppercase; letter-spacing: 0.1em; }
.ds-header-right { text-align: right; font-family: var(--font-mono); font-size: 0.7rem; color: #888; }
.ds-header-right .ds-dwg-no { font-size: 1.1rem; font-weight: 700; color: var(--ds-accent); margin-bottom: 0.25rem; }
.ds-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; margin-bottom: 2rem; }
.ds-stat { border: 1px solid rgba(44,62,80,0.15); padding: 1rem; text-align: center; background: #FFFFFF; }
.ds-stat .stat-value { font-family: var(--font-mono); font-size: 1.5rem; font-weight: 700; color: var(--ds-accent); }
.ds-stat .stat-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-top: 0.25rem; }
.ds-category { margin-bottom: 2rem; }
.ds-category-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; padding: 0.75rem 1rem; background: var(--ds-border); color: #FFFFFF; }
.ds-category-header h2 { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600; }
.ds-category-header .cat-line { flex: 1; height: 1px; background: rgba(255,255,255,0.3); }
.ds-tool-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.ds-tool-card { border: 1px solid rgba(44,62,80,0.15); padding: 1.25rem; background: #FFFFFF; transition: all 0.2s; text-decoration: none; color: inherit; display: block; position: relative; }
.ds-tool-card:hover { border-color: var(--ds-accent); box-shadow: 0 2px 12px rgba(0,85,164,0.08); }
.ds-tool-card::before { content: attr(data-dwg); position: absolute; top: 0.5rem; right: 0.75rem; font-family: var(--font-mono); font-size: 0.6rem; color: #AAA; }
.ds-tool-card .tool-sector { font-family: var(--font-mono); font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--ds-accent); margin-bottom: 0.5rem; }
.ds-tool-card .tool-name { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
.ds-tool-card .tool-desc { font-size: 0.8rem; color: #666; line-height: 1.5; margin-bottom: 0.75rem; }
.ds-tool-card .tool-meta { display: flex; gap: 1rem; flex-wrap: wrap; font-family: var(--font-mono); font-size: 0.65rem; color: #888; }
.tool-status { display: inline-block; padding: 0.15rem 0.5rem; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.75rem; }
.status-live { background: rgba(0,150,57,0.1); color: var(--iso-green); border: 1px solid var(--iso-green); }
.ds-index-table, .ds-revision-table { width: 100%; border-collapse: collapse; font-family: var(--font-mono); font-size: 0.75rem; margin-top: 2rem; }
.ds-index-table th, .ds-revision-table th { background: var(--ds-border); color: #fff; padding: 0.6rem 1rem; text-align: left; text-transform: uppercase; font-size: 0.6rem; letter-spacing: 0.1em; }
.ds-index-table td, .ds-revision-table td { padding: 0.5rem 1rem; border-bottom: 1px solid rgba(44,62,80,0.1); }
.dwg-no { color: var(--ds-accent); font-weight: 700; }
.rev { color: var(--iso-green); font-weight: 700; }
.ds-title-block { margin-top: 2rem; display: grid; grid-template-columns: repeat(4, 1fr); border: 2px solid var(--ds-border); }
.ds-title-block .tb-cell { padding: 0.75rem 1rem; border-right: 1px solid rgba(44,62,80,0.15); font-family: var(--font-mono); font-size: 0.7rem; }
.ds-title-block .tb-label { font-size: 0.55rem; text-transform: uppercase; color: #888; margin-bottom: 0.25rem; }
.ds-title-block .tb-value { font-weight: 600; color: var(--ds-border); }
.ds-nav { display: flex; gap: 0; background: var(--ds-accent); margin: -3rem -3rem 2rem; padding: 0 3rem; flex-wrap: wrap; }
.ds-nav a { color: #fff; text-decoration: none; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; padding: 0.75rem 1.25rem; border-right: 1px solid rgba(255,255,255,0.15); }
@media (max-width: 768px) { .ds-tool-grid, .ds-stats, .ds-title-block { grid-template-columns: 1fr 1fr; } .ds-header { flex-direction: column; gap: 1rem; } }
</style>
</head>
<body class="theme-drawing-index">
<div class="ds-sheet">
  <nav class="ds-nav">
    <a href="index.html">← Home</a>
    <a href="tools.html">Tools Index</a>
    <a href="pricing.html">Pricing</a>
    <a href="pro.html">Pro</a>
  </nav>
  <div class="ds-header">
    <div class="ds-header-left">
      <h1>Engineering Calculator Index</h1>
      <div class="ds-subtitle">Deterministic SI Engine · Full Audit Trail · ISO 3864 · DWG Index</div>
    </div>
    <div class="ds-header-right">
      <div class="ds-dwg-no">DWG NO: SC-INDEX-001</div>
      <div>SCALE: NTS</div>
      <div>REV: A · DATE: 2026-07-25</div>
      <div>ENGINE VERSION: suite-v1.1.0</div>
      <div>SHEET 1 OF 1</div>
    </div>
  </div>
  <div class="ds-stats">
    <div class="ds-stat"><div class="stat-value">25</div><div class="stat-label">Live Tools</div></div>
    <div class="ds-stat"><div class="stat-value">0</div><div class="stat-label">In Pipeline</div></div>
    <div class="ds-stat"><div class="stat-value">100%</div><div class="stat-label">Deterministic</div></div>
    <div class="ds-stat"><div class="stat-value">A1–A5</div><div class="stat-label">Audit Trail</div></div>
    <div class="ds-stat"><div class="stat-value">0</div><div class="stat-label">Data Leaves Browser</div></div>
  </div>
  <div class="ds-category">
    <div class="ds-category-header"><h2>Live Drawing Set — 25 Calculators</h2><span class="cat-line"></span><span class="cat-count">25 TOOLS</span></div>
    <div class="ds-tool-grid">
${cards}
    </div>
  </div>
  <div class="ds-table-view">
    <h3>Complete Drawing Index</h3>
    <table class="ds-index-table">
      <thead><tr><th>DWG NO</th><th>Tool Name</th><th>Sector</th><th>Standard</th><th>Status</th><th>Rev</th></tr></thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>
  <table class="ds-revision-table">
    <thead><tr><th>Rev</th><th>Description</th><th>Date</th><th>By</th><th>Approved</th></tr></thead>
    <tbody><tr><td>A</td><td>Engineering drawing theme v2.0 — 25 live tools, deterministic audit trail</td><td>2026-07-25</td><td>SC-ENGINE</td><td>Auto</td></tr></tbody>
  </table>
  <div class="ds-title-block">
    <div class="tb-cell"><div class="tb-label">DWG NO</div><div class="tb-value">SC-INDEX-001</div></div>
    <div class="tb-cell"><div class="tb-label">SCALE</div><div class="tb-value">NTS</div></div>
    <div class="tb-cell"><div class="tb-label">REV</div><div class="tb-value">A</div></div>
    <div class="tb-cell"><div class="tb-label">DATE</div><div class="tb-value">2026-07-25</div></div>
  </div>
</div>
<script>
/* CI catalog contract — 25 live tools */
const TOOLS=[
${toolsArray}
];
window.__SECTORCALC_TOOLS__ = TOOLS;
</script>
</body>
</html>
`;
}

writeFileSync(join(ROOT, 'tools.html'), buildToolsHtml());
console.log('[OK] tools.html');

for (const tool of TOOLS) {
  // Preserve existing SC-008 interactive body: only write themed shells for shared tools.
  // For SC-008, write a themed companion note file is not needed — keep current sc008 and patch header via separate step.
  if (tool.keepModule) {
    console.log(`[SKIP rewrite] ${tool.file} (dedicated Monte Carlo UX retained)`);
    continue;
  }
  writeFileSync(join(ROOT, tool.file), buildCalculatorSource(tool));
  console.log(`[OK] ${tool.file}`);
}

console.log(`[PASS] Applied engineering theme source shells for ${TOOLS.filter((t) => !t.keepModule).length} calculators + tools index`);
console.log(`TEMPLATE_BYTES=${TEMPLATE.length}`);
