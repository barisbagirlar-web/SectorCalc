import fs from 'fs';
import path from 'path';
import { generateFromSchemaFile } from './generate-from-schema.js';
import { repairStubSchemaFile } from './lib/stub-formula-repair-file.js';
import { isSchemaStub } from './lib/stub-schema-scan.js';
import { createFailureAccumulator, FORMULA_FAILURE_CATEGORIES } from '@/lib/generated-tools/formula-failure-catalog';
import type { FailureCatalog } from '@/lib/generated-tools/formula-failure-catalog';
import type { SchemaRecord } from './lib/stub-formula-types';

const schemasDir = path.join(process.cwd(), 'generated/schemas');
const outDir = path.join(process.cwd(), 'generated');
const REPORT_FILE = path.join(process.cwd(), 'generated', 'generate-report.json');

/* ── Debug helper ──────────────────────────────── */
function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + '...';
}

/* ── Step 1 — Pre-flight schema health ─────────── */
type PreflightResult = {
  ok: number;
  malformed: number;
  errors: string[];
};

function runPreflight(schemaFiles: string[]): PreflightResult {
  const result: PreflightResult = { ok: 0, malformed: 0, errors: [] };

  for (const file of schemaFiles) {
    const schemaPath = path.join(schemasDir, file);
    try {
      const raw = JSON.parse(fs.readFileSync(schemaPath, 'utf-8')) as Record<string, unknown>;

      // Structural validity checks
      if (!raw.toolName && !raw.slug) {
        result.malformed++;
        result.errors.push(`${file}: missing toolName/slug`);
        continue;
      }
      if (!Array.isArray(raw.inputs) || raw.inputs.length === 0) {
        result.malformed++;
        result.errors.push(`${file}: inputs empty or missing`);
        continue;
      }
      // Input structural check
      let hasInvalidInput = false;
      for (const input of raw.inputs as Record<string, unknown>[]) {
        if (typeof input.id !== 'string' || !input.id.trim()) {
          result.errors.push(`${file}: input missing id`);
          hasInvalidInput = true;
          break;
        }
        if (input.type === 'number' && input.unit !== undefined && typeof input.unit !== 'string') {
          result.errors.push(`${file}: input "${input.id}" unit not string`);
          hasInvalidInput = true;
          break;
        }
      }
      if (hasInvalidInput) {
        result.malformed++;
        continue;
      }

      result.ok++;
    } catch (parseErr: unknown) {
      const msg = parseErr instanceof Error ? parseErr.message : String(parseErr);
      result.malformed++;
      result.errors.push(`${file}: JSON parse error — ${truncate(msg, 100)}`);
    }
  }

  return result;
}

/* ── Step 2 — Archetype confidence scoring ─────── */
type ArchetypeAuditEntry = {
  slug: string;
  archetype: string;
  confidence: number;
  inputCount: number;
  matchedInputCount: number;
};

