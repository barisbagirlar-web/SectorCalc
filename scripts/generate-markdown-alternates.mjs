#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HERO_CALCULATOR_SLUGS } from '../seo/hero-cohort.mjs';
import { GUIDE_ASSEMBLY } from '../seo/guides-assembly.mjs';
import { resolveToolCost } from '../seo/tool-pricing.mjs';
import { PAGES, HOST } from '../seo/registry.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const pageByPath = (path) => PAGES.find((p) => p.canonicalPath === path);

function writeMd(relDir, body) {
  const dir = join(ROOT, relDir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.md'), body);
}

function frontmatter(fields, h1, description, extra) {
  const lines = Object.entries(fields).map(([k, v]) => `${k}: ${JSON.stringify(v)}`);
  return `---\n${lines.join('\n')}\n---\n\n# ${h1}\n\n${description}\n\n${extra}\n`;
}

for (const slug of HERO_CALCULATOR_SLUGS) {
  const page = pageByPath(`/calculator/${slug}`);
  if (!page) {
    console.error(`[FAIL] hero calculator missing from registry: ${slug}`);
    process.exit(1);
  }
  const cost = resolveToolCost(page.id);
  const credits = cost ? (cost.tier === 'FREE' ? 0 : cost.creditCost) : 'n/a';
  writeMd(
    `public/calculator/${slug}`,
    frontmatter(
      {
        title: page.title,
        engineVersion: page.engineVersion || 'unspecified',
        credits,
        method: page.engineId || 'see HTML',
        standardEdition: (page.standardBasis || []).join(', ') || 'see HTML',
        canonical: HOST + page.canonicalPath,
        robots: 'noindex,follow',
      },
      page.h1,
      page.description,
      `- Formula / model: ${page.engineId || 'Documented on the HTML page'}\n- Units: SI and Imperial/US customary where the engine supports conversion\n- Credits: ${credits}\n- Model boundaries: documented on the HTML page\n- Warnings: fail-closed on invalid inputs; documented on the HTML page\n- Source of truth: ${HOST}${page.canonicalPath}`,
    ),
  );
}

const stackGuide = GUIDE_ASSEMBLY.find((g) => g.slug === 'tolerance-stack-up-complete');
const guidePage = pageByPath('/guides/tolerance-stack-up-complete');
if (stackGuide && guidePage) {
  writeMd(
    'public/guides/tolerance-stack-up-complete',
    frontmatter(
      {
        title: guidePage.title,
        engineVersion: 'n/a',
        credits: 'n/a',
        method: 'worst-case / RSS / Monte Carlo selection',
        standardEdition: 'see HTML',
        canonical: HOST + '/guides/tolerance-stack-up-complete',
        robots: 'noindex,follow',
      },
      guidePage.h1,
      guidePage.description,
      `- Formula / model: documented on the HTML guide\n- Source of truth: ${HOST}/guides/tolerance-stack-up-complete`,
    ),
  );
}

const gloss = pageByPath('/glossary/tolerance-stack-up');
if (gloss) {
  writeMd(
    'public/glossary/tolerance-stack-up',
    frontmatter(
      {
        title: gloss.title,
        engineVersion: 'n/a',
        credits: 'n/a',
        method: 'definition',
        standardEdition: 'see HTML',
        canonical: HOST + '/glossary/tolerance-stack-up',
        robots: 'noindex,follow',
      },
      gloss.h1,
      gloss.description,
      `- Formula / model: definition node, not a calculator\n- Source of truth: ${HOST}/glossary/tolerance-stack-up`,
    ),
  );
}

console.log(`[OK] markdown alternates for ${HERO_CALCULATOR_SLUGS.length} hero calculators`);
