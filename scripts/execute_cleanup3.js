const fs = require('fs');
const path = require('path');

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

// Cleanup data/pro-tools and data/pro-tools-universal
function deleteIfNotAllowed(dir, extension, slugExtractor) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith(extension)) {
      const slug = slugExtractor(file);
      if (!allowedSlugs.has(slug) && file !== '_merged.json') {
        fs.unlinkSync(path.join(dir, file));
      }
    }
  }
}
deleteIfNotAllowed('data/pro-tools', '.json', f => f.replace('.json', ''));
deleteIfNotAllowed('data/pro-tools-universal', '.json', f => f.replace('.json', ''));

// Update tool-git-dates.json
const datesPath = 'generated/tool-git-dates.json';
if (fs.existsSync(datesPath)) {
  const dates = JSON.parse(fs.readFileSync(datesPath, 'utf8'));
  const newDates = {};
  for (const k of Object.keys(dates)) {
    if (allowedSlugs.has(k)) newDates[k] = dates[k];
  }
  fs.writeFileSync(datesPath, JSON.stringify(newDates, null, 2));
}

// Instead of deleting the .ts files, which breaks the build, we just keep the .ts files. The prompt asks to remove tools from data files so they don't appear anywhere. The missing JSON will make them disappear from the catalog.
