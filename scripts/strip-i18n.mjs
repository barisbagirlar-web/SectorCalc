import fs from 'fs';
import path from 'path';

console.log("=== YAPIYI SAFKAN İNGİLİZCEYE ÇEVİRME BAŞLADI ===");

// 1. Update src/lib/i18n/locale-config.ts
const localeConfigPath = path.join(process.cwd(), 'src/lib/i18n/locale-config.ts');
let localeConfig = fs.readFileSync(localeConfigPath, 'utf8');

// Replace SUPPORTED_LOCALES
localeConfig = localeConfig.replace(
  /export const SUPPORTED_LOCALES = \["en", "tr", "de", "fr", "es", "ar"\] as const;/,
  'export const SUPPORTED_LOCALES = ["en"] as const;'
);

// We should also remove TR, DE, etc. from LOCALE_DEFINITIONS
// But a simpler regex is just removing the keys from COUNTRY_TO_LOCALE and PREFIXED_LOCALES just in case.
localeConfig = localeConfig.replace(
  /export const PREFIXED_LOCALES.*?;/s,
  'export const PREFIXED_LOCALES = [] as const;'
);

fs.writeFileSync(localeConfigPath, localeConfig, 'utf8');
console.log("locale-config.ts güncellendi (Sadece EN).");

// 2. Clear translation data in src/data/
const dataDir = path.join(process.cwd(), 'src/data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') || f.endsWith('.ts'));

files.forEach(file => {
  if (file.includes('i18n')) {
    const filePath = path.join(dataDir, file);
    if (file.endsWith('.json')) {
      let content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      // Sadece 'en' anahtarını tut
      const pureEnglishContent = { en: content.en || {} };
      fs.writeFileSync(filePath, JSON.stringify(pureEnglishContent, null, 2), 'utf8');
      console.log(`${file} JSON dosyasından yabancı diller silindi.`);
    }
  }
});

// 3. Remove translation messages logic if any
const messagesDir = path.join(process.cwd(), 'src/i18n/messages');
if (fs.existsSync(messagesDir)) {
  const msgFiles = fs.readdirSync(messagesDir);
  msgFiles.forEach(f => {
    if (f !== 'en.json' && f.endsWith('.json')) {
      fs.unlinkSync(path.join(messagesDir, f));
      console.log(`Silindi: ${f}`);
    }
  });
}

console.log("Safkan İngilizce operasyonu tamamlandı!");
