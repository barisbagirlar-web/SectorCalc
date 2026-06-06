"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { useProSubscription } from "@/lib/subscription/use-pro-subscription";
import { getCurrentUserIdToken } from "@/lib/firebase/auth";
import {
  calculatePremium,
  type PremiumCalcResponse,
} from "@/lib/actions/calculate-premium";
import type { MarginCoreEngineOutput } from "@/lib/math/stochastic-engine";

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
      setError("Lütfen önce ücretsiz hesaplama aracını tamamlayın.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const idToken = await getCurrentUserIdToken();
      if (!idToken) {
        setError("Giriş yapılmamış. Lütfen önce giriş yapın.");
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
        setError("Bu hesaplama yalnızca SectorCalc Pro üyelerine açıktır.");
      }
    } catch {
      setError("Hesaplama sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }, [freeComplete, naiveCost, inputs]);

  // -------------------------------------------------------------------------
  // Render: Loading subscription check
  // -------------------------------------------------------------------------

  if (subscriptionLoading) {
    return (
      <div className="mt-8 rounded-2xl border border-border-subtle bg-bg-subtle p-6">
        <p className="text-sm text-slate">Abonelik durumu kontrol ediliyor…</p>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render: Non-Pro user — paywall
  // -------------------------------------------------------------------------

  if (!isPro) {
    return (
      <div className="mt-8 rounded-2xl border border-amber/30 bg-gradient-to-br from-deep-navy to-deep-navy/95 p-6 text-white sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber">
          Premium Stokastik Motor
        </p>
        <h3 className="mt-2 text-lg font-bold sm:text-xl">
          P90 Güvenli Fiyat Hesabı
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          Stokastik standart sapma ve Z-skoru (P90) ile gerçek maliyet riskini
          hesaplayın. Temel maliyet, risk tamponu ve güvenli teklif fiyatını
          görün.
        </p>
        <div className="mt-4 rounded-lg bg-white/5 p-4">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-secondary">P90 Güvenli Fiyat</dt>
              <dd className="font-mono text-amber">Pro</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Risk Tamponu</dt>
              <dd className="font-mono text-amber">Pro</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">CBAM Karbon Şoku</dt>
              <dd className="font-mono text-amber">Pro</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Hassasiyet Matrisi</dt>
              <dd className="font-mono text-amber">Pro</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Karar (Verdict)</dt>
              <dd className="font-mono text-amber">Pro</dd>
            </div>
          </dl>
        </div>
        <Button
          href="/pricing"
          variant="secondary"
          size="md"
          className="mt-5 w-full"
        >
          {"SectorCalc Pro'ya Geç →"}
        </Button>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render: Pro user — calculation panel
  // -------------------------------------------------------------------------

  return (
    <div className="mt-8 rounded-2xl border border-border-subtle bg-bg-subtle p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent-teal">
        Stokastik Hesaplama Motoru
      </p>
      <h3 className="mt-2 text-lg font-bold text-text-primary sm:text-xl">
        P90 Güvenli Fiyat Analizi
      </h3>

      {!freeComplete && (
        <p className="mt-3 text-sm text-slate">
          Lütfen önce yukarıdaki ücretsiz hesaplama aracını tamamlayın.
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
          {loading ? "Hesaplanıyor…" : "Stokastik Analizi Çalıştır"}
        </Button>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-soft-red/10 p-4 text-sm text-soft-red">
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
        <pre className="mt-4 overflow-x-auto rounded-lg bg-bg-primary p-4 text-xs leading-relaxed text-soft-red">
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
      ? "text-emerald"
      : verdict === "caution"
        ? "text-amber"
        : "text-soft-red";

  const verdictLabel =
    verdict === "accept"
      ? "KABUL"
      : verdict === "caution"
        ? "DİKKAT"
        : "REDDET";

  const verdictBg =
    verdict === "accept"
      ? "border-emerald/30 bg-emerald/5"
      : verdict === "caution"
        ? "border-amber/30 bg-amber/5"
        : "border-soft-red/30 bg-soft-red/5";

  return (
    <div className="mt-4 space-y-6">
      {/* ── Primary metrics: Temel Maliyet · Risk Tamponu · P90 Güvenli Fiyat ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Temel Maliyet */}
        <div className="rounded-xl border border-border-subtle bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate">
            Temel Maliyet
          </p>
          <p className="mt-2 font-mono text-xl font-bold text-text-primary">
            {fmt(p90.expected)}
          </p>
          <p className="mt-1 text-xs text-slate">Ham baz maliyet (risksiz)</p>
        </div>

        {/* Risk Tamponu */}
        <div className="rounded-xl border border-amber/30 bg-amber/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber">
            Risk Tamponu
          </p>
          <p className="mt-2 font-mono text-xl font-bold text-amber">
            {fmt(p90.buffer)}
          </p>
          <p className="mt-1 text-xs text-slate">
            +{bufferPercent.toFixed(1)}% of base (Z=1.28)
          </p>
        </div>

        {/* P90 Güvenli Fiyat */}
        <div className="rounded-xl border border-deep-navy/20 bg-deep-navy/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-deep-navy">
            P90 Güvenli Fiyat
          </p>
          <p className="mt-2 font-mono text-xl font-bold text-deep-navy">
            {fmt(p90.safe)}
          </p>
          <p className="mt-1 text-xs text-slate">%90 güven aralığı</p>
        </div>
      </div>

      {/* ── CBAM Carbon Liability ── */}
      {cbam.carbonLiability > 0 && (
        <div className="rounded-xl border border-border-subtle bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate">
            CBAM Karbon Yükümlülüğü
          </p>
          <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-3">
            <div className="flex justify-between sm:flex-col">
              <dt className="text-slate">Karbon Surcharges</dt>
              <dd className="font-mono font-semibold text-text-primary">
                {fmt(cbam.carbonLiability)}
              </dd>
            </div>
            <div className="flex justify-between sm:flex-col">
              <dt className="text-slate">CBAM Sonrası Toplam</dt>
              <dd className="font-mono font-semibold text-accent-teal">
                {fmt(cbam.totalWithCBAM)}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {/* ── Sensitivity scenarios (compact table) ── */}
      <div className="rounded-xl border border-border-subtle bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate mb-3">
          Hassasiyet Matrisi (3 Senaryo)
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left">
                <th className="pb-2 font-semibold text-slate">Senaryo</th>
                <th className="pb-2 font-semibold text-slate text-right">
                  Δ Maliyet
                </th>
                <th className="pb-2 font-semibold text-slate text-right">
                  P90 Ayarlı
                </th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((s) => (
                <tr key={s.label} className="border-b border-border-subtle/50">
                  <td className="py-2 text-text-primary">{s.label}</td>
                  <td className="py-2 text-right font-mono text-amber">
                    +{s.deltaPercent.toFixed(1)}%
                  </td>
                  <td className="py-2 text-right font-mono font-semibold text-text-primary">
                    {fmt(s.adjustedCost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Verdict ── */}
      <div className={`rounded-xl border p-4 ${verdictBg}`}>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate">
            Karar (Verdict)
          </p>
          <span className={`text-sm font-bold ${verdictColor}`}>
            {verdictLabel}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate">
          {verdictReason}
        </p>
      </div>

      {/* ── Full TXT Report (collapsible) ── */}
      <details className="rounded-xl border border-border-subtle bg-white p-4">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-slate select-none">
          Tam Denetim Raporu (TXT)
        </summary>
        <pre className="mt-3 overflow-x-auto text-xs leading-relaxed text-text-primary whitespace-pre-wrap">
          {txtReport}
        </pre>
      </details>

      {/* ── Legal disclaimer ── */}
      <p className="text-xs leading-relaxed text-slate">
        Bu çıktı teknik bir simülasyondur. Finansal, hukuki veya mühendislik
        tavsiyesi niteliği taşımaz. İş kararları almadan önce sonuçları
        doğrulayınız.
      </p>
    </div>
  );
}