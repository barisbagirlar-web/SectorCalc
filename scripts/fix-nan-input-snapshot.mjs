/**
 * Fix "NaN unit" leak in legacy tool input-snapshot tables:
 * fieldSI() builds disp as `${raw} ${unit}` with no isFinite guard, so an empty
 * numeric input (type=number rejects letters; empty -> parseFloat('') = NaN)
 * renders "NaN mm" / "NaN µm" in the A2 Input Snapshot audit table.
 * Wrap both disp constructions in Number.isFinite guards.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const FILES = readdirSync(process.cwd()).filter((f) => f.endsWith('-pro.html'));
const PAT1 = /disp:`\$\{raw\} \$\{us\.options\[us\.selectedIndex\]\.text\}`/g;
const PAT2 = /disp:String\(raw\)/g;

let changed = 0;
for (const f of FILES) {
  const p = path.resolve(f);
  let src = readFileSync(p, 'utf8');
  const before = src;
  src = src.replace(PAT1, 'disp:Number.isFinite(raw)?`${raw} ${us.options[us.selectedIndex].text}`:\'—\'');
  src = src.replace(PAT2, 'disp:Number.isFinite(raw)?String(raw):\'—\'');
  if (src !== before) {
    writeFileSync(p, src);
    changed += 1;
    console.log('FIXED', f);
  }
}
console.log(`\n${changed}/${FILES.length} files updated`);
