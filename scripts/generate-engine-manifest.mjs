#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publishedCalculators, HOST } from '../seo/registry.mjs';
import { GUIDE_ASSEMBLY } from '../seo/guides-assembly.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const rows = publishedCalculators().map((p) => {
  const guide = GUIDE_ASSEMBLY.find((g) => g.calculator?.href === p.canonicalPath);
  return {
    toolId: p.id,
    engineVersion: p.engineVersion || 'unspecified',
    methodIds: p.engineId ? [p.engineId] : [],
    standardEditions: p.standardBasis || [],
    lastValidatedAt: p.quality?.formulaVerified ? 'see-engine-tests' : null,
    status: p.publicationStatus === 'published' ? 'active' : p.publicationStatus,
    methodPage: guide ? `${HOST}/guides/${guide.slug}` : null,
  };
});

writeFileSync(join(ROOT, 'public/engine-manifest.json'), `${JSON.stringify({ generatedFrom: 'seo-registry', tools: rows }, null, 2)}\n`);
console.log(`[OK] engine-manifest.json tools=${rows.length}`);
