/**
 * Add "general" coverage item to all 6 locale files.
 */
import fs from "node:fs";

const localeFiles = [
  { file: "messages/tr.json", title: "Genel Amaçlı Hesaplayıcılar", desc: "Matematik, istatistik, sağlık, fitness ve genel kullanım hesaplayıcıları.", short: "Genel", tags: ["Matematik", "İstatistik", "Sağlık"] },
  { file: "messages/en.json", title: "General Purpose Calculators", desc: "Math, statistics, health, fitness and general-purpose calculators.", short: "General", tags: ["Math", "Statistics", "Health"] },
  { file: "messages/de.json", title: "Allgemeine Rechner", desc: "Mathematik, Statistik, Gesundheit, Fitness und allgemeine Rechner.", short: "Allgemein", tags: ["Mathe", "Statistik", "Gesundheit"] },
  { file: "messages/fr.json", title: "Calculateurs Généraux", desc: "Mathématiques, statistiques, santé, fitness et calculateurs généraux.", short: "Général", tags: ["Maths", "Statistiques", "Santé"] },
  { file: "messages/es.json", title: "Calculadoras Generales", desc: "Matemáticas, estadísticas, salud, fitness y calculadoras de uso general.", short: "General", tags: ["Matemáticas", "Estadística", "Salud"] },
  { file: "messages/ar.json", title: "آلات حاسبة عامة", desc: "آلات حاسبة للرياضيات والإحصاء والصحة واللياقة البدنية والاستخدام العام", short: "عام", tags: ["رياضيات", "إحصاء", "صحة"] },
];

const coverageItem = {
  title: "",
  description: "",
  shortTitle: "",
  tags: [] as string[],
};

for (const entry of localeFiles) {
  const raw = JSON.parse(fs.readFileSync(entry.file, "utf-8"));
  const coverage = raw.homepageHybrid?.coverage;
  if (!coverage || !coverage.items) {
    console.log(`SKIP: ${entry.file} - no homepageHybrid.coverage.items`);
    continue;
  }
  
  coverage.items.general = {
    title: entry.title,
    description: entry.desc,
    shortTitle: entry.short,
    tags: entry.tags,
  };
  
  fs.writeFileSync(entry.file, JSON.stringify(raw, null, 2) + "\n", "utf-8");
  console.log(`OK: ${entry.file} - added general`);
}
