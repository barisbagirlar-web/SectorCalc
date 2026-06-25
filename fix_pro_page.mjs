import fs from 'fs';

const p = 'src/app/pro-tools/[slug]/page.tsx';
let content = fs.readFileSync(p, 'utf8');

// Remove loadTool function
content = content.replace(/const TOOLS_DIR = path\.join[\s\S]*?return null;\n}\n/m, '');

// Remove pipeline tool branch in generateMetadata
content = content.replace(/  \/\/ 1\. Check if it's a direct pipeline JSON tool[\s\S]*?  \/\/ 2\. Category view/m, '  // 2. Category view');

// Remove pipeline tool branch in ProToolsSlugPage
content = content.replace(/  \/\/ 1\. Is it a direct pipeline JSON tool\?[\s\S]*?  \/\/ 2\. Is it a category slug\?/m, '  // 2. Is it a category slug?');

// Remove UniversalCalculator import
content = content.replace(/import UniversalCalculator from "@\/components\/calculators\/UniversalCalculator";\n/, '');

// Remove buildJsonLd
content = content.replace(/function buildJsonLd\(tool: any\) \{[\s\S]*?\}\n/m, '');

// Remove fs and path imports if unused
content = content.replace(/import fs from "fs";\n/, '');
content = content.replace(/import path from "path";\n/, '');

fs.writeFileSync(p, content, 'utf8');
console.log('Fixed pro-tools page');
