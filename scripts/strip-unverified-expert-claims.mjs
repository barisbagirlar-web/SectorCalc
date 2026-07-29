#!/usr/bin/env node
/**
 * When seo/evidence/expert-relationships.json does not allow public claims,
 * rewrite published HTML so Neela Person refs cannot ship as author/reviewer.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const EVIDENCE = join(ROOT, 'seo/evidence/expert-relationships.json');
const PERSON = 'https://sectorcalc.com/#person-neela-nataraj';
const ORG = 'https://sectorcalc.com/#organization';

function claimAllowed() {
  if (!existsSync(EVIDENCE)) return false;
  const data = JSON.parse(readFileSync(EVIDENCE, 'utf8'));
  return (data.relationships || []).some(
    (r) =>
      r.schemaPersonId?.includes('neela') &&
      r.publicClaimAllowed === true &&
      r.relationshipVerified === true &&
      r.scopeVerified === true,
  );
}

function walkHtmlFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === '.git') continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkHtmlFiles(p, out);
    else if (extname(name) === '.html') out.push(p);
  }
  return out;
}

function rewrite(html) {
  let out = html;
  // Schema author/reviewedBy → Organization
  out = out.replaceAll(`"@id": "${PERSON}"`, `"@id": "${ORG}"`);
  out = out.replaceAll(`"@id": '${PERSON}'`, `"@id": '${ORG}'`);
  out = out.replaceAll(`{ "@id": "${PERSON}" }`, `{ "@id": "${ORG}" }`);
  out = out.replaceAll(`{ "@id": '${PERSON}' }`, `{ "@id": '${ORG}' }`);
  // Meta article:author
  out = out.replace(
    /<meta\s+property=["']article:author["']\s+content=["'][^"']*neela-nataraj[^"']*["']\s*\/?>/gi,
    `<meta property="article:author" content="${ORG}">`,
  );
  // Visible review badges
  out = out.replace(
    /<span>\s*Reviewed by Prof\.\s*Dr\.\s*Neela Nataraj[^<]*<\/span>/gi,
    '',
  );
  out = out.replace(/Reviewed by Prof\.\s*Dr\.\s*Neela Nataraj[^.<]*/gi, 'SectorCalc Engineering Team');
  // Microdata itemid
  out = out.replaceAll(`itemid="${PERSON}"`, `itemid="${ORG}"`);
  return out;
}

function main() {
  if (claimAllowed()) {
    console.log('[PASS] strip-unverified-expert-claims: public claim allowed — no strip');
    return;
  }

  const roots = [ROOT, join(ROOT, 'public')];
  const files = new Set();
  for (const r of roots) {
    // Only top-level HTML under ROOT + recursive under public/
    if (r === ROOT) {
      for (const name of readdirSync(ROOT)) {
        if (extname(name) === '.html') files.add(join(ROOT, name));
      }
    } else {
      for (const f of walkHtmlFiles(r)) files.add(f);
    }
  }

  let n = 0;
  for (const file of files) {
    const before = readFileSync(file, 'utf8');
    if (!before.includes('neela-nataraj') && !/Neela Nataraj/i.test(before)) continue;
    const after = rewrite(before);
    if (after !== before) {
      writeFileSync(file, after);
      n += 1;
      console.log(`[STRIP] expert claim ← ${file.replace(ROOT + '/', '')}`);
    }
  }
  console.log(`[PASS] strip-unverified-expert-claims: ${n} pages rewritten (evidence gate closed)`);
}

main();
