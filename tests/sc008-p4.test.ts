// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  parseCSV,
  toCSV,
  saveProject,
  loadProject,
  listProjects,
  deleteProject,
  integrityHash,
  makeShareURL,
  parseShareURL,
  compareRevisions
} from '../src/lib/sc008-p4.js';
import type { ProjectState, ResultSnap } from '../src/lib/sc008-p4.js';

const state: ProjectState = {
  specUpper: '0.15',
  specLower: '-0.15',
  cpkTarget: '1.33',
  seed: '12345',
  unit: 'mm',
  dims: [
    { name: 'A', nominal: 10, tol: 0.2, dist: 'normal' },
    { name: 'B', nominal: 20, tol: 0.3, dist: 'uniform' }
  ]
};

beforeEach(() => localStorage.clear());

describe('CSV', () => {
  it('parses rows and skips header + bad lines', () => {
    const csv = 'name,nominal,tol,distribution\nA,10,0.2,normal\nbad\nC,30,0.1,weird';
    const r = parseCSV(csv);
    expect(r.length).toBe(2);
    expect(r[1]!.dist).toBe('normal');
  });

  it('round-trips through toCSV', () => {
    expect(parseCSV(toCSV(state.dims)).length).toBe(2);
  });
});

describe('projects (localStorage)', () => {
  it('save / load / list / delete', () => {
    saveProject('job1', state);
    expect(loadProject('job1')?.seed).toBe('12345');
    expect(listProjects()).toEqual(['job1']);
    deleteProject('job1');
    expect(loadProject('job1')).toBeNull();
  });

  it('load missing returns null', () => {
    expect(loadProject('nope')).toBeNull();
  });
});

describe('integrity share', () => {
  it('hash is deterministic', () => {
    expect(integrityHash(state)).toBe(integrityHash(state));
  });

  it('makeShareURL + parseShareURL round-trips with ok=true, tampered=false', () => {
    const url = makeShareURL('https://x', state);
    const q = url.split('?')[1]!;
    const r = parseShareURL(q);
    expect(r.ok).toBe(true);
    expect(r.tampered).toBe(false);
    expect(r.state?.seed).toBe('12345');
  });

  it('detects a tampered state', () => {
    const url = makeShareURL('https://x', state);
    const q = url.split('?')[1]!;
    const p = new URLSearchParams(q);
    const st = JSON.parse(decodeURIComponent(p.get('s')!)) as ProjectState;
    st.seed = '99999';
    const bad = `s=${encodeURIComponent(JSON.stringify(st))}&h=${p.get('h')}`;
    const r = parseShareURL(bad);
    expect(r.ok).toBe(true);
    expect(r.tampered).toBe(true);
  });

  it('legacy link without h still loads (ok, not tampered)', () => {
    const r = parseShareURL('s=' + encodeURIComponent(JSON.stringify(state)));
    expect(r.ok).toBe(true);
    expect(r.tampered).toBe(false);
  });
});

describe('revision compare', () => {
  it('flags Cpk increase as better, PPM increase as worse', () => {
    const a: ResultSnap = { cpk: 1.0, ppm: 1000, rss: 0.3, worst: 0.5, label: 'A' };
    const b: ResultSnap = { cpk: 1.3, ppm: 200, rss: 0.2, worst: 0.4, label: 'B' };
    const rows = compareRevisions(a, b);
    expect(rows.find((r) => r.metric === 'Predicted Cpk')?.better).toBe(true);
    expect(rows.find((r) => r.metric === 'Predicted PPM')?.better).toBe(true);
  });
});
