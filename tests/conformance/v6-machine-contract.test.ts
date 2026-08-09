import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { EXIT, coldStartContract, containsGuaranteeLanguage, hardcodedConfiguredThresholds, hasApprovalRecord, installedOperationalSeoScripts, missingNegativeTests, normalizeDeterministic, phaseWriteViolations, portfolioSiteIdsValid, registryWriterPhases, structuralBreakJoinAllowed, validateArtifactEnvelope, validateInvariantResults, validateMoneyMinor } from '../../seo/v6-conformance.mjs';

const config = JSON.parse(readFileSync('sites/sectorcalc/seo.config.json', 'utf8'));
const contracts = JSON.parse(readFileSync('data/seo/PHASE_CONTRACTS.json', 'utf8'));
const invariants = JSON.parse(readFileSync('data/seo/invariants.json', 'utf8'));
const decisionLedger = readFileSync('docs/seo/KARAR_DEFTERI.md', 'utf8');
const envelope = { meta: { artifact: 'fixture', schemaVersion: '6.0', generatedAt: '2026-08-09T00:00:00Z', generatorScript: 'fixture', inputWindow: { start: '2026-07-13', end: '2026-08-09' }, confidence: 'high', partial: false, siteId: 'sectorcalc', coldStart: false, structuralBreaksApplied: [] } };

describe('SEO V6 machine conformance C01-C15', () => {
  it('C01 artifact-envelope', () => { expect(validateArtifactEnvelope(envelope)).toEqual([]); expect(validateArtifactEnvelope({ meta: { artifact: 'x' } })).toContain('siteId'); });
  it('C02 invariant-result-schema', () => { expect(validateInvariantResults([{ status: 'PASS', severity: 'BLOCK', negativeTestPassed: true }])).toEqual([]); expect(validateInvariantResults([{ status: 'PASS', severity: 'BLOCK' }])).not.toEqual([]); expect(validateInvariantResults([{ status: 'UNKNOWN', severity: 'INFO' }])).not.toEqual([]); });
  it('C03 no-hardcoded-thresholds', () => { expect(hardcodedConfiguredThresholds(config, installedOperationalSeoScripts())).toEqual([]); });
  it('C04 phase-writes-lock', () => { expect(phaseWriteViolations(contracts['faz-00'], ['public/index.html'])).toEqual(['public/index.html']); expect(phaseWriteViolations(contracts['faz-00'], ['docs/seo/raporlar/faz00_baz.md'])).toEqual([]); });
  it('C05 money-integer', () => { expect(validateMoneyMinor({ revenueMinor: 1200, costMinor: '450' })).toEqual([]); expect(validateMoneyMinor({ revenueMinor: 12.5 })).toEqual(['$.revenueMinor']); expect(validateMoneyMinor({ revenueMinor: '12.50' })).toEqual(['$.revenueMinor']); });
  it('C06 guarantee-regex', () => { expect(containsGuaranteeLanguage('We guarantee traffic growth.')).toBe(true); expect(containsGuaranteeLanguage('This is an evidence-backed target, not a guarantee.')).toBe(false); });
  it('C07 approval-records', () => { expect(hasApprovalRecord(decisionLedger, '2026-08-09')).toBe(true); expect(hasApprovalRecord('No decision record exists.', 'A3-404')).toBe(false); });
  it('C08 registry-single-writer', () => { expect(registryWriterPhases(contracts)).toEqual(['faz-01']); });
  it('C09 negative-tests-exist', () => { expect(missingNegativeTests(invariants)).toEqual([]); });
  it('C10 determinism', () => { const a={meta:{generatedAt:'A'},data:{value:4}}; const b={meta:{generatedAt:'B'},data:{value:4}}; const c={meta:{generatedAt:'B'},data:{value:5}}; expect(normalizeDeterministic(a)).toEqual(normalizeDeterministic(b)); expect(normalizeDeterministic(a)).not.toEqual(normalizeDeterministic(c)); });
  it('C11 exit-codes', () => { expect(EXIT).toEqual({ VIOLATION: 1, NO_DATA: 3, CONFIG: 4 }); });
  it('C12 envelope-completeness', () => { for (const required of ['tam_map.json','slo_history.json','calibration_report.json']) expect(validateArtifactEnvelope({ ...envelope, meta: { ...envelope.meta, artifact: required } })).toEqual([]); });
  it('C13 structural-breaks-join', () => { const rows=[{date:'2026-07-01'},{date:'2026-08-01'}]; expect(structuralBreakJoinAllowed(envelope,rows,'2026-07-15')).toBe(false); expect(structuralBreakJoinAllowed({meta:{...envelope.meta,structuralBreaksApplied:['2026-07-15']}},rows,'2026-07-15')).toBe(true); });
  it('C14 coldstart-flag', () => { const required=config.measurement.defaultWindowDays; expect(coldStartContract(required-1,{coldStart:true,confidence:'low'},required)).toBe(true); expect(coldStartContract(required-1,{coldStart:false,confidence:'high'},required)).toBe(false); expect(coldStartContract(required,{coldStart:false,confidence:'high'},required)).toBe(true); });
  it('C15 portfolio-siteid', () => { expect(portfolioSiteIdsValid({meta:{siteId:'sectorcalc'},sites:[{siteId:'sectorcalc'}]})).toBe(true); expect(portfolioSiteIdsValid({meta:{siteId:'sectorcalc'},sites:[{}]})).toBe(false); expect(portfolioSiteIdsValid({meta:{},sites:[{siteId:'sectorcalc'}]})).toBe(false); });
});
