import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const schemasDir = path.join(process.cwd(), 'generated/schemas');
const outputDir = path.join(process.cwd(), 'generated');

if (!fs.existsSync(schemasDir)) {
  console.error('❌ generated/schemas/ klasörü bulunamadı. Önce npm run scan:all çalıştırın.');
  process.exit(1);
}

const schemaFiles = fs.readdirSync(schemasDir).filter(f => f.endsWith('.json'));

console.log(`🔍 ${schemaFiles.length} JSON şeması bulundu.`);

for (const file of schemaFiles) {
  const schemaPath = path.join(schemasDir, file);
  console.log(`📡 İşleniyor: ${file}`);
  try {
    execSync(`npx tsx scripts/deepseek/generate-from-schema.ts --schema=${schemaPath}`, {
      stdio: 'inherit',
    });
  } catch (err) {
    console.error(`❌ Hata: ${file} işlenirken başarısız oldu.`);
  }
}

console.log('✅ Tüm şemalar işlendi.');
