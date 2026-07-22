/**
 * SC-008 commercial/evidence layer (P4). Pure + localStorage only.
 *  - CSV import of dimensions (name,nominal,tol,distribution)
 *  - save / load / list / delete named projects (localStorage)
 *  - tamper-evident integrity hash on share URLs (NOT a server signature:
 *    a client-embedded secret cannot be a real signature. Server-signed
 *    share is a later RM via Cloud Function. This only proves the URL
 *    state was not altered in transit / by hand.)
 *  - revision compare (deltas between two result snapshots)
 */

export interface DimRow {
  name: string;
  nominal: number;
  tol: number;
  dist: string;
}

export interface ProjectState {
  specUpper: string;
  specLower: string;
  cpkTarget: string;
  seed: string;
  unit: string;
  dims: DimRow[];
}

export interface ResultSnap {
  cpk: number;
  ppm: number;
  rss: number;
  worst: number;
  label: string;
}

const KEY = 'sectorcalc.sc008.projects.v1';
const VALID_DIST = ['normal', 'uniform', 'truncated_normal', 'triangular'];

export function parseCSV(text: string): DimRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !/^name/i.test(l));
  const out: DimRow[] = [];
  for (const line of lines) {
    const c = line.split(',').map((s) => s.trim());
    if (c.length < 3) continue;
    const name = c[0] ?? 'Dim';
    const nominal = Number(c[1]);
    const tol = Number(c[2]);
    const rawDist = (c[3] ?? 'normal').toLowerCase();
    const dist = VALID_DIST.includes(rawDist) ? rawDist : 'normal';
    if (!Number.isFinite(nominal) || !Number.isFinite(tol) || tol < 0) continue;
    out.push({ name, nominal, tol, dist });
  }
  return out;
}

export function toCSV(dims: DimRow[]): string {
  const head = 'name,nominal,tol,distribution';
  const rows = dims.map((d) => `${csvEsc(d.name)},${d.nominal},${d.tol},${d.dist}`);
  return [head, ...rows].join('\n');
}

function csvEsc(s: string): string {
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function readAll(): Record<string, ProjectState> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Record<string, ProjectState>;
  } catch {
    return {};
  }
}

function writeAll(m: Record<string, ProjectState>): void {
  localStorage.setItem(KEY, JSON.stringify(m));
}

export function saveProject(name: string, state: ProjectState): void {
  const m = readAll();
  m[name] = state;
  writeAll(m);
}

export function loadProject(name: string): ProjectState | null {
  return readAll()[name] ?? null;
}

export function listProjects(): string[] {
  return Object.keys(readAll()).sort();
}

export function deleteProject(name: string): void {
  const m = readAll();
  delete m[name];
  writeAll(m);
}

// Synchronous, deterministic, tamper-evident (double FNV-1a). Not cryptographic.
export function integrityHash(state: ProjectState): string {
  const s = JSON.stringify(state);
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b1;
  for (let i = 0; i < s.length; i++) {
    const ch = s.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= ch;
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
}

export function makeShareURL(origin: string, state: ProjectState): string {
  const s = encodeURIComponent(JSON.stringify(state));
  return `${origin}/sc008-pro.html?s=${s}&h=${integrityHash(state)}`;
}

export function parseShareURL(search: string): { state: ProjectState | null; ok: boolean; tampered: boolean } {
  const p = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const raw = p.get('s');
  const h = p.get('h');
  if (!raw) return { state: null, ok: false, tampered: false };
  try {
    const state = JSON.parse(decodeURIComponent(raw)) as ProjectState;
    if (!h) return { state, ok: true, tampered: false };
    return { state, ok: true, tampered: integrityHash(state) !== h };
  } catch {
    return { state: null, ok: false, tampered: false };
  }
}

export function compareRevisions(
  a: ResultSnap,
  b: ResultSnap
): { metric: string; a: number; b: number; delta: number; better: boolean }[] {
  const row = (metric: string, va: number, vb: number, higherBetter: boolean) => ({
    metric,
    a: va,
    b: vb,
    delta: vb - va,
    better: higherBetter ? vb - va > 0 : vb - va < 0
  });
  return [
    row('Predicted Cpk', a.cpk, b.cpk, true),
    row('Predicted PPM', a.ppm, b.ppm, false),
    row('RSS', a.rss, b.rss, false),
    row('Worst-case', a.worst, b.worst, false)
  ];
}
