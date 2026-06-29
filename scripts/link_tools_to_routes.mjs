import fs from 'fs';
import path from 'path';

const toolsDir = path.resolve('./src/tools/generated');
const routesFile = path.resolve('./public/ai-tool-routes.json');

console.log("=== TUR 3: ROUTING ENTEGRASYONU ===");

if (!fs.existsSync(toolsDir)) {
    console.error("Araç klasörü bulunamadı.");
    process.exit(1);
}

const files = fs.readdirSync(toolsDir);
const routes = files
    .filter(f => f.endsWith('.ts'))
    .map(f => {
        const id = f.replace('.ts', '').toUpperCase();
        return {
            id: id.replace('-', '_'),
            url: `/free-tools/${f.replace('.ts', '')}`,
            importPath: `src/tools/generated/${f}`
        };
    });

fs.writeFileSync(routesFile, JSON.stringify(routes, null, 2));

console.log(`PASS: ${routes.length} adet aracın rotası başarıyla (public/ai-tool-routes.json) oluşturuldu ve eşleştirildi.`);
