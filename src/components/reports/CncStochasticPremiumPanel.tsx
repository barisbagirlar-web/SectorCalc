"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { useProSubscription } from "@/lib/features/subscription/use-pro-subscription";
import { getCurrentUserIdToken } from "@/lib/infrastructure/firebase/auth";
import {
 calculatePremium,
 type PremiumCalcResponse,
} from "@/lib/infrastructure/actions/calculate-premium";
import type { MarginCoreEngineOutput } from "@/lib/core/math/stochastic-engine";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CncStochasticPremiumPanelProps {
 /** Whether the free-tier calculation has been completed */
 freeComplete: boolean;
 /** CNC-specific inputs from the free tool */
 inputs: {
 partComplexity: string;
 material: string;
 quantity: number;
 leadTimeDays: number;
 currency: string;
 };
 /** Naive cost calculated by the free tool (base cost before risk) */
 naiveCost: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Derive volatility % from CNC inputs (client-side heuristic) */
function deriveVolatility(inputs: CncStochasticPremiumPanelProps["inputs"]): number {
 let vol = 18; // base CNC sector volatility %
 if (inputs.partComplexity === "Complex") vol += 8;
 else if (inputs.partComplexity === "Moderate") vol += 3;
 if (inputs.material === "Alloy / Titanium") vol += 5;
 if (inputs.leadTimeDays <= 5) vol += 6;
 else if (inputs.leadTimeDays <= 14) vol += 2;
 return vol;
}

/** Derive CBAM emission factor from material (0–1 scale) */
function deriveEmissionFactor(material: string): number {
 switch (material) {
 case "Alloy / Titanium": return 0.6;
 case "Steel": return 0.5;
 case "Aluminium": return 0.3;
 case "Brass": return 0.2;
 default: return 0.15; // plastics, composites, etc.
 }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CncStochasticPremiumPanel({
 freeComplete,
 inputs,
 naiveCost,
}: CncStochasticPremiumPanelProps) {
 const { isPro, loading: subscriptionLoading } = useProSubscription();
 const [response, setResponse] = useState<PremiumCalcResponse | null>(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const runCalculation = useCallback(async () => {
 if (!freeComplete || !naiveCost) {
 setError("Please complete the free calculator first.");
 return;
 }

 setLoading(true);
 setError(null);
 setResponse(null);

 try {
 const idToken = await getCurrentUserIdToken();
 if (!idToken) {
 setError("Not logged in. Please sign in first.");
 setLoading(false);
 return;
 }

 const result = await calculatePremium({
 idToken,
 expectedCost: naiveCost,
 volatilityPercent: deriveVolatility(inputs),
 emissionFactor: deriveEmissionFactor(inputs.material),
 currency: inputs.currency || "USD",
 });

 setResponse(result);

 if (!result.success && result.error === "PRO_REQUIRED") {
 setError("This calculation is only available to SectorCalc Pro members.");
 }
 } catch {
 setError("An error occurred during calculation. Please try again.");
 } finally {
 setLoading(false);
 }
 }, [freeComplete, naiveCost, inputs]);

 // -------------------------------------------------------------------------
 // Render: Loading subscription check
 // -------------------------------------------------------------------------

 if (subscriptionLoading) {
 return (
 <div className="mt-8 rounded-sm border border-border-subtle bg-bg-subtle p-6">
 <p className="text-sm text-text-secondary">Checking subscription status…</p>
 </div>
 );
 }

 // -------------------------------------------------------------------------
 // Render: Non-Pro user — paywall
 // -------------------------------------------------------------------------

 if (!isPro) {
 return (
 <div className="ind-os-panel mt-4">
<p className="ind-os-panel__label label-badge">Premium Stochastic Engine</p>
<h3 className="font-display mt-1 text-sm font-semibold text-premium-velvet">
P90 Safe Price Calculation
</h3>
<p className="mt-2 text-xs leading-relaxed text-body-charcoal">
Calculate real cost risk using stochastic standard deviation and
Z-score (P90). View base cost, risk buffer, and safe quote price.
</p>
 <div className="mt-3 border border-technical-gray p-2">
 <dl className="space-y-1 text-xs">
 {[
"P90 Safe Price",
"Risk Buffer",
"CBAM Carbon Shock",
"Sensitivity Matrix",
"Verdict",
 ].map((label) => (
 <div key={label} className="flex justify-between">
 <dt className="text-body-charcoal">{label}</dt>
 <dd className="data-value text-body-charcoal">Pro</dd>
 </div>
 ))}
 </dl>
 </div>
 <Button
 href="/pro-tools"
 variant="secondary"
 size="sm"
 className="mt-3 w-full"
 >
 {"Go to SectorCalc Pro →"}
 </Button>
 </div>
 );
 }

 // -------------------------------------------------------------------------
 // Render: Pro user — calculation panel
 // -------------------------------------------------------------------------

 return (
 <div className="ind-os-panel mt-4">
<p className="ind-os-panel__label label-badge">Stochastic Calculation Engine</p>
<h3 className="font-display mt-2 text-lg font-bold text-text-primary sm:text-xl">
P90 Safe Price Analysis
</h3>

 {!freeComplete && (
 <p className="mt-3 text-sm text-text-secondary">
 Please complete the free calculator above first.
 </p>
 )}

 {freeComplete && !response && (
 <Button
 variant="primary"
 size="md"
 className="mt-4"
 onClick={runCalculation}
 disabled={loading}
 >
 {loading ? "Calculating…" : "Run Stochastic Analysis"}
 </Button>
 )}

 {error && (
 <div className="mt-4 border border-border-subtle status-crit-bg p-4 text-sm text-crit-red" role="alert">
 {error}
 </div>
 )}

 {/* Result display */}
 {response?.success && response.output && (
 <EngineResultDisplay
 output={response.output}
 currency={inputs.currency || "USD"}
 txtReport={response.txt}
 />
 )}

 {/* Error TXT display */}
 {response && !response.success && (
 <pre className="mt-4 overflow-x-auto border border-border-subtle bg-base-white p-4 text-xs leading-relaxed text-crit-red whitespace-pre-wrap" role="alert">
 {response.txt}
 </pre>
 )}
 </div>
 );
}

// ---------------------------------------------------------------------------
// Result display sub-component
// ---------------------------------------------------------------------------

interface EngineResultDisplayProps {
 output: MarginCoreEngineOutput;
 currency: string;
 txtReport: string;
}

function EngineResultDisplay({
 output,
 currency,
 txtReport,
}: EngineResultDisplayProps) {
 const symbol =
 currency === "USD"
 ? "$"
 : currency === "EUR"
 ? "€"
 : currency === "TRY"
 ? "₺"
 : currency;

 const fmt = (n: number) =>
 `${symbol}${Math.abs(n).toLocaleString("en-US", {
 minimumFractionDigits: 2,
 maximumFractionDigits: 2,
 })}`;

 const { p90, cbam, scenarios, verdict, verdictReason } = output;

 const bufferPercent =
 p90.expected > 0 ? (p90.buffer / p90.expected) * 100 : 0;

 const verdictColor =
 verdict === "accept"
 ? "text-safe-green status-safe"
 : verdict === "caution"
 ? "text-warn-amber status-warn"
 : "text-crit-red status-crit";

 const verdictLabel =
 verdict === "accept"
? "ACCEPT"
 : verdict === "caution"
? "WARNING"
 : "REJECT";

 const verdictBg =
 verdict === "accept"
 ? "border-border-subtle status-safe-bg"
 : verdict === "caution"
 ? "border-border-subtle status-warn-bg"
 : "border-border-subtle status-crit-bg";

 return (
 <div className="mt-4 space-y-6">
 {/* ── Primary metrics: Base Cost · Risk Buffer · P90 Safe Price ── */}
 <div className="grid gap-4 sm:grid-cols-3">
 {/* Base Cost */}
 <div className="rounded-sm border border-border-subtle bg-white p-4">
<p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
Base Cost
</p>
 <p className="mt-2 data-value text-xl font-bold text-text-primary">
 {fmt(p90.expected)}
 </p>
 <p className="mt-1 text-xs text-text-secondary">Raw base cost (risk-free)</p>
 </div>

 {/* Risk Buffer — status signal (risk metric) */}
 <div className="border border-border-subtle status-warn-bg p-4" data-status="warning">
<p className="text-xs font-semibold uppercase tracking-wider text-warn-amber">
Risk Buffer
</p>
 <p className="mt-2 data-value text-xl font-bold text-warn-amber">
 {fmt(p90.buffer)}
 </p>
 <p className="mt-1 text-xs text-text-secondary">
 +{bufferPercent.toFixed(1)}% of base (Z=1.28)
 </p>
 </div>

 {/* P90 Safe Price */}
 <div className="border border-border-subtle bg-base-white p-4">
 <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
 P90 Safe Price
 </p>
 <p className="mt-2 data-value text-xl font-bold text-text-primary">
 {fmt(p90.safe)}
 </p>
 <p className="mt-1 text-xs text-text-secondary">90% confidence interval</p>
 </div>
 </div>

 {/* ── CBAM Carbon Liability ── */}
 {cbam.carbonLiability > 0 && (
 <div className="rounded-sm border border-border-subtle bg-white p-4">
 <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
 CBAM Carbon Liability
 </p>
 <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-3">
 <div className="flex justify-between sm:flex-col">
 <dt className="text-text-secondary">Carbon Surcharges</dt>
 <dd className="data-value font-semibold text-text-primary">
 {fmt(cbam.carbonLiability)}
 </dd>
 </div>
 <div className="flex justify-between sm:flex-col">
 <dt className="text-text-secondary">CBAM Total</dt>
 <dd className="data-value font-semibold text-text-primary">
 {fmt(cbam.totalWithCBAM)}
 </dd>
 </div>
 </dl>
 </div>
 )}

 {/* ── Sensitivity scenarios (compact table) ── */}
 <div className="rounded-sm border border-border-subtle bg-white p-4">
 <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
 Sensitivity Matrix (3 Scenarios)
 </p>
 <div className="overflow-x-auto">
 <table className="w-full text-xs sm:text-sm">
 <thead>
 <tr className="border-b border-border-subtle text-left">
 <th className="pb-2 font-semibold text-text-secondary">Scenario</th>
 <th className="pb-2 font-semibold text-text-secondary text-right">
 Δ Cost
 </th>
 <th className="pb-2 font-semibold text-text-secondary text-right">
 P90 Adjusted
 </th>
 </tr>
 </thead>
 <tbody>
 {scenarios.map((s) => (
 <tr key={s.label} className="border-b border-border-subtle/50">
 <td className="py-2 text-text-primary">{s.label}</td>
 <td className="py-2 text-right data-value text-warn-amber" data-status="warning">
 +{s.deltaPercent.toFixed(1)}%
 </td>
 <td className="py-2 text-right data-value font-semibold text-text-primary">
 {fmt(s.adjustedCost)}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* ── Verdict ── */}
 <div className={`rounded-sm border p-4 ${verdictBg}`}>
 <div className="flex items-center justify-between">
 <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
 Verdict
 </p>
 <span className={`text-sm font-bold ${verdictColor}`} data-status={verdict === "accept" ? "safe" : verdict === "caution" ? "warning" : "critical"}>
 {verdictLabel}
 </span>
 </div>
 <p className="mt-2 text-sm leading-relaxed text-text-secondary">
 {verdictReason}
 </p>
 </div>

 {/* ── Full TXT Report (collapsible) ── */}
 <details className="rounded-sm border border-border-subtle bg-white p-4">
 <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-text-secondary select-none">
 Full Audit Report (TXT)
 </summary>
 <pre className="mt-3 overflow-x-auto text-xs leading-relaxed text-text-primary whitespace-pre-wrap">
 {txtReport}
 </pre>
 </details>

 {/* ── Legal disclaimer ── */}
 <p className="text-xs leading-relaxed text-text-secondary">
This output is a technical simulation. It does not constitute financial, legal, or engineering advice. Verify results before making business decisions.
 </p>
 </div>
 );
}