import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

function classify(paths: string[]) {
  return spawnSync(process.execPath, ['scripts/classify-deploy-impact.mjs'], {
    input: `${paths.join('\n')}\n`,
    encoding: 'utf8'
  });
}

describe('deploy impact classifier', () => {
  it('skips deploy for documentation, tests, workflows and verification guards only', () => {
    const result = classify([
      'docs/seo/MANDATE_ERRATA.md',
      'tests/public-text-secret-scan.test.ts',
      '.github/workflows/public-secret-guard.yml',
      'scripts/verify-paddle-production-guard.mjs',
      'scripts/guard-sitemap-coverage.mjs'
    ]);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('DEPLOY_REQUIRED=false');
  });

  it.each([
    ['src/app.ts'],
    ['index.html'],
    ['public/robots.txt'],
    ['public/sitemap.xml'],
    ['seo/registry-data.mjs'],
    ['functions/src/index.ts'],
    ['firebase.json'],
    ['package.json'],
    ['scripts/generate-sitemap.mjs'],
    ['unknown/new-surface.txt']
  ])('requires deploy for runtime or unknown path %s', (path) => {
    const result = classify([path]);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('DEPLOY_REQUIRED=true');
  });

  it('fails closed when diff input is empty', () => {
    const result = classify([]);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('DEPLOY_REQUIRED=true');
    expect(result.stdout).toContain('no-diff-input-fail-closed');
  });

  it('requires deploy when a non-runtime change is mixed with runtime change', () => {
    const result = classify(['docs/seo/README.md', 'public/robots.txt']);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('DEPLOY_REQUIRED=true');
  });
});
