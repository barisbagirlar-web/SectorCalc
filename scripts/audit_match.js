const fs = require('fs');
const path = require('path');

const jsonFile = path.join(__dirname, '../gemını free 191-359 .txt');
const toolsDir = path.join(__dirname, '../src/tools/generated');
const appDir = path.join(__dirname, '../src/app/[locale]/free-tools');

async function runAudit() {
  console.log("=== TUR 1 - ADIM 1: TARAMA VE EŞLEŞTİRME ===");
  
  if (!fs.existsSync(jsonFile)) {
    console.error("HATA: JSON dosyası bulunamadı:", jsonFile);
    return;
  }

  const rawData = fs.readFileSync(jsonFile, 'utf-8');
  const toolIds = [];
  
  // JSON parsing failed due to control characters, fallback to Regex extraction
  const idRegex = /"tool_id"\s*:\s*"([^"]+)"/g;
  const nameRegex = /"tool_name"\s*:\s*"([^"]+)"/g;
  
  let idMatch, nameMatch;
  let matches = [];
  
  // Basitçe tüm tool_id ve tool_name leri sırayla toplayalım
  const ids = [...rawData.matchAll(idRegex)].map(m => m[1]);
  const names = [...rawData.matchAll(nameRegex)].map(m => m[1]);
  
  for (let i = 0; i < ids.length; i++) {
    if (names[i]) {
      toolIds.push({ id: ids[i], name: names[i] });
    }
  }

  const totalTools = toolIds.length;
  console.log(`PASS: JSON regex ile başarıyla tarandı. Toplam Araç Sayısı: ${totalTools}`);

  console.log(`PASS: JSON başarıyla okundu. Toplam Araç Sayısı: ${totalTools}`);
  
  // Klasör kontrolleri
  let existingToolsCount = 0;
  if (fs.existsSync(toolsDir)) {
      const files = fs.readdirSync(toolsDir);
      existingToolsCount = files.length;
      console.log(`INFO: ${toolsDir} dizininde ${existingToolsCount} dosya bulundu.`);
  } else {
      console.log(`UYARI: ${toolsDir} dizini bulunamadı.`);
  }

  let appToolsCount = 0;
  if (fs.existsSync(appDir)) {
      const files = fs.readdirSync(appDir);
      appToolsCount = files.length;
      console.log(`INFO: ${appDir} dizininde ${appToolsCount} route klasörü bulundu.`);
  } else {
      console.log(`UYARI: ${appDir} dizini bulunamadı.`);
  }

  console.log(`\nSONUÇ: TUR 1 Hazırlığı Tamamlandı. İlk 3 araç:`, toolIds.slice(0,3));
}

runAudit();
