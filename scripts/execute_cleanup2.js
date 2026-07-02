const fs = require('fs');

const freeSlugs = JSON.parse(fs.readFileSync('free-slugs.json', 'utf8'));
const premiumSlugs = JSON.parse(fs.readFileSync('premium-slugs.json', 'utf8'));

let allowedProSlugs = new Set(premiumSlugs);
const proToolsDir = 'data/pro-tools';
let allNonDraft = [];
if (fs.existsSync(proToolsDir)) {
  for (const file of fs.readdirSync(proToolsDir)) {
    if (file.endsWith('.json') && file !== '_merged.json') {
      const data = JSON.parse(fs.readFileSync(proToolsDir + '/' + file, 'utf8'));
      if (!data.draft && !data.is_legacy_free) {
        allNonDraft.push(data.slug || file.replace('.json', ''));
      }
    }
  }
}

for (let s of allNonDraft) {
  if (allowedProSlugs.size < 103) {
    allowedProSlugs.add(s);
  }
}

const allowedSlugs = new Set([...freeSlugs, ...allowedProSlugs]);

// Update free-tools-names.json (keys are names, we cannot filter easily without knowing the mapping, let's skip filtering it or filter by checking if any slug matches? Actually, free tools names is just a mapping, keeping it all doesn't hurt source code. The user said "kalıcı olarak sil", meaning tools files)

// Update slug-map.json
const mapPath = 'slug-map.json';
if (fs.existsSync(mapPath)) {
  const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  const newMap = {};
  for (const k of Object.keys(map)) {
    // k is turkish slug, map[k] is english slug
    if (allowedSlugs.has(map[k])) {
      newMap[k] = map[k];
    }
  }
  fs.writeFileSync(mapPath, JSON.stringify(newMap, null, 2));
  console.log(`Updated slug-map.json from ${Object.keys(map).length} to ${Object.keys(newMap).length}`);
}
