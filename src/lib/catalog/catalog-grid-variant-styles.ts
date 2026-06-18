/**
 * Shared tile colors:
 * - free: blue (mavi)
 * - industry: navy blue / lacivert (--sc-navy)
 * - premium: bordo / burgundy (--sc-premium-bordo)
 */
export type CatalogGridVariant = "free" | "premium" | "industry";

export const CATALOG_GRID_VARIANT_STYLES: Record<
  CatalogGridVariant,
  {
    readonly icon: string;
    readonly iconHover: string;
    readonly hoverBorder: string;
    readonly focusRing: string;
    readonly active: string;
  }
> = {
  free: {
    icon: "text-blue-600",
    iconHover: "group-hover:text-blue-700",
    hoverBorder: "hover:border-blue-400",
    focusRing: "focus-visible:ring-blue-500",
    active: "border-blue-500 bg-blue-50/70 ring-2 ring-blue-100",
  },
  industry: {
    icon: "text-[var(--sc-navy)]",
    iconHover: "group-hover:text-blue-800",
    hoverBorder: "hover:border-blue-700",
    focusRing: "focus-visible:ring-[var(--sc-navy)]",
    active:
      "border-[var(--sc-navy)] bg-blue-50/70 ring-2 ring-blue-100",
  },
  premium: {
    icon: "text-[var(--sc-premium-bordo)]",
    iconHover: "group-hover:text-[var(--sc-premium-bordo-hover)]",
    hoverBorder: "hover:border-[var(--sc-premium-bordo)]",
    focusRing: "focus-visible:ring-[var(--sc-premium-bordo)]",
    active:
      "border-[var(--sc-premium-bordo)] bg-red-50/70 ring-2 ring-red-100",
  },
};
