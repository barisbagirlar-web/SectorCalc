import fs from 'fs';
import path from 'path';

const SCHEMAS_DIR = path.join(process.cwd(), 'src/lib/premium-schema/schemas');
const REGISTRY_FILE = path.join(process.cwd(), 'src/lib/premium-schema/schema-registry.ts');

const CATEGORY_PREFIX_MAP = {
  "manufacturing": "mfg",
  "logistics": "log",
  "engineering": "eng",
  "mechanics": "mech",
  "finance": "fin",
  "energy": "eco",
  "maintenance": "maint",
  "construction": "const",
  "quality": "qc",
  "healthcare": "health",
  "agriculture": "agri",
  "business": "biz",
  "auto": "auto"
};

const counters = {};

function getPrefix(sectorSlug) {
  if (!sectorSlug) return 'pro';
  return CATEGORY_PREFIX_MAP[sectorSlug] || sectorSlug.substring(0, 4) || 'pro';
}

function processFiles() {
  const files = fs.readdirSync(SCHEMAS_DIR).filter(f => f.endsWith('.ts'));
  
  console.log(`Found ${files.length} schema files. Standardizing IDs to Free style...`);

  let exportsCode = `import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";\n\n`;
  let registryObject = `export const PREMIUM_SCHEMA_REGISTRY: Record<string, PremiumCalculatorSchema> = {\n`;
  let mapObject = `export const PREMIUM_SCHEMA_SLUG_MAP: Record<string, string> = {\n`;

  const newFiles = [];

  for (const file of files) {
    if (file === 'index.ts') continue;
    
    const filePath = path.join(SCHEMAS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Find sectorSlug or category
    const sectorMatch = content.match(/sectorSlug:\s*['"]([^'"]+)['"]/);
    const sectorSlug = sectorMatch ? sectorMatch[1] : null;
    
    // Find old ID
    const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/);
    
    if (!idMatch) {
      console.log(`Could not find 'id' in ${file}, skipping.`);
      continue;
    }
    
    const oldId = idMatch[1];
    
    // Generate new short ID
    const prefix = getPrefix(sectorSlug);
    if (!counters[prefix]) counters[prefix] = 1;
    const newShortId = `${prefix}-${500 + counters[prefix]}`;
    counters[prefix]++;
    
    // Replace id in content globally
    content = content.replace(new RegExp(`id:\\s*['"]${oldId}['"]`, 'g'), `id: "${newShortId}"`);
    
    // Find the exported schema variable name
    const exportMatch = content.match(/export\s+const\s+([A-Za-z0-9_]+)\s*:/);
    const exportName = exportMatch ? exportMatch[1] : null;
    
    if (!exportName) {
      console.log(`Could not find export name in ${file}`);
      continue;
    }
    
    // Delete old file
    fs.unlinkSync(filePath);
    
    // Write new file
    const newFileName = `${newShortId}.ts`;
    const newFilePath = path.join(SCHEMAS_DIR, newFileName);
    fs.writeFileSync(newFilePath, content, 'utf-8');
    
    newFiles.push({ oldId, newShortId, exportName, newFileName });
    console.log(`Renamed: ${oldId} -> ${newShortId}`);
  }

  // Generate registry
  for (const item of newFiles) {
    exportsCode += `import { ${item.exportName} } from "@/lib/premium-schema/schemas/${item.newShortId}";\n`;
    registryObject += `  "${item.newShortId}": ${item.exportName},\n`;
    
    // Map old ID to new short ID so existing links still work via the map
    mapObject += `  "${item.oldId}": "${item.newShortId}",\n`;
  }
  
  registryObject += `};\n\n`;
  mapObject += `};\n`;
  
  const registryContent = `${exportsCode}\n${registryObject}${mapObject}`;
  fs.writeFileSync(REGISTRY_FILE, registryContent, 'utf-8');
  
  console.log('Registry updated successfully.');
}

processFiles();
