// ============================================================
// src/utils/math/irr.ts
// SectorCalc - IRR Hesaplama Motoru (Claude Opus)
// Bisection + Newton-Raphson hibrit algoritmasi.
// Tum aritmetik SafeMath uzerinden gecer.
// Hata durumunda 0 degil, null doner.
// ============================================================

import { SafeMath, SafeNumber } from "./safeMath";

// ── Tolerans & limit sabitleri ─────────────────────────────
const TOLERANCE    = 1e-10;
const MAX_ITER_NR  = 1000;   // Newton-Raphson max iterasyon
const MAX_ITER_BIS = 300;    // Bisection max iterasyon
const RATE_MIN     = -0.999; // %−99.9 alt sinir
const RATE_MAX     = 100.0;  // %10.000 ust sinir

// ── NPV calc (SafeMath ile) ──────────────────────────────
function npv(cashFlows: number[], rate: number): number {
  let sum = 0;
  for (let i = 0; i < cashFlows.length; i++) {
    const discount = SafeMath.pow(1 + rate, i);
    if (discount === null || discount === 0) return Infinity;
    const term = SafeMath.divide(cashFlows[i], discount);
    if (term === null) return Infinity;
    sum += term;
  }
  return sum;
}

// ── NPV'nin sayisal turevi (central difference) ────────────
function npvDerivative(cashFlows: number[], rate: number): number {
  const h = 1e-6;
  const f1 = npv(cashFlows, rate + h);
  const f0 = npv(cashFlows, rate - h);
  if (!isFinite(f1) || !isFinite(f0)) return 0;
  return (f1 - f0) / (2 * h);
}

// ── Bisection: garantili ama yavas ────────────────────────
function bisection(
  cashFlows: number[],
  low: number,
  high: number
): number | null {
  let lo = low;
  let hi = high;

  for (let i = 0; i < MAX_ITER_BIS; i++) {
    const mid = (lo + hi) / 2;
    const fMid = npv(cashFlows, mid);

    if (Math.abs(fMid) < TOLERANCE) return mid;
    if (!isFinite(fMid)) return null;

    const fLo = npv(cashFlows, lo);
    if (fLo * fMid < 0) hi = mid;
    else lo = mid;

    // Aralik yeterince daraldiysa cik
    if (Math.abs(hi - lo) < TOLERANCE) return (lo + hi) / 2;
  }

  return (lo + hi) / 2;
}

// ── Gecerli bisection araligi bul ─────────────────────────
function findBracket(
  cashFlows: number[]
): [number, number] | null {
  let lo = RATE_MIN;
  let hi = 0.5; // %50'den basla

  // Isaret degisimi ara (lo tarafi negatif, hi tarafi pozitif ya da tersi)
  for (let attempt = 0; attempt < 200; attempt++) {
    const fLo = npv(cashFlows, lo);
    const fHi = npv(cashFlows, hi);

    if (isFinite(fLo) && isFinite(fHi) && fLo * fHi < 0) {
      return [lo, hi];
    }

    // Araligi genislet
    if (hi < RATE_MAX) hi = Math.min(hi * 2 + 0.1, RATE_MAX);
    else break;
  }

  // Sag taraftan da tara
  lo = -0.5;
  hi = RATE_MAX;
  for (let step = 0; step < 500; step++) {
    const mid = lo + (step / 500) * (hi - lo);
    const fMid = npv(cashFlows, mid);
    const fLo  = npv(cashFlows, lo);
    if (isFinite(fMid) && isFinite(fLo) && fLo * fMid < 0) {
      return [lo, mid];
    }
  }

  return null; // Bu nakit akisi icin IRR yok
}

// ── ANA FONKSIYON ─────────────────────────────────────────
export function calculateIRR(
  cashFlows: number[],
  _guess = 0.1  // eski API ile uyum icin alinir ama kullanilmaz
): SafeNumber {

  // 1. Giris dogrulama
  if (!cashFlows || cashFlows.length < 2) return null;

  // Tum valuelerin gecerli sayi oldugunu dogrula
  if (cashFlows.some((cf) => !isFinite(cf) || isNaN(cf))) return null;

  const hasPositive = cashFlows.some((cf) => cf > 0);
  const hasNegative = cashFlows.some((cf) => cf < 0);
  if (!hasPositive || !hasNegative) return null; // IRR matematiksel olarak anlamsiz

  // 2. Aralik bul
  const bracket = findBracket(cashFlows);
  if (!bracket) return null;
  const [lo, hi] = bracket;

  // 3. Newton-Raphson ile hizli yakinsama dene
  let rate = (lo + hi) / 2; // Orta noktadan basla

  for (let i = 0; i < MAX_ITER_NR; i++) {
    const f = npv(cashFlows, rate);

    if (Math.abs(f) < TOLERANCE) return rate;
    if (!isFinite(f)) break; // NR patladi, bisection'a gec

    const df = npvDerivative(cashFlows, rate);
    if (Math.abs(df) < 1e-14) break; // Turev sifir, NR ise yaramaz

    const newRate = rate - f / df;

    // Sinir disina ciktiysa bisection'a birak
    if (!isFinite(newRate) || newRate < RATE_MIN || newRate > RATE_MAX) break;

    rate = newRate;
  }

  // 4. Bisection ile garantili sonuc al
  const result = bisection(cashFlows, lo, hi);
  if (result === null) return null;

  // 5. Son dogrulama: sonuc makul mu?
  const verification = npv(cashFlows, result);
  if (Math.abs(verification) > 1e-4) return null; // Yakinsayamadi

  return result;
}

// ── NPV fonksiyonunu da disa ac (baska calculationlarda lazim olur) ──
export function calculateNPV(
  cashFlows: number[],
  rate: number
): SafeNumber {
  if (!cashFlows || cashFlows.length === 0) return null;
  if (!isFinite(rate)) return null;
  if (cashFlows.some((cf) => !isFinite(cf) || isNaN(cf))) return null;

  const result = npv(cashFlows, rate);
  if (!isFinite(result)) return null;
  return result;
}
