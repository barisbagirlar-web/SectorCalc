import fs from 'fs';
import { translate } from '@vitalets/google-translate-api';

const catalogFile = 'src/data/free-tool-catalog-i18n.generated.json';
const titlesFile = 'src/data/generated-tool-titles-i18n.generated.json';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log("Translating Free Tools Catalog...");
  const catalog = JSON.parse(fs.readFileSync(catalogFile, 'utf8'));
  const tools = catalog['tr'];
  
  if (!tools) {
    console.log("No TR tools found in catalog.");
    return;
  }
  
  const entries = Object.entries(tools);
  const newEn = {};
  
  // We process in small chunks to avoid bans
  const chunkSize = 20; 
  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunk = entries.slice(i, i + chunkSize);
    console.log(`Processing chunk ${i} to ${i+chunk.length} of ${entries.length}...`);
    
    for (const [key, val] of chunk) {
      try {
        const titleRes = await translate(val.title, { to: 'en' });
        const descRes = await translate(val.description, { to: 'en' });
        
        const enTitle = titleRes.text;
        const enDesc = descRes.text;
        
        newEn[key] = {
          title: enTitle,
          description: enDesc,
          seoTitle: `${enTitle} | SectorCalc`,
          seoDescription: enDesc
        };
      } catch (err) {
        console.error(`Error translating key ${key}:`, err.message);
        // Fallback to original if translation fails
        newEn[key] = val;
      }
      await delay(100); // 100ms between individual requests
    }
    
    // Save partial progress
    catalog['en'] = newEn;
    // Overwrite 'tr' with 'en' since we want pure english!
    catalog['tr'] = newEn;
    
    fs.writeFileSync(catalogFile, JSON.stringify(catalog, null, 2), 'utf8');
  }
  
  console.log("Catalog translation done.");
  
  console.log("Translating Generated Tool Titles...");
  const titles = JSON.parse(fs.readFileSync(titlesFile, 'utf8'));
  const keys = Object.keys(titles);
  
  for (let i = 0; i < keys.length; i += chunkSize) {
    const chunk = keys.slice(i, i + chunkSize);
    console.log(`Processing title chunk ${i} to ${i+chunk.length} of ${keys.length}...`);
    for (const key of chunk) {
      if (titles[key].tr) {
        try {
          const res = await translate(titles[key].tr, { to: 'en' });
          titles[key].en = res.text;
          titles[key].tr = res.text; // Pure english
        } catch(e) {
           console.error("Error", e.message);
        }
        await delay(100);
      }
    }
    fs.writeFileSync(titlesFile, JSON.stringify(titles, null, 2), 'utf8');
  }
  
  console.log("Translation completely finished!");
}

run();
