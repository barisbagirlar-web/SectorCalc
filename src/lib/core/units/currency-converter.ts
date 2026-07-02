export interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

let cachedRates: ExchangeRates | null = null;
let fetchPromise: Promise<ExchangeRates | null> | null = null;

export async function fetchExchangeRates(): Promise<ExchangeRates | null> {
  if (cachedRates) {
    return cachedRates;
  }
  
  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = fetch('/api/exchange-rates')
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch rates');
      return res.json();
    })
    .then((data: ExchangeRates) => {
      cachedRates = data;
      fetchPromise = null;
      return data;
    })
    .catch((err) => {
      console.error('[CurrencyConverter] Error fetching rates:', err);
      fetchPromise = null;
      return null;
    });

  return fetchPromise;
}

export function convertCurrency(
  value: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): number {
  const fromRate = rates[fromCurrency.toUpperCase()];
  const toRate = rates[toCurrency.toUpperCase()];

  if (!fromRate || !toRate) {
    console.warn(`[CurrencyConverter] Missing rate for ${fromCurrency} or ${toCurrency}. Returning original value.`);
    return value;
  }

  // Convert from 'fromCurrency' to USD (base), then to 'toCurrency'
  const valueInBase = value / fromRate;
  return valueInBase * toRate;
}

import { convertValueFromCanonical } from "@/lib/core/units/canonical-unit-normalizer";
import { convertUnits } from "@/lib/core/units/unit-conversions";

export function normalizeValue(
  value: number,
  sourceUnit: string,
  targetUnit: string,
  dimension: string,
  rates?: Record<string, number>
): number {
  if (dimension === "currency" && rates) {
    return convertCurrency(value, sourceUnit, targetUnit, rates);
  }
  
  // Try physical unit conversion (returns ok and value if successful)
  const res = convertUnits(value, sourceUnit, targetUnit);
  if (res.ok) {
    return res.value;
  }
  
  return value;
}
