import { describe, expect, it } from 'vitest';
import { assertSingleOrganization, assertVisibleSchemaClaims, validateBreadcrumbOrder } from '../../scripts/seo/schema-entity-contract.ts';

describe('SEO V3 Phase 6 schema/entity', () => {
  it('blocks schema claims that are not visible on the page', () => {
    expect(() => assertVisibleSchemaClaims('<main><h1>Machine Hour Rate Calculator</h1></main>', {
      '@type': 'SoftwareApplication',
      name: 'Certified aerospace cost authority',
    })).toThrow(/INVISIBLE_SCHEMA_CLAIM/);
  });

  it('requires exactly one canonical Organization root', () => {
    expect(() => assertSingleOrganization([
      { '@type': 'Organization', '@id': 'https://sectorcalc.com/#organization' },
      { '@type': 'Organization', '@id': 'https://sectorcalc.com/#organization' },
    ], 'https://sectorcalc.com/#organization')).toThrow(/ORGANIZATION_ROOT_COUNT/);
  });

  it('accepts one canonical Organization root', () => {
    expect(() => assertSingleOrganization([
      { '@type': 'Organization', '@id': 'https://sectorcalc.com/#organization', name: 'SectorCalc' },
    ], 'https://sectorcalc.com/#organization')).not.toThrow();
  });

  it('blocks breadcrumb order or canonical drift', () => {
    expect(() => validateBreadcrumbOrder([
      { position: 1, item: 'https://sectorcalc.com/' },
      { position: 3, item: 'https://sectorcalc.com/tools.html' },
    ])).toThrow(/BREADCRUMB_POSITION/);
  });
});
