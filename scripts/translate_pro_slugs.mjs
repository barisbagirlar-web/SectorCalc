import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

// Files to update
const SEED_JSON = path.join(ROOT, 'src/data/premium/sectorcalc-premium-152.seed.json');
const SEED_TS = path.join(ROOT, 'src/data/premium/sectorcalc-premium-152.seed.ts');
const VERDICTS_TS = path.join(ROOT, 'src/lib/tools/runtime-readiness-p24-verdicts.ts');
const PRO_TOOLS_PAGE = path.join(ROOT, 'src/app/pro-tools/[slug]/page.tsx');

function slugifyEnglish(text) {
  let base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  if (!base.endsWith('-calculator')) {
      base += '-calculator';
  }
  return base;
}

async function translate(text) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    let translated = "";
    if (json && json[0]) {
      for (const chunk of json[0]) {
        translated += chunk[0];
      }
    }
    return translated || text;
  } catch (e) {
    console.error("Translate error for", text, e.message);
    return text;
  }
}

async function run() {
  const jsonContent = fs.readFileSync(SEED_JSON, 'utf8');
  const data = JSON.parse(jsonContent);
  
  const map = {}; // old slug -> new slug
  
  // Extract all tools and translate
  for (const tool of data.tools) {
      const oldSlug = tool.slug;
      if (!oldSlug) continue;
      
      const trTitle = tool.trTitle;
      if (!trTitle) continue;

      const cleanedTrTitle = trTitle.replace(/Hesaplayıcı$/i, "").replace(/Hesaplayıcısı$/i, "").trim();
      let enName = await translate(cleanedTrTitle);
      enName = enName.replace(/Calculator/ig, "").trim();
      const newSlug = slugifyEnglish(enName);
      
      map[oldSlug] = newSlug;
      console.log(`Mapping: ${oldSlug} -> ${newSlug}`);
  }

  const keys = Object.keys(map).sort((a, b) => b.length - a.length);

  const filesToUpdate = [SEED_JSON, SEED_TS, VERDICTS_TS, PRO_TOOLS_PAGE];
  
  for (const filepath of filesToUpdate) {
    if (!fs.existsSync(filepath)) continue;
    let content = fs.readFileSync(filepath, 'utf8');
    let original = content;
    
    for (const oldSlug of keys) {
      if (oldSlug === map[oldSlug]) continue;
      
      const newSlug = map[oldSlug];
      const regex1 = new RegExp(`"${oldSlug}"`, 'g');
      content = content.replace(regex1, `"${newSlug}"`);
      
      const regex2 = new RegExp(`'${oldSlug}'`, 'g');
      content = content.replace(regex2, `'${newSlug}'`);
    }
    
    if (content !== original) {
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`Updated slugs in ${filepath}`);
    }
  }
  
  console.log(`Done translating and updating slugs.`);
}

run();
