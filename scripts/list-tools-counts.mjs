import fs from 'fs';
import path from 'path';

const premiumDir = "src/lib/features/premium-schema/schemas";
const premiumFiles = fs.readdirSync(premiumDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
console.log(`PremiumSchemaToolForm Kullanan Araç Sayısı: ${premiumFiles.length}`);

const generatedDir = "generated/schemas";
const generatedSlugs = [];
if (fs.existsSync(generatedDir)) {
  const dirs = fs.readdirSync(generatedDir);
  for (const dir of dirs) {
    const fullPath = path.join(generatedDir, dir);
    if (fs.statSync(fullPath).isDirectory()) {
      const files = fs.readdirSync(fullPath).filter(f => f.endsWith('-schema.json'));
      generatedSlugs.push(...files.map(f => f.replace('-schema.json', '')));
    } else if (fullPath.endsWith('-schema.json')) {
      generatedSlugs.push(dir.replace('-schema.json', ''));
    }
  }
}
console.log(`GeneratedToolFormView Kullanan Araç Sayısı: ${generatedSlugs.length}`);

// Yazdır
console.log("\n=== PremiumSchemaToolForm Kullananlar (Örnek İlk 5) ===");
premiumFiles.slice(0, 5).forEach(f => console.log(f.replace('.ts', '')));

console.log("\n=== GeneratedToolFormView Kullananlar (Örnek İlk 5) ===");
generatedSlugs.sort().slice(0, 5).forEach(s => console.log(s));
