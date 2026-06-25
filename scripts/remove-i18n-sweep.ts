import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');
const EN_JSON_PATH = path.join(process.cwd(), 'messages', 'en.json');

// 1. Load and flatten en.json
const enDictRaw = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf-8'));

function flattenObject(ob: any, prefix = '') {
  let toReturn: Record<string, string> = {};
  for (let i in ob) {
    if (!ob.hasOwnProperty(i)) continue;
    if ((typeof ob[i]) === 'object' && ob[i] !== null) {
      const flatObject = flattenObject(ob[i], prefix + i + '.');
      for (let x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        toReturn[x] = flatObject[x];
      }
    } else {
      toReturn[prefix + i] = ob[i];
    }
  }
  return toReturn;
}

const enDict = flattenObject(enDictRaw);

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// 2. Process all TS/TSX files
function walkSync(dir: string, filelist: string[] = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      // skip some dirs if needed, but we want all
      filelist = walkSync(filepath, filelist);
    } else if (filepath.endsWith('.ts') || filepath.endsWith('.tsx')) {
      filelist.push(filepath);
    }
  }
  return filelist;
}

const files = walkSync(SRC_DIR);
let modifiedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  // Find all useTranslations declarations
  // e.g. const t = useTranslations("common");
  // e.g. const tA11y = useTranslations("a11y");
  const useTransRegex = /const\s+([a-zA-Z0-9_]+)\s*=\s*useTranslations\(\s*['"]([^'"]*)['"]\s*\);?/g;
  let match;
  const translationsToReplace: { varName: string, namespace: string }[] = [];

  while ((match = useTransRegex.exec(content)) !== null) {
    translationsToReplace.push({
      varName: match[1],
      namespace: match[2]
    });
  }

  // Remove the declarations
  content = content.replace(useTransRegex, '');

  // For each found useTranslations, replace its usages
  for (const tDef of translationsToReplace) {
    const { varName, namespace } = tDef;
    const nsPrefix = namespace ? `${namespace}.` : '';

    // match t("key") or t('key')
    const tUsageRegex = new RegExp(`${varName}\\(\\s*['"]([^'"]+)['"]\\s*(?:,\\s*\\{.*?\\})?\\s*\\)`, 'g');
    
    content = content.replace(tUsageRegex, (fullMatch, key) => {
      const fullKey = nsPrefix + key;
      const englishString = enDict[fullKey];

      if (englishString) {
        // If it's pure string without variables
        if (!englishString.includes('{')) {
          // If this t() call is inside JSX curly braces like {t("key")}, returning a string literal requires quotes.
          // We will just return the literal string wrapped in quotes.
          // We can use backticks to avoid escaping single/double quotes easily.
          return `\`${englishString.replace(/`/g, '\\`')}\``;
        } else {
          // Has variables, just return the raw string as best effort, stripping the brackets
          return `\`${englishString.replace(/`/g, '\\`').replace(/\{.*?\}/g, '...')}\``;
        }
      }
      return `\`${key}\``; // Fallback
    });
  }

  // Next-intl specific replacements
  // Remove imports
  content = content.replace(/import\s+\{[^}]*useTranslations[^}]*\}\s+from\s+['"]next-intl['"];?/g, '');
  content = content.replace(/import\s+\{[^}]*useLocale[^}]*\}\s+from\s+['"]next-intl['"];?/g, '');
  content = content.replace(/import\s+\{[^}]*NextIntlClientProvider[^}]*\}\s+from\s+['"]next-intl['"];?/g, '');
  
  // Replace routing imports
  content = content.replace(/import\s+\{\s*Link([^}]*)\}\s+from\s+['"]@\/i18n\/routing['"];?/g, 'import Link$1 from "next/link";');
  content = content.replace(/import\s+\{\s*useRouter,\s*usePathname\s*\}\s+from\s+['"]@\/i18n\/routing['"];?/g, 'import { useRouter, usePathname } from "next/navigation";');
  content = content.replace(/import\s+\{\s*usePathname,\s*useRouter\s*\}\s+from\s+['"]@\/i18n\/routing['"];?/g, 'import { usePathname, useRouter } from "next/navigation";');
  content = content.replace(/import\s+\{\s*redirect\s*\}\s+from\s+['"]@\/i18n\/routing['"];?/g, 'import { redirect } from "next/navigation";');
  
  // Quick cleanup for unused next-intl line
  content = content.replace(/import\s+.*?from\s+['"]next-intl['"];?\n?/g, '');
  content = content.replace(/import\s+.*?from\s+['"]@\/i18n\/routing['"];?\n?/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf-8');
    modifiedFiles++;
  }
}

console.log(`Updated ${modifiedFiles} files by removing next-intl crumbs and injecting pure English.`);
