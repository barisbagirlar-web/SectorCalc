"use client";

interface LedgerNumberTickProps {
  value: string;
  className?: string;
}

/**
 * Micro number tick - 120ms, result values only. Animation stays active on
 * every device, including those with the OS "reduce motion" preference.
 */
export function LedgerNumberTick({ value, className = "" }: LedgerNumberTickProps) {
  return (
    <span
      key={value}
      className={`sc-result-number-tick sc-ledger-number-tick sc-ledger-big-number sc-result-big-number ${className}`.trim()}
      aria-live="polite"
    >
      {value}
    </span>
  );
}
