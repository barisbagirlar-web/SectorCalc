/**
 * Free tool form i18n - permanently purged.
 */

export function resolveFreeFormLabel(_key: string, _locale: string, fallback: string): string {
  return fallback;
}

export function resolveFreeToolFieldDisplay(
  _key: string,
  _locale: string,
  _fallbackLabel?: string,
  _fallbackPlaceholder?: string,
): { label: string; placeholder: string; helper: string } {
  return { label: _fallbackLabel ?? "", placeholder: _fallbackPlaceholder ?? "", helper: "" };
}

export function resolveSmartFormDecisionGoal(
  _key: string,
  _locale: string,
  _fallbackLabel?: string,
  _fallbackPlaceholder?: string,
): { label: string; placeholder: string; helper: string } {
  return { label: _fallbackLabel ?? "", placeholder: _fallbackPlaceholder ?? "", helper: "" };
}

export function readFreeToolUiString(
  _key: string,
  _locale: string,
  _fallbackLabel?: string,
  _fallbackPlaceholder?: string,
): { label: string; placeholder: string; helper: string } {
  return { label: _fallbackLabel ?? "", placeholder: _fallbackPlaceholder ?? "", helper: "" };
}
