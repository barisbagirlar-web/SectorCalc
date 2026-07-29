import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Money-page fixtures for SC-008/010/012 are frozen against the private server
 * engine. This suite only verifies fixture integrity — it must not import
 * proprietary formula modules.
 */
const ROOT = join(process.cwd(), 'seo/worked-examples');

function load(name: string): Record<string, unknown> {
  return JSON.parse(readFileSync(join(ROOT, `${name}.json`), 'utf8')) as Record<string, unknown>;
}

describe('money worked-example fixtures (private-engine SSOT)', () => {
  it('tolerance-stack-up cites private engine', () => {
    const fx = load('tolerance-stack-up');
    expect(String(fx.engineSource)).toContain('private server engine');
    expect(fx.outputs).toBeTruthy();
  });
  it('true-labor-cost cites private engine', () => {
    const fx = load('true-labor-cost');
    expect(String(fx.engineSource)).toContain('private server engine');
    expect(fx.outputs).toBeTruthy();
  });
  it('quote-pricing cites private engine', () => {
    const fx = load('quote-pricing');
    expect(String(fx.engineSource)).toContain('private server engine');
    expect(fx.outputs).toBeTruthy();
  });
});
