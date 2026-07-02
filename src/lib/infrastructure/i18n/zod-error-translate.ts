/**
 * translateZodErrorMessage - Locale-aware Zod validation error translator.
 *
 * Standard Zod error messages contain dynamic numbers (min/max values).
 * This function extracts numbers, translates the text template, then
 * restores numbers in the correct position.
 *
 * Falls back to translateCalculatorPhrase for custom/schema-level messages.
 */

import { translateCalculatorPhrase } from "./calculator-phrase-translate";

const DYNAMIC_NUMBER_RE = /\b(\d+(?:[.,]\d+)?)\b/g;

/**
 * Replace dynamic numbers with placeholders, translate text, restore numbers.
 *
 * Example:
 *   "Number must be greater than or equal to 50"
 *   → template: "Number must be greater than or equal to {{VAL}}"
 *   → translate text (uses glossary)
 *   → restore 50
 */
function translateWithNumbers(text: string, locale: string): string {
  const numbers: string[] = [];
  const template = text.replace(DYNAMIC_NUMBER_RE, (match) => {
    numbers.push(match);
    return "{{VAL}}";
  });

  let translated = translateCalculatorPhrase(template, locale);

  let idx = 0;
  translated = translated.replace(/\{\{VAL\}\}/g, () => numbers[idx++] ?? "{{VAL}}");

  return translated;
}

/**
 * Translate a Zod validation error message into the target locale.
 *
 * - Handles standard Zod messages (Required, min/max range, type errors).
 * - Falls back to translateCalculatorPhrase for any other message.
 * - Returns the original message for "en" or empty strings.
 */
export function translateZodErrorMessage(message: string, locale: string): string {
  if (!message || locale === "en") {
    return message;
  }

  if (DYNAMIC_NUMBER_RE.test(message)) {
    DYNAMIC_NUMBER_RE.lastIndex = 0;
    return translateWithNumbers(message, locale);
  }

  return translateCalculatorPhrase(message, locale);
}
