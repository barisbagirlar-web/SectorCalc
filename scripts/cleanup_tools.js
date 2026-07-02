const fs = require('fs');
const path = require('path');

const freeSlugs = JSON.parse(fs.readFileSync('free-slugs.json', 'utf8'));
const premiumSlugs = JSON.parse(fs.readFileSync('premium-slugs.json', 'utf8'));

// The user mentioned 103 Pro tools. Let's see if we can find 103 exactly.
// premiumSlugs has 87. Maybe there are 16 others?
// Let's read all files in data/pro-tools/ and find those that are active.
let activeProTools = new Set(premiumSlugs);
const proToolsDir = 'data/pro-tools';
if (fs.existsSync(proToolsDir)) {
  for (const file of fs.readdirSync(proToolsDir)) {
    if (file.endsWith('.json') && file !== '_merged.json') {
      const data = JSON.parse(fs.readFileSync(path.join(proToolsDir, file), 'utf8'));
      if (!data.draft && !data.is_legacy_free) {
        activeProTools.add(data.slug || file.replace('.json', ''));
      }
    }
  }
}
console.log('Active Free Tools:', freeSlugs.length);
console.log('Active Pro Tools found:', activeProTools.size);
