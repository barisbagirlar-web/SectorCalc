import fs from "node:fs";
import path from "node:path";
const META_SUFFIX =
  /\s*\((?:genişletilmiş|zaten var|expanded|already exists)\)\s*$/i;

function cleanToolNameForSchemaMatch(toolName: string): string {
  let name = toolName.trim();
  name = name.replace(/^[•\-*]+\s*/, "").trim();
  name = name.replace(META_SUFFIX, "").trim();
  return name;
}

const SOFT_FILE_SUFFIXES = [
  "generator",
  "converter",
  "score",
  "test",
  "english",
  "column",
  "hesaplayici",
  "schema",
] as const;

type SchemaFileIndexEntry = {
  readonly fileName: string;
  readonly keys: ReadonlySet<string>;
  readonly converterKey: string | null;
};

let schemaFileIndex: SchemaFileIndexEntry[] | null = null;
let indexedOutputDir: string | null = null;

function stripDiacritics(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "");
}

/** Görünen ad / dosya adı → karşılaştırılabilir metin. */
export function preprocessToolLabel(value: string): string {
  return stripDiacritics(value)
    .toLowerCase()
    .replace(/ø/g, "o")
    .replace(/æ/g, "ae")
    .replace(/œ/g, "oe")
    .replace(/ß/g, "ss")
    .replace(/&/g, " and ")
    .replace(/\bd\s*&\s*d\b/g, "dnd")
    .replace(/\be\s*=\s*mc\s*[²2³]?/gi, "emc2")
    .replace(/\bseconds?\s+of\s+arc\b/g, "arcseconds")
    .replace(/\bminutes?\s+of\s+arc\b/g, "arcminutes")
    .replace(/\bfluid\s+oz\b/g, "floz")
    .replace(/\bfl\.?\s*oz\b/g, "floz")
    .replace(/\btpace\b/g, "pace")
    .replace(/[²³]/g, (ch) => (ch === "²" ? "2" : "3"))
    .replace(/%/g, " percent ")
    .replace(/(\d)\/(\d)/g, "$1-$2")
    .replace(/([a-zA-Z])\/([a-zA-Z])/g, "$1-$2")
    .replace(/\//g, " per ")
    .replace(/[''`\u2019\u2018]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function apostropheVariants(value: string): string[] {
  const variants = new Set<string>([value]);
  if (/'s\b/.test(value)) {
    variants.add(value.replace(/'s\b/g, "s"));
    variants.add(value.replace(/'s\b/g, ""));
  }
  return [...variants];
}

function labelVariants(value: string): string[] {
  const out = new Set<string>();
  for (const variant of apostropheVariants(value)) {
    out.add(variant);
  }
  return [...out];
}

function stripParentheticals(value: string): string {
  return value.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
}

function extractParenAcronym(value: string): string | null {
  const match = value.match(/\(([A-Z][A-Z0-9/&-]{1,16})\)/);
  return match?.[1] ?? null;
}

function toCompactKey(value: string): string {
  let key = preprocessToolLabel(value).replace(/[^a-z0-9]+/g, "");
  for (const suffix of ["calculator", "converter", "schema"]) {
    if (key.endsWith(suffix) && key.length > suffix.length + 2) {
      key = key.slice(0, -suffix.length);
      break;
    }
  }
  return key;
}

function converterPairKey(value: string): string | null {
  const match = preprocessToolLabel(value).match(/^(.+?)\s+to\s+(.+)$/);
  if (!match) return null;
  const left = toCompactKey(match[1] ?? "");
  const right = toCompactKey(match[2] ?? "");
  if (!left || !right) return null;
  return [left, right].sort().join("|");
}

/** Bir araç adı için olası eşleşme anahtarları. */
export function buildToolMatchKeys(toolName: string): Set<string> {
  const keys = new Set<string>();
  const add = (raw: string): void => {
    for (const variant of labelVariants(raw)) {
      const compact = toCompactKey(variant);
      if (compact.length >= 2) keys.add(compact);
      const converter = converterPairKey(variant);
      if (converter) keys.add(`conv:${converter}`);
    }
  };

  const cleaned = cleanToolNameForSchemaMatch(toolName);
  add(cleaned);
  add(stripParentheticals(cleaned));

  const beforeParen = cleaned.match(/^(.+?)\s*\(/)?.[1]?.trim();
  if (beforeParen) add(beforeParen);

  const acronym = extractParenAcronym(cleaned);
  if (acronym) {
    add(acronym);
    add(acronym.replace(/\//g, " "));
  }

  return keys;
}

function slugifyDirect(toolName: string): string[] {
  const variants = new Set<string>();
  for (const label of labelVariants(stripParentheticals(cleanToolDisplayName(toolName)))) {
    const base = preprocessToolLabel(label)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    variants.add(base);
    variants.add(`${base}-calculator`);
    variants.add(base.replace(/-calculator$/, ""));
    variants.add(`${base.replace(/-calculator$/, "")}-calculator`);
  }
  return [...variants].filter(Boolean);
}

function cleanToolDisplayName(toolName: string): string {
  return cleanToolNameForSchemaMatch(toolName);
}

function softPrefixMatch(catalogKey: string, fileKey: string): boolean {
  if (catalogKey === fileKey) return true;
  if (catalogKey.length < 5 || fileKey.length < catalogKey.length) return false;
  if (!fileKey.startsWith(catalogKey)) return false;
  const rest = fileKey.slice(catalogKey.length);
  if (!rest) return true;
  return SOFT_FILE_SUFFIXES.some((suffix) => rest === suffix || rest.startsWith(suffix));
}

function keysOverlap(catalogKeys: ReadonlySet<string>, entry: SchemaFileIndexEntry): boolean {
  for (const catalogKey of catalogKeys) {
    if (catalogKey.startsWith("conv:")) {
      if (entry.converterKey && entry.converterKey === catalogKey.slice(5)) return true;
      continue;
    }
    if (entry.keys.has(catalogKey)) return true;
    for (const fileKey of entry.keys) {
      if (fileKey.startsWith("conv:")) continue;
      if (softPrefixMatch(catalogKey, fileKey) || softPrefixMatch(fileKey, catalogKey)) {
        return true;
      }
    }
  }
  return false;
}

function buildSchemaFileIndex(outputDir: string): SchemaFileIndexEntry[] {
  return fs
    .readdirSync(outputDir)
    .filter((fileName) => fileName.endsWith("-schema.json"))
    .map((fileName) => {
      const base = fileName.replace(/-schema\.json$/, "");
      const human = base.replace(/-/g, " ");
      const keys = buildToolMatchKeys(human);
      const converter = converterPairKey(human);
      if (converter) keys.add(`conv:${converter}`);
      return { fileName, keys, converterKey: converter };
    });
}

function getSchemaFileIndex(outputDir: string): SchemaFileIndexEntry[] {
  if (schemaFileIndex && indexedOutputDir === outputDir) {
    return schemaFileIndex;
  }
  schemaFileIndex = buildSchemaFileIndex(outputDir);
  indexedOutputDir = outputDir;
  return schemaFileIndex;
}

export function resetSchemaFileIndex(): void {
  schemaFileIndex = null;
  indexedOutputDir = null;
}

/** Katalog adı için generated/schemas altında eşleşen dosya var mı? */
export function schemaFileExistsForTool(toolName: string, outputDir: string): boolean {
  if (!fs.existsSync(outputDir)) return false;

  const catalogKeys = buildToolMatchKeys(toolName);

  for (const slug of slugifyDirect(toolName)) {
    if (fs.existsSync(path.join(outputDir, `${slug}-schema.json`))) return true;
  }

  const dndSlug = preprocessToolLabel(toolName).replace(/[^a-z0-9]+/g, "-");
  if (dndSlug.includes("dnd") || dndSlug.includes("d-and-d")) {
    const dndCandidate = dndSlug.replace(/d-and-d/g, "dnd");
    if (fs.existsSync(path.join(outputDir, `${dndCandidate}-schema.json`))) return true;
  }

  const index = getSchemaFileIndex(outputDir);
  return index.some((entry) => keysOverlap(catalogKeys, entry));
}
