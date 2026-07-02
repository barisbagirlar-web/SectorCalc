/**
 * CategorySymbolIcon - Premium inline SVG symbol renderer
 *
 * Renders a premium line-art SVG symbol for any category slug.
 * Uses currentColor so it adapts to sc-copper / sc-navy context.
 * ECMI / ISO 9001 - TUV-certifiable engineering illustration standard.
 */

import { resolveCategorySvgSymbol } from "@/data/category-svg-symbols";

interface CategorySymbolIconProps {
  readonly slug: string;
  readonly className?: string;
  readonly ariaHidden?: boolean;
}

/**
 * Renders the premium SVG line-art symbol for a given category slug.
 * The SVG is inlined to preserve stroke styling and enable color inheritance.
 */
export function CategorySymbolIcon({
  slug,
  className = "h-12 w-12",
  ariaHidden = true,
}: CategorySymbolIconProps) {
  const svgMarkup = resolveCategorySvgSymbol(slug);

  return (
    <span
      className={className}
      aria-hidden={ariaHidden}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
}
