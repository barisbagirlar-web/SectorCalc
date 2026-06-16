#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

const LABELS = {
  "physics-science": { en: "Physics & science", tr: "Fizik ve bilim", de: "Physik & Wissenschaft", fr: "Physique et sciences", es: "Física y ciencia", ar: "الفيزياء والعلوم" },
  "chemistry-science": { en: "Chemistry", tr: "Kimya", de: "Chemie", fr: "Chimie", es: "Química", ar: "الكيمياء" },
  "engineering-science": { en: "Engineering", tr: "Mühendislik", de: "Ingenieurwesen", fr: "Ingénierie", es: "Ingeniería", ar: "الهندسة" },
  "food-cooking": { en: "Food & cooking", tr: "Yemek ve mutfak", de: "Essen & Kochen", fr: "Alimentation et cuisine", es: "Comida y cocina", ar: "الطعام والطبخ" },
  "date-time": { en: "Date & time", tr: "Tarih ve saat", de: "Datum & Zeit", fr: "Date et heure", es: "Fecha y hora", ar: "التاريخ والوقت" },
  "education-academic": { en: "Education", tr: "Eğitim", de: "Bildung", fr: "Éducation", es: "Educación", ar: "التعليم" },
  "ecology-environment": { en: "Ecology & environment", tr: "Ekoloji ve çevre", de: "Ökologie & Umwelt", fr: "Écologie et environnement", es: "Ecología y medio ambiente", ar: "البيئة والإيكولوجيا" },
  "gaming-entertainment": { en: "Gaming & entertainment", tr: "Oyun ve eğlence", de: "Gaming & Unterhaltung", fr: "Jeux et divertissement", es: "Juegos y entretenimiento", ar: "الألعاب والترفيه" },
  "hobbies-diy": { en: "Hobbies & DIY", tr: "Hobi ve DIY", de: "Hobbys & DIY", fr: "Loisirs et bricolage", es: "Aficiones y bricolaje", ar: "الهوايات والأعمال اليدوية" },
};

const DESCRIPTIONS = {
  "physics-science": { en: "Mechanics, thermodynamics, waves and modern physics estimates.", tr: "Mekanik, termodinamik, dalgalar ve modern fizik tahminleri.", de: "Mechanik, Thermodynamik, Wellen und moderne Physik.", fr: "Mécanique, thermodynamique, ondes et physique moderne.", es: "Mecánica, termodinámica, ondas y física moderna.", ar: "ميكانيكا وديناميكا حرارية وموجات." },
  "chemistry-science": { en: "Molarity, pH, stoichiometry and lab concentration tools.", tr: "Molarite, pH, stokiyometri ve laboratuvar araçları.", de: "Molarität, pH, Stöchiometrie und Laborkonzentration.", fr: "Molarité, pH, stœchiométrie et concentration.", es: "Molaridad, pH, estequiometría y concentración.", ar: "المولارية ودرجة الحموضة والحسابات الكيميائية." },
  "engineering-science": { en: "Stress, fluids, electrical and mechanical engineering checks.", tr: "Gerilme, akışkanlar ve mühendislik kontrolleri.", de: "Spannung, Strömung, Elektro- und Maschinenbau.", fr: "Contrainte, fluides, électricité et mécanique.", es: "Esfuerzo, fluidos, electricidad e ingeniería.", ar: "إجهاد وموائع وهندسة ميكانيكية." },
  "food-cooking": { en: "Recipe scaling, baking, beverage and kitchen cost math.", tr: "Tarif ölçekleme, fırıncılık ve mutfak maliyeti.", de: "Rezeptskalierung, Backen und Küchenkosten.", fr: "Recettes, pâtisserie et coûts cuisine.", es: "Recetas, horneado y costos de cocina.", ar: "وصفات ومخبوزات وتكاليف المطبخ." },
  "date-time": { en: "Age, date difference, calendars and time zone helpers.", tr: "Yaş, tarih farkı ve saat dilimi yardımcıları.", de: "Alter, Datumsdifferenz und Zeitzonen.", fr: "Âge, dates, calendriers et fuseaux horaires.", es: "Edad, fechas, calendarios y zonas horarias.", ar: "العمر والتواريخ والمناطق الزمنية." },
  "education-academic": { en: "GPA, test scores, reading level and academic planning.", tr: "GPA, sınav puanları ve akademik planlama.", de: "GPA, Testergebnisse und Studienplanung.", fr: "GPA, scores de tests et planification.", es: "GPA, exámenes y planificación académica.", ar: "المعدل ودرجات الاختبارات والتخطيط الأكاديمي." },
  "ecology-environment": { en: "Carbon footprint, energy savings and sustainability metrics.", tr: "Karbon ayak izi ve sürdürülebilirlik metrikleri.", de: "CO₂-Fußabdruck und Nachhaltigkeit.", fr: "Empreinte carbone et durabilité.", es: "Huella de carbono y sostenibilidad.", ar: "البصمة الكربونية والاستدامة." },
  "gaming-entertainment": { en: "Game stats, odds, music tempo and photo exposure helpers.", tr: "Oyun istatistikleri, oranlar ve fotoğraf pozlama.", de: "Spielstatistiken, Quoten und Belichtung.", fr: "Stats de jeu, cotes et exposition photo.", es: "Estadísticas de juego, probabilidades y exposición.", ar: "إحصائيات الألعاب والاحتمالات." },
  "hobbies-diy": { en: "Gardening, pets, crafts, sports betting and outdoor hobbies.", tr: "Bahçecilik, evcil hayvan, el işi ve hobiler.", de: "Garten, Haustiere, Handwerk und Hobbys.", fr: "Jardinage, animaux, artisanat et loisirs.", es: "Jardinería, mascotas, manualidades y aficiones.", ar: "البستنة والحيوانات والحرف." },
};

for (const locale of LOCALES) {
  const path = join(ROOT, `messages/${locale}.json`);
  const messages = JSON.parse(readFileSync(path, "utf8"));
  const catalog = messages.freeTrafficCatalog;
  for (const [id, labels] of Object.entries(LABELS)) {
    catalog.categories[id] = labels[locale];
    catalog.categoryDescriptions[id] = DESCRIPTIONS[id][locale];
  }
  writeFileSync(path, `${JSON.stringify(messages, null, 2)}\n`);
  console.log(`patched ${locale}.json`);
}
