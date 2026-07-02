/** Keys that represent durations - never format 0–1 as percent. */
const TIME_LIKE_KEY = /time|downtime|cycle|duration/i;

/** Keys that represent rotational speed. */
const SPEED_LIKE_KEY = /spindle_speed|rpm/i;

/** Keys that represent counts or frequencies - not ratios. */
const COUNT_LIKE_KEY = /frequency|passes|count/i;

const RATIO_LIKE_KEY =
  /ratio|percent|share|availability|performance|quality|margin|utilization/i;

function inferUnitSuffix(key: string): string | undefined {
  if (SPEED_LIKE_KEY.test(key)) {
    return "rpm";
  }
  if (TIME_LIKE_KEY.test(key)) {
    return "min";
  }
  return undefined;
}

export function shouldFormatGeneratedValueAsPercent(key: string, value: number): boolean {
  if (!(value > 0 && value <= 1)) {
    return false;
  }
  if (TIME_LIKE_KEY.test(key) || SPEED_LIKE_KEY.test(key) || COUNT_LIKE_KEY.test(key)) {
    return false;
  }
  return RATIO_LIKE_KEY.test(key);
}

export function formatGeneratedNumericValue(
  value: number,
  key: string,
  locale: string,
  unitHint?: string,
): string {
  if (!Number.isFinite(value)) {
    return "-";
  }

  if (shouldFormatGeneratedValueAsPercent(key, value)) {
    return new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(value);
  }

  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: Math.abs(value) >= 1000 ? 0 : 2,
  }).format(value);

  const unit = unitHint?.trim() || inferUnitSuffix(key);
  return unit ? `${formatted} ${unit}` : formatted;
}
