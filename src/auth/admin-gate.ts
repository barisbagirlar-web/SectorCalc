/**
 * Ops console gate: obscure path + passphrase + admin email allowlist.
 * Client-side gate is friction/defense-in-depth — pair with Firebase Auth.
 */
const GATE_KEY = 'sectorcalc-ops-gate';

function vite(name: string): string {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return typeof env?.[name] === 'string' ? env[name]! : '';
}

export function getOpsAdminEmails(): string[] {
  return vite('VITE_OPS_ADMIN_EMAILS')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isOpsGateConfigured(): boolean {
  return Boolean(vite('VITE_OPS_GATE_HASH')) && getOpsAdminEmails().length > 0;
}

export function isOpsUnlocked(): boolean {
  try {
    return sessionStorage.getItem(GATE_KEY) === '1';
  } catch {
    return false;
  }
}

export function lockOpsGate(): void {
  try {
    sessionStorage.removeItem(GATE_KEY);
  } catch {
    /* ignore */
  }
}

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function unlockOpsGate(passphrase: string): Promise<boolean> {
  const expected = vite('VITE_OPS_GATE_HASH').toLowerCase();
  if (!expected) return false;
  const got = (await sha256Hex(passphrase.trim())).toLowerCase();
  if (got !== expected) return false;
  sessionStorage.setItem(GATE_KEY, '1');
  return true;
}

export function isOpsAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const allow = getOpsAdminEmails();
  if (allow.length === 0) return false;
  return allow.includes(email.trim().toLowerCase());
}

export function canEnterOps(email: string | null | undefined): boolean {
  return isOpsGateConfigured() && isOpsUnlocked() && isOpsAdminEmail(email);
}
