import { describe, expect, it } from 'vitest';
import { isTransientGuardFailure } from '../../scripts/run-seo-live-guard.mjs';

describe('SEO live guard transport retry policy', () => {
  it.each([
    'DOMException [TimeoutError]: The operation was aborted due to timeout',
    'TypeError: fetch failed',
    'UND_ERR_CONNECT_TIMEOUT',
    'ECONNRESET',
    'EAI_AGAIN',
  ])('recognizes transient transport failures: %s', (message) => {
    expect(isTransientGuardFailure(message)).toBe(true);
  });

  it.each([
    '[FAIL] live SEO guard: canonical mismatch',
    '[FAIL] live SEO guard: robots policy invalid for Googlebot',
    '[FAIL] live SEO guard: sitemap has duplicate locs',
  ])('does not retry semantic SEO failures: %s', (message) => {
    expect(isTransientGuardFailure(message)).toBe(false);
  });
});
