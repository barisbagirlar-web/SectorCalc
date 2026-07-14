import { SUPPORTED_CURRENCIES } from "./form-render-helpers";
import { GLOBAL_CURRENCY_CODES } from "./universal-unit-catalog";

/**
 * Backward-compatible runtime extension for the universal form's currency
 * selector. Existing helper imports retain their API while the rendered list is
 * expanded to the governed global catalog. This module does not perform FX
 * conversion; it only changes the declared monetary denomination.
 */
const mutableCurrencies = SUPPORTED_CURRENCIES as unknown as string[];
const existing = new Set(mutableCurrencies);
for (const code of GLOBAL_CURRENCY_CODES) {
  if (!existing.has(code)) {
    mutableCurrencies.push(code);
    existing.add(code);
  }
}
