#!/usr/bin/env node
/**
 * Export SEO registry JSON for Python inject-seo.py and other non-ESM consumers.
 * DO NOT EDIT THE GENERATED FILE BY HAND.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  HOST,
  PAGES,
  toolCanonicalBySlug,
  toolMetaBySlug,
  toolCanonicalBySourceFile,
  sitemapLocs,
  publishedCalculators,
  validateRegistryInvariants,
} from '../seo/registry.mjs';
import { FREE_TOOLS, FREE_TOOL_SLUGS } from '../seo/free-tools.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(ROOT, 'seo');
mkdirSync(outDir, { recursive: true });

const errors = validateRegistryInvariants();
if (errors.length) {
  console.error('[FAIL] registry invariants:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

const payload = {
  generatedFrom: 'seo/registry.mjs',
  host: HOST,
  pages: PAGES,
  toolCanonicalBySlug: toolCanonicalBySlug(),
  toolMetaBySlug: toolMetaBySlug(),
  toolCanonicalBySourceFile: toolCanonicalBySourceFile(),
  sitemapLocs: sitemapLocs(),
  publishedToolCount: publishedCalculators().length,
  freeToolSlugs: [...FREE_TOOL_SLUGS],
  freeTools: FREE_TOOLS.map((t) => ({
    toolId: t.toolId,
    sourceSlug: t.sourceSlug,
    entity: t.entity,
    canonicalPath: t.canonicalPath,
    name: t.name,
  })),
};

const out = join(outDir, 'registry.generated.json');
writeFileSync(out, JSON.stringify(payload, null, 2) + '\n');
console.log(`[OK] wrote ${out} (${PAGES.length} pages, ${payload.publishedToolCount} tools)`);
