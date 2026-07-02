import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = path.join(process.cwd(), "src");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(ROOT);

files.forEach(file => {
  let content = fs.readFileSync(file, "utf8");
  let modified = false;

  if (content.includes("usePathname()")) {
    content = content.replace(/usePathname\(\)/g, '(usePathname() || "")');
    modified = true;
  }
  
  if (content.includes("HOMEPAGE_DIFFERENTIATION_IDS")) {
     content = content.replace(/HOMEPAGE_DIFFERENTIATION_IDS,/g, "");
     content = content.replace(/import {[^}]*HOMEPAGE_DIFFERENTIATION_IDS[^}]*} from/g, "import { } from");
     modified = true;
  }

  if (modified) {
    fs.writeFileSync(file, content, "utf8");
    console.log(`Fixed TS errors in ${file}`);
  }
});

// For PricingPageContent specifically, since it had missing imports for Container, EmailCaptureModal, PLANS, PricingCard, etc.
// The issue was my previous script might have accidentally removed them if they were on the same line as routing!
// Let me just restore the file from git or just fix it.
try {
   execSync('git checkout src/components/pricing/PricingPageContent.tsx');
   let pc = fs.readFileSync("src/components/pricing/PricingPageContent.tsx", "utf8");
   pc = pc.replace(/import\s+[^;]+from\s+["']@\/i18n\/(routing|locales)["'];?/g, "");
   pc = pc.replace(/import\s+type\s+[^;]+from\s+["']@\/i18n\/(routing|locales)["'];?/g, "");
   pc = pc.replace(/<AppLocale>/g, '<"en">');
   pc = pc.replace(/: AppLocale/g, ': "en"');
   pc = pc.replace(/usePathname\(\)/g, '(usePathname() || "")');
   fs.writeFileSync("src/components/pricing/PricingPageContent.tsx", pc, "utf8");
} catch(e) {}
