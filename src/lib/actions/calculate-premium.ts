/**
 * MarginCore Premium Calculation — Server Action
 *
 * Server-side calculation entry point that protects the stochastic math
 * engine behind a Pro-subscription gate. Returns structured TXT strings
 * (not JSON) to prevent direct formula scraping from the browser.
 *
 * Auth flow:
 * 1. Client sends Firebase ID token
 * 2. Server verifies via firebase-admin SDK
 * 3. Checks Firestore users/{uid} for active subscription
 * 4. Runs stochastic calculation
 * 5. Returns TXT-formatted report
 */

"use server";

import {
 calculateP90SafeCost,
 generateSensitivityMatrixText,
 runEngine,
 formatEngineReport,
 type MarginCoreEngineOutput,
} from "@/lib/math/stochastic-engine";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { verifyProSubscriber } from "@/lib/billing/verify-pro-subscriber";
import { getSectorRiskProfile } from "@/lib/tools/sectors/risk-profiles";
import {
 getNaiveCostCalculator,
 getVerdictLabels,
} from "@/lib/tools/sectors/sector-calculators";
import type { MarginCoreInputValues } from "@/lib/types/margincore-engine";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Sector + numeric inputs + auth token for Pro gate. */
export interface PremiumVerdictRequest {
 sector: string;
 inputs: Record<string, number>;
 idToken: string;
}

/**
 * Client-submitted input for the legacy CNC stochastic panel.
 */
export interface PremiumCalcRequest {
 idToken: string;
 expectedCost: number;
 volatilityPercent: number;
 emissionFactor: number;
 currency: string;
}

/**
 * Legacy server action return value (CNC panel).
 * New callers should use `calculatePremiumVerdict` which returns TXT only.
 */
export interface PremiumCalcResponse {
 success: boolean;
 txt: string;
 output?: MarginCoreEngineOutput;
 error?: string;
}

// ---------------------------------------------------------------------------
// TXT serialization
// ---------------------------------------------------------------------------

function formatCurrency(value: number): string {
 return value.toLocaleString("en-US", {
 minimumFractionDigits: 2,
 maximumFractionDigits: 2,
 });
}

function formatCompactMatrix(baseCost: number, volatilityPercent: number): string {
 const iv = volatilityPercent / 100;
 const matrix = generateSensitivityMatrixText(baseCost, iv);
 return matrix
 .split("\n")
 .map((line) => line.trim())
 .filter(Boolean)
 .join(" || ");
}

function resolveVerdictLabel(
 sector: string,
 verdict: MarginCoreEngineOutput["verdict"],
): string {
 const labels = getVerdictLabels(sector);
 switch (verdict) {
 case "accept":
 return labels.accept;
 case "caution":
 return labels.caution;
 case "reject":
 return labels.reject;
 default:
 return labels.caution;
 }
}

/**
 * Serialize engine output into the canonical single-line TXT verdict string.
 */
function serializePremiumVerdictTxt(
 sector: string,
 output: MarginCoreEngineOutput,
 volatilityPercent: number,
): string {
 const baseCost = output.p90.expected;
 const buffer = output.p90.buffer;
 const p90Safe = output.p90.safe;
 const verdictLabel = resolveVerdictLabel(sector, output.verdict);
 const matrixString = formatCompactMatrix(baseCost, volatilityPercent);

 return [
 `TEMEL MALIYET: ${formatCurrency(baseCost)}`,
 `RİSK TAMPONU: ${formatCurrency(buffer)}`,
 `P90 GÜVENLİ FİYAT: ${formatCurrency(p90Safe)}`,
 `VERDİKT: ${verdictLabel}`,
 `MATRİS: ${matrixString}`,
 ].join(" | ");
}

function authErrorTxt(): string {
 return "HATA: Yetki hatası. Bu hesaplama yalnızca SectorCalc Pro üyelerine açıktır. Lütfen giriş yapın veya Pro aboneliğinizi aktifleştirin.";
}

function invalidInputTxt(): string {
 return "HATA: Geçersiz giriş. Sektör ve sayısal alanlar doğrulanamadı.";
}

