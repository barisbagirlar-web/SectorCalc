import fs from 'fs';

let audit = fs.readFileSync('src/app/audit/[sectorKey]/page.tsx', 'utf-8');
audit = audit.replace(/import\s+[^'"]+['"]@\/i18n\/routing['"];?/g, '');
fs.writeFileSync('src/app/audit/[sectorKey]/page.tsx', audit, 'utf-8');

let page = fs.readFileSync('src/app/page.tsx', 'utf-8');
page = page.replace(/\.\.\/\.\.\/styles\/landing-page\.css/, '../styles/landing-page.css');
fs.writeFileSync('src/app/page.tsx', page, 'utf-8');

console.log('Fixed path errors.');
