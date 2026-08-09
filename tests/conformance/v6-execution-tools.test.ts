import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

function run(script: string, args: string[] = []) {
  return spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
}

describe('SEO V6 execution tools', () => {
  it('registry validator requires siteId and validates the SectorCalc registry read-only', () => {
    const missing = run('scripts/seo/registry-validate.ts');
    expect(missing.status).toBe(4);
    const valid = run('scripts/seo/registry-validate.ts', ['--site', 'sectorcalc', '--dry-run']);
    expect(valid.status).toBe(0);
    expect(valid.stdout).toContain('SEO_REGISTRY=PASS site=sectorcalc');
    expect(valid.stdout).toContain('dryRun=true');
  });

  it('cold-start checker requires siteId and never invents an observed window', () => {
    const missing = run('scripts/seo/coldstart-check.ts');
    expect(missing.status).toBe(4);
    const unknown = run('scripts/seo/coldstart-check.ts', ['--site', 'sectorcalc', '--dry-run']);
    expect(unknown.status).toBe(0);
    expect(unknown.stdout).toContain('coldStart=true');
    expect(unknown.stdout).toContain('observedDays=unknown');
    expect(unknown.stdout).toContain('source=no-verified-window-provided');
  });

  it('cold-start checker uses explicit observed days without hidden assumptions', () => {
    const short = run('scripts/seo/coldstart-check.ts', ['--site', 'sectorcalc', '--observed-days', '27']);
    expect(short.status).toBe(0);
    expect(short.stdout).toContain('coldStart=true');
    expect(short.stdout).toContain('confidence=low');
    const complete = run('scripts/seo/coldstart-check.ts', ['--site', 'sectorcalc', '--observed-days', '28']);
    expect(complete.status).toBe(0);
    expect(complete.stdout).toContain('coldStart=false');
    expect(complete.stdout).toContain('confidence=normal');
    const invalid = run('scripts/seo/coldstart-check.ts', ['--site', 'sectorcalc', '--observed-days', '-1']);
    expect(invalid.status).toBe(4);
  });
});
