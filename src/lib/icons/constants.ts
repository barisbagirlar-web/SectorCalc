/** SectorCalc premium icon system — stroke & size tokens */

export const ICON_STROKE = 1.75;

export const ICON_SIZE_CLASS = {
 compact: "h-5 w-5",
 default: "h-6 w-6",
 feature: "h-7 w-7",
} as const;

export type ScIconSize = keyof typeof ICON_SIZE_CLASS;
