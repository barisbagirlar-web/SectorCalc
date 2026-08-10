import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const phaseScripts: Record<string, string> = {
  '11': 'scripts/seo/kac-contract.ts',
  '12': 'scripts/seo/slo-contract.ts',
  '13': 'scripts/seo/offpage-contract.ts',
  '14': 'scripts/seo/cro-contract.ts',
  '15': 'scripts/seo/vertical-contract.ts',
  '16': 'scripts/seo/tam-loop-contract.ts',
  '17': 'scripts/seo/portfolio-contract.ts',
  '19': 'scripts/seo/valuation-contract.ts',
};

type Invariant = { id: string; phase: number | string };
type Catalog = { invariants: Invariant[] };

describe('SEO V6 code-side completeness seal', () => {
  const catalog = JSON.parse(readFileSync('data/seo/invariants.json', 'utf8')) as Catalog;

  for (const [phase, script] of Object.entries(phaseScripts)) {
    it(`phase ${phase} explicitly binds every catalog invariant`, () => {
      const source = readFileSync(script, 'utf8');
      const ids = catalog.invariants.filter((item) => String(item.phase) === phase).map((item) => item.id);
      expect(ids.length).toBeGreaterThan(0);
      for (const id of ids) expect(source, `${script} missing ${id}`).toContain(id);
    });

    it(`phase ${phase} contract is deterministic and network-independent`, () => {
      const source = readFileSync(script, 'utf8');
      for (const forbidden of ['fetch(', 'https://', 'googleapis', '@google/', 'PADDLE_API', 'GSC_API', 'GA4_API']) {
        expect(source, `${script} contains external dependency ${forbidden}`).not.toContain(forbidden);
      }
    });

    it(`phase ${phase} code-ready CLI passes without external connectors`, () => {
      const output = execFileSync(process.execPath, [script, '--site', 'sectorcalc'], { encoding: 'utf8' });
      expect(output).toContain(`SEO_PHASE_${phase}_CODE_READY`);
    });
  }

  it('keeps Phase 18 out of code closure for Profile M', () => {
    const config = JSON.parse(readFileSync('sites/sectorcalc/seo.config.json', 'utf8')) as { profile: string };
    expect(config.profile).toBe('M');
    expect(phaseScripts['18']).toBeUndefined();
  });
});
