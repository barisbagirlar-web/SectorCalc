/**
 * Locked-demo report bridge.
 *
 * Premium calculators keep authored sample values visible while locked. Their
 * local calculation guards pre-date the shared __scDemoCalcPass contract and
 * can therefore reject the same verified demo restore that the universal gate
 * explicitly allows. This bridge makes that contract authoritative without
 * weakening paid/custom calculations:
 *
 * - real entitlement remains the source of truth outside a demo pass;
 * - locked report generation always restores the golden SCStudy snapshot;
 * - custom DOM edits are discarded before calculation/report rendering;
 * - free tools and entitled sessions are unchanged.
 */

import { freeResultPreviewEnabled } from './free-preview.js';

type UnknownFn = (...args: unknown[]) => unknown;

type DemoGate = {
  isEntitled: () => boolean;
  ensureEntitled: () => Promise<boolean>;
};

type StudyApi = {
  restoreDemoSnapshot?: () => void;
  loadSample?: () => void;
};

type DemoWindow = Window &
  typeof globalThis & {
    __scProGate?: DemoGate;
    __scDemoCalcPass?: boolean;
    __scDemoReportPass?: boolean;
    generateReport?: UnknownFn;
    calculate?: UnknownFn;
    compute?: UnknownFn;
    validateAndCalc?: UnknownFn;
    SCStudy?: StudyApi;
  };

const bridgedGates = new WeakSet<object>();
const paidChecks = new WeakMap<object, () => boolean>();
const wrappedReports = new WeakSet<Function>();
let installed = false;

function toolWindow(): DemoWindow {
  return window as DemoWindow;
}

function isPaidEntitled(gate: DemoGate): boolean {
  const check = paidChecks.get(gate);
  return check ? check() : gate.isEntitled();
}

function bridgeGate(gate: DemoGate): void {
  if (bridgedGates.has(gate)) return;

  const paidCheck = gate.isEntitled.bind(gate);
  const paidEnsure = gate.ensureEntitled.bind(gate);
  paidChecks.set(gate, paidCheck);

  gate.isEntitled = () => {
    const w = toolWindow();
    return w.__scDemoCalcPass === true || w.__scDemoReportPass === true || paidCheck();
  };
  gate.ensureEntitled = async () => {
    const w = toolWindow();
    if (w.__scDemoCalcPass === true || w.__scDemoReportPass === true) return true;
    return paidEnsure();
  };

  bridgedGates.add(gate);
}

function withDemoPass<T>(run: () => T): T {
  const w = toolWindow();
  const previousCalc = w.__scDemoCalcPass;
  const previousReport = w.__scDemoReportPass;
  w.__scDemoCalcPass = true;
  w.__scDemoReportPass = true;
  try {
    return run();
  } finally {
    w.__scDemoCalcPass = previousCalc;
    w.__scDemoReportPass = previousReport;
  }
}

function restoreGoldenDemoAndCalculate(): void {
  const w = toolWindow();
  // Prefer loadSample over restoreDemoSnapshot: tools with a registered
  // loadSample (SC-008/SC-012/SC-001/SC-010) reset their JS state directly
  // (loadPreset -> validateAndCalc/compute + generateReport) instead of poking
  // every form input, so no input-event storm re-runs the full calculation per
  // field (SC-008: ~4s of 18 Decimal recomputes → ~0.6s).
  //
  // No separate calculate() call afterwards: loadSample already runs the same
  // report pipeline as the Generate button, and a second validateAndCalc would
  // go through syncReportIfOpen which clears the tool's _demoReportOpen flag —
  // hiding the DEMO banner right after the demo report renders.
  if (typeof w.SCStudy?.loadSample === 'function') {
    w.SCStudy.loadSample();
  } else if (typeof w.SCStudy?.restoreDemoSnapshot === 'function') {
    w.SCStudy.restoreDemoSnapshot();
  }
}

function wrapGlobalReport(gate: DemoGate): void {
  const w = toolWindow();
  const current = w.generateReport;
  if (typeof current !== 'function' || wrappedReports.has(current)) return;

  const original = current.bind(window);
  const wrapped: UnknownFn = (...args) => {
    if (isPaidEntitled(gate) || w.__scDemoCalcPass === true || w.__scDemoReportPass === true) {
      return original(...args);
    }

    return withDemoPass(() => {
      restoreGoldenDemoAndCalculate();
      return original(...args);
    });
  };

  wrappedReports.add(current);
  wrappedReports.add(wrapped);
  w.generateReport = wrapped;
}

function reportAlreadyOpen(): boolean {
  return Boolean(document.querySelector('#reportArea .sc-report-hd'));
}

function generateLockedDemoReport(): void {
  const w = toolWindow();
  const gate = w.__scProGate;
  if (!gate || isPaidEntitled(gate) || reportAlreadyOpen()) return;

  bridgeGate(gate);
  if (typeof w.generateReport === 'function') {
    w.generateReport();
    return;
  }

  // SC-008 owns its report function locally and exposes only #genReport.
  document.getElementById('genReport')?.click();
}

function armLocalReportPass(): void {
  const w = toolWindow();
  const gate = w.__scProGate;
  if (!gate || isPaidEntitled(gate)) return;

  bridgeGate(gate);
  w.__scDemoCalcPass = true;
  w.__scDemoReportPass = true;
  restoreGoldenDemoAndCalculate();

  // Local async handlers await ensureEntitled(); clear only after their
  // continuation has rendered the deterministic report.
  window.setTimeout(() => {
    w.__scDemoCalcPass = false;
    w.__scDemoReportPass = false;
  }, 0);
}

function onDocumentClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) return;

  if (target.closest('[data-sc-study="sample"]')) {
    // Let SCStudy apply the sample first, then route through the normal report
    // function. SC-012 already renders synchronously and is de-duplicated by
    // reportAlreadyOpen().
    window.setTimeout(generateLockedDemoReport, 0);
    return;
  }

  if (target.closest('#genReport')) armLocalReportPass();
}

function reconcile(): boolean {
  const gate = toolWindow().__scProGate;
  if (!gate) return false;
  bridgeGate(gate);
  wrapGlobalReport(gate);
  return true;
}

export function installDemoReportBridge(): void {
  if (installed) return;
  installed = true;

  // Free result preview: the numeric layer is open but the report layer stays
  // behind the credit gate. Auto-generating a demo report here would hand
  // non-entitled users the sealed report for free, so the bridge stands down.
  // The local Generate Report handlers (ensureEntitled) enforce the gate.
  if (freeResultPreviewEnabled()) return;

  document.addEventListener('click', onDocumentClick, true);

  reconcile();
  let tries = 0;
  const timer = window.setInterval(() => {
    tries += 1;
    reconcile();
    if (tries >= 50) window.clearInterval(timer);
  }, 100);
}
