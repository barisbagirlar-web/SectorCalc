/**
 * GOLDEN TESTS — real verification, hand-checked expected values.
 * Source: claude_pro_tasarim_/engine-golden.test.ts (verified engine design)
 *
 * Run: npx tsx src/lib/formula-governance/calculation-engine/__tests__/golden.test.ts
 * Expected: 28 passed, 0 failed
 */
import type { ToolSchema } from '../types';
import { prepare, compute } from '../engine';
import { AuditService } from '../audit';

let pass = 0, fail = 0;
function check(name: string, cond: boolean, detail = '') {
  if (cond) { pass++; console.log(`  ✓ ${name}${detail ? '  ' + detail : ''}`); }
  else { fail++; console.log(`  ✗ FAIL: ${name}${detail ? '  ' + detail : ''}`); }
}
function near(a: number, b: number, tol = 1e-3) { return Math.abs(a - b) <= tol; }

const rcBeam: ToolSchema = {
  id: 'PRO_117_EC2', version: '1.0.0', name: 'RC Beam EC2 Flexure', industry: 'Civil', riskLevel: 'CRITICAL',
  inputs: [
    { id: 'b_w', label: 'Web width', symbol: 'b_w', unit: 'mm', type: 'number', confidence: 'KESIN', required: true, min: 75, uncertainty: { value: 0.02, relative: true, type: 'B', distribution: 'normal' } },
    { id: 'd', label: 'Effective depth', symbol: 'd', unit: 'mm', type: 'number', confidence: 'KESIN', required: true, min: 50, uncertainty: { value: 0.02, relative: true, type: 'B', distribution: 'normal' } },
    { id: 'A_s', label: 'Tension steel area', symbol: 'A_s', unit: 'mm2', type: 'number', confidence: 'KESIN', required: true, min: 50, uncertainty: { value: 0.01, relative: true, type: 'B', distribution: 'normal' } },
    { id: 'f_ck', label: 'Concrete strength', symbol: 'f_ck', unit: 'MPa', type: 'number', confidence: 'KESIN', required: true, min: 12, uncertainty: { value: 0.03, relative: true, type: 'B', distribution: 'normal' } },
    { id: 'f_yk', label: 'Steel yield', symbol: 'f_yk', unit: 'MPa', type: 'number', confidence: 'KESIN', required: true, defaultValue: 500 },
    { id: 'gamma_c', label: 'γc', symbol: 'γ_c', unit: '-', type: 'number', confidence: 'KESIN', required: true, defaultValue: 1.5 },
    { id: 'gamma_s', label: 'γs', symbol: 'γ_s', unit: '-', type: 'number', confidence: 'KESIN', required: true, defaultValue: 1.15 },
    { id: 'alpha_cc', label: 'αcc', symbol: 'α_cc', unit: '-', type: 'number', confidence: 'GUCLU', required: true, defaultValue: 0.85 },
    { id: 'M_Ed', label: 'Design moment', symbol: 'M_Ed', unit: 'kNm', type: 'number', confidence: 'KESIN', required: true, min: 0, uncertainty: { value: 0.02, relative: true, type: 'B', distribution: 'normal' } },
  ],
  // Deliberately scrambled order — engine must topo-sort.
  formulas: [
    { id: 'F8', outputVar: 'M_Rd', expression: 'A_s * f_yd * z / 1e6', unit: 'kNm' },
    { id: 'F36', outputVar: 'UC_M', expression: 'M_Ed / M_Rd', unit: '-' },
    { id: 'F6', outputVar: 'x', expression: 'A_s * f_yd / (eta * f_cd * b_w * lambda)', unit: 'mm', domainGuard: { condition: 'x < d', errorMessage: 'Over-reinforced: x >= d. Increase section or reduce A_s.' } },
    { id: 'F2', outputVar: 'f_cd', expression: 'alpha_cc * f_ck / gamma_c', unit: 'MPa' },
    { id: 'F3', outputVar: 'f_yd', expression: 'f_yk / gamma_s', unit: 'MPa' },
    { id: 'F7', outputVar: 'z', expression: 'min(d - 0.5 * lambda * x, 0.95 * d)', unit: 'mm' },
    { id: 'F4', outputVar: 'lambda', expression: 'f_ck <= 50 ? 0.80 : 0.80 - (f_ck - 50) / 400', unit: '-' },
    { id: 'F5', outputVar: 'eta', expression: 'f_ck <= 50 ? 1.0 : 1.0 - (f_ck - 50) / 200', unit: '-' },
    { id: 'Fk', outputVar: 'k_size', expression: 'min(1 + sqrt(200 / d), 2.0)', unit: '-' },
    { id: 'Fv', outputVar: 'v_min', expression: '0.035 * k_size^1.5 * sqrt(f_ck)', unit: 'MPa' },
  ],
  validationRules: [
    { id: 'V_d', action: 'BLOCK', condition: 'd >= 50', message: 'd must be >= 50mm' },
  ],
  gum: { measurand: 'M_Rd', coverageFactor: 2 },
  auditConfig: { requirePeerReview: true, retentionDays: 3650 },
};

