import fs from "fs";
import path from "path";

const mapping = {
  "math": "core/math",
  "units": "core/units",
  "format": "core/format",
  "validation": "core/validation",
  "types": "core/types",
  "steelcore": "core/steelcore",
  "cn": "core/cn",
  "mathematical-property-tester": "core/mathematical-property-tester",
  "calculators": "features/calculators",
  "tools": "features/tools",
  "premium": "features/premium",
  "premium-schema": "features/premium-schema",
  "ai": "features/ai",
  "ai-assistant": "features/ai-assistant",
  "ai-gateway": "features/ai-gateway",
  "ai-repair": "features/ai-repair",
  "assistant": "features/assistant",
  "reports": "features/reports",
  "case-studies": "features/case-studies",
  "admin": "features/admin",
  "billing": "features/billing",
  "subscription": "features/subscription",
  "auth": "features/auth",
  "commercial": "features/commercial",
  "compliance": "features/compliance",
  "decision-engine": "features/decision-engine",
  "engine": "features/engine",
  "engines": "features/engines",
  "entitlements": "features/entitlements",
  "formula-governance": "features/formula-governance",
  "formulas": "features/formulas",
  "free-tools": "features/free-tools",
  "freemium": "features/freemium",
  "generated-tools": "features/generated-tools",
  "leads": "features/leads",
  "local-ai": "features/local-ai",
  "quote": "features/quote",
  "regional": "features/regional",
  "regional-benchmarks": "features/regional-benchmarks",
  "registry": "features/registry",
  "smart-form": "features/smart-form",
  "standards": "features/standards",
  "tool-activation": "features/tool-activation",
  "tool-guides": "features/tool-guides",
  "tool-schemas": "features/tool-schemas",
  "trust-trace": "features/trust-trace",
  "campaigns": "features/campaigns",
  "cbam": "features/cbam",
  "carbon": "features/carbon",
  "credits": "features/credits",
  "emission-factors": "features/emission-factors",
  "machine-rate": "features/machine-rate",
  "manufacturing-os": "features/manufacturing-os",
  "shop-rate": "features/shop-rate",
  "inventory": "features/inventory",
  "field-mode": "features/field-mode",
  "growth": "features/growth",
  "industries": "features/industries",
  "plans": "features/plans",
  "input": "features/input",
  "firebase": "infrastructure/firebase",
  "email": "infrastructure/email",
  "analytics": "infrastructure/analytics",
  "seo": "infrastructure/seo",
  "i18n": "infrastructure/i18n",
  "metadata": "infrastructure/metadata",
  "pwa": "infrastructure/pwa",
  "trace": "infrastructure/trace",
  "build": "infrastructure/build",
  "feature-flags": "infrastructure/feature-flags",
  "release": "infrastructure/release",
  "supplier-api": "infrastructure/supplier-api",
  "actions": "infrastructure/actions",
  "benchmarks": "features/benchmarks",
  "feedback": "features/feedback",
  "semantic": "features/semantic",
  "layout": "ui-shared/layout",
  "icons": "ui-shared/icons",
  "fonts": "ui-shared/fonts",
  "chart-helpers": "ui-shared/chart-helpers",
  "branding": "ui-shared/branding",
  "calculator-experience": "ui-shared/calculator-experience",
  "footer": "ui-shared/footer",
  "home": "ui-shared/home",
  "navigation": "ui-shared/navigation",
  "notifications": "ui-shared/notifications",
  "ui": "ui-shared/ui",
  "paddle-provider": "ui-shared/paddle-provider",
  "legal": "content/legal",
  "disclaimer": "content/disclaimer",
  "terminology": "content/terminology",
  "guidance": "content/guidance",
  "methodology": "content/methodology",
  "locale-center": "content/locale-center",
  "pdf": "content/pdf"
};

const ROOT_DIR = process.cwd();

function updateImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  let modified = false;

  for (const [oldName, catName] of Object.entries(mapping)) {
    // Regex for "@/lib/..."
    const regex1 = new RegExp(`@/lib/${oldName}(?=[/'"\`])`, 'g');
    if (regex1.test(content)) {
      content = content.replace(regex1, `@/lib/${catName}`);
      modified = true;
    }
    
    // Regex for "./src/lib/..."
    const regex2 = new RegExp(`\\./src/lib/${oldName}(?=[/'"\`])`, 'g');
    if (regex2.test(content)) {
      content = content.replace(regex2, `./src/lib/${catName}`);
      modified = true;
    }
  }
  
  // Specific fixes for relative paths in src/lib/features/...
  content = content.replace(/from "(\.\.\/\.\.\/free-slugs\.json)"/g, 'from "../$1"');
  content = content.replace(/from "(\.\.\/\.\.\/premium-slugs\.json)"/g, 'from "../$1"');
  content = content.replace(/from "(\.\.\/\.\.\/config\/[^"]+)"/g, 'from "../$1"');
  content = content.replace(/from "(\.\.\/\.\.\/\.\.\/data[^"]+)"/g, 'from "../$1"');
  content = content.replace(/from "(\.\.\/\.\.\/\.\.\/messages[^"]+)"/g, 'from "../$1"');
  
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

// Ensure we also process the root config files
updateImportsInFile(path.join(ROOT_DIR, "next.config.ts"));

// Ensure we re-process everything just to be safe
processDirectory(path.join(ROOT_DIR, "src"));

console.log("Missed imports fixed.");
