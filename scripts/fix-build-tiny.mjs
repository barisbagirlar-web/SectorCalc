import fs from 'fs';

function fixUseClient(file) {
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes('import { usePathname } from \'next/navigation\';\n"use client";')) {
    content = content.replace('import { usePathname } from \'next/navigation\';\n"use client";', '"use client";\nimport { usePathname } from \'next/navigation\';');
    fs.writeFileSync(file, content, 'utf-8');
  } else if (content.includes('import { usePathname } from \'next/navigation\';\n// @ts-nocheck\n"use client";')) {
    content = content.replace('import { usePathname } from \'next/navigation\';\n// @ts-nocheck\n"use client";', '"use client";\n// @ts-nocheck\nimport { usePathname } from \'next/navigation\';');
    fs.writeFileSync(file, content, 'utf-8');
  }
}

fixUseClient('src/components/subscription/ProCheckoutButton.tsx');
fixUseClient('src/components/tools/DynamicPremiumCalculator.tsx');
fixUseClient('src/components/tools/ToolSafeReviewState.tsx');

let audit = fs.readFileSync('src/app/audit/[sectorKey]/page.tsx', 'utf-8');
audit = audit.replace(/import \{ routing \} from "@\/i18n\/routing";/g, '');
fs.writeFileSync('src/app/audit/[sectorKey]/page.tsx', audit, 'utf-8');

let layout = fs.readFileSync('src/app/layout.tsx', 'utf-8');
layout = layout.replace(/import "\.\.\/globals\.css";/g, 'import "./globals.css";');
fs.writeFileSync('src/app/layout.tsx', layout, 'utf-8');

console.log('Fixed build tiny issues.');
