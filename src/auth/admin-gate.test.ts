import { describe, it, expect, beforeEach } from 'vitest';
import { sha256Hex, isOpsAdminEmail, unlockOpsGate, isOpsUnlocked, lockOpsGate } from './admin-gate.js';

describe('admin-gate', () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      value: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => store.set(k, v),
        removeItem: (k: string) => store.delete(k)
      }
    });
    lockOpsGate();
  });

  it('hashes passphrase with sha256', async () => {
    const hex = await sha256Hex('abc');
    expect(hex).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });

  it('allowlists admin emails case-insensitively when env is empty → false', () => {
    expect(isOpsAdminEmail('anyone@example.com')).toBe(false);
  });

  it('unlock fails without configured hash', async () => {
    expect(await unlockOpsGate('nope')).toBe(false);
    expect(isOpsUnlocked()).toBe(false);
  });
});
