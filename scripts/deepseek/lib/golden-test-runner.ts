import fs from 'node:fs';
import path from 'node:path';
import { generatedCalculateExport } from "@/lib/generated-tools/export-names";

/* ── Types ────────────────────────────────────── */

export type GoldenTestIssue = {
  readonly slug: string;
  readonly scenario: string;
  readonly field: string;
  readonly severity: 'ERROR' | 'WARN';
  readonly message: string;
  readonly value?: number;
};

export type GoldenTestResult = {
  readonly slug: string;
  readonly success: boolean;
  readonly issueCount: number;
  readonly issues: readonly GoldenTestIssue[];
  readonly schemaPath: string;
  readonly generatedPath: string;
};

export type GoldenTestSuiteResult = {
  readonly total: number;
  readonly passed: number;
  readonly failed: number;
  readonly totalIssues: number;
  readonly results: readonly GoldenTestResult[];
  readonly errorSlugs: readonly string[];
};

/* ── Schema input generation ──────────────────── */

type SchemaInputDef = {
  readonly id: string;
  readonly type: string;
  readonly default?: number | string | boolean;
  readonly min?: number;
  readonly max?: number;
  readonly options?: readonly string[] | null;
};

type SchemaRecord = {
  readonly toolName?: string;
  readonly slug?: string;
  readonly inputs?: readonly SchemaInputDef[];
  readonly outputs?: Readonly<Record<string, unknown>>;
  readonly formulas?: Readonly<Record<string, string>>;
  readonly premiumRequired?: boolean;
};

function loadSchema(schemaPath: string): SchemaRecord | null {
  try {
    return JSON.parse(fs.readFileSync(schemaPath, 'utf-8')) as SchemaRecord;
  } catch {
    return null;
  }
}

type SampleInput = Record<string, number | string | boolean>;

function generateSampleInputs(schema: SchemaRecord): { default: SampleInput; min: SampleInput; max: SampleInput } {
  const def: SampleInput = {};
  const mn: SampleInput = {};
  const mx: SampleInput = {};

  for (const input of schema.inputs ?? []) {
    if (input.type === 'number') {
      // Default scenario: use default if available, else mid-range
      def[input.id] = input.default ?? (
        typeof input.min === 'number' && typeof input.max === 'number'
          ? (input.min + input.max) / 2
          : 100
      );

      // Min scenario: use min if available, else 10% of default
      mn[input.id] = input.min ?? (typeof input.default === 'number' ? input.default * 0.1 : 1);

      // Max scenario: use max if available, else 10x default
      mx[input.id] = input.max ?? (typeof input.default === 'number' ? input.default * 10 : 1000);
    } else if (input.type === 'boolean') {
      def[input.id] = input.default ?? false;
      mn[input.id] = false;
      mx[input.id] = true;
    } else if (input.type === 'select' && input.options && input.options.length > 0) {
      def[input.id] = input.default ?? input.options[0];
      mn[input.id] = input.default ?? input.options[0];
      mx[input.id] = input.options[input.options.length - 1] ?? input.options[0];
    }
  }

  return { default: def, min: mn, max: mx };
}

/* ── Dynamic import & validation ──────────────── */

async function importGeneratedModule(generatedPath: string): Promise<Record<string, unknown> | null> {
  try {
    // Convert to file:// URL for Windows compatibility
    const fileUrl = new URL(`file://${path.resolve(generatedPath)}`).href;
    const mod = await import(fileUrl);
    return mod;
  } catch {
    // Try dynamic import without URL
    try {
      const mod = await import(path.resolve(generatedPath));
      return mod;
    } catch {
      return null;
    }
  }
}

function findCalculateFunction(mod: Record<string, unknown>, slug: string): ((input: Record<string, unknown>) => Record<string, unknown>) | null {
  // Use the same naming convention as the code generator
  const directKey = generatedCalculateExport(slug);
  const fn = mod[directKey];
  if (typeof fn === 'function') {
    return fn as (input: Record<string, unknown>) => Record<string, unknown>;
  }

  // Fallback: search for any function named calculate*
  for (const [key, value] of Object.entries(mod)) {
    if (key.startsWith('calculate') && typeof value === 'function') {
      return value as (input: Record<string, unknown>) => Record<string, unknown>;
    }
  }

  return null;
}

/**
 * Heuristic: field names that should NOT be negative.
 * Cost, expense, debt, loss, mass, weight, area, volume, count, score, index, rate, time, etc.
 */
