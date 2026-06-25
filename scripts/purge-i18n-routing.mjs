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

walk('./src', (file) => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('@/i18n/routing')) {
    let needsLink = content.match(/\bLink\b/) && content.match(/^.*@\/i18n\/routing.*$/m)[0].includes('Link');
    let needsRouter = content.match(/\buseRouter\b/) && content.match(/^.*@\/i18n\/routing.*$/m)[0].includes('useRouter');
    let needsPathname = content.match(/\busePathname\b/) && content.match(/^.*@\/i18n\/routing.*$/m)[0].includes('usePathname');
    let needsRedirect = content.match(/\bredirect\b/) && content.match(/^.*@\/i18n\/routing.*$/m)[0].includes('redirect');
    
    // Also check for stripLocalePrefix or AppLocale
    let hasOther = content.match(/^.*@\/i18n\/routing.*$/m)[0].includes('stripLocalePrefix') || content.match(/^.*@\/i18n\/routing.*$/m)[0].includes('AppLocale');
    
    content = content.replace(/^.*@\/i18n\/routing.*$\n?/gm, '');
    
    if (needsLink && !content.includes('next/link')) {
      content = `import Link from "next/link";\n` + content;
    }
    
    const navImports = [];
    if (needsRouter && !content.includes('import { useRouter')) navImports.push('useRouter');
    if (needsPathname && !content.includes('import { usePathname')) navImports.push('usePathname');
    if (needsRedirect && !content.includes('import { redirect')) navImports.push('redirect');
    
    if (navImports.length > 0) {
      content = `import { ${navImports.join(', ')} } from "next/navigation";\n` + content;
    }
    
    // Stub stripLocalePrefix if it was used
    if (hasOther) {
      if (!content.includes('stripLocalePrefix')) {
         content += `\n// fallback\nfunction stripLocalePrefix(p: string) { return p; }\ntype AppLocale = "en";\n`;
      }
    }
    
    fs.writeFileSync(file, content, 'utf8');
  }
});
console.log('Purged i18n routing from all files.');
