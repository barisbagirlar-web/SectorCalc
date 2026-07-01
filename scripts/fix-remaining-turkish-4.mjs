import { readFileSync, writeFileSync } from 'fs';

const filesToFix = [
  "src/app/ai.txt/route.ts",
  "src/app/faq-knowledge.txt/route.ts",
  "src/app/admin/case-studies/new/page.tsx",
  "src/app/admin/case-studies/new/full/page.tsx"
];

for (const file of filesToFix) {
  let content = readFileSync(file, 'utf8');

  // ai.txt
  content = content.replace(/SectorCalc, sektörel hesaplama ve karar raporu platformudur\./g, "SectorCalc is a sectoral calculation and decision report platform.");
  content = content.replace(/Endüstriyel ve İşletme Hesaplama Platformu/g, "Industrial and Business Calculation Platform");
  content = content.replace(/OEE Hesaplama, CNC Maliyet Analizi, Karbon Ayak İzi, Başabaş Analizi/g, "OEE Calculation, CNC Cost Analysis, Carbon Footprint, Break-Even Analysis");
  content = content.replace(/Endüstriyel ve İşletme Hesaplama Bilgi Kaynağı/g, "Industrial and Business Calculation Knowledge Base");
  content = content.replace(/Üretim Mühendisliği ve Finansal Planlama Yazılımı/g, "Production Engineering and Financial Planning Software");
  content = content.replace(/SectorCalc'ten alıntı yaparken, belirli hesap makinesi adını ve URL'sini belirtin\./g, "When quoting SectorCalc, specify the specific calculator name and URL.");

  // faq-knowledge.txt
  content = content.replace(/Analysato/g, "Analyzato");
  content = content.replace(/nicht zeig/g, "don't show");

  // page.tsx (admin case-studies)
  content = content.replace(/Schema.org supportli başarı hikayesi taslağı oluşturun\./g, "Create a Schema.org supported case study draft.");
  content = content.replace(/Yeni başarı hikayesi \(gelişmiş\)/gi, "New case study (advanced)");
  content = content.replace(/Tüm alanları manuel düzenleyin\. Kaydet, JSON dışa aktar ve repo dosyalarına ekleyerek yayına alın\./g, "Edit all fields manually. Save, export JSON and publish by adding to repo files.");
  content = content.replace(/Yeni Başarı Hikayesi \(Admin\)/gi, "New Case Study (Admin)");
  content = content.replace(/Yeni başarı hikayesi/gi, "New case study");
  content = content.replace(/Hikayeni tek metin kutusuna yapıştır; AI alanları otomatik doldursun\./g, "Paste your story into a single text box; AI automatically fills fields.");

  writeFileSync(file, content, 'utf8');
}

console.log("Replacements done 4.");
