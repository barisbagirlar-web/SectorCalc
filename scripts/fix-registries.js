const fs = require('fs');
const path = require('path');

function generateRegistry(dataDir, outputFile, title, mapName, listName) {
  if (!fs.existsSync(dataDir)) return;
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && f !== '_merged.json').sort();
  
  let imports = '';
  let mapEntries = '';
  
  files.forEach(file => {
    const base = file.replace('.json', '');
    const importName = base.replace(/-/g, '_').toUpperCase(); // usually PRO_XXX
    imports += `import ${importName} from "../../../../${dataDir}/${file}";\n`;
    mapEntries += `  "${base}": withType<ToolSchema>(${importName}),\n`;
  });
  
  const content = `/**
 * ${title}
 * Generated automatically. Do not edit manually.
 */

${imports}
import type { ToolSchema, StandardVariant } from "../tool-schemas/types";

type ToolSchemaJson = Record<string, any>;

const withType = <T>(data: ToolSchemaJson): T => data as unknown as T;

export const ${mapName}: Record<string, ToolSchema> = {
${mapEntries}};

export const ${listName}: ToolSchema[] = Object.values(${mapName});

/** Get all distinct sector paths from all tools */
export function getAllSectorPaths(): string[][] {
  return ${listName}.map(t => t.sectorPath);
}

/** Get all unique sector names (first path segment) */
export function getAllSectors(): string[] {
  return [...new Set(${listName}.map(t => t.sectorPath[0] || "General"))];
}
`;

  fs.writeFileSync(outputFile, content);
  console.log(`Generated ${outputFile} with ${files.length} tools.`);
}

generateRegistry('data/pro-tools', 'src/lib/features/tools/pro-tools-registry.ts', 'SectorCalc — Static Pro Tools Registry', 'PRO_TOOLS_MAP', 'PRO_TOOLS_LIST');
generateRegistry('data/pro-tools-universal', 'src/lib/features/tools/universal-tools-registry.ts', 'Universal PRO Tools Registry — Schema v1', 'UNIVERSAL_TOOLS_MAP', 'UNIVERSAL_TOOLS_LIST');
