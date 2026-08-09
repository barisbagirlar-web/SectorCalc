import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const config = JSON.parse(readFileSync('sites/sectorcalc/seo.config.json', 'utf8'));
const schema = JSON.parse(readFileSync('seo.config.schema.json', 'utf8'));
const contracts = JSON.parse(readFileSync('data/seo/PHASE_CONTRACTS.json', 'utf8'));
const invariants = JSON.parse(readFileSync('data/seo/invariants.json', 'utf8'));

describe('SEO V6 bootstrap contract', () => {
  it('binds SectorCalc to V6 profile M and the canonical apex host', () => {
    expect(config.version).toBe('6.0');
    expect(config.profile).toBe('M');
    expect(config.site.siteId).toBe('sectorcalc');
    expect(config.site.rootUrl).toBe('https://sectorcalc.com');
    expect(config.site.language).toBe('en');
  });

  it('uses the repository-approved JSON Schema dialect and Firebase target', () => {
    expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
    expect(schema.properties.deployment.properties.target.enum).toContain('firebase_hosting');
    expect(config.deployment.target).toBe('firebase_hosting');
  });

  it('keeps generative-AI report data out of measurement formulas', () => {
    expect(config.measurement.gscGenerativeAiInFormula).toBe(false);
  });

  it('keeps economic defaults evidence-conservative', () => {
    expect(config.economics.defaultValuePerConversionMinor).toBe(0);
    expect(config.economics.valuationMultiples.low).toBe(0);
    expect(config.economics.valuationMultiples.high).toBe(0);
  });

  it('requires the budget governance split to total 100', () => {
    const split = config.economics.budgetSplit;
    expect(split.investPct + split.holdPct + split.harvestPct + split.divestPct).toBe(100);
  });

  it('has no unresolved pipe placeholder in the site config', () => {
    expect(readFileSync('sites/sectorcalc/seo.config.json', 'utf8')).not.toContain('|');
  });

  it('locks Phase 0 away from runtime public output', () => {
    expect(contracts['faz-00'].forbidsWrites).toContain('public/**');
    expect(contracts['faz-00'].forbidsWrites).toContain('data/seo/registry/**');
  });

  it('keeps registry writes owned by Phase 1 among installed phase contracts', () => {
    const writers = Object.entries(contracts)
      .filter(([name]) => name !== 'bootstrap')
      .filter(([, contract]: any) => (contract.writes || []).some((value: string) => value.startsWith('data/seo/registry/')))
      .map(([name]) => name);
    expect(writers).toEqual(['faz-01']);
  });

  it('has unique invariant identifiers and a negative-test reference for every BLOCK invariant', () => {
    const ids = invariants.invariants.map((item: any) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of invariants.invariants.filter((value: any) => value.severity === 'BLOCK')) {
      expect(item.negativeTest).toBeTruthy();
    }
  });
});
