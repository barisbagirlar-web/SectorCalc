/**
 * MarginCore system identity — user-facing terminology & risk-driver mapping.
 * Internal code names (calculatorId, runCalculator) unchanged.
 */

export const MARGINCORE_TERMS = {
 riskAnalyzer: "Risk Analyzer",
 riskAnalyzers: "Risk Analyzers",
 analysis: "Analysis",
 runAnalysis: "Run margin leak analysis",
 riskVariable: "Risk Variable",
 riskVariables: "Risk Variables",
 decisionVerdict: "Decision Verdict",
 decisionVerdicts: "Decision Verdicts",
 safeBidLimit: "Safe Bid / Operational Limit",
 exposureBaseline: "Exposure baseline (pre-P90)",
 marginLeakBuffer: "Margin leak buffer (P90)",
 whyLosingMargin:
 "Surfaces why margin erodes — not what to charge. Verdicts are Accept / Reprice / Reject against P90 thresholds.",
 freePreCheck:
 "Early margin-leak signals only. No safe bid floor or final verdict on the free tier.",
 premiumVerdict:
 "P90 threshold verdict — where hidden drivers push you into loss territory.",
} as const;

/** Map tool input ids → margin leak driver (display only). */
const RISK_DRIVER_BY_INPUT_ID: Record<string, string> = {
 setupTime: "Setup time margin leak — fixed cost dilution across quantity",
 setupMinutes: "Setup time margin leak — fixed cost dilution across quantity",
 cycleTime: "Cycle time efficiency leak — run-rate exposure per unit",
 cycleMinutesPerPart: "Cycle time efficiency leak — run-rate exposure per unit",
 quantity: "Volume dilution driver — setup burden vs run size",
 machineRate: "Machine rate exposure — hourly burn under delay risk",
 machineHourlyCost: "Machine rate exposure — hourly burn under delay risk",
 hourlyRate: "Machine rate exposure — hourly burn under delay risk",
 materialCost: "Material volatility driver — COGS drift vs quote",
 materialCostPerPart: "Material volatility driver — per-part COGS drift",
 toolCost: "Tooling amortization leak — non-recurring cost left in margin",
 toolingCost: "Tooling amortization leak — non-recurring cost left in margin",
 sellingPrice: "Bid ceiling gap driver — revenue vs loaded cost",
 laborRate: "Labor rate leak — wage burden under schedule slip",
 laborHours: "Labor hours leak — time overrun vs estimate",
 wasteRate: "Yield / waste leak — effective COGS inflation",
 scrapRate: "Scrap margin leak — material loss not in headline quote",
 returnRate: "Return erosion driver — post-sale margin give-back",
 platformFeeRate: "Channel fee leak — marketplace take from gross",
 paymentFeeRate: "Payment processing leak — net revenue erosion",
 shippingCost: "Fulfillment leak — delivery cost not recovered",
 overheadPercent: "Overhead absorption leak — fixed cost allocation gap",
 targetMargin: "Target margin stress — ambition vs achievable floor",
 contingencyPercent: "Contingency adequacy driver — buffer vs sector P90",
 leadTimeDays: "Schedule compression leak — rush / overtime risk",
 partComplexity: "Complexity volatility driver — rework probability",
 material: "Material class risk driver — supplier & compliance exposure",
};

const OUTPUT_LABEL_REMAP: Record<string, string> = {
 Results: MARGINCORE_TERMS.decisionVerdicts,
 Result: MARGINCORE_TERMS.decisionVerdict,
 Price: MARGINCORE_TERMS.safeBidLimit,
 "Naive Cost": MARGINCORE_TERMS.exposureBaseline,
 "Naive price": MARGINCORE_TERMS.exposureBaseline,
 "Naive Price": MARGINCORE_TERMS.exposureBaseline,
 "P90 safe price": MARGINCORE_TERMS.safeBidLimit,
 "Safe Bid Price": MARGINCORE_TERMS.safeBidLimit,
 "Margin risk buffer": MARGINCORE_TERMS.marginLeakBuffer,
 "Risk Buffer (P90)": MARGINCORE_TERMS.marginLeakBuffer,
};

export function getRiskDriverForInput(inputId: string, fallbackLabel?: string): string {
 const mapped = RISK_DRIVER_BY_INPUT_ID[inputId];
 if (mapped) {
 return mapped;
 }
 if (fallbackLabel) {
 return `${fallbackLabel} — margin exposure driver`;
 }
 return "Margin exposure driver — maps to stochastic P90 threshold";
}

export function remapUserFacingLabel(label: string): string {
 return OUTPUT_LABEL_REMAP[label] ?? label.replace(/\bPrice\b/g, "Safe bid limit").replace(/\bResult\b/g, "Verdict");
}
