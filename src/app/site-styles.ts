/**
 * Site-wide design system CSS - imported from layouts before globals.css so
 * webpack resolves each file directly (avoids invalid @import-after-@tailwind).
 *
 * Removed confirmed dead CSS files:
 * - calculation-tool-mobile-layout.css (CALC_TOOL_PAGE_CLASS never consumed)
 * - tool-tier-bands.css (no active component references)
 * - sectorcalc-hud-footer.css (no active component references)
 * - premium-category-catalog.css (no active component references)
 * - sectorcalc-calculator-cards.css (no active component references)
 */
import "../styles/industrial-ui.css";
import "../styles/industrial-os.css";
import "../styles/apple-ui.css";
import "../styles/premium-minimal.css";
import "../styles/contrast-system.css";
import "../styles/design-craft.css";
import "../styles/terminal-panel.css";
import "../styles/public-demo-pages.css";
import "../styles/sectorcalc-hero.css";
import "../styles/guided-reference-graphics.css";
import "../styles/premium-calculator-shell.css";
