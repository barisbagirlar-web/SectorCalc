const FINANCE_PATTERN =
  /kredi|leasing|finans|nakit|maa[sş]|maas|sgk|vergi|kdv|stopaj|\birr\b|\bnpv\b|faiz|çek|cek|senet|rent-vs-buy|salary|payroll|withholding|tevkifat|gelir-vergisi|isveren|işveren|employer-cost|employer|early-payoff|check-note|vade-kirma|personel-devamsizlik|is-kazasi|loan|invoice-discount|cash-flow|working-capital|interest|tax-bracket|income-tax/i;

const TECHNICAL_BLOCKLIST =
  /\boee\b|spc|six-sigma|sigma-dpmo|regression|sample-size|concrete|beton|kablo|gerilim|voltage|cable|basinc|pressure-vessel|wps|welding|kaynak|bearing|rulman|hydraulic|hidrolik|pneumatic|pnomatik|compressor|kompresor|sheet-metal|laser|lazer|3d-print|wind-turbine|ruzg|container|konteyner|forklift|navlun|freight|warehouse|depo-raf|packaging|streç|hvac|btu|generator|jenerator|spring|yay|shaft|mil-|bolt|bulon|scrap|sac-metal|forming|oee-calculator|spc-limit|linear-regression|sample-size-calculator|fuel-emission|karbon|carbon-footprint|container-loading|truck-load|pallet|irsaliye|shipping-cost|fire-escape|yangin|osgb|atık|waste-declaration|recycling|geri-donu/i;

export function isFinanceLikeTool(input: {
  readonly slug: string;
  readonly title?: string;
  readonly description?: string;
  readonly categorySlug?: string;
}): boolean {
  const haystack = `${input.slug} ${input.title ?? ""} ${input.description ?? ""} ${input.categorySlug ?? ""}`.toLowerCase();

  if (TECHNICAL_BLOCKLIST.test(haystack)) {
    return FINANCE_PATTERN.test(haystack) && !/(navlun|freight|logistics|konteyner|container|forklift|depo)/i.test(haystack);
  }

  return FINANCE_PATTERN.test(haystack);
}
