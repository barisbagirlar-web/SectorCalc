import type { CaseStudy } from "@/lib/case-studies/types";

export type CaseStudySavingsBand = "0-100k" | "100k-500k" | "500k-1m" | "1m+";

export type CaseStudyDatabaseFilters = {
  readonly industry?: string;
  readonly country?: string;
  readonly year?: string;
  readonly savings?: CaseStudySavingsBand | "";
};

const SAVINGS_METRIC_PATTERN =
  /savings|tasarruf|einsparung|économies|economies|ahorro|توفير/i;

export function parseEuroAmount(value: string): number {
  const normalized = value.replace(/[^\d.,]/g, "");
  if (!normalized) {
    return 0;
  }

  const hasComma = normalized.includes(",");
  const hasDot = normalized.includes(".");

  if (hasComma && hasDot) {
    const lastComma = normalized.lastIndexOf(",");
    const lastDot = normalized.lastIndexOf(".");
    if (lastComma > lastDot) {
      return Number(normalized.replace(/\./g, "").replace(",", ".")) || 0;
    }
    return Number(normalized.replace(/,/g, "")) || 0;
  }

  if (hasComma) {
    const parts = normalized.split(",");
    if (parts.length === 2 && parts[1]?.length <= 2) {
      return Number(`${parts[0]?.replace(/\./g, "")}.${parts[1]}`) || 0;
    }
    return Number(normalized.replace(/,/g, "")) || 0;
  }

  if (hasDot) {
    const parts = normalized.split(".");
    if (parts.length === 2 && parts[1]?.length === 3) {
      return Number(`${parts[0]}${parts[1]}`) || 0;
    }
    if (parts.length > 2) {
      return Number(parts.join("")) || 0;
    }
    return Number(normalized) || 0;
  }

  return Number(normalized) || 0;
}

export function resolveCaseStudySavingsEur(study: CaseStudy): number {
  if (study.savingsEur != null) {
    return study.savingsEur;
  }

  const savingsRow = study.results.find((row) => SAVINGS_METRIC_PATTERN.test(row.metric));
  if (savingsRow) {
    return parseEuroAmount(savingsRow.after);
  }

  return 0;
}

export function formatEuroAmount(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(value);
}

export function matchesSavingsBand(value: number, band: CaseStudySavingsBand): boolean {
  switch (band) {
    case "0-100k":
      return value >= 0 && value < 100_000;
    case "100k-500k":
      return value >= 100_000 && value < 500_000;
    case "500k-1m":
      return value >= 500_000 && value < 1_000_000;
    case "1m+":
      return value >= 1_000_000;
    default:
      return true;
  }
}

export function filterCaseStudiesForDatabase(
  studies: readonly CaseStudy[],
  filters: CaseStudyDatabaseFilters,
): CaseStudy[] {
  return studies.filter((study) => {
    if (filters.industry && study.industry !== filters.industry) {
      return false;
    }

    const country = study.country ?? "Germany";
    if (filters.country && country !== filters.country) {
      return false;
    }

    const year = study.publishedAt.slice(0, 4);
    if (filters.year && year !== filters.year) {
      return false;
    }

    if (filters.savings && !matchesSavingsBand(resolveCaseStudySavingsEur(study), filters.savings)) {
      return false;
    }

    return true;
  });
}

export function getPrimaryResultRow(study: CaseStudy) {
  const savingsRow = study.results.find((row) => SAVINGS_METRIC_PATTERN.test(row.metric));
  return savingsRow ?? study.results[0];
}
