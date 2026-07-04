import fs from "fs";
import path from "path";

const SRC_LIB = path.join(process.cwd(), "src/lib");
const SRC_DIR = path.join(process.cwd(), "src");
const ROOT_DIR = process.cwd();

// 1. Dizin Haritalaması (Eski ad -> Yeni Kategori)
const mapping = {
  // CORE
  "math": "core",
  "units": "core",
  "format": "core",
  "validation": "core",
  "types": "core",
  "steelcore": "core",
  "cn.ts": "core",
  "mathematical-property-tester.ts": "core",

  // FEATURES
  "calculators": "features",
  "tools": "features",
  "premium": "features",
  "premium-schema": "features",
  "ai": "features",
  "ai-assistant": "features",
  "ai-gateway": "features",
  "ai-repair": "features",
  "assistant": "features",
  "reports": "features",
  "case-studies": "features",
  "admin": "features",
  "billing": "features",
  "subscription": "features",
  "auth": "features",
  "commercial": "features",
  "compliance": "features",
  "decision-engine": "features",
  "engine": "features",
  "engines": "features",
  "entitlements": "features",
  "formula-governance": "features",
  "formulas": "features",
  "free-tools": "features",
  "freemium": "features",
  "generated-tools": "features",
  "leads": "features",
  "local-ai": "features",
  "quote": "features",
  "regional": "features",
  "regional-benchmarks": "features",
  "registry": "features",
  "smart-form": "features",
  "standards": "features",
  "tool-activation": "features",
  "tool-guides": "features",
  "tool-schemas": "features",
  "trust-trace": "features",
  "campaigns": "features",
  "cbam": "features",
  "carbon": "features",
  "credits": "features",
  "emission-factors": "features",
  "emission-factors.ts": "features",
  "machine-rate": "features",
  "manufacturing-os": "features",
  "shop-rate": "features",
  "inventory": "features",
  "field-mode": "features",
  "growth": "features",
  "industries": "features",
  "plans.ts": "features",
  "input": "features",

  // INFRASTRUCTURE
  "firebase": "infrastructure",
  "email": "infrastructure",
  "analytics": "infrastructure",
  "seo": "infrastructure",
  "i18n": "infrastructure",
  "metadata": "infrastructure",
  "metadata.ts": "infrastructure",
  "pwa": "infrastructure",
  "trace": "infrastructure",
  "build": "infrastructure",
  "feature-flags": "infrastructure",
  "release": "infrastructure",
  "supplier-api": "infrastructure",
  "supplier-api.ts": "infrastructure",
  "actions": "infrastructure",
  "benchmarks": "infrastructure", // (or features, but wait, there is regional-benchmarks) Let's put in features
  "feedback": "infrastructure",
  "semantic": "infrastructure",

  // UI-SHARED
  "layout": "ui-shared",
  "icons": "ui-shared",
  "fonts": "ui-shared",
  "chart-helpers": "ui-shared",
  "chart-helpers.ts": "ui-shared",
  "branding": "ui-shared",
  "calculator-experience": "ui-shared",
  "footer": "ui-shared",
  "home": "ui-shared",
  "navigation": "ui-shared",
  "notifications": "ui-shared",
  "ui": "ui-shared",
  "paddle-provider.tsx": "ui-shared",

  // CONTENT
  "legal": "content",
  "disclaimer": "content",
  "terminology": "content",
  "guidance": "content",
  "methodology": "content",
  "locale-center": "content",
  "pdf": "content",
  
  // IGNORE (Don't move)
  "__tests__": null
};

// Adjust missed ones
mapping["benchmarks"] = "features";
mapping["feedback"] = "features";
mapping["semantic"] = "features";

// 2. Yeni Klasörleri Oluştype
const categories = new Set(Object.values(mapping).filter(Boolean));
for (const cat of categories) {
  const dirPath = path.join(SRC_LIB, cat);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 3. Import Replace Fonksiyonu (Project Genelinde)
function updateImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  let modified = false;

  // We need to replace imports like "@/lib/auth" with "@/lib/features/auth"
  // We should match exactly or with slash: "@/lib/auth" or "@/lib/auth/something"
  // Also we need to replace relative imports if the file itself moved!
  // BUT to keep it safe, we'll run a regex that replaces ALL instances of the aliases.
  
  for (const [oldName, cat] of Object.entries(mapping)) {
    if (!cat) continue;
    const isFile = oldName.includes('.');
    const importName = isFile ? oldName.replace(/\.tsx?$/, '') : oldName;
    
    // Pattern: "@/lib/NAME" optionally followed by "/" or quote/apostrophe
    // Examples: "@/lib/auth", "@/lib/auth/", "@/lib/auth/utils"
    const regex = new RegExp(`@/lib/${importName}(?=[/'"\`])`, 'g');
    const replacement = `@/lib/${cat}/${importName}`;
    
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf-8");
  }
}

function processDirectory(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      if (item !== "node_modules" && item !== ".next" && item !== "generated") {
        processDirectory(fullPath);
      }
    } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx") || fullPath.endsWith(".js") || fullPath.endsWith(".mjs")) {
      updateImportsInFile(fullPath);
    }
  }
}

console.log("Updating imports across the project...");
processDirectory(SRC_DIR);
// Also update tests and other configs if necessary, but app/ and lib/ are in src/
// We also need to update generated files maybe? Generated files don't import from @/lib usually, they are standalone or import via @/lib
if (fs.existsSync(path.join(ROOT_DIR, "generated"))) {
  processDirectory(path.join(ROOT_DIR, "generated"));
}

// 4. Dosyaları / Klasörleri Fiziksel Olarak Taşı
console.log("Moving files and directories...");
for (const [oldName, cat] of Object.entries(mapping)) {
  if (!cat) continue;
  
  const oldPath = path.join(SRC_LIB, oldName);
  const newPath = path.join(SRC_LIB, cat, oldName);
  
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Moved ${oldName} -> ${cat}/${oldName}`);
  }
}

console.log("Phase 3 migration completed.");
