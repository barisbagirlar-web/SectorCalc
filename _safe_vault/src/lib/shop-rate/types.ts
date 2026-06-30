export type ShopRateSavedRates = {
  readonly hourlyRate: number;
  readonly energyCost: number;
  readonly maintenanceCost: number;
  readonly amortization: number;
  readonly currency: string;
};

export const SHOP_RATE_MODAL_SLUG = "shop-rate-hourly-cost-calculator" as const;

export const SHOP_RATE_SCHEMA_PUBLIC_PATH =
  "/generated/schemas/shop-rate-hourly-cost-calculator-schema.json" as const;
