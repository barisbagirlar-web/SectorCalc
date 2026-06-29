import fs from 'fs';
import path from 'path';

function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else if (filepath.endsWith('.ts') || filepath.endsWith('.tsx')) {
      filelist.push(filepath);
    }
  }
  return filelist;
}

const files = walkSync(path.join(process.cwd(), 'src'));
let fixedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  // Replace t(...) with ...
  // This is a simple regex that matches t(something) where something doesn't contain parentheses.
  // We do it in a loop to handle multiple occurrences.
  content = content.replace(/\b(?:t|tTools|tCards|tA11y|tValidation)\(([^)]+)\)/g, '$1');
  
  // Replace useLocale() with "en"
  content = content.replace(/\buseLocale\(\)/g, '"en"');
  
  // Replace stripLocalePrefix(...) with ...
  content = content.replace(/\bstripLocalePrefix\(([^)]+)\)/g, '$1');

  // Replace AppLocale with "en"
  // If it's used as a type, we replace it with "en" type
  content = content.replace(/\bAppLocale\b/g, '"en"');

  // Remove next-intl imports that might be lingering
  content = content.replace(/import\s+.*?from\s+['"]next-intl.*['"];?\n?/g, '');
  content = content.replace(/import\s+.*?from\s+['"]@\/i18n\/routing['"];?\n?/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf-8');
    fixedFiles++;
  }
}

console.log(`Fixed remaining TS errors in ${fixedFiles} files.`);