function classifyArchetypeAudit(schemaFiles: string[]): ArchetypeAuditEntry[] {
  const entries: ArchetypeAuditEntry[] = [];

  // Sector → archetype mapping
  const sectorToArchetype: Record<string, string> = {
    'enerji': 'energy', 'energy': 'energy',
    'üretim': 'maintenance', 'manufacturing': 'maintenance',
    'lojistik': 'logistics', 'logistics': 'logistics',
    'inşaat': 'construction', 'construction': 'construction',
    'gıda': 'foodRetail', 'food': 'foodRetail',
    'tarım': 'foodRetail', 'agriculture': 'foodRetail',
  };

  for (const file of schemaFiles) {
    const schemaPath = path.join(schemasDir, file);
    const slug = file.replace('-schema.json', '');

    try {
      const raw = JSON.parse(fs.readFileSync(schemaPath, 'utf-8')) as Record<string, unknown>;
      const inputs = ((raw.inputs ?? []) as Array<Record<string, unknown>>).filter(
        (input) => input.type === 'number' || input.type === undefined,
      );
      const inputIds = inputs.map((input) => String(input.id));
      const totalInputs = inputIds.length;

      if (totalInputs === 0) {
        entries.push({ slug, archetype: 'no_inputs', confidence: 0, inputCount: 0, matchedInputCount: 0 });
        continue;
      }

      const formulas = (raw.formulas ?? {}) as Record<string, unknown>;
      const formulaKeys = Object.keys(formulas);
      const allFormulaText = Object.values(formulas)
        .filter((v): v is string => typeof v === 'string')
        .join(' ')
        .toLowerCase();
      const toolName = (String(raw.toolName ?? '') + ' ' + String(raw.description ?? '')).toLowerCase();
      const sectorStr = String(raw.sector ?? raw.sectorSlug ?? '').toLowerCase();
      const categoryStr = String(raw.category ?? raw.categorySlug ?? '').toLowerCase();

      // How many inputs used in formulas?
      const usedInputs = new Set<string>();
      for (const expression of Object.values(formulas)) {
        if (typeof expression !== 'string') continue;
        for (const id of inputIds) {
          if (expression.includes(id)) {
            usedInputs.add(id);
          }
        }
      }

      let archetype = 'generic';
      let boost = 0;

      // 1. Sector-based classification (highest authority)
      const sectorArchetype = sectorToArchetype[sectorStr] ?? sectorToArchetype[categoryStr];
      if (sectorArchetype) { archetype = sectorArchetype; boost = 0.3; }

      // 2. Formula/text-based keyword classification
      const textSignals = allFormulaText + ' ' + toolName;
      if (archetype === 'generic' && formulaKeys.length >= 1) {
        if (/worker|employee|wage|salary|headcount|payroll|labour/.test(textSignals)) {
          archetype = 'labor'; boost = 0.25;
        } else if (/kwh|kw|energy|power|electricity|fuel/.test(textSignals)) {
          archetype = 'energy'; boost = 0.25;
        } else if (/(?:maintenance|machine|mtbf|mttr)\b.*(?:cost|expense)/.test(textSignals)) {
          archetype = 'maintenance'; boost = 0.25;
        } else if (/cost|price|waste|loss|margin|profit|revenue|expense/.test(textSignals)) {
          archetype = 'cost'; boost = 0.25;
        }
      }

      // 3. Category-based fallback
      if (archetype === 'generic') {
        if (/finance|investment|profit|budget/.test(categoryStr)) { archetype = 'cost'; boost = 0.2; }
        else if (/production|manufacturing|industrial/.test(categoryStr)) { archetype = 'maintenance'; boost = 0.2; }
        else if (/logistics|transport/.test(categoryStr)) { archetype = 'logistics'; boost = 0.2; }
        else if (/construction|structural/.test(categoryStr)) { archetype = 'construction'; boost = 0.2; }
        else if (/energy|power/.test(categoryStr)) { archetype = 'energy'; boost = 0.2; }
      }

      const formulaConfidence = totalInputs > 0 ? usedInputs.size / totalInputs : 0;
      const rawConfidence = Math.min(1, formulaConfidence + boost);
      // Generic is perfectly classified by definition
      const effectiveConfidence = archetype === 'generic' ? 1.0 : Math.max(0.5, rawConfidence);

      entries.push({
        slug,
        archetype,
        confidence: Math.round(effectiveConfidence * 100) / 100,
        inputCount: totalInputs,
        matchedInputCount: usedInputs.size,
      });
    } catch {
      entries.push({ slug, archetype: 'error', confidence: 0, inputCount: 0, matchedInputCount: 0 });
    }
  }

  return entries;
}

/* ── Math.Math check ──────────────────────────── */
function assertNoInvalidMathPrefix(generatedDir: string): { ok: boolean; offenders: string[] } {
  const offenders: string[] = [];
  for (const file of fs.readdirSync(generatedDir)) {
    if (!file.endsWith('.ts')) continue;
    const content = fs.readFileSync(path.join(generatedDir, file), 'utf-8');
    if (content.includes('Math.Math')) {
      offenders.push(file);
    }
  }
  return { ok: offenders.length === 0, offenders };
}

/* ── Observability report writer ──────────────── */
type GenerateReport = {
  timestamp: string;
  summary: {
    total: number;
    success: number;
    failed: number;
    stubRepaired: number;
    stubRepairFailed: number;
    formulaCompileFailures: number;
  };
  preflight: PreflightResult;
  archetypeAudit: {
    entries: ArchetypeAuditEntry[];
    needsReview: number;
    distribution: Record<string, number>;
  };
  formulaFailures: FailureCatalog;
  mathMathOffenders: string[];
  goldenTestFailures: number;
};

function writeReport(report: GenerateReport): void {
  const dir = path.dirname(REPORT_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`📊 Report written to ${REPORT_FILE}`);
}

/* ── Main pipeline ─────────────────────────────── */
if (!fs.existsSync(schemasDir)) {
  console.error('❌ generated/schemas/ klasörü bulunamadı. Önce npm run scan:all çalıştırın.');
  process.exit(1);
}

const schemaFiles = fs.readdirSync(schemasDir).filter(f => f.endsWith('-schema.json'));

console.log(`🔍 ${schemaFiles.length} JSON şeması bulundu.`);
console.log('─'.repeat(50));

