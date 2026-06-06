/**
 * MarginCore Premium Calculation — Server Action
 *
 * Server-side calculation entry point that protects the stochastic math
 * engine behind a Pro-subscription gate. Returns structured TXT strings
 * (not JSON) to prevent direct formula scraping from the browser.
 *
 * Auth flow:
 *   1. Client sends Firebase ID token
 *   2. Server verifies via firebase-admin SDK
 *   3. Checks Firestore users/{uid} for active subscription
 *   4. Runs stochastic calculation
 *   5. Returns TXT-formatted report
 */

"use server";

import { getAuth } from "firebase-admin/auth";
import {
  runEngine,
  formatEngineReport,
  type MarginCoreEngineOutput,
} from "@/lib/math/stochastic-engine";
import { getFirebaseAdminApp, getAdminFirestore } from "@/lib/firebase/admin";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Client-submitted input for the premium calculation.
 */
export interface PremiumCalcRequest {
  /** Firebase ID token from the client (for server-side auth verification) */
  idToken: string;
  /** Naive (base) cost estimate */
  expectedCost: number;
  /** Cost volatility as a percentage (e.g. 18 for 18%) */
  volatilityPercent: number;
  /** CBAM emission intensity (0.0 = clean, 1.0 = max dirty) */
  emissionFactor: number;
  /** Currency code */
  currency: string;
}

/**
 * Server action return value.
 * Always includes a TXT-formatted string for display/export.
 */
export interface PremiumCalcResponse {
  success: boolean;
  txt: string;
  output?: MarginCoreEngineOutput;
  error?: string;
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

/**
 * Verify the current user has an active Pro subscription.
 * Returns the uid if authorized, or null otherwise.
 */
async function getAuthorizedUser(idToken: string): Promise<string | null> {
  try {
    const app = getFirebaseAdminApp();
    if (!app) return null;

    const decoded = await getAuth(app).verifyIdToken(idToken);
    if (!decoded || !decoded.uid) return null;

    // Check Firestore for active subscription
    const db = getAdminFirestore();
    if (!db) return null;

    const userDoc = await db.collection("users").doc(decoded.uid).get();
    if (!userDoc.exists) return null;

    const userData = userDoc.data();
    const subscription = userData?.subscription;
    const status = subscription?.status;

    if (status !== "active") return null;

    return decoded.uid;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Server Action
// ---------------------------------------------------------------------------

/**
 * Run the MarginCore premium stochastic calculation.
 *
 * - Requires active Pro subscription (checked server-side)
 * - Returns structured TXT report + raw engine output
 * - All calculation happens on the server; formulas never reach the browser
 */
export async function calculatePremium(
  request: PremiumCalcRequest,
): Promise<PremiumCalcResponse> {
  // 1. Auth gate — verify Firebase ID token + check Pro subscription
  if (!request.idToken) {
    return {
      success: false,
      txt: "HATA: Giriş yapılmamış. Bu hesaplama yalnızca SectorCalc Pro üyelerine açıktır.",
      error: "NO_TOKEN",
    };
  }

  const uid = await getAuthorizedUser(request.idToken);
  if (!uid) {
    return {
      success: false,
      txt: "HATA: Yetki hatası. Bu hesaplama yalnızca SectorCalc Pro üyelerine açıktır.\n\nLütfen giriş yapın veya Pro aboneliğinizi aktifleştirin.",
      error: "PRO_REQUIRED",
    };
  }

  // 2. Input validation
  if (
    !request.expectedCost ||
    request.expectedCost <= 0 ||
    !request.volatilityPercent ||
    request.volatilityPercent <= 0
  ) {
    return {
      success: false,
      txt: "HATA: Geçersiz giriş. Beklenen maliyet > 0 ve volatilite > 0 olmalıdır.",
      error: "INVALID_INPUT",
    };
  }

  // 3. Run stochastic engine
  const output = runEngine(
    request.expectedCost,
    request.volatilityPercent,
    request.emissionFactor ?? 0,
  );

  // 4. Format as Big Four report TXT
  const txt = formatEngineReport(output, request.currency || "USD");

  // 5. Log calculation (fire-and-forget)
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

/**
 * Log the calculation to Firestore for audit/analytics.
 */
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
    // Silent — analytics logging must not throw
  }
}