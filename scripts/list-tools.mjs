import fs from 'fs';
import path from 'path';

console.log("=== PremiumSchemaToolForm KULLANAN ARAÇLAR (Premium Schema) ===");
const premiumDir = "src/lib/features/premium-schema/schemas";
const premiumFiles = fs.readdirSync(premiumDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
const premiumSlugs = [];
for (const file of premiumFiles) {
  const content = fs.readFileSync(path.join(premiumDir, file), 'utf8');
  const match = content.match(/id:\s*"([^"]+)"/);
  if (match) premiumSlugs.push(match[1]);
}
premiumSlugs.sort().forEach(slug => console.log(`- ${slug}`));

console.log("\n=== GeneratedToolFormView KULLANAN ARAÇLAR (Legacy / Pro / Universal JSON) ===");
const proToolsDir = "data/pro-tools";
const universalDir = "data/pro-tools-universal";

function parseDir(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== '_merged.json');
  const tools = [];
  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
      if (data.tool_slug) tools.push(`${data.tool_slug} (${data.tool_name})`);
    } catch(e) {}
  }
  return tools;
}

const generatedTools = [...parseDir(proToolsDir), ...parseDir(universalDir)];
// Filter unique tools
const uniqueGeneratedTools = [...new Set(generatedTools)];
uniqueGeneratedTools.sort().forEach(tool => console.log(`- ${tool}`));