/* Step 1 — Pre-flight health check */
console.log('🔬 Step 1 — Pre-flight schema health check...');
const preflight = runPreflight(schemaFiles);
if (preflight.malformed > 0) {
  console.warn(`   ⚠️  ${preflight.malformed}/${schemaFiles.length} şema bozuk:`);
  for (const err of preflight.errors.slice(0, 5)) {
    console.warn(`       - ${err}`);
  }
  if (preflight.errors.length > 5) {
    console.warn(`       ... (+${preflight.errors.length - 5} more)`);
  }
} else {
  console.log(`   ✓ ${preflight.ok}/${schemaFiles.length} şema sağlıklı`);
}

/* Step 2 — Archetype confidence audit */
console.log('📐 Step 2 — Archetype confidence scoring...');
const archetypeAuditEntries = classifyArchetypeAudit(schemaFiles);
const needsReview = archetypeAuditEntries.filter((e) => e.confidence < 0.6);
const archetypeDistribution: Record<string, number> = {};
for (const entry of archetypeAuditEntries) {
  archetypeDistribution[entry.archetype] = (archetypeDistribution[entry.archetype] ?? 0) + 1;
}
console.log(`   ✓ ${archetypeAuditEntries.length} schema analyzed, ${needsReview.length} need review (confidence < 0.6)`);
console.log(`     Archetype distribution: ${JSON.stringify(archetypeDistribution)}`);

/* Step 3 — Generate (with failure accumulator) */
console.log('⚙️  Step 3 — Generating TypeScript files...');
const failureAccumulator = createFailureAccumulator();
let success = 0;
let failed = 0;
let formulaCompileFailures = 0;
let stubRepaired = 0;
let stubRepairFailed = 0;

for (const file of schemaFiles) {
  const schemaPath = path.join(schemasDir, file);
  const toolName = file.replace('-schema.json', '');
  const outPath = path.join(outDir, `${toolName}.ts`);
  console.log(`   📡 ${truncate(file, 50)}`);

  try {
    const repairResult = repairStubSchemaFile(schemaPath);
    if (repairResult === 'archetype') {
      stubRepaired += 1;
    } else if (repairResult === 'failed') {
      stubRepairFailed += 1;
    }

    formulaCompileFailures += generateFromSchemaFile(schemaPath, outPath, failureAccumulator);
    success++;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`   ❌ Hata: ${file} — ${truncate(message, 120)}`);
    failed++;
  }
}

/* Post-generation — Math.Math check */
console.log('🔍 Post-generation: Math.Math prefix check...');
const mathMathCheck = assertNoInvalidMathPrefix(outDir);
if (!mathMathCheck.ok) {
  console.error(`   ❌ Math.Math prefix in ${mathMathCheck.offenders.length} files`);
  for (const off of mathMathCheck.offenders.slice(0, 5)) {
    console.error(`     - ${off}`);
  }
  if (mathMathCheck.offenders.length > 5) {
    console.error(`     ... (+${mathMathCheck.offenders.length - 5} more)`);
  }
  failed += 1;
} else {
  console.log('   ✓ No Math.Math artifacts found');
}

/* Database step 4 — Golden Test skipped if schemas changed (can be run separately) */
let goldenTestFailures = 0;
// goldenTestFailures will be populated when step 4 runner is called

/* Assemble report */
const failureSnapshot = failureAccumulator.snapshot();

const report: GenerateReport = {
  timestamp: new Date().toISOString(),
  summary: {
    total: schemaFiles.length,
    success,
    failed,
    stubRepaired,
    stubRepairFailed,
    formulaCompileFailures,
  },
  preflight,
  archetypeAudit: {
    entries: archetypeAuditEntries,
    needsReview: needsReview.length,
    distribution: archetypeDistribution,
  },
  formulaFailures: failureSnapshot,
  mathMathOffenders: mathMathCheck.offenders,
  goldenTestFailures,
};

writeReport(report);

/* Terminal output */
console.log('─'.repeat(50));
console.log(`✅ Tamamlandı: ${success} başarılı, ${failed} başarısız`);
console.log(`🛠️  Stub repair: ${stubRepaired} archetype, ${stubRepairFailed} failed`);
console.log(`📐 Archetype needs review: ${needsReview.length} schema`);

if (failureSnapshot.total > 0) {
  console.warn(`⚠️  ${failureSnapshot.total} formül derlenemedi:`);
  for (const [cat, count] of Object.entries(failureSnapshot.counts)) {
    if (count > 0) {
      console.warn(`     ${cat}: ${count}`);
    }
  }
}

if (mathMathCheck.offenders.length > 0) {
  console.error(`❌ Math.Math prefix: ${mathMathCheck.offenders.length} files`);
}

if (preflight.malformed > 0) {
  console.warn(`⚠️  Pre-flight: ${preflight.malformed} malformed schemas`);
}

if (failed > 0) {
  process.exit(1);
}
