/**
 * Parse structured TXT output from `calculatePremiumVerdict` server action.
 * Format:
 * BASE COST: [val] | RISK BUFFER: [val] | P90 SAFE PRICE: [val] | VERDICT: [label] | MATRIX: [matrix]
 */

export interface SensitivityMatrixRow {
  scenario: string;
  deltaPercent: string;
  deltaAmount: string;
  p90Adjusted: string;
}

export interface ParsedPremiumVerdict {
  isError: boolean;
  errorMessage?: string;
  naivePrice: number;
  riskBuffer: number;
  p90SafePrice: number;
  verdict: string;
  matrixRows: SensitivityMatrixRow[];
  rawTxt: string;
}

function parseMoney(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function extractField(txt: string, field: string): string {
  const regex = new RegExp(`${field}:\\s*([^|]+)`, "i");
  const match = txt.match(regex);
  return match?.[1]?.trim() ?? "";
}

function parseMatrixRows(matrixText: string): SensitivityMatrixRow[] {
  const rows: SensitivityMatrixRow[] = [];
  const segments = matrixText.split("||");

  for (const segment of segments) {
    if (!segment.includes("\u2502")) continue;
    const cells = segment
      .split("\u2502")
      .map((cell) => cell.trim())
      .filter(Boolean);

    if (cells.length < 4) continue;
    if (/scenario|\u0394 cost|\u2500|\u250c|\u2514|\u252c|\u2534|\u251c|\u2524/.test(cells[0])) continue;

    rows.push({
      scenario: cells[0],
      deltaPercent: cells[1],
      deltaAmount: cells[2],
      p90Adjusted: cells[3],
    });
  }

  return rows;
}

export function parsePremiumVerdictTxt(txt: string): ParsedPremiumVerdict {
  const rawTxt = txt.trim();

  if (rawTxt.startsWith("ERROR:")) {
    return {
      isError: true,
      errorMessage: rawTxt,
      naivePrice: 0,
      riskBuffer: 0,
      p90SafePrice: 0,
      verdict: "",
      matrixRows: [],
      rawTxt,
    };
  }

  const naivePrice = parseMoney(extractField(rawTxt, "BASE COST"));
  const riskBuffer = parseMoney(extractField(rawTxt, "RISK BUFFER"));
  const p90SafePrice = parseMoney(extractField(rawTxt, "P90 SAFE PRICE"));
  const verdict = extractField(rawTxt, "VERDICT");

  const matrixIndex = rawTxt.indexOf("MATRIX:");
  const matrixText =
    matrixIndex >= 0 ? rawTxt.slice(matrixIndex + "MATRIX:".length).trim() : "";

  return {
    isError: false,
    naivePrice,
    riskBuffer,
    p90SafePrice,
    verdict,
    matrixRows: parseMatrixRows(matrixText),
    rawTxt,
  };
}

export function verdictSeverity(
  verdict: string,
): "safe" | "watch" | "danger" {
  const upper = verdict.toUpperCase();
  if (
    upper.includes("DO NOT") ||
    upper.includes("REJECT") ||
    upper.includes("REMOVE") ||
    upper.includes("LOSS")
  ) {
    return "danger";
  }
  if (
    upper.includes("REPRICE") ||
    upper.includes("CAUTION") ||
    upper.includes("WATCH") ||
    upper.includes("LEAK") ||
    upper.includes("FRAGILE") ||
    upper.includes("LOW MARGIN")
  ) {
    return "watch";
  }
  return "safe";
}
