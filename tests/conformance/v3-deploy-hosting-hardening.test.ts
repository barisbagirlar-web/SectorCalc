import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');

describe('production hosting hardening deploy wiring', () => {
  it('generates and deploys the hardened Firebase config', () => {
    expect(workflow).toContain('node scripts/prepare-firebase-production-config.mjs firebase.json firebase.production.json');
    expect(workflow).toContain('--config firebase.production.json');
  });

  it('blocks promotion when preview discovery headers are wrong', () => {
    const previewGuard = workflow.indexOf('name: Preview discovery-header seal');
    const promote = workflow.indexOf('name: Promote the exact validated Firebase version to live');
    expect(previewGuard).toBeGreaterThan(-1);
    expect(promote).toBeGreaterThan(previewGuard);
    expect(workflow.slice(previewGuard, promote)).toContain('node scripts/verify-live-discovery-headers.mjs');
  });

  it('verifies HSTS and discovery headers after live promotion', () => {
    const promote = workflow.indexOf('name: Promote the exact validated Firebase version to live');
    const liveGuard = workflow.indexOf('name: Post-promotion discovery/HSTS header seal');
    expect(liveGuard).toBeGreaterThan(promote);
    expect(workflow.slice(liveGuard)).toContain('SEO_GUARD_MODE: live');
    expect(workflow.slice(liveGuard)).toContain('node scripts/verify-live-discovery-headers.mjs');
  });
});
