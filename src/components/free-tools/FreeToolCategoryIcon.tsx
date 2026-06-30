/**
 * Free Tool Category Icon — Premium line-art SVG symbol renderer.
 *
 * Renders the premium-style SVG symbol for a given free tool category.
 * Falls back to the generic "other" symbol for unknown slugs.
 *
 * The SVGs use 48×48 viewBox with stroke-width="1.5" and currentColor stroke,
 * matching the premium-categories.ts design language (copper/navy tones).
 */

import { resolveFreeToolCategorySymbolSvg } from "@/lib/features/free-tools/free-tool-categories";

type FreeToolCategoryIconProps = {
  readonly iconKey: string;
  readonly className?: string;
};

export function FreeToolCategoryIcon({
  iconKey,
  className = "h-5 w-5 text-copper",
}: FreeToolCategoryIconProps) {
  const svgString = resolveFreeToolCategorySymbolSvg(iconKey);

  if (!svgString) {
    return null;
  }

  return (
    <span
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
}
