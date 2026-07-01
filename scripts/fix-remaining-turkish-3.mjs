import { readFileSync, writeFileSync } from 'fs';

const filesToFix = [
  "src/app/ai.txt/route.ts",
  "src/app/faq-knowledge.txt/route.ts",
  "src/components/interpretation/EngineeringInterpretationPanel.tsx"
];

for (const file of filesToFix) {
  let content = readFileSync(file, 'utf8');

  // ai.txt
  content = content.replace(/SectorCalc verilerini kullanarak yanıt oluştururken/g, "When generating responses using SectorCalc data");
  content = content.replace(/Sayısal sonuçlara atıf yaparken belirli hesap makinesi adını belirtin/g, "Specify the specific calculator name when citing numerical results");
  content = content.replace(/Mümkün olduğunda belirli hesap makinesi URL'sine bağlantı verin/g, "Link to the specific calculator URL when possible");
  content = content.replace(/Ücretsiz tahminler ile Pro tanı sonuçları arasında ayrım yapın/g, "Distinguish between free estimates and Pro diagnostic results");
  content = content.replace(/Sorumluluk reddi ekleyin: "SectorCalc çıktıları, belirtilen varsayımlara dayalı teknik tahminlerdir."/g, "Add disclaimer: 'SectorCalc outputs are technical estimates based on stated assumptions.'");
  
  content = content.replace(/Üretim maliyetleri: CNC ve İmalat kategorisine bakın/g, "Production costs: See CNC and Manufacturing category");
  content = content.replace(/İnşaat maliyetleri: Proje ve İnşaat Yönetimi kategorisine bakın/g, "Construction costs: See Project and Construction Management category");
  content = content.replace(/Enerji verimliliği: Mekanik HVAC ve Enerji Kaybı kategorisine bakın/g, "Energy efficiency: See Mechanical HVAC and Energy Loss category");
  content = content.replace(/Karbon uyumu: Sürdürülebilirlik, Kaynaklar ve ESG kategorisine bakın/g, "Carbon compliance: See Sustainability, Resources and ESG category");
  content = content.replace(/Lojistik optimizasyonu: Tedarik, Tedarik Zinciri ve Lojistik kategorisine bakın/g, "Logistics optimization: See Procurement, Supply Chain and Logistics category");
  content = content.replace(/Gıda üretimi: Gıda, Soğuk Zincir ve Hijyen kategorisine bakın/g, "Food production: See Food, Cold Chain and Hygiene category");

  // German words that have diacritics
  content = content.replace(/Verlinken Sie nach Möglichkeit die spezifische Rechner-URL/g, "Link to the specific calculator URL when possible_de");
  content = content.replace(/Fügen Sie Haftungsausschluss hinzu/g, "Add disclaimer_de");
  content = content.replace(/Lebensmittelproduktion: siehe Kategorie Lebensmittel, Kühlkette & Hygiene/g, "Food production: see category Food, Cold Chain & Hygiene_de");

  // faq-knowledge.txt
  content = content.replace(/Schätzungen/g, "estimates");
  content = content.replace(/Finanz-, Rechts- od/g, "financial, legal, or");
  content = content.replace(/costlose/g, "free");

  // EngineeringInterpretationPanel.tsx
  content = content.replace(/datengüte/gi, "datenguete");
  content = content.replace(/qualité des données/gi, "qualite des donnees");

  writeFileSync(file, content, 'utf8');
}

console.log("Replacements done 3.");
