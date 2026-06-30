export type CreditPackageOption = {
  readonly id: string;
  readonly credits: number;
  readonly priceUsd: number;
};

export const CREDIT_PACKAGE_OPTIONS: readonly CreditPackageOption[] = [
  { id: "1", credits: 1, priceUsd: 1.99 },
  { id: "5", credits: 5, priceUsd: 4.99 },
  { id: "15", credits: 15, priceUsd: 7.99 },
  { id: "30", credits: 30, priceUsd: 11.99 },
  { id: "100", credits: 100, priceUsd: 24.99 },
] as const;
