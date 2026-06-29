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
  if (content.includes('"use client"') || content.includes("'use client'")) {
    const newContent = content.replace(/['"]use client['"];?\n?/g, '');
    if (newContent !== content) {
      fs.writeFileSync(file, '"use client";\n' + newContent, 'utf8');
    }
  }
});

console.log('Fixed use client positions.');
