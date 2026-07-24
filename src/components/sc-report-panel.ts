import { LitElement, html, css } from 'lit';
import Chart from 'chart.js/auto';
import type { ToolReport } from '../lib/tool-report.js';

/** 360-degree report panel: verdict + gauge + risk + insights + standards. */
export class ScReportPanel extends LitElement {
  static properties = { report: { type: Object } };
  declare report: ToolReport | null;
  private chart: Chart | null = null;
  private canvas: HTMLCanvasElement | null = null;

  constructor() { super(); this.report = null; }

  private gaugeColor(r: ToolReport): string {
    const v = r.metricValue;
    const good = r.direction === 'high' ? v >= r.warn : v <= r.warn;
    const critical = r.direction === 'high' ? v < r.crit : v > r.crit;
    if (critical) return '#e74c3c';
    return good ? '#27ae60' : '#f39c12';
  }

  private drawGauge() {
    if (!this.report) return;
    this.canvas = this.renderRoot.querySelector('canvas');
    if (!this.canvas) return;
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = this.canvas.getContext('2d');
    } catch {
      return; // jsdom without canvas package
    }
    if (!ctx) return;
    const r = this.report;
    const color = this.gaugeColor(r);
    let track = '#ecf0f1';
    try {
      track = getComputedStyle(document.documentElement).getPropertyValue('--bg-2').trim() || track;
    } catch { /* ignore */ }
    const cfg = {
      type: 'doughnut' as const,
      data: { labels: ['v', ''], datasets: [{ data: [Math.min(r.metricValue, r.gaugeMax), Math.max(r.gaugeMax - r.metricValue, 0)], backgroundColor: [color, track] }] },
      options: { rotation: -90, circumference: 180, cutout: '70%', animation: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } }
    };
    if (this.chart) {
      try {
        this.chart.data = cfg.data;
        this.chart.update();
      } catch {
        // Incomplete canvas environment during update.
      }
      return;
    }
    try {
      this.chart = new Chart(ctx, cfg as never);
    } catch {
      this.chart = null;
    }
  }

  render() {
    if (!this.report) return html`<div class="empty">Run a calculation to see the 360° report.</div>`;
    const r = this.report;
    const vc = r.verdict === 'PASS' ? 'pass' : r.verdict === 'MARGINAL' ? 'warn' : 'crit';
    return html`
      <h3>360° Report</h3>
      <div class="verdict ${vc}">${r.verdict}</div>
      <div class="gauge"><canvas></canvas><div class="metric">${r.metricName}: ${r.metricValue}</div></div>
      <div class="risk">${r.riskAnalysis.map((x) => html`<div class="ri ${x.level.toLowerCase()}"><strong>${x.level}</strong> ${x.message} <em>→ ${x.recommendation}</em></div>`)}</div>
      <div class="block"><h4>Actionable insights</h4><ul>${r.insights.map((i) => html`<li>${i}</li>`)}</ul></div>
      <div class="block"><h4>Standards</h4><ul>${r.standards.map((s) => html`<li>${s}</li>`)}</ul></div>
    `;
  }

  firstUpdated() { this.drawGauge(); }
  updated() { this.drawGauge(); }
  disconnectedCallback() { super.disconnectedCallback(); this.chart?.destroy(); this.chart = null; }

  static styles = css`
    :host { display: block; background: var(--bg-1, #fff); color: var(--text-primary, #2d3436); border: 1px solid var(--border-subtle, #dfe6e9); border-radius: 12px; padding: 20px; margin-top: 16px; }
    h3 { font: 700 16px var(--sc-sans, system-ui); margin: 0 0 10px; color: var(--text-primary, #2d3436); }
    .verdict { display: inline-block; font: 800 18px var(--sc-sans, system-ui); padding: 6px 14px; border-radius: 8px; }
    .verdict.pass { background: var(--accent-green-glow, #eafaf1); color: var(--accent-green, #27ae60); }
    .verdict.warn { background: var(--accent-amber-glow, #fef9e7); color: var(--accent-amber, #f39c12); }
    .verdict.crit { background: var(--accent-red-glow, #fdedec); color: var(--accent-red, #e74c3c); }
    .gauge { max-width: 220px; margin: 12px 0; text-align: center; }
    .metric { font: 600 13px var(--sc-mono, monospace); color: var(--text-primary, var(--sc-steel, #2d3436)); }
    .ri { padding: 8px 10px; border-radius: 8px; font: 13px var(--sc-sans, system-ui); margin-bottom: 6px; color: var(--text-primary, #2d3436); }
    .ri em { color: var(--text-muted, var(--sc-muted, #636e72)); font-style: normal; }
    .ri.critical { background: var(--accent-red-glow, #fdedec); border-left: 4px solid var(--accent-red, #e74c3c); }
    .ri.warning { background: var(--accent-amber-glow, #fef9e7); border-left: 4px solid var(--accent-amber, #f39c12); }
    .ri.pass { background: var(--accent-green-glow, #eafaf1); border-left: 4px solid var(--accent-green, #27ae60); }
    .block h4 { font: 700 14px var(--sc-sans, system-ui); margin: 12px 0 6px; color: var(--text-primary, #2d3436); }
    .block ul { margin: 0; padding-left: 18px; font: 13px var(--sc-sans, system-ui); line-height: 1.7; color: var(--text-secondary, #4A4A4A); }
    .empty { color: var(--text-muted, #636e72); }
  `;
}
if (!customElements.get('sc-report-panel')) customElements.define('sc-report-panel', ScReportPanel);
