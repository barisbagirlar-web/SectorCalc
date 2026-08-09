import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

function runScanner(input: string) {
  return spawnSync(process.execPath, ['scripts/verify-public-text-secrets.mjs'], {
    input,
    encoding: 'utf8'
  });
}

describe('public text secret scanner', () => {
  it('passes ordinary PR text', () => {
    const result = runScanner('Rotate production credentials and verify billing readiness.');
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('PUBLIC_TEXT_SECRET_SCAN=PASS');
  });

  it.each([
    'pdl_live_apikey_1234567890abcdefghijklmnop',
    'pdl_sdbx_apikey_1234567890abcdefghijklmnop',
    'pdl_ntfset_1234567890abc+/=defghijklmnop',
    'whsec_1234567890abcdefghijklmnop',
    'github_pat_11AAABBBCCCDDDEEEFFF111222333444'
  ])('blocks a secret pattern without echoing it: %s', (secret) => {
    const result = runScanner(`credential=${secret}`);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('PUBLIC_TEXT_SECRET_SCAN=FAIL');
    expect(result.stdout + result.stderr).not.toContain(secret);
  });

  it('uses exit 3 for missing input', () => {
    const result = runScanner('');
    expect(result.status).toBe(3);
    expect(result.stderr).toContain('PUBLIC_TEXT_SECRET_SCAN=NO_INPUT');
  });
});
