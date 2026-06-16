import fs from "node:fs";
import path from "node:path";
import { PROJECT_ROOT } from "./load-env";

export type CalculatorListEntry = {
  readonly name: string;
  readonly section: string;
  readonly subsection: string;
  readonly slug: string;
};

const META_SUFFIX =
  /\s*\((?:genişletilmiş|zaten var|expanded|already exists)\)\s*$/i;

const MAIN_SECTION_PATTERN =
  /^[A-Z][A-Z0-9 &/–-]+(?:\(\d+\+?\s*(?:araç|tools?)\))?$/;

export function normalizeCalculatorSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function cleanCalculatorName(raw: string): string {
  let name = raw.trim();
  name = name.replace(/^[•\-*\d.]+\s*/, "").trim();
  name = name.replace(META_SUFFIX, "").trim();
  return name;
}

function isBulletLine(line: string): boolean {
  const trimmed = line.trim();
  return /^[•\-*]/.test(trimmed) || /^\d+\./.test(trimmed);
}

function isMainSectionLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    return false;
  }
  if (isBulletLine(trimmed)) {
    return false;
  }
  return MAIN_SECTION_PATTERN.test(trimmed);
}

function isSubsectionLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#") || isBulletLine(trimmed)) {
    return false;
  }
  if (isMainSectionLine(trimmed)) {
    return false;
  }
  return /^[A-Za-z0-9]/.test(trimmed);
}

export function parseCalculatorListEntries(filePath: string): CalculatorListEntry[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`List file not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const entries: CalculatorListEntry[] = [];
  let currentSection = "GENERAL";
  let currentSubsection = "";

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    if (trimmed.startsWith("#")) {
      const sectionFromHash = trimmed.replace(/^#+\s*/, "").trim();
      if (sectionFromHash && !sectionFromHash.toLowerCase().startsWith("sectorcalc")) {
        currentSection = sectionFromHash.replace(/\(\d+\+?\s*(?:araç|tools?)\)/i, "").trim();
        currentSubsection = "";
      }
      continue;
    }

    if (isMainSectionLine(trimmed)) {
      currentSection = trimmed.replace(/\(\d+\+?\s*(?:araç|tools?)\)/i, "").trim();
      currentSubsection = "";
      continue;
    }

    if (isSubsectionLine(trimmed)) {
      currentSubsection = trimmed;
      continue;
    }

    if (isBulletLine(trimmed)) {
      const name = cleanCalculatorName(trimmed);
      if (name.length > 2) {
        entries.push({
          name,
          section: currentSection,
          subsection: currentSubsection,
          slug: normalizeCalculatorSlug(name),
        });
      }
      continue;
    }

    if (currentSection !== "GENERAL" && /^[A-Za-z0-9]/.test(trimmed)) {
      const name = cleanCalculatorName(trimmed);
      if (name.length > 2) {
        entries.push({
          name,
          section: currentSection,
          subsection: currentSubsection,
          slug: normalizeCalculatorSlug(name),
        });
      }
    }
  }

  return entries;
}

export function parseCalculatorList(filePath: string): string[] {
  return parseCalculatorListEntries(filePath).map((entry) => entry.name);
}

export const SECTION_TO_FREE_TRAFFIC_CATEGORY: Readonly<Record<string, string>> = {
  "FINANCE & BUSINESS": "finance-business",
  "HEALTH & FITNESS": "health-body",
  "MATH & STATISTICS": "math-statistics",
  "CONVERSION & UNIT TOOLS": "conversion",
  "CONSTRUCTION & MEASUREMENT": "construction-measurement",
  PHYSICS: "physics-science",
  CHEMISTRY: "chemistry-science",
  ENGINEERING: "engineering-science",
  "FOOD & COOKING": "food-cooking",
  "DATE & TIME": "date-time",
  EDUCATION: "education-academic",
  "EVERYDAY LIFE": "everyday-life",
  "ECOLOGY & ENVIRONMENT": "ecology-environment",
  "STATISTICS & DATA SCIENCE": "math-statistics",
  "GAMING & ENTERTAINMENT": "gaming-entertainment",
  "HOBBIES & MISCELLANEOUS": "hobbies-diy",
  GENERAL: "everyday-life",
};

export function resolveSectionCategory(section: string): string {
  const normalized = section.trim().toUpperCase();
  return SECTION_TO_FREE_TRAFFIC_CATEGORY[normalized] ?? SECTION_TO_FREE_TRAFFIC_CATEGORY[section] ?? "everyday-life";
}

export function buildSlugCategoryMap(entries: readonly CalculatorListEntry[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const entry of entries) {
    if (entry.slug) {
      map[entry.slug] = resolveSectionCategory(entry.section);
    }
  }
  return map;
}

export function defaultListFilePath(): string {
  return path.join(PROJECT_ROOT, "input_calculators.txt");
}
