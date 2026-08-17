#!/usr/bin/env node
/**
 * Generate public/llms.txt (concise agent map) and sanitized llms-full.txt.
 * /llm.txt is a tiny pointer; Firebase 301s it to /llms.txt.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HERO_CALCULATOR_SLUGS } from '../seo/hero-cohort.mjs';
import { FREE_TOOLS } from '../seo/free-tools.mjs';
import { GLOSSARY_TERMS } from '../seo/glossary-catalog.mjs';
import { COMPARE_PAGES } from '../seo/compare-catalog.mjs';
import { GUIDE_ASSEMBLY as GUIDES } from '../seo/guides-assembly.mjs';
import { resolveToolCost } from '../seo/tool-pricing.mjs';
import { OPERATOR_JARGON_RE } from '../seo/operator-jargon.mjs';
import {
  HOST,
  absoluteUrl,
  llmEligibleCalculators,
  sitemapLocs,
  sitemapPages,
  validateRegistryInvariants,
} from '../seo/registry.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = validateRegistryInvariants();
if (errors.length) {
  console.error('[FAIL] registry:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

const FORBIDDEN_LEAK = [
  /Cloud Scheduler/i,
  /billing\/health/i,
  /\/src\//,
  /sc-calc-sheet\.[a-f0-9]{8}/i,
  /Playwright/i,
  /hosting:channel/i,
  /preview channel/i,
  /seo\/registry/i,
];

const calcs = llmEligibleCalculators().sort((a, b) => a.id.localeCompare(b.id));
const freeIds = new Set(FREE_TOOLS.map((t) => t.toolId));
const free = calcs.filter((c) => freeIds.has(c.id));
const paid = calcs.filter((c) => !freeIds.has(c.id));

function abs(path) {
  return absoluteUrl(path);
}

function line(title, path, desc) {
  return `- [${title}](${abs(path)}): ${desc}`;
}

const openRef = free.map((t) => {
  const src = FREE_TOOLS.find((f) => f.toolId === t.id);
  return line(t.name || t.h1, t.canonicalPath, src?.problem || t.description || 'Open reference calculator.');
});

const heroSet = new Set(HERO_CALCULATOR_SLUGS.map((s) => `/calculator/${s}`));
const guideCalcPaths = new Set(GUIDES.map((g) => g.calculator?.href).filter(Boolean));
const corePaid = paid
  .filter((t) => heroSet.has(t.canonicalPath) || guideCalcPaths.has(t.canonicalPath))
  .map((t) => {
  const cost = resolveToolCost(t.id);
  const band = cost ? `${cost.tier} · ${cost.creditCost} credits · 24h session` : 'credit session';
  return line(t.name || t.h1, t.canonicalPath, `${t.id} — ${band}. ${t.description || ''}`.trim());
});

const guideLines = GUIDES.map((g) =>
  line(g.title, `/guides/${g.slug}`, `Method guide for ${g.calculator?.toolId || 'the linked calculator'}.`),
);

const glossaryPriority = [
  'tolerance-stack-up',
  'rss-tolerance',
  'worst-case-analysis',
  'iso-286-fits',
  'iso-281',
  'bearing-l10-life',
  'cnc-feeds-and-speeds',
  'process-capability-cpk',
  'vdi-2230-bolted-joint',
  'machine-hour-rate',
];
const glossaryLines = glossaryPriority
  .map((slug) => GLOSSARY_TERMS.find((t) => t.slug === slug))
  .filter(Boolean)
  .map((t) => line(t.title || t.slug, `/glossary/${t.slug}`, t.blurb || 'Engineering definition.'));

const root = `# SectorCalc

> Deterministic industrial engineering calculators for machining,
> tolerances, rotating equipment, welding, pressure systems,
> bolted joints, lifting and manufacturing costing.
> SectorCalc exposes calculation methods, model boundaries,
> units, engine versions and reproducibility information so
> engineering results can be reviewed rather than treated as a black box.

## Start Here

${line('Engineering Calculators', '/tools', 'Browse all active engineering calculators.')}
${line('Engineering Topics', '/topics', 'Find calculators by engineering decision area.')}
${line('Calculation Guides', '/guides', 'Review formulas, methods, examples and model boundaries.')}
${line('Engineering Glossary', '/glossary', 'Definitions, symbols, units and technical concepts.')}
${line('Pricing', '/pricing', 'One-time calculation credits with no subscription.')}

## Open Reference Calculators

${openRef.join('\n')}

## Core Decision Calculators

${corePaid.join('\n')}

## Engineering Guides

${guideLines.join('\n')}

## Glossary

${glossaryLines.join('\n')}

## Methods and Evidence

${line('Evidence & Validation Framework', '/case-studies', 'How calculated results and measured evidence are separated.')}
${line('Security', '/security', 'Calculation-data and platform security model.')}
${line('About', '/about', 'Operator and product information.')}
${line('Trust', '/trust', 'About, security, privacy, terms, refund, status and evidence.')}

## Optional

${line('Privacy', '/privacy', 'Privacy policy.')}
${line('Terms', '/terms', 'Terms of use.')}
${line('Refund Policy', '/refund', 'Refund policy.')}
${line('Status', '/status', 'Service status information.')}
${line('Contact', '/contact', 'Contact the operator.')}
`;

const pointer = `# SectorCalc

This file is a pointer. Use [llms.txt](${HOST}/llms.txt) as the agent resource map.
`;

function assertClean(name, text) {
  if (OPERATOR_JARGON_RE.test(text)) {
    console.error(`[FAIL] ${name} contains public operator jargon`);
    process.exit(1);
  }
  for (const re of FORBIDDEN_LEAK) {
    if (re.test(text)) {
      console.error(`[FAIL] ${name} leaked internal detail matching ${re}`);
      process.exit(1);
    }
  }
}

assertClean('llms.txt', root);
const bytes = Buffer.byteLength(root, 'utf8');
if (bytes > 28 * 1024) {
  console.error(`[FAIL] llms.txt ${bytes} bytes exceeds 28KB operational budget`);
  process.exit(1);
}

const fullPages = sitemapPages()
  .filter((p) => p.canonicalPath !== '/pro.html' && p.role !== 'pro')
  .sort((a, b) => a.canonicalPath.localeCompare(b.canonicalPath));

const full = `# SectorCalc — full public index

Sanitized inventory of canonical indexable HTML pages. Engineering truth lives on the HTML page, not in this file.
Do not treat this as a second method specification.

${fullPages.map((p) => `- [${p.h1 || p.title}](${abs(p.canonicalPath)})`).join('\n')}
`;
assertClean('llms-full.txt', full);

writeFileSync(join(ROOT, 'public/llms.txt'), root);
writeFileSync(join(ROOT, 'public/llm.txt'), pointer);
writeFileSync(join(ROOT, 'public/llms-full.txt'), full);
console.log(`[OK] llms.txt ${bytes} bytes, resources≈${(root.match(/^- \[/gm) || []).length}, sitemap=${sitemapLocs().length}`);