async function run() {
  console.log('\n━━━ TEST 1: RC beam flexure — hand-verified values + topo-sort + functions ━━━');
  const prep = prepare(rcBeam);
  console.log('  topo order:', prep.order.join(' → '));
  const r = compute(prep, { b_w: 300, d: 500, A_s: 1500, f_ck: 30, f_yk: 500, gamma_c: 1.5, gamma_s: 1.15, alpha_cc: 0.85, M_Ed: 200 });
  check('compute ok', r.ok);
  check('f_cd = 17.000 MPa', near(r.results.f_cd, 17.0), `got ${r.results.f_cd?.toFixed(4)}`);
  check('f_yd = 434.783 MPa', near(r.results.f_yd, 434.78261, 1e-3), `got ${r.results.f_yd?.toFixed(5)}`);
  check('x = 159.847 mm', near(r.results.x, 159.84655, 1e-3), `got ${r.results.x?.toFixed(5)}`);
  check('z = 436.061 mm', near(r.results.z, 436.06138, 1e-3), `got ${r.results.z?.toFixed(5)}`);
  check('M_Rd ≈ 284.39 kN·m (hand-calc)', near(r.results.M_Rd, 284.388, 0.05), `got ${r.results.M_Rd?.toFixed(3)}`);
  check('UC_M ≈ 0.7033', near(r.results.UC_M, 0.70327, 1e-3), `got ${r.results.UC_M?.toFixed(5)}`);
  check('k_size ≈ 1.63246 (sqrt works)', near(r.results.k_size, 1.63246, 1e-4), `got ${r.results.k_size?.toFixed(5)}`);
  check('v_min ≈ 0.39987 (^ + sqrt work)', near(r.results.v_min, 0.39987, 1e-4), `got ${r.results.v_min?.toFixed(5)}`);

  console.log('\n━━━ TEST 2: Unit conversion (mm vs m) — same physical input, same result ━━━');
  const areaTool: ToolSchema = {
    id: 'AREA', version: '1', name: 'Area', industry: 'x', riskLevel: 'LOW',
    inputs: [
      { id: 'w', label: 'w', symbol: 'w', unit: 'mm', type: 'number', confidence: 'KESIN', required: true },
      { id: 'h', label: 'h', symbol: 'h', unit: 'mm', type: 'number', confidence: 'KESIN', required: true },
    ],
    formulas: [{ id: 'A', outputVar: 'area', expression: 'w * h', unit: 'mm2' }],
    validationRules: [], auditConfig: { requirePeerReview: false, retentionDays: 1 },
  };
  const pa = prepare(areaTool);
  const inMm = compute(pa, { w: 1000, h: 2000 });
  const areaToolM = { ...areaTool, inputs: areaTool.inputs.map(i => ({ ...i, unit: 'm' } as any)) };
  const inM = compute(prepare(areaToolM as ToolSchema), { w: 1, h: 2 });
  check('1000mm×2000mm = 2,000,000 mm²', near(inMm.results.area, 2_000_000, 1e-6), `got ${inMm.results.area}`);
  check('1m×2m converts to SAME 2,000,000 mm²', near(inM.results.area, 2_000_000, 1e-6), `got ${inM.results.area}`);

  console.log('\n━━━ TEST 3: Fail-closed — over-reinforced triggers domain guard, NO results ━━━');
  const guardSchema: ToolSchema = { ...rcBeam, validationRules: [] };
  const pg = prepare(guardSchema);
  const blocked = compute(pg, { b_w: 100, d: 100, A_s: 5000, f_ck: 20, f_yk: 500, gamma_c: 1.5, gamma_s: 1.15, alpha_cc: 0.85, M_Ed: 50 });
  check('ok === false (blocked)', blocked.ok === false);
  check('results empty (no silent NaN)', Object.keys(blocked.results).length === 0);
  check('error is the domain-guard message', blocked.errors.some(e => /Over-reinforced/.test(e.message)), blocked.errors[0]?.message ?? '');

  console.log('\n━━━ TEST 4: Security — no eval; malicious / invalid expressions rejected ━━━');
  const tryReject = (expr: string) => {
    try { prepare({ ...areaTool, formulas: [{ id: 'X', outputVar: 'area', expression: expr, unit: '-' }] } as ToolSchema); return false; }
    catch { return true; }
  };
  check('allows simple assignment "a = 5"', !tryReject('a = 5'));
  check('rejects disallowed fn "parse(1)"', tryReject('parse(1)'));
  check('rejects unknown symbol "evilVar + 1"', tryReject('evilVar + 1'));
  check('rejects member access "w.constructor"', tryReject('w.constructor'));
  check('accepts legitimate "w * h"', !tryReject('w * h'));

  console.log('\n━━━ TEST 5: GUM uncertainty — finite-diff matches analytic on y = a·b ━━━');
  const gumTool: ToolSchema = {
    id: 'GUM', version: '1', name: 'gum', industry: 'x', riskLevel: 'LOW',
    inputs: [
      { id: 'a', label: 'a', symbol: 'a', unit: '-', type: 'number', confidence: 'KESIN', required: true, uncertainty: { value: 0.1, type: 'B', distribution: 'normal' } },
      { id: 'b', label: 'b', symbol: 'b', unit: '-', type: 'number', confidence: 'KESIN', required: true, uncertainty: { value: 0.2, type: 'B', distribution: 'normal' } },
    ],
    formulas: [{ id: 'Y', outputVar: 'y', expression: 'a * b', unit: '-' }],
    validationRules: [], gum: { measurand: 'y', coverageFactor: 2 },
    auditConfig: { requirePeerReview: false, retentionDays: 1 },
  };
  const rg = compute(prepare(gumTool), { a: 10, b: 20 });
  const uc = rg.uncertainty!;
  check('y = 200', near(uc.value, 200, 1e-9), `got ${uc.value}`);
  check('u_c = 2.828427 (matches analytic)', near(uc.u_c, 2.8284271, 1e-5), `got ${uc.u_c.toFixed(7)}`);
  check('U = 5.656854 (k=2)', near(uc.U, 5.6568542, 1e-5), `got ${uc.U.toFixed(7)}`);
  check('each contributes 50% (computed)', uc.contributions.every(c => near(c.percent, 50, 1e-3)), uc.contributions.map(c => `${c.input}:${c.percent.toFixed(2)}%`).join(' '));

  console.log('\n━━━ TEST 6: Audit — real SHA-256, full payload, tamper-evident chain ━━━');
  const audit = new AuditService();
  const rec1 = await audit.release({ toolId: 'PRO_117', schemaVersion: '1.0.0', inputs: { b_w: 300, d: 500 }, results: { M_Rd: 284.388 } });
  const rec2 = await audit.release({ toolId: 'PRO_117', schemaVersion: '1.0.0', inputs: { b_w: 300, d: 500 }, results: { M_Rd: 284.388 }, prevHash: rec1.recordHash });
  check('hash is 64 hex chars (real SHA-256)', /^[0-9a-f]{64}$/.test(rec1.recordHash), rec1.recordHash.slice(0, 16) + '…');
  check('record verifies', await audit.verify(rec1));
  check('valid chain verifies', await audit.verifyChain([rec1, rec2]));
  const tampered = { ...rec1, results: { M_Rd: 999 } };
  check('tampered record FAILS verification', !(await audit.verify(tampered as any)));
  check('broken chain FAILS', !(await audit.verifyChain([rec1, { ...rec2, prevHash: 'wrong' }])));

  console.log(`\n━━━ RESULT: ${pass} passed, ${fail} failed ━━━\n`);
  process.exit(fail === 0 ? 0 : 1);
}
run();
