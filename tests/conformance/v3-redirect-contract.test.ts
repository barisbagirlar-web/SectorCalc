import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('SEO V3 phase 2 redirect contract', () => {
  const firebase = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
  const redirects = firebase.hosting.redirects ?? [];
  const bySource = new Map(redirects.map((r: any) => [r.source, r]));

  it('uses permanent single-hop redirects without loops', () => {
    for (const r of redirects) {
      expect([301, 308]).toContain(r.type);
      expect(r.source).not.toBe(r.destination);
      expect(bySource.has(r.destination)).toBe(false);
    }
  });

  it('keeps one trailing-slash policy and required security headers', () => {
    expect(firebase.hosting.trailingSlash).toBe(false);
    const h = (firebase.hosting.headers ?? []).find((x: any) => x.source === '**')?.headers ?? [];
    const value = (key: string) => h.find((x: any) => x.key === key)?.value ?? '';
    expect(value('X-Content-Type-Options')).toBe('nosniff');
    expect(value('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(value('Content-Security-Policy')).toContain('upgrade-insecure-requests');
    expect(value('Strict-Transport-Security')).not.toContain('preload');
  });
});
