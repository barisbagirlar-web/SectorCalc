import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const MAP_PATH = path.join(ROOT, 'slug-map.json');

const FILES_TO_UPDATE = [
  'src/data/premium/sectorcalc-premium-152.seed.ts',
  'src/data/premium/sectorcalc-premium-152.seed.json',
  'src/lib/tools/runtime-readiness-p24-verdicts.ts',
  'src/tools/generated/index.ts',
];

function run() {
  if (!fs.existsSync(MAP_PATH)) {
    console.error("slug-map.json not found!");
    process.exit(1);
  }
  
  const map = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));
  
  // Sort keys by length descending to prevent partial replacements (e.g. replacing 'abc' inside 'abc-def')
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);
  
  let totalReplaced = 0;
  
  for (const file of FILES_TO_UPDATE) {
    const filepath = path.join(ROOT, file);
    if (!fs.existsSync(filepath)) {
      console.warn("File not found, skipping:", file);
      continue;
    }
    
    let content = fs.readFileSync(filepath, 'utf8');
    let original = content;
    
    for (const oldSlug of keys) {
      if (oldSlug.length < 5) continue; // skip very short/dangerous replacements
      
      const newSlug = map[oldSlug];
      if (oldSlug === newSlug) continue;
      
      // regex to match exact string occurrences (mainly inside quotes)
      // e.g. "old-slug" or 'old-slug'
      // We will look for quotes surrounding the slug
      const regex1 = new RegExp(`"${oldSlug}"`, 'g');
      content = content.replace(regex1, `"${newSlug}"`);
      
      const regex2 = new RegExp(`'${oldSlug}'`, 'g');
      content = content.replace(regex2, `'${newSlug}'`);
    }
    
    if (content !== original) {
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`Updated slugs in ${file}`);
      totalReplaced++;
    } else {
      console.log(`No matching slugs found in ${file}`);
    }
  }
  
  console.log(`Finished updating ${totalReplaced} files.`);
}

run();
