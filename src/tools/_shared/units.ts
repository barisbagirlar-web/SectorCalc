// SectorCalc — Canonical Unit Registry V5.4
// Single source of truth for all unit conversions across 20 PRO tools.
// Every new domain MUST have a round-trip test before merge.
//
// Convention: factor f is the multiplier FROM that unit TO canonical.
//   toCanonical(val, unit)  = val * f
//   fromCanonical(val, unit) = val / f
// Round-trip property: fromCanonical(toCanonical(x, u), u) === x for all x,u.
//
// Rate-domain critical rule (Section 2 of spec): when canonical is the SMALLEST end
// (e.g. wage: cur/h), larger periods have factor = canonical_period / unit_period,
// NOT the other way. This was caught by round-trip Layer 4 in Machine Hourly Rate rollout.

const DAYS_PER_MONTH = 365.25 / 12; // 30.4375
const WEEKS_PER_MONTH = 365.25 / 7 / 12; // 4.348214286

export interface UnitEntry {
  c: string; // display label (e.g. "/month", "%", "kW")
  f: number; // factor to canonical
}

export interface UnitDomain {
  canon: string; // canonical unit label
  list: readonly UnitEntry[];
}

export const UNITS = {
  // -- Break-Even domain set (verified, unchanged) --
  perUnit: {
    canon: "cur/unit",
    list: [
      { c: "/unit", f: 1 },
      { c: "/dozen (12)", f: 1 / 12 },
      { c: "/gross (144)", f: 1 / 144 },
      { c: "/100 units", f: 1 / 100 },
      { c: "/1,000 units", f: 1 / 1000 },
    ] as const,
  } satisfies UnitDomain,

  money: {
    canon: "cur/month",
    list: [
      { c: "/day", f: DAYS_PER_MONTH },
      { c: "/week", f: WEEKS_PER_MONTH },
      { c: "/month", f: 1 },
      { c: "/quarter", f: 1 / 3 },
      { c: "/year", f: 1 / 12 },
    ] as const,
  } satisfies UnitDomain,

  vol: {
    canon: "u/month",
    list: [
      { c: "/day", f: DAYS_PER_MONTH },
      { c: "/week", f: WEEKS_PER_MONTH },
      { c: "/month", f: 1 },
      { c: "/quarter", f: 1 / 3 },
      { c: "/year", f: 1 / 12 },
    ] as const,
  } satisfies UnitDomain,

  flat: {
    canon: "cur",
    list: [
      { c: "units", f: 1 },
      { c: "thousands (k)", f: 1000 },
      { c: "millions (M)", f: 1e6 },
    ] as const,
  } satisfies UnitDomain,

  // -- Extended domains (19 tools) --
  percent: {
    canon: "fraction",
    list: [
      { c: "%", f: 0.01 },
      { c: "fraction (0-1)", f: 1 },
      { c: "bps", f: 0.0001 },
    ] as const,
  } satisfies UnitDomain,

  years: {
    canon: "yr",
    list: [
      { c: "months", f: 1 / 12 },
      { c: "quarters", f: 1 / 4 },
      { c: "years", f: 1 },
    ] as const,
  } satisfies UnitDomain,

  days: {
    canon: "day",
    list: [
      { c: "days", f: 1 },
      { c: "weeks", f: 7 },
      { c: "months", f: DAYS_PER_MONTH },
    ] as const,
  } satisfies UnitDomain,

  hours: {
    canon: "h",
    list: [
      { c: "seconds", f: 1 / 3600 },
      { c: "minutes", f: 1 / 60 },
      { c: "hours", f: 1 },
      { c: "shifts (8h)", f: 8 },
      { c: "days (24h)", f: 24 },
    ] as const,
  } satisfies UnitDomain,

  energy: {
    canon: "kWh",
    list: [
      { c: "kWh", f: 1 },
      { c: "MWh", f: 1000 },
      { c: "MJ", f: 1 / 3.6 },
      { c: "GJ", f: 1000 / 3.6 },
      { c: "BTU", f: 1 / 3412.14 },
    ] as const,
  } satisfies UnitDomain,

  power: {
    canon: "kW",
    list: [
      { c: "W", f: 0.001 },
      { c: "kW", f: 1 },
      { c: "MW", f: 1000 },
      { c: "HP (mech)", f: 0.7457 },
    ] as const,
  } satisfies UnitDomain,

  mass: {
    canon: "kg",
    list: [
      { c: "g", f: 0.001 },
      { c: "kg", f: 1 },
      { c: "t (metric)", f: 1000 },
      { c: "lb", f: 0.453592 },
      { c: "oz", f: 0.0283495 },
    ] as const,
  } satisfies UnitDomain,

  length: {
    canon: "mm",
    list: [
      { c: "mm", f: 1 },
      { c: "cm", f: 10 },
      { c: "m", f: 1000 },
      { c: "in", f: 25.4 },
      { c: "ft", f: 304.8 },
    ] as const,
  } satisfies UnitDomain,

  // -- Machine Hourly Rate specific domain: wage (cur/hour, canonical at smallest end) --
  wage: {
    canon: "cur/h",
    list: [
      { c: "/hour", f: 1 },
      { c: "/day (8h)", f: 1 / 8 },
      { c: "/week (40h)", f: 1 / 40 },
    ] as const,
  } satisfies UnitDomain,

  // -- Machine Hourly Rate specific domain: energy price (cur/kWh) --
  energyPrice: {
    canon: "cur/kWh",
    list: [
      { c: "/kWh", f: 1 },
      { c: "/MWh", f: 0.001 },
    ] as const,
  } satisfies UnitDomain,
} as const;

export type DomainKey = keyof typeof UNITS;

/** Convert a display value to canonical (base) unit value. */
export function toCanonical(domain: DomainKey, val: number, unitLabel: string): number {
  const domainObj = UNITS[domain];
  const entry = domainObj.list.find((e) => e.c === unitLabel);
  if (!entry) return val; // passthrough on unknown unit
  return val * entry.f;
}

/** Convert a canonical (base) value back to a display unit value. */
export function fromCanonical(domain: DomainKey, canonVal: number, unitLabel: string): number {
  const domainObj = UNITS[domain];
  const entry = domainObj.list.find((e) => e.c === unitLabel);
  if (!entry) return canonVal; // passthrough on unknown unit
  return canonVal / entry.f;
}

/** Validate that a unit label exists in the given domain. */
export function isValidUnit(domain: DomainKey, unitLabel: string): boolean {
  return UNITS[domain].list.some((e) => e.c === unitLabel);
}

/** Return all valid unit labels for a domain. */
export function getUnitOptions(domain: DomainKey): readonly string[] {
  return UNITS[domain].list.map((e) => e.c);
}