const NON_NEGATIVE_FIELDS = new Set([
  'totalWasteCost', 'totalCost', 'totalCosts', 'totalCostPerUnit', 'totalMachineCost',
  'totalVariableCost', 'totalFixedCost', 'totalRevenue', 'totalExpenses', 'totalDebt',
  'totalLiabilities', 'totalAssets', 'totalEquity', 'totalMass', 'totalWeight',
  'totalVolume', 'totalArea', 'totalLength', 'totalCount', 'totalScore',
  'totalTime', 'totalDuration', 'totalHours', 'totalMinutes', 'totalSeconds',
  'totalDistance', 'totalEnergy', 'totalPower', 'totalForce', 'totalPressure',
  'totalTemperature', 'totalPercent', 'totalRate', 'totalIndex',
  'cost', 'costs', 'expense', 'expenses', 'debt', 'liabilities', 'mass', 'weight',
  'volume', 'area', 'length', 'count', 'score', 'duration', 'distance',
  'dataConfidenceAdjusted',
]);

/**
 * Check a single numeric value for validity.
 */
function checkNumericField(
  value: unknown,
  fieldName: string,
  slug: string,
  scenario: string,
): GoldenTestIssue[] {
  const issues: GoldenTestIssue[] = [];
  if (typeof value !== 'number') {
    issues.push({
      slug, scenario, field: fieldName,
      severity: 'ERROR',
      message: `"${fieldName}" is not a number: ${String(value)}`,
    });
    return issues;
  }

  if (!Number.isFinite(value)) {
    issues.push({
      slug, scenario, field: fieldName,
      severity: 'ERROR',
      message: `"${fieldName}" is not finite: ${value}`,
      value,
    });
    return issues;
  }

  if (value < 0 && NON_NEGATIVE_FIELDS.has(fieldName)) {
    issues.push({
      slug, scenario, field: fieldName,
      severity: 'WARN',
      message: `"${fieldName}" is negative: ${value}`,
      value,
    });
  }

  return issues;
}

function validateOutput(
  result: Record<string, unknown>,
  slug: string,
  scenario: string,
): GoldenTestIssue[] {
  const issues: GoldenTestIssue[] = [];

  if (result === null || result === undefined) {
    issues.push({
      slug, scenario, field: 'output',
      severity: 'ERROR',
      message: 'Output is null/undefined',
    });
    return issues;
  }

  // Iterate EVERY field in the result object
  for (const [fieldName, value] of Object.entries(result)) {
    if (typeof value === 'number') {
      issues.push(...checkNumericField(value, fieldName, slug, scenario));
    } else if (value === null || value === undefined) {
      // Null/undefined is a type error for expected fields
      issues.push({
        slug, scenario, field: fieldName,
        severity: 'WARN',
        message: `"${fieldName}" is null/undefined`,
      });
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // Breakdown/sub-object — check each child
      for (const [childKey, childValue] of Object.entries(value as Record<string, unknown>)) {
        if (typeof childValue === 'number') {
          issues.push(...checkNumericField(childValue, `breakdown.${childKey}`, slug, scenario));
        }
      }
    } else if (Array.isArray(value)) {
      // Arrays should exist (non-null) — content is schema-dependent, skip deep check
      // But ensure it's an actual array
      if (!Array.isArray(value)) {
        issues.push({
          slug, scenario, field: fieldName,
          severity: 'ERROR',
          message: `"${fieldName}" is not an array`,
        });
      }
    } else if (typeof value === 'boolean') {
      // Booleans are always valid
    } else if (typeof value === 'string') {
      // Strings are always valid
    } else {
      issues.push({
        slug, scenario, field: fieldName,
        severity: 'WARN',
        message: `"${fieldName}" has unexpected type: ${typeof value}`,
      });
    }
  }

  return issues;
}

/* ── Main runner ───────────────────────────────── */

