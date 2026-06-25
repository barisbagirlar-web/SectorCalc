import fs from 'fs';

const p = 'src/app/layout.tsx';
let content = fs.readFileSync(p, 'utf8');

if (!content.includes('import { PaddleProvider }')) {
  content = content.replace(
    'import { NextIntlClientProvider } from "next-intl";',
    'import { NextIntlClientProvider } from "next-intl";\nimport { PaddleProvider } from "@/lib/paddle-provider";'
  );
  
  content = content.replace(
    '{children}',
    '<PaddleProvider>{children}</PaddleProvider>'
  );
}

fs.writeFileSync(p, content, 'utf8');
console.log('Fixed app layout');
