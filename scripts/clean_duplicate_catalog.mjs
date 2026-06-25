import fs from 'fs';
import path from 'path';

const catalogFile = path.resolve('./src/lib/tools/free-traffic-catalog.ts');
const cacheFile = path.resolve('./scripts/extracted_tools_cache.json');

console.log("=== AŞAMA 1: KATALOG TEMİZLİĞİ (CLEAN SLATE) ===");

const rawCache = fs.readFileSync(cacheFile, 'utf-8');
const tools = JSON.parse(rawCache);

// Çıkarılmış olan 400 aracın slug listesini bir Hash Map'e alalım ki hızlıca arayabilelim.
// fin-001, mech-192 vb.
const generatedSlugs = new Set();
tools.forEach(t => {
    if (t.tool_id) {
        generatedSlugs.add(t.tool_id.toLowerCase().replace(/_/g, '-'));
    }
});

let content = fs.readFileSync(catalogFile, 'utf-8');

const arrayStartToken = 'export const FREE_TRAFFIC_TOOLS: readonly FreeTrafficTool[] = [';
const startIndex = content.indexOf(arrayStartToken);

if (startIndex === -1) {
    console.error("[FAIL] FREE_TRAFFIC_TOOLS array bulunamadı.");
    process.exit(1);
}

const contentBeforeArray = content.substring(0, startIndex + arrayStartToken.length);
const restOfContent = content.substring(startIndex + arrayStartToken.length);

let depth = 0;
let inString = false;
let stringChar = '';
let currentObjectStr = '';
const cleanedObjects = [];
let arrayEndIndex = -1;

// Basit Brace Matcher (Objeleri tek tek çıkart)
for (let i = 0; i < restOfContent.length; i++) {
    const char = restOfContent[i];
    
    // Eğer dizinin sonuna ']' geldiysek ve obje içinde değilsek döngüyü kır
    if (char === ']' && depth === 0 && !inString) {
        arrayEndIndex = i;
        break;
    }

    if (char === '"' || char === "'" || char === '`') {
        if (!inString) {
            inString = true;
            stringChar = char;
        } else if (char === stringChar && restOfContent[i-1] !== '\\') {
            inString = false;
        }
    }

    if (!inString) {
        if (char === '{') depth++;
        if (char === '}') depth--;
    }

    if (depth > 0 || char === '}') {
        currentObjectStr += char;
    }
    
    // Obje kapandığında (depth 0 olduğunda ve currentObjectStr doluyken)
    if (depth === 0 && currentObjectStr.trim().length > 0) {
        // Bu objeyi incele
        let shouldKeep = true;
        
        // Slug'ı regex ile bulalım: slug: "fin-001" veya "slug": "fin-001"
        const slugMatch = currentObjectStr.match(/slug\s*:\s*["']([^"']+)["']/);
        if (slugMatch) {
            const currentSlug = slugMatch[1];
            // Eğer bu slug bizim YENİ veya ESKİ ürettiğimiz 400 (veya 359) araçtan biriyse, SİL! (Keep = false)
            if (generatedSlugs.has(currentSlug) || currentSlug.match(/^[a-z]+-\d+$/)) {
                shouldKeep = false;
            }
        }
        
        if (shouldKeep) {
            cleanedObjects.push(currentObjectStr.trim());
        }
        
        currentObjectStr = '';
    }
}

const contentAfterArray = restOfContent.substring(arrayEndIndex);

// Temizlenmiş objeleri virgülle birleştir ve yeni array string'i oluştur
const newArrayContent = '\n  ' + cleanedObjects.join(',\n  ') + '\n';
const finalContent = contentBeforeArray + newArrayContent + contentAfterArray;

fs.writeFileSync(catalogFile, finalContent, 'utf-8');

console.log(`[PASS] Katalog temizlendi. Tüm dummy/eski endüstriyel araçlar (fin-xxx vb) dosyadan silindi.`);
console.log(`[INFO] Sadece ${cleanedObjects.length} adet orijinal OMNI aracı korundu.`);