export async function runGoldenTest(
  schemaPath: string,
  generatedPath: string,
): Promise<GoldenTestResult> {
  const slug = path.basename(schemaPath, '-schema.json');
  const issues: GoldenTestIssue[] = [];

  const schema = loadSchema(schemaPath);
  if (!schema) {
    return {
      slug,
      success: false,
      issueCount: 1,
      issues: [{ slug, scenario: 'preload', field: 'schema', severity: 'ERROR', message: 'Schema JSON could not be parsed' }],
      schemaPath,
      generatedPath,
    };
  }

  const mod = await importGeneratedModule(generatedPath);
  if (!mod) {
    return {
      slug,
      success: false,
      issueCount: 1,
      issues: [{ slug, scenario: 'preload', field: 'module', severity: 'ERROR', message: 'Generated .ts module could not be imported' }],
      schemaPath,
      generatedPath,
    };
  }

  const calculateFn = findCalculateFunction(mod, slug);
  if (!calculateFn) {
    return {
      slug,
      success: false,
      issueCount: 1,
      issues: [{ slug, scenario: 'preload', field: 'function', severity: 'ERROR', message: 'calculate function not found in module' }],
      schemaPath,
      generatedPath,
    };
  }

  // Run 3 scenarios
  const samples = generateSampleInputs(schema);

  for (const [name, input] of Object.entries(samples)) {
    try {
      // Add optionals for schema-based fields
      const enrichedInput = { ...input, dataConfidence: 100 };
      const result = calculateFn(enrichedInput as Record<string, unknown>);
      const outputIssues = validateOutput(result, slug, name);
      issues.push(...outputIssues);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      issues.push({
        slug,
        scenario: name,
        field: 'execution',
        severity: 'ERROR',
        message: `Runtime error: ${message}`,
      });
    }
  }

  return {
    slug,
    success: issues.filter((i) => i.severity === 'ERROR').length === 0,
    issueCount: issues.length,
    issues,
    schemaPath,
    generatedPath,
  };
}

/* ── Suite runner ──────────────────────────────── */

export async function runGoldenTestSuite(
  schemasDir: string,
  generatedDir: string,
  limit?: number,
): Promise<GoldenTestSuiteResult> {
  const schemaFiles = fs
    .readdirSync(schemasDir)
    .filter((f) => f.endsWith('-schema.json'))
    .sort();

  const targetFiles = limit ? schemaFiles.slice(0, limit) : schemaFiles;
  const results: GoldenTestResult[] = [];
  const errorSlugs: string[] = [];

  console.log(`🧪 Golden Test: ${targetFiles.length} schema (of ${schemaFiles.length} total)`);

  let completed = 0;
  for (const file of targetFiles) {
    const slug = file.replace('-schema.json', '');
    const schemaPath = path.join(schemasDir, file);
    const generatedPath = path.join(generatedDir, `${slug}.ts`);

    if (!fs.existsSync(generatedPath)) {
      results.push({
        slug,
        success: false,
        issueCount: 1,
        issues: [{ slug, scenario: 'preload', field: 'file', severity: 'ERROR', message: 'Generated .ts file not found' }],
        schemaPath,
        generatedPath,
      });
      errorSlugs.push(slug);
      continue;
    }

    const result = await runGoldenTest(schemaPath, generatedPath);
    results.push(result);
    if (!result.success) errorSlugs.push(slug);

    completed++;
    if (completed % 50 === 0 || completed === targetFiles.length) {
      const errCount = results.filter((r) => !r.success).length;
      console.log(`   ${completed}/${targetFiles.length} — ${errCount} errors so far`);
    }
  }

  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  const totalIssues = results.reduce((sum, r) => sum + r.issueCount, 0);

  return {
    total: targetFiles.length,
    passed,
    failed,
    totalIssues,
    results,
    errorSlugs,
  };
}

/* ── CLI entry point ──────────────────────────── */

if (import.meta.url === `file://${process.argv[1]}`) {
  const schemasDir = path.join(process.cwd(), 'generated/schemas');
  const generatedDir = path.join(process.cwd(), 'generated');
  const limitArg = process.argv.find((arg) => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1] ?? '100', 10) : undefined;

  runGoldenTestSuite(schemasDir, generatedDir, limit).then((result) => {
    console.log('─'.repeat(50));
    console.log(`📊 Golden Test Results:`);
    console.log(`   Total: ${result.total}`);
    console.log(`   Passed: ${result.passed}`);
    console.log(`   Failed: ${result.failed}`);
    console.log(`   Total issues: ${result.totalIssues}`);
    if (result.failed > 0) {
      console.log(`   Error slugs (first 20): ${result.errorSlugs.slice(0, 20).join(', ')}`);
    }

    // Write report
    const reportFile = path.join(process.cwd(), 'generated', 'golden-test-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`📊 Report: ${reportFile}`);

    process.exit(result.failed > 0 ? 1 : 0);
  });
}
