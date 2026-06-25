import fs from 'fs';
import path from 'path';

const catalogFile = path.resolve('./src/lib/tools/free-traffic-catalog.ts');
const cacheFile = path.resolve('./scripts/extracted_tools_cache.json');

console.log("=== AŞAMA 5: FRONTEND UI (KATALOG) ENTEGRASYONU ===");

if (!fs.existsSync(catalogFile) || !fs.existsSync(cacheFile)) {
    console.error("[FAIL] Katalog veya Cache dosyası bulunamadı!");
    process.exit(1);
}

const rawCache = fs.readFileSync(cacheFile, 'utf-8');
const tools = JSON.parse(rawCache);

let catalogContent = fs.readFileSync(catalogFile, 'utf-8');

// Check if already injected
if (catalogContent.includes("rezonans-frekansi")) {
    console.log("[INFO] Araçlar zaten kataloga eklenmiş.");
    process.exit(0);
}

let injectionString = "";

tools.forEach(t => {
    if (!t.tool_id) return;
    const slug = t.tool_id.toLowerCase().replace(/_/g, '-');
    
    // Validate category (it must be a valid FreeTrafficCategory, if not known fallback to math-statistics)
    const validCategories = ["construction-measurement", "finance-business", "manufacturing-workshop", "energy-carbon", "logistics-travel", "agriculture-food", "everyday-life", "math-statistics", "conversion", "health-body"];
    let category = "math-statistics";
    if (t.category) {
         // Haritalama yapabiliriz ama şimdilik en yakın eşleşme veya fallback
         if (validCategories.includes(t.category)) {
             category = t.category;
         }
    }
    
    const title = t.tool_name.replace(/"/g, "'");
    
    let inputsStr = t.inputs.map(i => {
        let minVal = "undefined";
        if (t.validation && t.validation[i.id] !== undefined) {
            minVal = t.validation[i.id];
        }
        return `      {
        key: "${i.id}",
        label: "tools.free.${slug}.inputs.${i.id}.label",
        unit: "${i.unit || ''}",
        type: "number",
        min: ${minVal},
        helper: "tools.free.${slug}.inputs.${i.id}.helper"
      }`;
    }).join(',\n');

    injectionString += `
  {
    slug: "${slug}",
    category: "${category}",
    title: "${title}",
    description: "${title} hesaplama aracı.",
    seoTitle: "${title} | SectorCalc Pro",
    seoDescription: "${title} endüstriyel hesaplamaları.",
    missingFactors: [],
    inputs: [
${inputsStr}
    ],
    resultType: "quantity"
  },`;
});

// Remove trailing comma from injectionString
injectionString = injectionString.replace(/,$/, '');

const fallbackPoint = "export const FREE_TRAFFIC_CATEGORIES";
if (catalogContent.includes(fallbackPoint)) {
     const parts = catalogContent.split(fallbackPoint);
     const lastBracketIndex = parts[0].lastIndexOf("];");
     if (lastBracketIndex !== -1) {
         const before = parts[0].substring(0, lastBracketIndex).trim().replace(/,$/, '');
         const after = parts[0].substring(lastBracketIndex + 2);
         catalogContent = before + "," + injectionString + "\n];\n" + after + fallbackPoint + parts[1];
         fs.writeFileSync(catalogFile, catalogContent, 'utf-8');
         console.log(`[PASS] ${tools.length} adet aracın UI Form şeması başarıyla kataloğa zerk edildi.`);
     } else {
         console.error("[FAIL] Enjeksiyon noktası (];) bulunamadı.");
     }
} else {
    console.error("[FAIL] Enjeksiyon noktası bulunamadı.");
}
