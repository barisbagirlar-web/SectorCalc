import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateFromSchemaFile } from './generate-from-schema.js';
import { repairStubSchemaFile } from './lib/stub-formula-repair-file.js';

const schemasDir = path.join(process.cwd(), 'generated/schemas');
const outDir = path.join(process.cwd(), 'generated');

function assertNoInvalidMathPrefix(generatedDir: string): void {
  const offenders: string[] = [];
  for (const file of fs.readdirSync(generatedDir)) {
    if (!file.endsWith('.ts')) continue;
    const content = fs.readFileSync(path.join(generatedDir, file), 'utf-8');
    if (content.includes('Math.Math')) {
      offenders.push(file);
    }
  }
  if (offenders.length > 0) {
    throw new Error(
      `Invalid Math.Math prefix in generated output: ${offenders.slice(0, 5).join(', ')}${offenders.length > 5 ? ` (+${offenders.length - 5} more)` : ''}`,
    );
  }
}

if (!fs.existsSync(schemasDir)) {
  console.error('❌ generated/schemas/ klasörü bulunamadı. Önce npm run scan:all çalıştırın.');
  process.exit(1);
}

const schemaFiles = fs.readdirSync(schemasDir).filter(f => f.endsWith('-schema.json'));

console.log(`🔍 ${schemaFiles.length} JSON şeması bulundu.`);

let success = 0;
let failed = 0;
let formulaCompileFailures = 0;
let stubRepaired = 0;
let stubRepairFailed = 0;

for (const file of schemaFiles) {
  const schemaPath = path.join(schemasDir, file);
  const toolName = file.replace('-schema.json', '');
  const outPath = path.join(outDir, `${toolName}.ts`);
  console.log(`📡 İşleniyor: ${file}`);
  try {
    const repairResult = repairStubSchemaFile(schemaPath);
    if (repairResult === 'archetype') {
      stubRepaired += 1;
    } else if (repairResult === 'failed') {
      stubRepairFailed += 1;
    }
    formulaCompileFailures += generateFromSchemaFile(schemaPath, outPath);
    success++;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`❌ Hata: ${file} - ${message}`);
    failed++;
  }
}

try {
  assertNoInvalidMathPrefix(outDir);
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`❌ ${message}`);
  failed += 1;
}

console.log(`✅ Tamamlandı: Başarılı ${success}, Başarısız ${failed}`);
if (stubRepaired > 0 || stubRepairFailed > 0) {
  console.log(`🛠️ Stub formula repair: ${stubRepaired} archetype, ${stubRepairFailed} failed`);
}
if (formulaCompileFailures > 0) {
  console.warn(`⚠️ Toplam ${formulaCompileFailures} formül derlenemedi (0 fallback)`);
}

if (failed > 0) {
  process.exit(1);
}
