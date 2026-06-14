import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateFromSchemaFile } from './generate-from-schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemasDir = path.join(process.cwd(), 'generated/schemas');
const outDir = path.join(process.cwd(), 'generated');

if (!fs.existsSync(schemasDir)) {
  console.error('❌ generated/schemas/ klasörü bulunamadı. Önce npm run scan:all çalıştırın.');
  process.exit(1);
}

const schemaFiles = fs.readdirSync(schemasDir).filter(f => f.endsWith('-schema.json'));

console.log(`🔍 ${schemaFiles.length} JSON şeması bulundu.`);

let success = 0;
let failed = 0;
for (const file of schemaFiles) {
  const schemaPath = path.join(schemasDir, file);
  const toolName = file.replace('-schema.json', '');
  const outPath = path.join(outDir, `${toolName}.ts`);
  console.log(`📡 İşleniyor: ${file}`);
  try {
    generateFromSchemaFile(schemaPath, outPath);
    success++;
  } catch (err: any) {
    console.error(`❌ Hata: ${file} - ${err.message}`);
    failed++;
  }
}

console.log(`✅ Tamamlandı: Başarılı ${success}, Başarısız ${failed}`);
