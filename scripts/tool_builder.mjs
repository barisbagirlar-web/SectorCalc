import fs from 'fs';
import path from 'path';

const jsonFile = path.resolve('./gemını free 191-359 .txt');

console.log("=== TYPE 2: ENDÜSTRİYEL VALİDASYON VE KOD ÜRETİMİ (TOOL BUILDER) ===");

if (!fs.existsSync(jsonFile)) {
  console.error("ERROR: JSON dosyası bulunamadı:", jsonFile);
  process.exit(1);
}

const rawData = fs.readFileSync(jsonFile, 'utf-8');

// Temizlik İşlemleri:
let cleanData = rawData.replace(/[\x00-\x09\x0B-\x1F\x7F]/g, "");

let fixedData = cleanData.trim();
if (fixedData.startsWith('{') && fixedData.endsWith('}')) {
    fixedData = fixedData.replace(/}\s*\{/g, '},{');
    fixedData = '[' + fixedData + ']';
}

let toolsArray = [];
try {
  const parsed = JSON.parse(fixedData);
  if (Array.isArray(parsed)) {
      parsed.forEach(batchObj => {
          Object.keys(batchObj).forEach(key => {
              if (Array.isArray(batchObj[key])) {
                  toolsArray = toolsArray.concat(batchObj[key]);
              }
          });
      });
  } else {
      Object.keys(parsed).forEach(key => {
          if (Array.isArray(parsed[key])) {
              toolsArray = toolsArray.concat(parsed[key]);
          }
      });
  }
} catch (e) {
  console.error("ERROR: JSON Parse failed after cleanup. Detay:", e.message);
  process.exit(1);
}

console.log(`PASS: ${toolsArray.length} count toolın TAM DATASI (Inputs, Warnings, Validation) başarıyla yüklendi.`);

// Örnek: İlk Toolı İncele
const firstTool = toolsArray[0];
console.log(`\nÖRNEK ARAÇ İNCELEMESİ: ${firstTool.tool_id} - ${firstTool.tool_name}`);
console.log(`Inputs: ${firstTool.inputs.map(i => i.id).join(', ')}`);
if (firstTool.engine_rules) {
   console.log(`Validation Kuralları Mevcut: ${Object.keys(firstTool.engine_rules.validation || {}).length}`);
   console.log(`Smart Warnings (Endüstriyel Kural): ${firstTool.engine_rules.smart_warnings?.length || 0} count`);
}

console.log("\nSONUÇ: Tool Builder veriyi işlemeye hazır. Kod üretimine başlanabilir.");
