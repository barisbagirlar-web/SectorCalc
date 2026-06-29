const FINANCE_PATTERN =
  /leasing|finans|\bnpv\b|\birr\b|rent-vs-buy|salary|payroll|withholding|tax|employer-cost|employer|early-payoff|check-note|loan|invoice-discount|cash-flow|working-capital|interest|tax-bracket|income-tax|credit|finance|cash|wage|social-security|vat|withholding-tax|interest-rate|promissory-note|revenue|income|dividend|equity|bond|stock|asset|liability|depreciation|amortization|budget|forecast|audit|compliance|insurance|premium-due|claim|deductible|collateral|mortgage|amortization-schedule|refinance|debt|equity-ratio|leverage|solvency|liquidity|capital-expenditure|operating-expense|profit|loss|margin|overhead|cost-allocation|unit-cost|break-even|roi|roa|roe|ebitda|ebit|net-income|gross-profit|operating-profit|cogs|inventory-turnover|days-sales-outstanding|accounts-payable|accounts-receivable|working-capital-ratio|current-ratio|quick-ratio|capex|opex|depreciation-schedule|tax-liability|tax-refund|tax-credit|tax-deduction|tax-rate|corporate-tax|payroll-tax|social-security-tax|unemployment-tax|workers-comp|fringe-benefits|bonus|commission|severance|pension|401k|ira|roth|traditional-ira|fund|index-fund|mutual-fund|etf|bond-yield|dividend-yield|price-to-earnings|market-cap|enterprise-value|book-value|earnings-per-share|price-to-book|debt-to-equity|interest-coverage|cash-flow-from-operations|cash-flow-from-investing|cash-flow-from-financing|free-cash-flow|net-present-value|internal-rate-of-return|payback-period|discounted-payback|profitability-index|sensitivity-analysis|scenario-analysis|monte-carlo|black-scholes|option-pricing|future-value|present-value|annuity|perpetuity|amortizing-loan|balloon-payment|interest-only|fixed-rate|variable-rate|arm|prime-rate|libor|sofr|euribor|yield-curve|credit-score|credit-rating|credit-report|fico|vantage|credit-bureau|equifax|experian|transunion|identity-theft|fraud|embezzlement|money-laundering|anti-money-laundering|know-your-customer|kyc|aml|sanctions|ofac|patriot-act|sarbanes-oxley|gaap|ifrs|fasb|sec|edgar|10k|10q|8k|annual-report|quarterly-report|proxy-statement|shareholder-letter|ceo-letter|management-discussion|mdna|financial-statement|balance-sheet|income-statement|cash-flow-statement|statement-of-equity|footnotes|auditor-opinion|unqualified-opinion|qualified-opinion|adverse-opinion|going-concern|material-weakness|significant-deficiency|internal-control|sox-compliance|audit-committee|board-of-directors|independent-director|auditor-independence|audit-trail|forensic-accounting|fraud-examination|certified-fraud-examiner|cpa|cma|cia|cfe|financial-analyst|investment-banker|portfolio-manager|risk-manager|treasurer|controller|cfo/i;

const TECHNICAL_BLOCKLIST =
  /\boee\b|spc|six-sigma|sigma-dpmo|regression|sample-size|concrete|concrete|cable|voltage|cable|pressure|pressure-vessel|wps|welding|weld|bearing|bearing|hydraulic|hydraulic|pneumatic|pneumatic|compressor|compressor|sheet-metal|laser|laser|3d-print|wind-turbine|wind|container|container|forklift|freight|freight|warehouse|warehouse|packaging|stretch|hvac|btu|generator|generator|spring|spring|shaft|shaft|bolt|bolt|scrap|sheet-metal|forming|oee-calculator|spc-limit|linear-regression|sample-size-calculator|fuel-emission|carbon|carbon-footprint|container-loading|truck-load|pallet|waybill|shipping-cost|fire-escape|fire|safety|waste|waste-declaration|recycling|recycle/i;

export function isFinanceLikeTool(input: {
  readonly slug: string;
  readonly title?: string;
  readonly description?: string;
  readonly categorySlug?: string;
}): boolean {
  const haystack = `${input.slug} ${input.title ?? ""} ${input.description ?? ""} ${input.categorySlug ?? ""}`.toLowerCase();

  if (TECHNICAL_BLOCKLIST.test(haystack)) {
    return FINANCE_PATTERN.test(haystack) && !/(freight|logistics|container|forklift|warehouse)/i.test(haystack);
  }

  return FINANCE_PATTERN.test(haystack);
}
