#!/usr/bin/env node
/**
 * P25 — patch TR calculator surface glossary + revenue free-tool input labels.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const glossaryPath = join(ROOT, "src/data/calculator-phrase-glossary.json");
const messagesPath = (locale) => join(ROOT, "messages", `${locale}.json`);

const TR_GLOSSARY_PATCH = {
  "Amount to convert": "Dönüştürülecek miktar",
  "Source unit": "Kaynak birim",
  "Hourly": "Saatlik",
  "Original budget": "Orijinal bütçe",
  "Change cost estimate": "Değişiklik maliyet tahmini",
  "Change Estimate": "Değişiklik tahmini",
  "Deadline pressure": "Teslim baskısı",
  "Deadline Pressure": "Teslim baskısı",
  "Deadline Pressure Waste Percent": "Teslim baskısı fire yüzdesi",
  "Area size": "Alan büyüklüğü",
  "Area Size": "Alan büyüklüğü",
  "Staff count": "Personel sayısı",
  "Staff Count": "Personel sayısı",
  "Visits per month": "Aylık ziyaret sayısı",
  "Visit Frequency": "Ziyaret sıklığı",
  "Menu price": "Menü fiyatı",
  "Food cost": "Yemek maliyeti",
  "Product price": "Ürün fiyatı",
  "Shipping cost": "Kargo maliyeti",
  "Ad spend": "Reklam harcaması",
  "Return rate": "İade oranı",
  "Low": "Düşük",
  "Medium": "Orta",
  "High": "Yüksek",
  "Input": "Girdi",
  "Unit": "Birim",
  "Amount": "Tutar",
  "Starting amount": "Başlangıç tutarı",
  "Time horizon": "Zaman ufku",
  "Return amount": "Getiri tutarı",
  "Driving time": "Sürüş süresi",
  "Run time": "Çalışma süresi",
  "Yardage": "Metraj",
  "Box": "Kutu",
  "Depth / Height": "Derinlik / Yükseklik",
  "Setup time": "Hazırlık süresi",
  "Cycle time": "Çevrim süresi",
  "to run": "çalıştırılacak",
  "per part": "parça başına",
  "Part": "Parça",
  "part": "parça",
  "cycle": "çevrim",
  "Unit price": "Birim fiyat",
  "Unit Price": "Birim fiyat",
  "Unit tariff": "Birim tarife",
  "Unit Fiyat": "Birim fiyat",
  "Input Material": "Girdi malzeme",
  "Fuel input": "Yakıt girdisi",
  "Margin error": "Marj hatası",
  "Marj error": "Marj hatası",
  "Wall Area": "Duvar alanı",
  "Slab length": "Döşeme uzunluğu",
  "Slab width": "Döşeme genişliği",
  "Slab thickness": "Döşeme kalınlığı",
  "Slab depth": "Döşeme derinliği",
  "Length in feet": "Uzunluk (fit)",
  "Width in feet": "Genişlik (fit)",
  "Cubic yards": "Yarda küp",
  "Liters": "Litre",
  "Volume with waste": "Fire dahil hacim",
  "Bags needed": "Gereken torba sayısı",
  "Pour volume": "Döküm hacmi",
  "Paint needed": "Gereken boya",
  "in feet": "fit cinsinden",
  "foot": "fit",
  "feet": "fit",
  Time: "Süre",
  time: "süre",
  Error: "Hata",
  error: "hata",
  Optional: "İsteğe bağlı",
  optional: "isteğe bağlı",
  "Running time": "Çalışma süresi",
  "planned time": "planlanan süre",
  "planned production time": "planlanan üretim süresi",
  "Book time": "Kayıtlı süre",
  "Taşıma time": "Taşıma süresi",
  "Transport time": "Taşıma süresi",
  "kesim time": "kesim süresi",
  "Marj of error": "Marj hatası",
  "of error": "hata oranı",
  Rod: "Mil",
  rod: "mil",
};

const REVENUE_TR_INPUTS = {
  "machine-time-calculator": {
    setuptime: { label: "Hazırlık süresi", placeholder: "Hazırlık süresi girin", helper: "Parça başına hazırlık süresi" },
    cycletime: { label: "Çevrim süresi", placeholder: "Çevrim süresi girin", helper: "Parça başına çevrim süresi" },
    quantity: { label: "Miktar", placeholder: "Miktar girin", helper: "Çalıştırılacak parça adedi" },
  },
  "project-cost-calculator": {
    originalbudget: { label: "Orijinal bütçe", placeholder: "Orijinal bütçe girin", helper: "Proje başlangıç bütçesi" },
    changeestimate: { label: "Değişiklik maliyet tahmini", placeholder: "Değişiklik maliyeti girin", helper: "Tahmini değişiklik maliyeti" },
    deadlinepressure: { label: "Teslim baskısı", placeholder: "Teslim baskısı seçin", helper: "Teslim tarihi baskı seviyesi" },
  },
  "cleaning-cost-calculator": {
    areasize: { label: "Alan büyüklüğü", placeholder: "Alan büyüklüğü girin", helper: "Temizlenecek alan" },
    staffcount: { label: "Personel sayısı", placeholder: "Personel sayısı girin", helper: "Görevdeki personel adedi" },
    visitfrequency: { label: "Aylık ziyaret sayısı", placeholder: "Ziyaret sayısı girin", helper: "Ayda kaç ziyaret" },
  },
  "food-cost-calculator": {
    menuprice: { label: "Menü fiyatı", placeholder: "Menü fiyatı girin", helper: "Satış fiyatı" },
    foodcost: { label: "Yemek maliyeti", placeholder: "Yemek maliyeti girin", helper: "Malzeme maliyeti" },
    deliverycommission: { label: "Teslimat komisyonu", placeholder: "Komisyon girin", helper: "Teslimat platform komisyonu" },
  },
  "product-margin-calculator": {
    productprice: { label: "Ürün fiyatı", placeholder: "Ürün fiyatı girin", helper: "Satış fiyatı" },
    productcost: { label: "Ürün maliyeti", placeholder: "Ürün maliyeti girin", helper: "Birim maliyet" },
    returnrate: { label: "İade oranı", placeholder: "İade oranı girin", helper: "İade yüzdesi" },
  },
};

const glossary = JSON.parse(readFileSync(glossaryPath, "utf8"));
glossary.tr = { ...glossary.tr, ...TR_GLOSSARY_PATCH };
writeFileSync(glossaryPath, `${JSON.stringify(glossary, null, 2)}\n`);

function translateTrPhrase(text) {
  if (!text) return text;
  let result = text;
  const entries = Object.entries({ ...glossary.tr, ...TR_GLOSSARY_PATCH }).sort(
    (a, b) => b[0].length - a[0].length,
  );
  for (const [en, tr] of entries) {
    const re = new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    result = result.replace(re, tr);
  }
  return result;
}

for (const locale of ["tr"]) {
  const messages = JSON.parse(readFileSync(messagesPath(locale), "utf8"));
  messages.freeToolInputs = messages.freeToolInputs ?? {};
  for (const [slug, fields] of Object.entries(REVENUE_TR_INPUTS)) {
    messages.freeToolInputs[slug] = {
      ...(messages.freeToolInputs[slug] ?? {}),
      ...fields,
    };
  }
  for (const [slug, fields] of Object.entries(messages.freeToolInputs)) {
    if (!fields || typeof fields !== "object") continue;
    for (const [fieldKey, copy] of Object.entries(fields)) {
      if (!copy || typeof copy !== "object") continue;
      for (const part of ["label", "placeholder", "helper"]) {
        if (typeof copy[part] === "string") {
          copy[part] = translateTrPhrase(copy[part]);
        }
      }
      fields[fieldKey] = copy;
    }
    messages.freeToolInputs[slug] = fields;
  }
  writeFileSync(messagesPath(locale), `${JSON.stringify(messages, null, 2)}\n`);
}

console.log("patch-calculator-surface-p25: glossary + revenue TR inputs updated");
