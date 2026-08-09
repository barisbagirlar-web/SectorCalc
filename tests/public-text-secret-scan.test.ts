import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

function runScanner(input: string) {
  return spawnSync(process.execPath, ['scripts/verify-public-text-secrets.mjs'], {
    input,
    encoding: 'utf8'
  });
}

const apiKey = (env: 'live' | 'sdbx') => ['pdl', env, 'apikey', '1234567890abcdefghijklmnop'].join('_');
const webhook = () => ['pdl', 'ntfset', '1234567890abc+/=defghijklmnop'].join('_');
const legacyWebhook = () => ['whsec', '1234567890abcdefghijklmnop'].join('_');
const githubPat = () => ['github', 'pat', '11AAABBBCCCDDDEEEFFF111222333444'].join('_');

describe('public text secret scanner', () => {
  it('passes ordinary PR text', () => {
    const result = runScanner('Rotate production credentials and verify billing readiness.');
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('PUBLIC_TEXT_SECRET_SCAN=PASS');
  });

  it.each([apiKey('live'), apiKey('sdbx'), webhook(), legacyWebhook(), githubPat()])(
    'blocks a secret pattern without echoing it',
    (secret) => {
      const result = runScanner(`credential=${secret}`);
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('PUBLIC_TEXT_SECRET_SCAN=FAIL');
      expect(result.stdout + result.stderr).not.toContain(secret);
    }
  );

  it('uses exit 3 for missing input', () => {
    const result = runScanner('');
    expect(result.status).toBe(3);
    expect(result.stderr).toContain('PUBLIC_TEXT_SECRET_SCAN=NO_INPUT');
  });
});
