import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

dotenv.config({ path: path.join(PROJECT_ROOT, '.env.local') });

const CONCURRENCY = Math.max(1, Number(process.env.SCHEMA_CONCURRENCY || 6));
const MAX_RETRIES = Math.max(0, Number(process.env.SCHEMA_MAX_RETRIES || 3));
const REQUEST_TIMEOUT_MS = Math.max(30_000, Number(process.env.SCHEMA_TIMEOUT_MS || 180_000));
const HEARTBEAT_MS = Math.max(10_000, Number(process.env.SCHEMA_HEARTBEAT_MS || 30_000));

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

const premiumSlugs = JSON.parse(
  fs.readFileSync(path.join(PROJECT_ROOT, 'premium-slugs.json'), 'utf-8'),
);
const freeSlugs = JSON.parse(
  fs.readFileSync(path.join(PROJECT_ROOT, 'free-slugs.json'), 'utf-8'),
);
const allSlugs = [...premiumSlugs, ...freeSlugs];
const isPremium = (slug) => premiumSlugs.includes(slug);

const outDir = path.join(PROJECT_ROOT, 'generated/schemas');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const INDUSTRIAL_PROMPT = (slug, premium) => `
You are an industrial engineering expert. Generate a complete industrial-grade JSON schema for the calculation tool with slug "${slug}".

Requirements:
- Only valid JSON output, no extra text.
- Inputs: each input must have id, label, type (number/select/boolean), unit, default, min, max, businessContext.
- validation: rules (conditional rules) and thresholds (alert conditions).
- formulas: at least 3-7 sub-formulas leading to a primary result.
- outputs: primary, breakdown (object with component values), hiddenLossDrivers (array), suggestedActions (array), dataConfidenceAdjusted (number).
- premiumRequired: ${premium}.
- premiumFeatures: array of strings (e.g., "PDF export", "CSV export", "Trend analysis").

Use your knowledge of industrial engineering standards (ISO, Lean, Six Sigma, WERC, etc.). 
Output only JSON.
`;

function isRetryableError(err) {
  const message = String(err?.message ?? err);
  return /429|rate.?limit|timeout|ECONNRESET|ETIMEDOUT|503|502/i.test(message);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateSchema(slug) {
  const prompt = INDUSTRIAL_PROMPT(slug, isPremium(slug));

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await client.chat.completions.create(
        {
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          max_tokens: 4096,
        },
        { timeout: REQUEST_TIMEOUT_MS },
      );

      let content = response.choices[0]?.message?.content ?? '';
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) content = jsonMatch[1];

      return JSON.parse(content);
    } catch (err) {
      if (attempt < MAX_RETRIES && isRetryableError(err)) {
        const backoffMs = 1000 * (attempt + 1);
        console.warn(`  ↻ ${slug}: retry ${attempt + 1}/${MAX_RETRIES} in ${backoffMs}ms`);
        await sleep(backoffMs);
        continue;
      }
      throw err;
    }
  }

  throw new Error(`Failed after ${MAX_RETRIES} retries`);
}

async function processSlug(slug, index, total, { force = false } = {}) {
  const outPath = path.join(outDir, `${slug}-schema.json`);
  if (!force && fs.existsSync(outPath)) {
    console.log(`[${index + 1}/${total}] SKIP ${slug} (already exists)`);
    return { slug, status: 'skip' };
  }

  console.log(`[${index + 1}/${total}] ${slug}${force ? ' (force)' : ''}`);
  try {
    const schema = await generateSchema(slug);
    fs.writeFileSync(outPath, JSON.stringify(schema, null, 2));
    console.log(`  ✅ ${slug}`);
    return { slug, status: 'ok' };
  } catch (err) {
    console.error(`  ❌ ${slug}: ${err.message}`);
    return { slug, status: 'error', error: err.message };
  }
}

function resolveTargetSlugs(requestedSlugs) {
  if (!requestedSlugs?.length) {
    return allSlugs.map((slug, index) => ({ slug, index }));
  }

  const unknown = requestedSlugs.filter((slug) => !allSlugs.includes(slug));
  if (unknown.length > 0) {
    throw new Error(`Unknown slug(s): ${unknown.join(', ')}`);
  }

  return requestedSlugs.map((slug) => ({
    slug,
    index: allSlugs.indexOf(slug),
  }));
}

/**
 * @param {{ slugs?: string[], force?: boolean }} [options]
 */
export async function runSchemaScan({ slugs: requestedSlugs, force = false } = {}) {
  const targets = resolveTargetSlugs(requestedSlugs);
  const total = targets.length;
  const pending = force
    ? targets
    : targets.filter(({ slug }) => !fs.existsSync(path.join(outDir, `${slug}-schema.json`)));

  const existing = total - pending.length;
  console.log(
    `Schema scan: ${total} target | ${existing} cached | ${pending.length} pending | concurrency=${CONCURRENCY}${force ? ' | force' : ''}`,
  );

  let ok = 0;
  let failed = 0;
  const skipped = existing;

  for (let i = 0; i < pending.length; i += CONCURRENCY) {
    const chunk = pending.slice(i, i + CONCURRENCY);
    const slugLabel = chunk.map(({ slug }) => slug).join(', ');
    const startedAt = Date.now();

    const heartbeat = setInterval(() => {
      const elapsedSec = Math.round((Date.now() - startedAt) / 1000);
      console.log(`  ⏳ batch in flight (${elapsedSec}s): ${slugLabel}`);
    }, HEARTBEAT_MS);

    let results;
    try {
      results = await Promise.all(
        chunk.map(({ slug, index }) => processSlug(slug, index, total, { force })),
      );
    } finally {
      clearInterval(heartbeat);
    }

    for (const result of results) {
      if (result.status === 'ok') ok += 1;
      if (result.status === 'error') failed += 1;
    }

    const done = Math.min(i + CONCURRENCY, pending.length);
    console.log(`--- batch ${done}/${pending.length} | ok=${ok} fail=${failed} skip=${skipped} ---`);
  }

  console.log(`Done. ok=${ok} fail=${failed} skip=${skipped} total=${total}`);
  return { ok, failed, skipped, total };
}

async function main() {
  const argv = process.argv.slice(2);
  const force = argv.includes('--force');
  const slugs = argv.filter((arg) => arg !== '--force');
  await runSchemaScan({ slugs: slugs.length > 0 ? slugs : undefined, force });
}

const isCliEntry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCliEntry) {
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err);
    process.exit(1);
  });

  process.on('SIGINT', () => {
    console.log('\nInterrupted — re-run to resume (existing schemas are skipped).');
    process.exit(130);
  });

  main().catch((err) => {
    console.error('Fatal:', err);
    process.exit(1);
  });
}
