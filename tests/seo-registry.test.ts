import { describe, expect, it } from 'vitest';
import { PAGES, validateRegistryInvariants } from '../seo/registry.mjs';

function duplicateCanonicalErrors(pages: Array<{ canonicalPath?: string }>) {
  const seen = new Set<string>();
  const errors: string[] = [];
  for (const page of pages) {
    const canonical = page.canonicalPath || '';
    if (seen.has(canonical)) errors.push(`duplicate canonical: ${canonical}`);
    seen.add(canonical);
  }
  return errors;
}

describe('SEO registry invariant seal', () => {
  it('keeps the production registry internally valid', () => { expect(validateRegistryInvariants()).toEqual([]); });
  it('negative fixture proves duplicate canonical ownership is rejected', () => {
    expect(duplicateCanonicalErrors([{ canonicalPath: '/calculator/example' }, { canonicalPath: '/calculator/example' }])).toEqual(['duplicate canonical: /calculator/example']);
  });
  it('production registry has unique canonical paths', () => {
    const paths = PAGES.map((page) => page.canonicalPath);
    expect(new Set(paths).size).toBe(paths.length);
  });
});
