import fs from 'fs';

const catalogFile = 'src/data/free-tool-catalog-i18n.generated.json';
const titlesFile = 'src/data/generated-tool-titles-i18n.generated.json';

function slugToTitle(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

console.log("Englishifying Free Tools Catalog...");
const catalog = JSON.parse(fs.readFileSync(catalogFile, 'utf8'));
const tools = catalog['tr'] || catalog['en'];

const newEn = {};
for (const [key, val] of Object.entries(tools)) {
  const enTitle = slugToTitle(key);
  const enDesc = `Calculate ${enTitle} efficiently.`;
  
  newEn[key] = {
    title: enTitle,
    description: enDesc,
    seoTitle: `${enTitle} | SectorCalc`,
    seoDescription: enDesc
  };
}

// Ensure purely English
catalog['tr'] = newEn;
catalog['en'] = newEn;

fs.writeFileSync(catalogFile, JSON.stringify(catalog, null, 2), 'utf8');
console.log("Catalog updated.");

console.log("Englishifying Generated Tool Titles...");
const titles = JSON.parse(fs.readFileSync(titlesFile, 'utf8'));
for (const key of Object.keys(titles)) {
  const enTitle = slugToTitle(key);
  titles[key] = {
    en: enTitle,
    tr: enTitle
  };
}
fs.writeFileSync(titlesFile, JSON.stringify(titles, null, 2), 'utf8');
console.log("Titles updated.");
