/**
 * Theme palette for pro-tool reports and charts.
 *
 * Standard for every current and future *-pro tool:
 * - Read colors from CSS custom properties (set by public/sc-theme.css).
 * - Never hardcode light-theme ink (#1A1714) into SVG / canvas / html2canvas.
 * - On `sectorcalc-theme`, regenerate any open report so SVG fills stay readable.
 *
 * Usage:
 *   import { readThemePalette, exportSurfaceBg } from './lib/theme-palette.js';
 *   const P = readThemePalette();
 *   // SVG: fill="${P.ink}" stroke="${P.track}"
 *   // html2canvas: { backgroundColor: exportSurfaceBg() }
 */
export type ThemePalette = {
  ink: string;
  text: string;
  muted: string;
  track: string;
  grid: string;
  axis: string;
  blue: string;
  green: string;
  amber: string;
  red: string;
  surface: string;
  page: string;
  greenFill: string;
  amberFill: string;
  redFill: string;
  blueFill: string;
};

function cssVar(name: string, fallback: string): string {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  } catch {
    return fallback;
  }
}

/** Live CSS-token palette (light or dark). Call at render time, not module load. */
export function readThemePalette(): ThemePalette {
  const ink = cssVar('--text-primary', '#1A1A1A');
  const text = cssVar('--text-secondary', '#4A4A4A');
  const muted = cssVar('--text-muted', '#7A7A7A');
  const track = cssVar('--bg-2', '#E0E0D8');
  const grid = cssVar('--border-soft', '#C5C5BE');
  const axis = cssVar('--text-muted', '#7A7A7A');
  const blue = cssVar('--accent-blue', '#0055A4');
  const green = cssVar('--accent-green', '#007A33');
  const amber = cssVar('--accent-amber', '#E87722');
  const red = cssVar('--accent-red', '#C8102E');
  const surface = cssVar('--bg-1', '#FFFFFF');
  const page = cssVar('--bg-0', '#F5F5F0');
  return {
    ink,
    text,
    muted,
    track,
    grid,
    axis,
    blue,
    green,
    amber,
    red,
    surface,
    page,
    greenFill: cssVar('--accent-green-glow', 'rgba(0,122,51,0.12)'),
    amberFill: cssVar('--accent-amber-glow', 'rgba(232,119,34,0.10)'),
    redFill: cssVar('--accent-red-glow', 'rgba(200,16,46,0.12)'),
    blueFill: cssVar('--accent-blue-glow', 'rgba(0,85,164,0.10)')
  };
}

/** Opaque background for html2canvas / graphic PDF export (matches page sheet). */
export function exportSurfaceBg(): string {
  return cssVar('--bg-0', '#FFFFFF');
}

/** Re-run a callback when the site theme flips (SVG reports stay contrast-safe). */
export function onThemeChange(cb: () => void): void {
  if (typeof window === 'undefined') return;
  window.addEventListener('sectorcalc-theme', cb);
}
