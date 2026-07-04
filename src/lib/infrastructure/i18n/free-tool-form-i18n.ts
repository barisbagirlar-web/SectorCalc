/**
 * Free tool form i18n - permanently purged.
 */

export interface LocalizedFieldDisplay {
  label: string;
  placeholder: string;
  helper: string | undefined;
}

export function resolveFreeFormLabel(_key: string, _locale: string, fallback: string): string {
  return fallback;
}

export function resolveFreeToolFieldDisplay(
  _slug: string,
  _key: string,
  _locale: string,
  fallback: LocalizedFieldDisplay,
): LocalizedFieldDisplay {
  return fallback;
}

export function resolveSmartFormDecisionGoal(
  _slug: string,
  _locale: string,
  fallback: string,
): string {
  return fallback;
}

export function readFreeToolUiString(
  _locale: string,
  _key: string,
): string | undefined {
  return undefined;
}
