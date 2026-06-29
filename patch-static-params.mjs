import fs from 'fs';

const filesToPatch = [
  "src/app/[locale]/premium-tools/[categorySlug]/page.tsx",
  "src/app/[locale]/tools/[tier]/[slug]/page.tsx",
  "src/app/[locale]/tools/free/[slug]/page.tsx",
  "src/app/[locale]/tools/premium-schema/[slug]/print/page.tsx",
  "src/app/[locale]/tools/premium-schema/[slug]/page.tsx",
  "src/app/[locale]/tools/premium/[slug]/page.tsx",
  "src/app/[locale]/industries/[slug]/page.tsx",
  "src/app/[locale]/audit/[sectorKey]/page.tsx",
  "src/app/[locale]/guides/[slug]/page.tsx",
  "src/app/[locale]/seo/[slug]/page.tsx"
];

for (const file of filesToPatch) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Find the exact line containing `export async function generateStaticParams` or `export function generateStaticParams`
  const lines = content.split('\n');
  const outLines = [];
  let inFunc = false;
  
  for (let i = 0; i < lines.length; i++) {
    outLines.push(lines[i]);
    if (lines[i].includes('export async function generateStaticParams') || lines[i].includes('export function generateStaticParams')) {
      // If the '{' is on the same line or next line
      if (lines[i].includes('{')) {
        outLines.push('  return []; // HACK: bypass huge SSG build for fast Firebase deploy');
      } else if (i + 1 < lines.length && lines[i+1].includes('{')) {
        outLines.push(lines[i+1]);
        outLines.push('  return []; // HACK: bypass huge SSG build for fast Firebase deploy');
        i++;
      }
    }
  }

  fs.writeFileSync(file, outLines.join('\n'));
  console.log("Patched", file);
}
