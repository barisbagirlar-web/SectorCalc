import { describe, it, expect } from 'vitest';
import { createHmac } from 'node:crypto';
import { verifyPaddleSignature } from './paddle-signature.js';

describe('verifyPaddleSignature', () => {
  const secret = 'test_webhook_secret';
  const raw = '{"event_id":"evt_1","event_type":"transaction.completed"}';

  function sign(body: string, ts = '1700000000'): string {
    const h1 = createHmac('sha256', secret).update(`${ts}:${body}`).digest('hex');
    return `ts=${ts};h1=${h1}`;
  }

  it('accepts valid signature', () => {
    expect(verifyPaddleSignature(raw, sign(raw), secret)).toBe(true);
  });

  it('rejects missing signature', () => {
    expect(verifyPaddleSignature(raw, undefined, secret)).toBe(false);
  });

  it('rejects invalid signature', () => {
    expect(verifyPaddleSignature(raw, 'ts=1;h1=deadbeef', secret)).toBe(false);
  });

  it('rejects modified body after signing', () => {
    const sig = sign(raw);
    expect(verifyPaddleSignature(raw + ' ', sig, secret)).toBe(false);
  });

  it('rejects empty secret', () => {
    expect(verifyPaddleSignature(raw, sign(raw), '')).toBe(false);
  });
});
