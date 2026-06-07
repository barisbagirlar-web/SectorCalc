/**
 * Parse structured TXT output from `calculatePremiumVerdict` server action.
 * Format:
 * TEMEL MALIYET: [val] | RİSK TAMPONU: [val] | P90 GÜVENLİ FİYAT: [val] | VERDİKT: [label] | MATRİS: [matrix]
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
 if (!segment.includes("│")) continue;
 const cells = segment
 .split("│")
 .map((cell) => cell.trim())
 .filter(Boolean);

 if (cells.length < 4) continue;
 if (/scenario|Δ cost|─|┌|└|┬|┴|├|┤/.test(cells[0])) continue;

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

 if (rawTxt.startsWith("HATA:")) {
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

 const naivePrice = parseMoney(extractField(rawTxt, "TEMEL MALIYET"));
 const riskBuffer = parseMoney(extractField(rawTxt, "RİSK TAMPONU"));
 const p90SafePrice = parseMoney(extractField(rawTxt, "P90 GÜVENLİ FİYAT"));
 const verdict = extractField(rawTxt, "VERDİKT");

 const matrixIndex = rawTxt.indexOf("MATRİS:");
 const matrixText =
 matrixIndex >= 0 ? rawTxt.slice(matrixIndex + "MATRİS:".length).trim() : "";

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
