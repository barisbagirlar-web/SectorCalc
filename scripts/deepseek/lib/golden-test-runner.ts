import fs from 'node:fs';
import path from 'node:path';

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
  // Try calculate<Name> pattern
  const exportBase = slug
    .replace(/-/g, '_')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const directKey = `calculate${exportBase}`;
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

function validateOutput(
  result: Record<string, unknown>,
  slug: string,
  scenario: string,
): GoldenTestIssue[] {
  const issues: GoldenTestIssue[] = [];

  if (result === null || result === undefined) {
    issues.push({
      slug,
      scenario,
      field: 'output',
      severity: 'ERROR',
      message: 'Output is null/undefined',
    });
    return issues;
  }

  // Check totalWasteCost
  const total = result.totalWasteCost;
  if (typeof total !== 'number') {
    issues.push({
      slug,
      scenario,
      field: 'totalWasteCost',
      severity: 'ERROR',
      message: `totalWasteCost is not a number: ${String(total)}`,
    });
  } else {
    if (!Number.isFinite(total)) {
      issues.push({
        slug,
        scenario,
        field: 'totalWasteCost',
        severity: 'ERROR',
        message: `totalWasteCost is not finite: ${total}`,
        value: total,
      });
    }
    if (total < 0) {
      issues.push({
        slug,
        scenario,
        field: 'totalWasteCost',
        severity: 'WARN',
        message: `totalWasteCost is negative: ${total}`,
        value: total,
      });
    }
  }

  // Check breakdown
  const breakdown = result.breakdown;
  if (breakdown !== undefined && typeof breakdown === 'object' && !Array.isArray(breakdown)) {
    for (const [key, value] of Object.entries(breakdown as Record<string, unknown>)) {
      if (typeof value === 'number') {
        if (!Number.isFinite(value)) {
          issues.push({
            slug,
            scenario,
            field: `breakdown.${key}`,
            severity: 'ERROR',
            message: `Breakdown "${key}" value is not finite: ${value}`,
            value,
          });
        }
      }
    }
  }

  // Check dataConfidenceAdjusted
  const dca = result.dataConfidenceAdjusted;
  if (typeof dca === 'number' && !Number.isFinite(dca)) {
    issues.push({
      slug,
      scenario,
      field: 'dataConfidenceAdjusted',
      severity: 'ERROR',
      message: `dataConfidenceAdjusted is not finite: ${dca}`,
      value: dca,
    });
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
