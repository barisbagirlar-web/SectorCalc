import fs from 'fs';
import path from 'path';

console.log("=== GeneratedToolFormView KULLANAN ARAÇLAR (Legacy / Pro / Universal) ===");

const files = [
  'src/lib/features/tools/pro-tools-registry.ts',
  'src/lib/features/tools/universal-tools-registry.ts'
];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const ids = [...content.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]);
  ids.forEach(id => {
    // Read the actual json to get the name
    const jsonPath = file.includes('universal') ? `data/pro-tools-universal/${id}.json` : `data/pro-tools/${id}.json`;
    if (fs.existsSync(jsonPath)) {
       const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
       console.log(`- ${id} (${data.tool_name || 'Bilinmiyor'})`);
    } else {
       console.log(`- ${id} (JSON Bulunamadı)`);
    }
  });
});
