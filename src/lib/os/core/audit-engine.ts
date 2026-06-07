/**
 * Global standartlarda, sektörel bağımsız analiz motoru.
 */

export interface AuditInput {
 target: number;
 actual: number;
 cost: number;
 tolerance: number;
}

export type GlobalAuditStatus = "CRITICAL" | "OPTIMAL";

export interface GlobalAuditResult {
 variancePct: string;
 financialLoss: string;
 status: GlobalAuditStatus;
 timestamp: string;
}

function resolveIntlLocale(locale: string): string {
 const map: Record<string, string> = {
 en: "en-US",
 tr: "tr-TR",
 de: "de-DE",
 es: "es-ES",
 ar: "ar-SA",
 };
 return map[locale] ?? locale;
}

export const runGlobalAudit = (
 input: AuditInput,
 locale: string = "en-US"
): GlobalAuditResult => {
 const intlLocale = resolveIntlLocale(locale);
 const timestamp = new Date().toISOString();

 if (
 !Number.isFinite(input.target) ||
 !Number.isFinite(input.actual) ||
 !Number.isFinite(input.cost) ||
 !Number.isFinite(input.tolerance)
 ) {
 return {
 variancePct: "0.00",
 financialLoss: (0).toLocaleString(intlLocale, {
 style: "currency",
 currency: "USD",
 }),
 status: "CRITICAL",
 timestamp,
 };
 }

 const safeTolerance = input.tolerance > 0 ? input.tolerance : 0.05;
 const diff = input.actual - input.target;
 const variancePct =
 input.target === 0
 ? diff === 0
 ? 0
 : (Math.sign(diff) || 1) * 100
 : (diff / input.target) * 100;
 const financialLoss = Math.abs(diff) * Math.max(0, input.cost);
 const tolerancePct = safeTolerance * 100;

 return {
 variancePct: variancePct.toFixed(2),
 financialLoss: financialLoss.toLocaleString(intlLocale, {
 style: "currency",
 currency: "USD",
 }),
 status: Math.abs(variancePct) > tolerancePct ? "CRITICAL" : "OPTIMAL",
 timestamp,
 };
};
