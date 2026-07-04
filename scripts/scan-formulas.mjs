import fs from 'fs';
import path from 'path';

const txtFiles = ['hesaplama kontrolu.txt', 'gemini_free_yeni_.txt'];
const generatedDir = './src/tools/generated';

// Extract tools from TXT
const txtTools = [];
for (const file of txtFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    // Example: "1. Yüzde Kuralı | Girdiler: AylikKira (₺), MulkDegeri (₺) | Formül: Ratio = (AylikKira / MAX(1, MulkDegeri)) * 100 | Çıktı: Ratio (%)"
    if (line.includes('| Girdiler:') && line.includes('| Formül:')) {
      const match = line.match(/^\d+\.\s*(.*?)\s*\|\s*Girdiler:(.*?)\|\s*Formül:(.*?)\|\s*Çıktı:/);
      if (match) {
        txtTools.push({
          title: match[1].trim(),
          inputs: match[2].trim(),
          formula: match[3].trim(),
          file: file
        });
      }
    }
  }
}

// Read TS files
const tsFiles = fs.readdirSync(generatedDir).filter(f => f.endsWith('.ts'));
const results = [];

for (const tsFile of tsFiles) {
  const p = path.join(generatedDir, tsFile);
  const content = fs.readFileSync(p, 'utf8');
  
  const titleMatch = content.match(/Araç Adı:\s*(.*?)$/m);
  if (!titleMatch) continue;
  const title = titleMatch[1].trim();
  
  // Find formula in TS
  const formulaMatch = content.match(/const result\s*=\s*(.*?);/);
  const tsFormula = formulaMatch ? formulaMatch[1].trim() : 'N/A';
  
  // Find in txt
  const txtTool = txtTools.find(t => t.title.toLowerCase() === title.toLowerCase() || title.toLowerCase().includes(t.title.toLowerCase()));
  
  if (txtTool) {
    results.push({
      title,
      tsFile,
      txtFormula: txtTool.formula,
      tsFormula
    });
  } else {
    results.push({
      title,
      tsFile,
      txtFormula: "NOT FOUND IN TXT",
      tsFormula
    });
  }
}

fs.writeFileSync('scripts/.cache/formula-scan-results.json', JSON.stringify(results, null, 2));
console.log(`Scanned ${tsFiles.length} TS files. Found ${results.filter(r => r.txtFormula !== 'NOT FOUND IN TXT').length} matches in TXT.`);
