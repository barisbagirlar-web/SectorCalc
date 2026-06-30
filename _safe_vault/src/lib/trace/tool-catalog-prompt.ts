// LOCKED — DO NOT MODIFY without explicit user approval.
// Trace tool catalog: sadece bu listedeki araclari oner. Hayali arac uretme.

import "server-only";

const REAL_FREE_TOOLS = [
  "roi-quick-check -> /tools/generated/roi-quick-check. Quick ROI check: investment, return, period. 3 inputs.",
];

const REAL_PREMIUM_TOOLS = [
  "roi-payback-analyzer -> /tools/premium/roi-payback-analyzer. Full ROI with NPV, IRR, payback period.",
  "cnc-quote-risk-analyzer -> /tools/premium/cnc-quote-risk-analyzer. CNC quote accuracy and margin risk.",
  "sheet-metal-quote-risk-tool -> /tools/premium/sheet-metal-quote-risk-tool. Sheet metal quote cost floor.",
  "route-optimization-analyzer -> /tools/premium/route-optimization-analyzer. Route loss and fuel exposure.",
  "change-order-impact-analyzer -> /tools/premium/change-order-impact-analyzer. Margin erosion from scope changes.",
  "energy-efficiency-report -> /tools/premium/energy-efficiency-report. Peak load and carbon exposure.",
  "menu-profit-leak-detector -> /tools/premium/menu-profit-leak-detector. Food cost and margin per SKU.",
  "office-cleaning-bid-optimizer -> /tools/premium/office-cleaning-bid-optimizer. Labor burden and bid margin.",
  "crop-yield-loss-analyzer -> /tools/premium/crop-yield-loss-analyzer. Irrigation and harvest efficiency.",
];

export function buildToolCatalogForPrompt(locale: string): string {
  return [
    "=== TOOLS YOU CAN RECOMMEND ===",
    "Only recommend tools from this list. If a tool is not here, do not mention it.",
    "",
    "FREE TOOLS (web calculators, no signup):",
    ...REAL_FREE_TOOLS.map((t) => "  " + t),
    "",
    "PREMIUM TOOLS (Pro subscription required):",
    ...REAL_PREMIUM_TOOLS.map((t) => "  " + t),
    "",
    "=== RULES ===",
    "- Only recommend tools from the list above.",
    "- Never make up a tool name, slug, or route.",
    "- If no tool matches the user's need, say you don't know and ask them to describe their calculation.",
    "- Never upsell. If the user asks about premium features, answer directly. Otherwise recommend the free tool.",
    "- Never list multiple tools in one response. One tool per message max.",
    "- Current locale: " + locale,
    "- Supported languages: en, tr, de, fr, es, ar. Always respond in the user's language.",
  ]
    .filter(Boolean)
    .join("\n");
}
