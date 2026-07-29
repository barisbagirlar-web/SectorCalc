import { LatestCalculation, engineErrorMessage } from './engine-api/client.js';
import type { StackComponent, StackInput, StackResult } from './engine-api/types.js';
import { sha256 } from './core/checksum.js';
import { convert } from './core/unit-converter.js';
import { histogramBins, paretoData, compareData } from './lib/stack-chart-data.js';
import { buildReportData } from './lib/report-data.js';
import type { StackChange } from './components/sc-stack-editor.js';
import type { WarningData } from './components/sc-warning-panel.js';
import type { StackPdfInput } from './lib/stack-pdf-builder.js';
import './components/sc-stack-editor.js';
import './components/sc-stack-result.js';
import './components/sc-warning-panel.js';
import './components/sc-stack-chart.js';
import './components/sc-stack-pdf.js';

type El<T> = HTMLElement & T;
const editor = document.querySelector('sc-stack-editor') as El<{
  spec: StackChange['spec'];
  components: StackChange['components'];
}>;
const resultEl = document.querySelector('sc-stack-result') as El<{ result: StackResult | null }>;
const warnEl = document.querySelector('sc-warning-panel') as El<{ warnings: WarningData[] }>;
const histEl = document.querySelector('#hist') as El<{
  data: { labels: string[]; values: number[] };
}>;
const paretoEl = document.querySelector('#pareto') as El<{
  data: { labels: string[]; values: number[] };
}>;
const compareEl = document.querySelector('#compare') as El<{
  data: { labels: string[]; values: number[] };
}>;
const gaugeEl = document.querySelector('#gauge') as El<{
  data: { labels: string[]; values: number[] };
}>;
const trendEl = document.querySelector('#trend') as El<{
  data: { labels: string[]; values: number[] };
}>;
const pdfEl = document.querySelector('sc-stack-pdf') as El<{ input: StackPdfInput | null }>;
const requests = new LatestCalculation();

async function recalc(detail: StackChange) {
  const toMM = (v: string, u: string) => convert(v, u, 'mm', 'length').toString();
  const components: StackComponent[] = detail.components.map((c) => ({
    name: c.name,
    nominal: toMM(c.nominal, c.nominalUnit),
    tol: toMM(c.tol, c.tolUnit),
    distribution: c.distribution,
    cpk: c.cpk === '' ? undefined : c.cpk
  }));
  const input: StackInput = {
    components,
    usl: toMM(detail.spec.usl, detail.spec.uslUnit),
    lsl: toMM(detail.spec.lsl, detail.spec.lslUnit),
    target:
      detail.spec.target === '' ? undefined : toMM(detail.spec.target, detail.spec.targetUnit),
    seed: detail.spec.seed === '' ? undefined : Number(detail.spec.seed),
    iterations: detail.spec.iterations === '' ? undefined : Number(detail.spec.iterations)
  };
  editor.toggleAttribute('aria-busy', true);
  editor.style.pointerEvents = 'none';
  try {
    const response = await requests.run('SC-008', input);
    if (!response) return;
    const result = response.result;
    const warnings = result.warnings;
    resultEl.result = result;
    warnEl.warnings = warnings as unknown as WarningData[];
    const samplesNum = result.samples;
    // histogramBins returns HistBin[]; Chart shell wants labels/values.
    const bins = histogramBins(samplesNum);
    histEl.data = { labels: bins.map((b) => b.label), values: bins.map((b) => b.count) };
    paretoEl.data = paretoData(result.pareto);
    const mcSpread = (Number(result.mcP9987) - Number(result.mcP0013)) / 2;
    compareEl.data = compareData(result.worstPlus, result.rssPlus, String(mcSpread));
    if (gaugeEl) gaugeEl.data = { labels: ['Cpk'], values: [Number(result.cpk)] };
    const whatIf = result.sensitivity ?? [];
    if (trendEl)
      trendEl.data = {
        labels: whatIf.map((p) => p.name),
        values: whatIf.map((p) => Number(p.cpk))
      };
    const checksum = await sha256(JSON.stringify(result));
    const byName = new Map(result.pareto.map((p) => [p.name, p.pct]));
    pdfEl.input = {
      toolCode: 'SC-008',
      nominalSum: result.nominalSum,
      worstPlus: result.worstPlus,
      rssPlus: result.rssPlus,
      mcMean: result.mcMean,
      mcStd: result.mcStd,
      mcP0013: result.mcP0013,
      mcP9987: result.mcP9987,
      cp: result.cp,
      cpk: result.cpk,
      ppm: result.ppm,
      seed: result.seed,
      iterations: result.iterations,
      components: components.map((c) => ({
        name: c.name,
        nominal: String(c.nominal),
        tol: String(c.tol),
        distribution: c.distribution,
        pct: byName.get(c.name) ?? '0.0'
      })),
      warnings: warnings.map((w) => ({ severity: w.severity, message: w.message })),
      steps: result.steps,
      checksum,
      reportData: buildReportData(result)
    };
  } catch (err) {
    warnEl.warnings = [
      {
        code: 'CALC_ERROR',
        severity: 'CRITICAL',
        message: engineErrorMessage(err),
        action: 'Check your active session and inputs.'
      }
    ];
  } finally {
    editor.removeAttribute('aria-busy');
    editor.style.pointerEvents = '';
  }
}

editor.addEventListener('sc-stack-change', (e) => {
  void recalc((e as CustomEvent).detail as StackChange);
});
// initial render
editor.dispatchEvent(
  new CustomEvent('sc-stack-change', {
    detail: { spec: editor.spec, components: editor.components },
    bubbles: true,
    composed: true
  })
);
