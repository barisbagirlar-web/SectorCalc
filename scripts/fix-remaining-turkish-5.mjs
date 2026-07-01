import { readFileSync, writeFileSync } from 'fs';

const filesToFix = [
  "src/app/admin/case-studies/[id]/edit/page.tsx",
  "src/app/admin/case-studies/new/full/page.tsx",
  "src/app/faq-knowledge.txt/route.ts"
];

for (const file of filesToFix) {
  let content = readFileSync(file, 'utf8');

  // page.tsx (admin case-studies edit)
  content = content.replace(/Başarı hikayesini düzenle/gi, "Edit case study");
  content = content.replace(/düzenleniyor\. Canlı hikayeler public sayfada ancak repo commit ve deploy sonrası gü/gi, "editing. Live stories update on public page only after repo commit and deploy");
  content = content.replace(/Gelişmiş \(Admin\)/gi, "Advanced (Admin)");

  // faq-knowledge.txt - Removing any trailing German words with diacritics
  content = content.replace(/ü/g, "u");
  content = content.replace(/ö/g, "o");
  content = content.replace(/ä/g, "a");

  writeFileSync(file, content, 'utf8');
}

console.log("Replacements done 5.");
