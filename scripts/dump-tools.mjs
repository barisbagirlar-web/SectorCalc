import fs from 'fs';
import path from 'path';

let md = "# SectorCalc Form Kullanım Listesi\n\nBu dokümanda projede bulunan tüm hesaplama araçlarının hangi form motorunu kullandığı eksiksiz olarak listelenmiştir.\n\n";

md += "## 1. UniversalIndustrialDecisionForm Kullanan Araçlar (Premium Schema)\n\n";
md += "Bu araçlar `src/lib/features/premium-schema/schemas/` dizini altında tanımlanmıştır.\n\n";
const premiumDir = "src/lib/features/premium-schema/schemas";
const premiumFiles = fs.readdirSync(premiumDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
premiumFiles.map(f => f.replace('.ts', '')).sort().forEach(slug => {
  md += `- ${slug}\n`;
});

md += "\n## 2. GeneratedToolFormView Kullanan Araçlar (Generated / Legacy JSON)\n\n";
md += "Bu araçlar `generated/schemas/` dizininden JSON formatında yüklenir.\n\n";
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
generatedSlugs.sort().forEach(slug => {
  md += `- ${slug}\n`;
});

fs.writeFileSync("/Users/macair1/.gemini/antigravity/brain/f28f16c4-c47c-4672-b0fd-efb5f95473b0/calculator_forms_list.md", md, "utf8");
console.log("Artifact created");
