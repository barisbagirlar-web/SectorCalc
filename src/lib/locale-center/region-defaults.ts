import type { MeasurementSystem } from "@/lib/locale-center/locale-types";

export type RegionFormatDefaults = {
  readonly currency: string;
  readonly measurementSystem: MeasurementSystem;
  readonly decimal: string;
  readonly group: string;
  readonly dateStyle: string;
  readonly direction?: "ltr" | "rtl";
};

export const REGION_DEFAULTS = {
  GLOBAL: {
    currency: "USD",
    measurementSystem: "metric",
    decimal: ".",
    group: ",",
    dateStyle: "MM/dd/yyyy",
  },
  TR: {
    currency: "USD",
    measurementSystem: "metric",
    decimal: ",",
    group: ".",
    dateStyle: "dd.MM.yyyy",
  },
  US: {
    currency: "USD",
    measurementSystem: "imperial",
    decimal: ".",
    group: ",",
    dateStyle: "MM/dd/yyyy",
  },
  GB: {
    currency: "GBP",
    measurementSystem: "mixed",
    decimal: ".",
    group: ",",
    dateStyle: "dd/MM/yyyy",
  },
  DE: {
    currency: "EUR",
    measurementSystem: "metric",
    decimal: ",",
    group: ".",
    dateStyle: "dd.MM.yyyy",
  },
  FR: {
    currency: "EUR",
    measurementSystem: "metric",
    decimal: ",",
    group: " ",
    dateStyle: "dd/MM/yyyy",
  },
  ES: {
    currency: "EUR",
    measurementSystem: "metric",
    decimal: ",",
    group: ".",
    dateStyle: "dd/MM/yyyy",
  },
  AE: {
    currency: "AED",
    measurementSystem: "metric",
    decimal: ".",
    group: ",",
    dateStyle: "dd/MM/yyyy",
    direction: "rtl",
  },
  SA: {
    currency: "SAR",
    measurementSystem: "metric",
    decimal: ".",
    group: ",",
    dateStyle: "dd/MM/yyyy",
    direction: "rtl",
  },
  QA: {
    currency: "QAR",
    measurementSystem: "metric",
    decimal: ".",
    group: ",",
    dateStyle: "dd/MM/yyyy",
    direction: "rtl",
  },
  KW: {
    currency: "KWD",
    measurementSystem: "metric",
    decimal: ".",
    group: ",",
    dateStyle: "dd/MM/yyyy",
    direction: "rtl",
  },
  CA: {
    currency: "CAD",
    measurementSystem: "metric",
    decimal: ".",
    group: ",",
    dateStyle: "yyyy-MM-dd",
  },
  AU: {
    currency: "AUD",
    measurementSystem: "metric",
    decimal: ".",
    group: ",",
    dateStyle: "dd/MM/yyyy",
  },
  CH: {
    currency: "CHF",
    measurementSystem: "metric",
    decimal: ".",
    group: "'",
    dateStyle: "dd.MM.yyyy",
  },
  JP: {
    currency: "JPY",
    measurementSystem: "metric",
    decimal: ".",
    group: ",",
    dateStyle: "yyyy/MM/dd",
  },
} as const satisfies Record<string, RegionFormatDefaults>;
