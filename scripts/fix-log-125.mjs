import fs from 'fs';
import path from 'path';

const i18nPath = path.join(process.cwd(), 'src/data/free-tool-inputs-i18n.generated.json');
const i18nData = JSON.parse(fs.readFileSync(i18nPath, 'utf8'));

// The exact structure according to the TS error is:
// Record<Locale, Record<Slug, Record<InputKey, FieldDisplayCopy>>>
// We must NOT wrap input keys inside an "inputs" object.

const locales = ['en', 'tr', 'de', 'fr', 'es', 'ar'];

locales.forEach(locale => {
  if (!i18nData[locale]) i18nData[locale] = {};
  
  if (!i18nData[locale]["log-125"]) {
    const labelCif = locale === 'tr' ? "CIF Bedeli (Mal + Sigorta + Navlun)" : "CIF Value";
    const helperCif = locale === 'tr' ? "Gümrük vergisi matrahı olarak kullanılacak CIF değeri." : "CIF value used as tax base.";
    
    const labelGumruk = locale === 'tr' ? "Gümrük Vergisi Oranı" : "Customs Tax Rate";
    const helperGumruk = locale === 'tr' ? "Uygulanacak gümrük vergisi oranı." : "Applicable customs tax rate.";
    
    // DIRECTLY ATTACH TO SLUG (no 'inputs' wrapper)
    i18nData[locale]["log-125"] = {
       "cif_bedel": {
          "label": labelCif,
          "placeholder": "...",
          "helper": helperCif
       },
       "gumruk_orani": {
          "label": labelGumruk,
          "placeholder": "...",
          "helper": helperGumruk
       }
    };
  }
});

fs.writeFileSync(i18nPath, JSON.stringify(i18nData, null, 2), 'utf8');
console.log("log-125 i18n SUCCESS!");
