/**
 * Paddle-Signature verification (shared SSOT for Functions + unit tests).
 * @see https://developer.paddle.com/webhooks/signature-verification
 */
import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifyPaddleSignature(
  rawBody: Buffer | string,
  signatureHeader: string | undefined,
  secret: string
): boolean {
  if (!signatureHeader || !secret) return false;
  const parts = Object.fromEntries(
    signatureHeader.split(';').map((p) => {
      const [k, v] = p.split('=');
      return [k?.trim(), v?.trim()];
    })
  ) as Record<string, string | undefined>;
  const ts = parts.ts;
  const h1 = parts.h1;
  if (!ts || !h1) return false;
  const payload = `${ts}:${typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8')}`;
  const computed = createHmac('sha256', secret).update(payload).digest('hex');
  try {
    const a = Buffer.from(computed, 'hex');
    const b = Buffer.from(h1, 'hex');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
