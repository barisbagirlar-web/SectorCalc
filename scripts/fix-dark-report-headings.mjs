/**
 * DARK THEME REPORT HEADINGS FIX — idempotent, scoped.
 *
 * Root cause: in dark theme the template variables --navy (#0a1626) and
 * --steel (#12385e) stay near-black, but the report headings (audit <summary>,
 * table <th>, chart .chartbox .t, page h1, field-group labels, .btn3, unit
 * selects) use them as TEXT color → unreadable on the dark panels.
 * We cannot recolor the variables (they are also BACKGROUND colors for
 * .topbar/.panel-h/.btn2), so we add dark-theme overrides that switch the
 * text-bearing heading elements to var(--ink) (light in dark theme).
 *
 * Safe: appends one rule after the dark variable block; repeats no-op.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const HEAD = 'scripts/fix-dark-report-headings.mjs';

const DARK_VAR_BLOCK = `html[data-theme="dark"]{
  --bg:#0e131a; --panel:#161d27; --panel2:#1b2430; --line:#2a3646;
  --ink:#e6ecf3; --mut:#93a3b5; --thead:#212c3a;
  --navy:#0a1626; --steel:#12385e; --blue:#4c9be8; --accent:#E87722;
  --ok:#3fbf7f; --warn:#e8a33d; --err:#f26d64;
}`;

const FIX_RULE =
  'html[data-theme="dark"] .head h1,html[data-theme="dark"] .fgroup>label,' +
  'html[data-theme="dark"] summary,html[data-theme="dark"] th,' +
  'html[data-theme="dark"] .chartbox .t,html[data-theme="dark"] .btn3,' +
  'html[data-theme="dark"] .uwrap select.units{color:var(--ink)}';

function main() {
  const files = readdirSync(process.cwd()).filter(
    (f) => f.endsWith('-pro.html') && !f.startsWith('.')
  );
  let patched = 0;
  let skipped = 0;
  for (const file of files) {
    const html = readFileSync(file, 'utf8');
    if (!html.includes('--navy:#0f2744')) continue; // different template (quote/labor/weld/sc008)
    if (html.includes(FIX_RULE)) {
      console.log(`[skip] ${file} already patched`);
      skipped++;
      continue;
    }
    const blockIndex = html.indexOf(DARK_VAR_BLOCK);
    if (blockIndex === -1) {
      console.error(`[FAIL] ${file}: dark variable block not found`);
      process.exitCode = 1;
      continue;
    }
    const blockEnd = blockIndex + DARK_VAR_BLOCK.length;
    const nextChar = html[blockEnd];
    if (nextChar !== '\n' && nextChar !== '\r' && nextChar !== '') {
      console.error(`[FAIL] ${file}: unexpected char after dark block ('${nextChar}')`);
      process.exitCode = 1;
      continue;
    }
    const patchedHtml = html.slice(0, blockEnd) + '\n' + FIX_RULE + html.slice(blockEnd);
    writeFileSync(file, patchedHtml, 'utf8');
    console.log(`[ok] ${file} patched`);
    patched++;
  }
  console.log(`\nDARK_REPORT_HEADINGS: ${patched} patched, ${skipped} already patched`);
  if (process.exitCode) {
    console.error(`${HEAD}: FAILED — see errors above`);
    process.exit(1);
  }
}

main();
