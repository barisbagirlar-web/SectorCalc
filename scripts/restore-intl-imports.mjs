import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p, callback);
    } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      callback(p);
    }
  });
}

let modified = 0;

walk('./src', (file) => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('getTranslations') && !content.includes('next-intl/server') && !content.includes('next-intl')) {
    content = `import { getTranslations } from "next-intl/server";\n` + content;
    changed = true;
  }
  if (content.includes('getLocale') && !content.includes('getLocale }') && !content.includes('next-intl/server')) {
    content = `import { getLocale } from "next-intl/server";\n` + content;
    changed = true;
  }
  if (content.includes('useTranslations') && !content.includes('useTranslations }') && !content.includes('next-intl')) {
    content = `import { useTranslations } from "next-intl";\n` + content;
    changed = true;
  }
  if (content.includes('useLocale') && !content.includes('useLocale }') && !content.includes('next-intl')) {
    content = `import { useLocale } from "next-intl";\n` + content;
    changed = true;
  }
  if (content.includes('<NextIntlClientProvider') && !content.includes('NextIntlClientProvider }') && !content.includes('next-intl')) {
    content = `import { NextIntlClientProvider } from "next-intl";\n` + content;
    changed = true;
  }
  if (content.includes('getMessages') && !content.includes('getMessages }') && !content.includes('next-intl/server')) {
    content = `import { getMessages } from "next-intl/server";\n` + content;
    changed = true;
  }
  if (content.includes('setRequestLocale') && !content.includes('setRequestLocale }') && !content.includes('next-intl/server')) {
    content = `import { setRequestLocale } from "next-intl/server";\n` + content;
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    modified++;
  }
});

console.log(`Restored imports in ${modified} files.`);
