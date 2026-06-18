import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/* ── Types ────────────────────────────────────── */

type TscCheckResult = {
  readonly ok: boolean;
  readonly exitCode: number | null;
  readonly errorCount: number;
  readonly output: string;
};

/* ── Core check ───────────────────────────────── */

function runTscCheck(projectDir: string, extraArgs = ''): TscCheckResult {
  try {
    const output = execSync(
      `npx tsc --noEmit ${extraArgs}`,
      {
        cwd: projectDir,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 120_000, // 2 minutes max
      },
    ).toString();

    return {
      ok: true,
      exitCode: 0,
      errorCount: 0,
      output: output.trim(),
    };
  } catch (err: unknown) {
    const errorOutput = err instanceof Error && 'stdout' in err
      ? String((err as { stdout: string }).stdout)
      : err instanceof Error
        ? err.message
        : String(err);

    const lines = errorOutput.split('\n');
    // Count "error TS" lines (excluding file paths and repeats)
    const errorLines = lines.filter((l) => /error TS\d+/.test(l));
    const errorCount = errorLines.length;

    return {
      ok: errorCount === 0,
      exitCode: err instanceof Error && 'status' in err ? (err as { status: number }).status : null,
      errorCount,
      output: errorOutput.trim(),
    };
  }
}

/* ── Summary for generated files ──────────────── */

function countGeneratedErrors(output: string, generatedDir: string): number {
  const absGenerated = path.resolve(generatedDir);
  const lines = output.split('\n');
  return lines.filter((line) => {
    if (!line.includes('error TS')) return false;
    // Check if the error is from a file inside generated/
    const fileMatch = line.match(/^([^(]+)\(/);
    if (!fileMatch) return false;
    const filePath = path.resolve(fileMatch[1].trim());
    return filePath.startsWith(absGenerated);
  }).length;
}

/* ── Main ─────────────────────────────────────── */

function main(): void {
  const projectDir = process.cwd();
  const generatedDir = path.join(projectDir, 'generated');
  const reportFile = path.join(generatedDir, 'tsc-check-report.json');

  // Ensure generated dir exists
  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
  }

  console.log('🔍 TypeScript type check (tsc --noEmit)...');

  // Check generated files separately first
  const generatedTscDir = path.join(projectDir, 'generated');
  const tsFiles = fs.readdirSync(generatedTscDir).filter((f) => f.endsWith('.ts'));

  // Run tsc on the full project but count generated vs non-generated errors
  const result = runTscCheck(projectDir);
  const generatedErrors = countGeneratedErrors(result.output, generatedDir);
  const otherErrors = result.errorCount - generatedErrors;

  console.log(`   Generated .ts files: ${tsFiles.length}`);
  console.log(`   Errors in generated/: ${generatedErrors}`);
  console.log(`   Errors elsewhere: ${otherErrors}`);
  console.log(`   Total errors: ${result.errorCount}`);

  const report = {
    timestamp: new Date().toISOString(),
    ok: result.ok,
    exitCode: result.exitCode,
    totalErrorCount: result.errorCount,
    generatedErrors,
    otherErrors,
    generatedFileCount: tsFiles.length,
    outputPreview: result.output.slice(0, 2000),
  };

  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`📊 Report: ${reportFile}`);

  if (!result.ok) {
    console.log('   First 5 errors:');
    const lines = result.output.split('\n');
    let shown = 0;
    for (const line of lines) {
      if (line.includes('error TS') && shown < 5) {
        console.log(`   ${line.trim()}`);
        shown++;
      }
    }
    process.exit(1);
  }
}

main();
