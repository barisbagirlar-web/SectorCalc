import { LitElement, html, css } from 'lit';
import Chart from 'chart.js/auto';

/**
 * Thin canvas shell for SC-008 charts. Chart.js requires Number pixel points;
 * all audit math stays Decimal upstream. animation:false for sync render.
 */
export class ScStackChart extends LitElement {
  static properties = { kind: { type: String }, data: { type: Object }, title: { type: String } };
  static styles = css`:host { display: block; margin-bottom: 12px; } canvas { max-width: 100%; } .t { font: 600 13px var(--sc-sans, system-ui); margin-bottom: 4px; }`;
  declare kind: 'histogram' | 'pareto' | 'compare';
  declare data: { labels: string[]; values: number[] };
  declare title: string;
  private chart: Chart | null = null;
  private canvas: HTMLCanvasElement | null = null;
  constructor() { super(); this.kind = 'histogram'; this.data = { labels: [], values: [] }; this.title = ''; }
  private draw() {
    if (!this.canvas) return;
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = this.canvas.getContext('2d');
    } catch {
      return; // jsdom without canvas package
    }
    if (!ctx) return;
    const bg = this.kind === 'compare' ? ['#2d3436', '#d35400', '#27ae60'] : '#d35400';
    const cfg = {
      type: 'bar' as const,
      data: { labels: this.data.labels, datasets: [{ label: this.title, data: this.data.values, backgroundColor: bg }] },
      options: { animation: false as const, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
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
      this.chart = new Chart(ctx, cfg);
    } catch {
      // Incomplete canvas environment (jsdom): shell still renders <canvas>.
      this.chart = null;
    }
  }
  render() { return html`<div class="t">${this.title}</div><canvas></canvas>`; }
  firstUpdated() { this.canvas = this.renderRoot.querySelector('canvas'); this.draw(); }
  updated() { this.draw(); }
  disconnectedCallback() { super.disconnectedCallback(); this.chart?.destroy(); this.chart = null; }
}
if (!customElements.get('sc-stack-chart')) customElements.define('sc-stack-chart', ScStackChart);
