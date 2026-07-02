const fs = require('fs');
const path = require('path');

const freeSlugs = JSON.parse(fs.readFileSync('free-slugs.json', 'utf8'));
const premiumSlugs = JSON.parse(fs.readFileSync('premium-slugs.json', 'utf8'));

// We will keep all freeSlugs and premiumSlugs. 
// The user mentioned 103 pro tools, so let's try to keep 103 active pro tools.
let allowedProSlugs = new Set(premiumSlugs);
const proToolsDir = 'data/pro-tools';
let allNonDraft = [];
if (fs.existsSync(proToolsDir)) {
  for (const file of fs.readdirSync(proToolsDir)) {
    if (file.endsWith('.json') && file !== '_merged.json') {
      const data = JSON.parse(fs.readFileSync(path.join(proToolsDir, file), 'utf8'));
      if (!data.draft && !data.is_legacy_free) {
        allNonDraft.push(data.slug || file.replace('.json', ''));
      }
    }
  }
}

// Add to allowed Pro tools until we hit 103 (or just use all non-drafts)
for (let s of allNonDraft) {
  if (allowedProSlugs.size < 103) {
    allowedProSlugs.add(s);
  }
}

const allowedSlugs = new Set([...freeSlugs, ...allowedProSlugs]);
console.log(`Allowed slugs total: ${allowedSlugs.size} (Free: ${freeSlugs.length}, Pro: ${allowedProSlugs.size})`);

function deleteIfNotAllowed(dir, extension, slugExtractor) {
  if (!fs.existsSync(dir)) return;
  let deleted = 0;
  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith(extension)) {
      const slug = slugExtractor(file);
      if (!allowedSlugs.has(slug) && file !== '_merged.json') {
        fs.unlinkSync(path.join(dir, file));
        deleted++;
      }
    }
  }
  console.log(`Deleted ${deleted} files from ${dir}`);
}

// Clean data/pro-tools/
deleteIfNotAllowed('data/pro-tools', '.json', f => f.replace('.json', ''));

// Clean data/pro-tools-universal/
deleteIfNotAllowed('data/pro-tools-universal', '.json', f => f.replace('.json', ''));

// Clean generated schemas
deleteIfNotAllowed('generated/schemas/1', '.json', f => f.replace('-schema.json', ''));

// Clean generated ts
deleteIfNotAllowed('generated', '.ts', f => f.replace('.ts', ''));

// Clean premium-schema calculators
deleteIfNotAllowed('src/lib/features/premium-schema/calculators', '.ts', f => {
  return f.replace('-validation.ts', '').replace('.ts', '');
});

// Update tool-git-dates.json
const datesPath = 'generated/tool-git-dates.json';
if (fs.existsSync(datesPath)) {
  const dates = JSON.parse(fs.readFileSync(datesPath, 'utf8'));
  const newDates = {};
  for (const k of Object.keys(dates)) {
    if (allowedSlugs.has(k)) newDates[k] = dates[k];
  }
  fs.writeFileSync(datesPath, JSON.stringify(newDates, null, 2));
  console.log(`Updated tool-git-dates.json from ${Object.keys(dates).length} to ${Object.keys(newDates).length}`);
}

// Update free-tools-names.json
const namesPath = 'data/free-tools-names.json';
if (fs.existsSync(namesPath)) {
  const names = JSON.parse(fs.readFileSync(namesPath, 'utf8'));
  const newNames = {};
  for (const k of Object.keys(names)) {
    if (allowedSlugs.has(k)) newNames[k] = names[k];
  }
  fs.writeFileSync(namesPath, JSON.stringify(newNames, null, 2));
  console.log(`Updated free-tools-names.json from ${Object.keys(names).length} to ${Object.keys(newNames).length}`);
}

// Update slug-map.json
const mapPath = 'slug-map.json';
if (fs.existsSync(mapPath)) {
  const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  const newMap = {};
  for (const k of Object.keys(map)) {
    if (allowedSlugs.has(k)) newMap[k] = map[k];
  }
  fs.writeFileSync(mapPath, JSON.stringify(newMap, null, 2));
  console.log(`Updated slug-map.json from ${Object.keys(map).length} to ${Object.keys(newMap).length}`);
}
