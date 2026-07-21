// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import './sc-chart.js';
import { ScChart } from './sc-chart.js';

// jsdom has no canvas 2d context; provide a minimal stub so Chart.js can construct.
HTMLCanvasElement.prototype.getContext = vi.fn(function (this: HTMLCanvasElement) {
  return {
    canvas: this,
    clearRect() {}, fillRect() {}, beginPath() {}, closePath() {}, arc() {}, fill() {}, stroke() {},
    moveTo() {}, lineTo() {}, save() {}, restore() {}, clip() {}, setTransform() {}, resetTransform() {},
    transform() {}, translate() {}, scale() {}, rotate() {}, setLineDash() {},
    createLinearGradient: () => ({ addColorStop() {} }),
    measureText: () => ({ width: 0 }),
    fillText() {}, strokeText() {}
  };
}) as unknown as typeof HTMLCanvasElement.prototype.getContext;

async function mount(el: ScChart): Promise<ScChart> {
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('sc-chart', () => {
  it('renders a canvas', async () => {
    const el = await mount(new ScChart());
    expect(el.shadowRoot?.querySelector('canvas')).not.toBeNull();
  });

  it('updates without throwing when breakdown changes', async () => {
    const el = await mount(new ScChart());
    el.breakdown = [{ item: 'A', pct: '60' }, { item: 'B', pct: '40' }];
    await el.updateComplete;
    el.breakdown = [{ item: 'A', pct: '70' }, { item: 'B', pct: '30' }];
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('canvas')).not.toBeNull();
  });

  it('destroys chart on disconnect', async () => {
    const el = await mount(new ScChart());
    el.breakdown = [{ item: 'A', pct: '100' }];
    await el.updateComplete;
    el.remove();
    expect(el.shadowRoot?.querySelector('canvas')).not.toBeNull();
  });
});
