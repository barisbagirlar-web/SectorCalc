import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const FILES = [
  'pro_hesaplama_araclari_193_.txt',
  'gemını free 191-359 .txt',
  'gemını_free_359_359.txt',
  'gemini_free_yeni_.txt' // I see this file exists too
];

function slugifyTurkish(text) {
  const trMap = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'i': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'I': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
  };
  let base = text
    .split('')
    .map(char => trMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  if (!base.endsWith('-calculator')) {
      base += '-calculator';
  }
  return base;
}

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
  const map = {};
  for (const file of FILES) {
    const filepath = path.join(ROOT, file);
    if (!fs.existsSync(filepath)) {
      continue;
    }
    
    let content = fs.readFileSync(filepath, 'utf8');
    // sometimes these files have invalid JSON trailing commas, etc.
    let data;
    try {
        data = JSON.parse(content);
    } catch(e) {
        console.error("Failed to parse JSON for", file, e.message);
        // attempt rough regex extraction
        const toolNames = [...content.matchAll(/"tool_name"\s*:\s*"([^"]+)"/g)].map(m => m[1]);
        data = { "extracted": toolNames.map(name => ({ tool_name: name })) };
    }
    
    const arrays = Object.values(data);
    for (const arr of arrays) {
        if (!Array.isArray(arr)) continue;
        for (const item of arr) {
            const rawTrName = item.tool_name || item.name;
            if (!rawTrName) continue;
            
            const trName = rawTrName.replace(/Hesaplayıcı$/i, "").replace(/Hesaplayıcısı$/i, "").trim();
            const oldSlug1 = slugifyTurkish(trName);
            const oldSlug2 = slugifyTurkish(rawTrName);
            
            // translate
            let enName = await translate(trName);
            enName = enName.replace(/Calculator/ig, "").trim();
            const newSlug = slugifyEnglish(enName);
            
            map[oldSlug1] = newSlug;
            map[oldSlug2] = newSlug;
            console.log(`Mapped: ${oldSlug1} -> ${newSlug}`);
        }
    }
  }
  
  fs.writeFileSync(path.join(ROOT, 'slug-map.json'), JSON.stringify(map, null, 2));
  console.log(`Created slug-map.json with ${Object.keys(map).length} entries.`);
}

run();
