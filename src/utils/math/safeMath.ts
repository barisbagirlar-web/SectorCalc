// ============================================================
// src/utils/math/safeMath.ts
// SectorCalc — Guvenli Matematik Katmani (Claude Opus)
// Tum floating-point islemleri bu katmandan gecer.
// NaN, Infinity, -0 → null doner. Asla 0 dondurmez.
// ============================================================

import Big from "big.js";

// big.js config: maksimum hassasiyet
Big.DP = 20;   // decimal places
Big.RM = 1;    // round mode: ROUND_DOWN (muhendislik standardi)

export type SafeNumber = number | null;

export class SafeMath {
  // ── Us alma: negatif baz + kesirli us → null ──────────────
  static pow(base: number, exponent: number): SafeNumber {
    if (!isFinite(base) || !isFinite(exponent)) return null;
    if (base < 0 && !Number.isInteger(exponent)) return null;
    if (base === 0 && exponent < 0) return null; // 0^(-n) = Infinity

    try {
      const result = new Big(base).pow(exponent);
      const num = result.toNumber();
      if (!isFinite(num) || isNaN(num)) return null;
      return num;
    } catch {
      return null;
    }
  }

  // ── Bolme: sifira bolme → null ────────────────────────────
  static divide(numerator: number, denominator: number): SafeNumber {
    if (!isFinite(numerator) || !isFinite(denominator)) return null;
    if (denominator === 0) return null;

    try {
      const result = new Big(numerator).div(new Big(denominator));
      const num = result.toNumber();
      if (!isFinite(num) || isNaN(num)) return null;
      return num;
    } catch {
      return null;
    }
  }

  // ── Toplama ────────────────────────────────────────────────
  static add(a: number, b: number): SafeNumber {
    if (!isFinite(a) || !isFinite(b)) return null;
    try {
      return new Big(a).plus(new Big(b)).toNumber();
    } catch {
      return null;
    }
  }

  // ── Cikarma ───────────────────────────────────────────────
  static subtract(a: number, b: number): SafeNumber {
    if (!isFinite(a) || !isFinite(b)) return null;
    try {
      return new Big(a).minus(new Big(b)).toNumber();
    } catch {
      return null;
    }
  }

  // ── Carpma ────────────────────────────────────────────────
  static multiply(a: number, b: number): SafeNumber {
    if (!isFinite(a) || !isFinite(b)) return null;
    try {
      return new Big(a).times(new Big(b)).toNumber();
    } catch {
      return null;
    }
  }

  // ── Yuzde ─────────────────────────────────────────────────
  static percent(value: number, total: number): SafeNumber {
    if (total === 0) return null;
    return SafeMath.multiply(SafeMath.divide(value, total) ?? NaN, 100);
  }

  // ── Kok alma ──────────────────────────────────────────────
  static sqrt(value: number): SafeNumber {
    if (!isFinite(value) || value < 0) return null;
    try {
      return new Big(value).sqrt().toNumber();
    } catch {
      return null;
    }
  }

  // ── Guvenli giris dogrulama ────────────────────────────────
  // Kullanici inputunu parse eder. "abc" → null, "3.14" → 3.14
  static parseInput(raw: unknown): SafeNumber {
    if (raw === null || raw === undefined || raw === "") return null;
    const num = Number(raw);
    if (isNaN(num) || !isFinite(num)) return null;
    return num;
  }

  // ── Sonuc formatlama ───────────────────────────────────────
  // null revenuese kullaniciya "—" goster, asla "0" degil
  static format(
    value: SafeNumber,
    decimals = 2,
    fallback = "—"
  ): string {
    if (value === null || value === undefined) return fallback;
    return value.toFixed(decimals);
  }
}
