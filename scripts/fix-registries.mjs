import fs from 'fs';
import path from 'path';

function generateRegistry(dirPath, outputPath, mapName, listName, description) {
  const files = fs.readdirSync(dirPath).filter(f => f.startsWith('PRO_') && f.endsWith('.json'));
  files.sort();
  const baseNames = files.map(f => f.replace('.json', ''));

  let content = `/**\n * ${description}\n * Generated automatically. Do not edit manually.\n */\n\n`;
  
  for (const name of baseNames) {
    content += `import ${name} from "../../../../${dirPath}/${name}.json";\n`;
  }
  
  content += `\nimport type { ToolSchema, StandardVariant } from "../tool-schemas/types";\n\n`;
  content += `type ToolSchemaJson = Record<string, any>;\n\n`;
  content += `const withType = <T>(data: ToolSchemaJson): T => data as unknown as T;\n\n`;
  
  content += `export const ${mapName}: Record<string, ToolSchema> = {\n`;
  for (const name of baseNames) {
    content += `  "${name}": withType<ToolSchema>(${name}),\n`;
  }
  content += `};\n\n`;
  
  content += `export const ${listName}: ToolSchema[] = Object.values(${mapName});\n`;
  
  if (mapName === 'PRO_TOOLS_MAP') {
    content += `\n/** Get all distinct sector paths from all tools */
export function getAllSectorPaths(): string[][] {
  return PRO_TOOLS_LIST.map(t => t.sectorPath);
}

/** Get all unique sector names (first path segment) */
export function getAllSectors(): string[] {
  return [...new Set(PRO_TOOLS_LIST.map(t => t.sectorPath[0] || "General"))];
}
`;
  }

  fs.writeFileSync(outputPath, content);
  console.log(`Generated ${outputPath}`);
}

generateRegistry('data/pro-tools', 'src/lib/features/tools/pro-tools-registry.ts', 'PRO_TOOLS_MAP', 'PRO_TOOLS_LIST', 'SectorCalc — Static Pro Tools Registry');
generateRegistry('data/pro-tools-universal', 'src/lib/features/tools/universal-tools-registry.ts', 'UNIVERSAL_TOOLS_MAP', 'UNIVERSAL_TOOLS_LIST', 'Universal PRO Tools Registry — Schema v1');
