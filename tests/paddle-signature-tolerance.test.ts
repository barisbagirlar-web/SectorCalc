import { describe, expect, it } from 'vitest';
import { createHmac } from 'node:crypto';
import { verifyPaddleSignature } from '../functions/src/domain/paddle-signature';

const secret = 'whsec_production';
const raw = '{"event_id":"evt_1","event_type":"transaction.completed"}';

function sign(body: string, tsSeconds: number): string {
  const h1 = createHmac('sha256', secret).update(`${tsSeconds}:${body}`).digest('hex');
  return `ts=${tsSeconds};h1=${h1}`;
}

const NOW = 1_700_000_000_000; // fixed "now" for tests

describe('verifyPaddleSignature timestamp tolerance', () => {
  it('accepts a valid signature with a fresh timestamp', () => {
    const sig = sign(raw, Math.floor(NOW / 1000));
    expect(verifyPaddleSignature(raw, sig, secret, { now: NOW })).toBe(true);
  });

  it('accepts a valid signature just inside the 5 minute window', () => {
    const sig = sign(raw, Math.floor(NOW / 1000) - 4 * 60);
    expect(verifyPaddleSignature(raw, sig, secret, { now: NOW })).toBe(true);
  });

  it('rejects a valid signature older than 5 minutes (replay)', () => {
    const sig = sign(raw, Math.floor(NOW / 1000) - 6 * 60);
    expect(verifyPaddleSignature(raw, sig, secret, { now: NOW })).toBe(false);
  });

  it('rejects a signature from the future (clock skew > 1 min)', () => {
    const sig = sign(raw, Math.floor(NOW / 1000) + 2 * 60);
    expect(verifyPaddleSignature(raw, sig, secret, { now: NOW })).toBe(false);
  });

  it('rejects signatures with a missing or malformed ts', () => {
    const good = sign(raw, Math.floor(NOW / 1000));
    const noTs = good.replace(/^ts=\d+/, 'ts=');
    expect(verifyPaddleSignature(raw, noTs, secret, { now: NOW })).toBe(false);
    expect(
      verifyPaddleSignature(raw, `ts=notanumber;h1=${good.split(';')[1]}`, secret, { now: NOW })
    ).toBe(false);
  });

  it('rejects a tampered body even with a fresh timestamp', () => {
    const sig = sign(raw, Math.floor(NOW / 1000));
    expect(verifyPaddleSignature(raw + ' ', sig, secret, { now: NOW })).toBe(false);
  });

  it('rejects when the secret is empty', () => {
    const sig = sign(raw, Math.floor(NOW / 1000));
    expect(verifyPaddleSignature(raw, sig, '', { now: NOW })).toBe(false);
  });
});
