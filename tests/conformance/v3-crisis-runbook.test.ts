import { describe, expect, it } from 'vitest';
import { assertMigrationMayStart, findForbiddenExecution, validateCrisisCards } from '../../scripts/seo/crisis-runbook-contract.ts';

const cards = [
  { id: 'algorithm-drop' as const, detection: ['verified 28-day click decline'], firstFourHours: ['freeze speculative edits'], decisionTree: ['separate demand, indexing and ranking causes'], communication: ['state evidence and uncertainty'] },
  { id: 'manual-action' as const, detection: ['verified Search Console notice'], firstFourHours: ['preserve evidence and freeze risky changes'], decisionTree: ['identify exact policy issue before remediation'], communication: ['record scope, owner and actions'] },
  { id: 'technical-disaster' as const, detection: ['noindex, robots or canonical regression'], firstFourHours: ['revert offending merge after gates'], decisionTree: ['restore last known good then validate live contract'], communication: ['publish incident facts only'] },
  { id: 'revenue-crisis' as const, detection: ['verified traffic stable while measured value falls'], firstFourHours: ['freeze SEO blame assignment'], decisionTree: ['route to conversion and portfolio economics'], communication: ['separate acquisition from monetization'] },
];

describe('SEO V3 Phase 10 crisis/migration', () => {
  it('requires all four complete scenario cards', () => {
    expect(validateCrisisCards(cards)).toEqual([]);
    expect(validateCrisisCards(cards.slice(0, 3))).toContain('missing:revenue-crisis');
  });

  it('blocks migration start without runbook and approval record', () => {
    expect(() => assertMigrationMayStart(true, false)).toThrow(/MIGRATION_START_BLOCKED/);
    expect(() => assertMigrationMayStart(false, true)).toThrow(/MIGRATION_START_BLOCKED/);
  });

  it('detects prohibited execution patterns', () => {
    expect(findForbiddenExecution('run automatic 301 and paid link campaign').length).toBeGreaterThan(0);
    expect(findForbiddenExecution('prepare a reversible redirect ledger for human review')).toEqual([]);
  });
});