// ---------------------------------------------------------------------------
// Server Actions
// ---------------------------------------------------------------------------

/**
 * Run MarginCore premium verdict for any sector.
 *
 * Accepts sector slug + numeric inputs, verifies Pro subscription server-side,
 * and returns a human-readable TXT string (never raw JSON).
 */
export async function calculatePremiumVerdict(
 request: PremiumVerdictRequest,
): Promise<string> {
 if (!request.idToken) {
 return "HATA: Giriş yapılmamış. Bu hesaplama yalnızca SectorCalc Pro üyelerine açıktır.";
 }

 const uid = await verifyProSubscriber(request.idToken);
 if (!uid) {
 return authErrorTxt();
 }

 const sector = request.sector?.trim();
 if (!sector || !request.inputs || typeof request.inputs !== "object") {
 return invalidInputTxt();
 }

 const marginInputs: MarginCoreInputValues = request.inputs;
 const calculateNaiveCost = getNaiveCostCalculator(sector);
 const expectedCost = calculateNaiveCost(marginInputs);

 if (!Number.isFinite(expectedCost) || expectedCost <= 0) {
 return invalidInputTxt();
 }

 const riskProfile = getSectorRiskProfile(sector);
 const volatilityPercent = Math.round(riskProfile.baseVolatility * 1000) / 10;
 const emissionFactor = riskProfile.cbamExposureIndex ?? 0;

 // Explicit P90 pass (engine also uses this internally via runEngine)
 const p90 = calculateP90SafeCost(expectedCost, volatilityPercent);
 if (p90.expected <= 0) {
 return invalidInputTxt();
 }

 const output = runEngine(expectedCost, volatilityPercent, emissionFactor);
 const txt = serializePremiumVerdictTxt(sector, output, volatilityPercent);

 logSectorCalculation(uid, sector, expectedCost).catch(() => {
 // Silent — logging failure must not break calculation
 });

 return txt;
}

/**
 * Legacy CNC stochastic calculation (Big Four report format).
 * Prefer `calculatePremiumVerdict` for sector-aware premium tools.
 */
export async function calculatePremium(
 request: PremiumCalcRequest,
): Promise<PremiumCalcResponse> {
 if (!request.idToken) {
 return {
 success: false,
 txt: "HATA: Giriş yapılmamış. Bu hesaplama yalnızca SectorCalc Pro üyelerine açıktır.",
 error: "NO_TOKEN",
 };
 }

 const uid = await verifyProSubscriber(request.idToken);
 if (!uid) {
 return {
 success: false,
 txt: authErrorTxt(),
 error: "PRO_REQUIRED",
 };
 }

 if (
 !request.expectedCost ||
 request.expectedCost <= 0 ||
 !request.volatilityPercent ||
 request.volatilityPercent <= 0
 ) {
 return {
 success: false,
 txt: invalidInputTxt(),
 error: "INVALID_INPUT",
 };
 }

 const output = runEngine(
 request.expectedCost,
 request.volatilityPercent,
 request.emissionFactor ?? 0,
 );

 const txt = formatEngineReport(output, request.currency || "USD");

 logCalculation(uid, request).catch(() => {
 // Silent — logging failure must not break calculation
 });

 return {
 success: true,
 txt,
 output,
 };
}

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------

async function logSectorCalculation(
 uid: string,
 sector: string,
 expectedCost: number,
): Promise<void> {
 try {
 const db = getAdminFirestore();
 if (!db) return;

 await db.collection("calculations").add({
 uid,
 type: "margincore_premium_verdict",
 sector,
 expectedCost,
 createdAt: new Date().toISOString(),
 });
 } catch {
 // Silent
 }
}

async function logCalculation(
 uid: string,
 input: PremiumCalcRequest,
): Promise<void> {
 try {
 const db = getAdminFirestore();
 if (!db) return;

 await db.collection("calculations").add({
 uid,
 type: "margincore_premium",
 expectedCost: input.expectedCost,
 volatilityPercent: input.volatilityPercent,
 currency: input.currency,
 createdAt: new Date().toISOString(),
 });
 } catch {
 // Silent
 }
}
