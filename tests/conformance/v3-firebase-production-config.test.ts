import { describe, expect, it } from 'vitest';
import {
  DISCOVERY_CACHE_VALUE,
  DISCOVERY_SOURCE,
  HSTS_VALUE,
  hardenFirebaseConfig,
  validateHardenedFirebaseConfig,
} from '../../scripts/prepare-firebase-production-config.mjs';

function baseConfig() {
  return {
    hosting: {
      public: 'dist',
      headers: [
        {
          source: '**',
          headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }],
        },
        {
          source: DISCOVERY_SOURCE,
          headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }],
        },
      ],
    },
  };
}

describe('production Firebase SEO/security hardening', () => {
  it('adds one-year HSTS without preload and tightens discovery caching', () => {
    const hardened = hardenFirebaseConfig(baseConfig());
    expect(validateHardenedFirebaseConfig(hardened)).toEqual([]);

    const globalRule = hardened.hosting.headers.find((rule) => rule.source === '**');
    const hsts = globalRule?.headers.find((header) => header.key === 'Strict-Transport-Security')?.value;
    expect(hsts).toBe(HSTS_VALUE);
    expect(hsts).not.toMatch(/preload/i);

    const discoveryRule = hardened.hosting.headers.find((rule) => rule.source === DISCOVERY_SOURCE);
    expect(discoveryRule?.headers.find((header) => header.key === 'Cache-Control')?.value).toBe(DISCOVERY_CACHE_VALUE);
  });

  it('is idempotent and does not duplicate managed headers', () => {
    const once = hardenFirebaseConfig(baseConfig());
    const twice = hardenFirebaseConfig(once);
    expect(twice).toEqual(once);

    const globalRule = twice.hosting.headers.find((rule) => rule.source === '**');
    expect(globalRule?.headers.filter((header) => header.key.toLowerCase() === 'strict-transport-security')).toHaveLength(1);
  });

  it('fails validation on weak or preload HSTS and stale discovery caching', () => {
    const invalid = hardenFirebaseConfig(baseConfig());
    const globalRule = invalid.hosting.headers.find((rule) => rule.source === '**');
    const hsts = globalRule?.headers.find((header) => header.key === 'Strict-Transport-Security');
    if (hsts) hsts.value = 'max-age=60; preload';
    const discoveryRule = invalid.hosting.headers.find((rule) => rule.source === DISCOVERY_SOURCE);
    const cache = discoveryRule?.headers.find((header) => header.key === 'Cache-Control');
    if (cache) cache.value = 'public, max-age=86400';

    const errors = validateHardenedFirebaseConfig(invalid);
    expect(errors.some((error) => error.includes('HSTS mismatch'))).toBe(true);
    expect(errors).toContain('HSTS preload must not be enabled by this automation');
    expect(errors.some((error) => error.includes('discovery Cache-Control mismatch'))).toBe(true);
  });
});
