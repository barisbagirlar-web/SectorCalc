/**
 * Pure chart-data builders. No DOM, no Chart.js import — so they are tested
 * in node with full determinism. Conservation locked: doughnut slices sum to 100.
 */
import { D } from '../core/engine.js';

export interface Slice { label: string; value: number; }

export interface DoughnutData {
  labels: string[];
  values: number[];
}

export interface BarData {
  labels: string[];
  values: number[];
}

const PALETTE = ['#2d3436', '#d35400', '#e74c3c', '#f39c12', '#27ae60', '#3498db', '#9b59b6', '#1abc9c', '#e67e22', '#16a085'];

export function buildDoughnutData(breakdown: Array<{ item: string; pct: string }>): DoughnutData {
  const slices = breakdown.map((b) => ({ label: b.item, value: Number(b.pct) }));
  // conservation: re-normalize so the visual always sums to exactly 100
  const sum = slices.reduce((a, s) => a + s.value, 0);
  const values = sum > 0 ? slices.map((s) => Number(D(s.value).div(sum).times(100).toFixed(1))) : [];
  return { labels: slices.map((s) => s.label), values };
}

export function doughnutColors(n: number): string[] {
  return Array.from({ length: n }, (_, i) => PALETTE[i % PALETTE.length]!);
}

export function buildSensitivityBar(points: Array<{ net: number; cost: number }>): BarData {
  return {
    labels: points.map((p) => String(p.net)),
    values: points.map((p) => Number(D(p.cost).toFixed(2)))
  };
}
