import { LitElement, html, css } from 'lit';
import Chart from 'chart.js/auto';
import { buildDoughnutData, doughnutColors } from '../lib/chart-data.js';

/**
 * Thin canvas shell. The data math lives in lib/chart-data (pure, tested).
 * Instance is reused via update(); destroyed on disconnect (no leak).
 */
export class ScChart extends LitElement {
  static properties = { breakdown: { type: Array } };
  static styles = css`:host { display: block; } canvas { max-width: 100%; }`;

  declare breakdown: Array<{ item: string; pct: string }>;
  private chart: Chart<'doughnut', number[], string> | null = null;
  private canvas: HTMLCanvasElement | null = null;

  constructor() {
    super();
    this.breakdown = [];
  }

  private draw() {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return; // jsdom without canvas mock: skip silently
    const data = buildDoughnutData(this.breakdown);
    if (this.chart) {
      try {
        this.chart.data.labels = data.labels;
        (this.chart.data.datasets[0] as { data: number[]; backgroundColor: string[] }).data = data.values;
        (this.chart.data.datasets[0] as { data: number[]; backgroundColor: string[] }).backgroundColor = doughnutColors(data.values.length);
        this.chart.update();
      } catch {
        // Incomplete canvas environment during update.
      }
      return;
    }
    try {
      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: { labels: data.labels, datasets: [{ data: data.values, backgroundColor: doughnutColors(data.values.length) }] },
        options: { responsive: false, animation: false, plugins: { legend: { position: 'bottom' } } }
      });
    } catch {
      // Incomplete canvas environment (jsdom): shell still renders <canvas>.
      this.chart = null;
    }
  }

  render() {
    return html`<canvas></canvas>`;
  }

  firstUpdated() {
    this.canvas = this.renderRoot.querySelector('canvas');
    this.draw();
  }

  updated() {
    this.draw();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.chart?.destroy();
    this.chart = null;
  }
}

if (!customElements.get('sc-chart')) customElements.define('sc-chart', ScChart);
