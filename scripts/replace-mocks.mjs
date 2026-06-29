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

walk('./src/app', (file) => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('await (async (k: string) => k)')) {
    content = content.replace(/await\s+\(async\s+\(k:\s*string\)\s*=>\s*k\)/g, 'await getTranslations()');
    fs.writeFileSync(file, content, 'utf8');
  }
});
console.log('Replaced all mocks.');
