/**
 * Tamper-evident share-state integrity (client-side, not a server signature).
 * Shared by SC-001 / SC-008 / SC-010 / SC-012 share URLs.
 */

function fnvDual(s: string): string {
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

export function integrityHashState(state: unknown): string {
  return fnvDual(JSON.stringify(state));
}

export function makeIntegrityShareURL(origin: string, path: string, state: unknown): string {
  const s = encodeURIComponent(JSON.stringify(state));
  return `${origin}${path}?s=${s}&h=${integrityHashState(state)}`;
}

export function parseIntegrityShare(search: string): {
  state: unknown | null;
  ok: boolean;
  tampered: boolean;
  missingHash: boolean;
} {
  const p = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const raw = p.get('s');
  const h = p.get('h');
  if (!raw) return { state: null, ok: false, tampered: false, missingHash: false };
  try {
    const state = JSON.parse(decodeURIComponent(raw));
    if (!h) return { state, ok: true, tampered: true, missingHash: true };
    const match = integrityHashState(state) === h;
    return { state, ok: true, tampered: !match, missingHash: false };
  } catch {
    return { state: null, ok: false, tampered: false, missingHash: false };
  }
}
