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

  // Fix: import Link, usePathname, useRouter  from "next/link";
  // to: 
  // import Link from "next/link";
  // import { usePathname, useRouter } from "next/navigation";
  
  content = content.replace(/import\s+Link\s*,\s*usePathname\s*,\s*useRouter\s+from\s+['"]next\/link['"];?/g, 
    'import Link from "next/link";\nimport { usePathname, useRouter } from "next/navigation";');

  content = content.replace(/import\s+Link\s*,\s*useRouter\s*,\s*usePathname\s+from\s+['"]next\/link['"];?/g, 
    'import Link from "next/link";\nimport { useRouter, usePathname } from "next/navigation";');

  content = content.replace(/import\s+Link\s*,\s*usePathname\s+from\s+['"]next\/link['"];?/g, 
    'import Link from "next/link";\nimport { usePathname } from "next/navigation";');

  content = content.replace(/import\s+Link\s*,\s*useRouter\s+from\s+['"]next\/link['"];?/g, 
    'import Link from "next/link";\nimport { useRouter } from "next/navigation";');

  content = content.replace(/import\s+Link\s*,\s*redirect\s+from\s+['"]next\/link['"];?/g, 
    'import Link from "next/link";\nimport { redirect } from "next/navigation";');

  content = content.replace(/import\s+Link\s+as\s+([a-zA-Z0-9_]+)\s+from\s+['"]next\/link['"];?/g, 
    'import $1 from "next/link";');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf-8');
    fixedFiles++;
  }
}

console.log(`Fixed imports in ${fixedFiles} files.`);
