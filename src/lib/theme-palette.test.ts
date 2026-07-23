/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readThemePalette, exportSurfaceBg } from './theme-palette.js';

describe('theme-palette', () => {
  const root = document.documentElement;

  beforeEach(() => {
    root.style.setProperty('--text-primary', '#FFFFFF');
    root.style.setProperty('--text-secondary', '#E8EAEC');
    root.style.setProperty('--text-muted', '#A8B0B8');
    root.style.setProperty('--bg-0', '#14171A');
    root.style.setProperty('--bg-1', '#1B1F23');
    root.style.setProperty('--bg-2', '#2E343A');
    root.style.setProperty('--border-soft', '#3A4046');
    root.style.setProperty('--accent-blue', '#4FA6D6');
    root.style.setProperty('--accent-green', '#007A33');
    root.style.setProperty('--accent-amber', '#E87722');
    root.style.setProperty('--accent-red', '#C8102E');
  });

  afterEach(() => {
    [
      '--text-primary',
      '--text-secondary',
      '--text-muted',
      '--bg-0',
      '--bg-1',
      '--bg-2',
      '--border-soft',
      '--accent-blue',
      '--accent-green',
      '--accent-amber',
      '--accent-red'
    ].forEach((k) => root.style.removeProperty(k));
  });

  it('reads ink/track/blue from CSS vars for dark surfaces', () => {
    const P = readThemePalette();
    expect(P.ink).toBe('#FFFFFF');
    expect(P.track).toBe('#2E343A');
    expect(P.blue).toBe('#4FA6D6');
    expect(P.page).toBe('#14171A');
  });

  it('exportSurfaceBg uses page sheet token', () => {
    expect(exportSurfaceBg()).toBe('#14171A');
  });
});
