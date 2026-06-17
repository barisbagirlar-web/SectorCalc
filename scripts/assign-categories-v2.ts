#!/usr/bin/env npx tsx
/**
 * Assign 21-category taxonomy to generated schemas.
 * Updates category, sector, and global categorySlug fields.
 */
import fs from "node:fs";
import path from "node:path";
import {
  CATEGORY_TAXONOMY,
  TAXONOMY_CATEGORY_NAMES,
  type CategoryTaxonomyEntry,
} from "../src/lib/tools/category-taxonomy";

const SCHEMAS_DIR = path.join(process.cwd(), "generated", "schemas");
const DEFAULT_CATEGORY = "Diğer";

type SchemaInput = {
  readonly label?: string;
  readonly id?: string;
};

type RawSchema = {
  toolName?: string;
  slug?: string;
  title?: string;
  description?: string;
  category?: string;
  sector?: string;
  categorySlug?: string;
  inputs?: readonly SchemaInput[];
};

function normalizeHaystack(parts: readonly string[]): string {
  return parts
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ");
}

function keywordMatches(haystack: string, keyword: string): boolean {
  const normalizedKeyword = keyword.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (!normalizedKeyword) {
    return false;
  }
  if (normalizedKeyword.includes(" ")) {
    return haystack.includes(normalizedKeyword);
  }
  if (normalizedKeyword.length <= 3) {
    const escaped = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`).test(haystack);
  }
  return haystack.includes(normalizedKeyword);
}

function scoreCategory(
  haystack: string,
  inputHaystack: string,
  entry: CategoryTaxonomyEntry,
): number {
  let score = 0;
  for (const keyword of entry.keywords) {
    if (keywordMatches(haystack, keyword)) {
      score += 2;
    }
    if (keywordMatches(inputHaystack, keyword)) {
      score += 1;
    }
  }
  return score;
}

const FALLBACK_CATEGORY_PATTERNS: ReadonlyArray<{
  readonly title: string;
  readonly pattern: RegExp;
}> = [
  {
    title: "İSG & Risk Yönetimi",
    pattern:
      /bmi|bmr|tdee|calorie|body-fat|health|baby|pregnancy|sleep|heart|blood|fitness|workout|diet|metabolic|exercise|vo2|ovulation|wellness|1rm|fasting|alcohol|smoking|stress|anxiety|depression|ergonomic/,
  },
  {
    title: "Kalite & Laboratuvar",
    pattern:
      /matrix|vector|angle|decimal|binary|logarithm|coefficient|percentile|statistics|algebra|geometry|trigonometry|calculus|probability|regression|antilog|checksum|ascii|coordinate|polynomial|integral|derivative|modulus|magnitude|filter|frequency|wavelength|atom|molecule|electron|physics|chemistry|science|score-calculator|sat-|act-|ap-score|gpa/,
  },
  {
    title: "Vergi & Finansal Raporlama",
    pattern:
      /loan|mortgage|interest|tax|salary|income|savings|401k|ira|bond|stock|dividend|crypto|budget|annuity|amortization|depreciation|refinance|credit|debt|tip-calculator/,
  },
  {
    title: "Maliyet & Bütçeleme",
    pattern: /cost|price|profit|margin|markup|quote|rent|value|worth|roi|break-even|breakeven|discount|sale/,
  },
  {
    title: "Gıda & Tarım",
    pattern: /recipe|food|meal|nutrition|baking|cooking|coffee|beer|wine|abv|calorie|diet|crop|farm|yield|fertilizer/,
  },
  {
    title: "Otomotiv",
    pattern: /car-|auto-|vehicle|fuel|mpg|mileage|tire|brake|engine|driving|ev-range/,
  },
  {
    title: "Elektrik & Otomasyon",
    pattern: /voltage|ampere|watt|ohm|resistor|capacitor|inductor|circuit|electrical|motor|power-factor/,
  },
  {
    title: "Akışkanlar & Termodinamik",
    pattern: /reynolds|flow|pipe|pump|pressure|fluid|thermal|heat-|steam|hvac|air-/,
  },
  {
    title: "Makine & Tasarım",
    pattern: /beam|bolt|torque|stress|strain|deflection|gear|bearing|spring|shaft|weld/,
  },
  {
    title: "İnşaat & Yapı",
    pattern: /concrete|roof|wall|brick|mortar|rebar|foundation|construction|building|paint-coverage/,
  },
  {
    title: "Proje & Yatırım",
    pattern: /npv|irr|payback|investment|present-value|future-value|compound/,
  },
  {
    title: "Çevre & Emisyon",
    pattern: /carbon|emission|waste|water-|ecology|pollution|recycle|e-waste/,
  },
];

function resolveBestCategory(raw: RawSchema, slug: string): {
  readonly title: string;
  readonly entry: CategoryTaxonomyEntry;
  readonly score: number;
} {
  const haystack = normalizeHaystack([
    slug,
    raw.toolName ?? "",
    raw.slug ?? "",
    raw.title ?? "",
    raw.description ?? "",
  ]);
  const inputHaystack = normalizeHaystack(
    (raw.inputs ?? []).flatMap((input) => [input.label ?? "", input.id ?? ""]),
  );

  let bestTitle = DEFAULT_CATEGORY;
  let bestEntry: CategoryTaxonomyEntry | undefined;
  let bestScore = 0;

  for (const title of TAXONOMY_CATEGORY_NAMES) {
    const entry = CATEGORY_TAXONOMY[title];
    const score = scoreCategory(haystack, inputHaystack, entry);
    if (score > bestScore) {
      bestScore = score;
      bestTitle = title;
      bestEntry = entry;
    }
  }

  if (!bestEntry || bestScore === 0) {
    for (const fallback of FALLBACK_CATEGORY_PATTERNS) {
      if (fallback.pattern.test(haystack)) {
        const entry = CATEGORY_TAXONOMY[fallback.title];
        return { title: fallback.title, entry, score: 1 };
      }
    }
    const fallback = CATEGORY_TAXONOMY["Kalite & Laboratuvar"];
    return { title: DEFAULT_CATEGORY, entry: fallback, score: 0 };
  }

  return { title: bestTitle, entry: bestEntry, score: bestScore };
}

function main(): void {
  if (!fs.existsSync(SCHEMAS_DIR)) {
    console.error(`Schemas directory missing: ${SCHEMAS_DIR}`);
    process.exit(1);
  }

  let assigned = 0;
  let skipped = 0;
  const distribution = new Map<string, number>();

  for (const file of fs.readdirSync(SCHEMAS_DIR)) {
    if (!file.endsWith(".json")) {
      continue;
    }

    const filePath = path.join(SCHEMAS_DIR, file);
    const slug = file.replace(/-schema\.json$/, "").replace(/\.json$/, "");
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as RawSchema;

    const { title, entry, score } = resolveBestCategory(raw, slug);
    const category = score > 0 ? title : DEFAULT_CATEGORY;
    const sector = score > 0 ? entry.sector : DEFAULT_CATEGORY;
    const categorySlug = score > 0 ? entry.globalCategorySlug : "technology-ai-cloud-cyber";

    const needsWrite =
      raw.category !== category || raw.sector !== sector || raw.categorySlug !== categorySlug;

    if (!needsWrite) {
      skipped += 1;
      distribution.set(category, (distribution.get(category) ?? 0) + 1);
      continue;
    }

    raw.category = category;
    raw.sector = sector;
    raw.categorySlug = categorySlug;
    fs.writeFileSync(filePath, `${JSON.stringify(raw, null, 2)}\n`);
    assigned += 1;
    distribution.set(category, (distribution.get(category) ?? 0) + 1);
    console.log(`✅ ${file} → ${category} (${score})`);
  }

  console.log(`\n🎉 Toplam ${assigned} şemaya kategori atandı (${skipped} değişmedi).`);
  console.log("\nDağılım:");
  for (const [category, count] of [...distribution.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${count} ${category}`);
  }
}

main();
