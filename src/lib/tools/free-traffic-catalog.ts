/**
 * Free Traffic Catalog — 230 active browser-side calculators (Omni-style library).
 */

export type FreeTrafficCategory =
  | "construction-measurement"
  | "finance-business"
  | "manufacturing-workshop"
  | "energy-carbon"
  | "logistics-travel"
  | "agriculture-food"
  | "everyday-life"
  | "math-statistics"
  | "conversion"
  | "health-body";

export type FreeTrafficInput = {
  readonly key: string;
  readonly label: string;
  readonly unit: string;
  readonly type: "number" | "select";
  readonly options?: readonly { readonly label: string; readonly value: string }[];
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly defaultValue?: number | string;
  readonly helper: string;
};

export type FreeTrafficResultType =
  | "quantity"
  | "cost"
  | "ratio"
  | "conversion"
  | "time"
  | "health"
  | "statistics";

export type FreeTrafficTool = {
  readonly slug: string;
  readonly title: string;
  readonly category: FreeTrafficCategory;
  readonly description: string;
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly inputs: readonly FreeTrafficInput[];
  readonly resultType: FreeTrafficResultType;
  readonly relatedPremiumSlug?: string;
  readonly relatedIndustrySlug?: string;
  readonly missingFactors: readonly string[];
};

/** @deprecated All catalog tools are active; kept for backward compatibility */
export type FreeTrafficToolInput = FreeTrafficInput;

export const FREE_TRAFFIC_TOOLS: readonly FreeTrafficTool[] = [
  {
    "slug": "rental-yield-one-percent-rule",
    "title": "Rental Yield One Percent Rule",
    "category": "finance-business",
    "description": "Free online rental yield one percent rule calculator. Get accurate calculations instantly.",
    "seoTitle": "Rental Yield One Percent Rule | SectorCalc",
    "seoDescription": "Free online rental yield one percent rule calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "monthlyRent",
        "label": "Monthly Rent",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter monthly rent"
      },
      {
        "key": "propertyValue",
        "label": "Property Value",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter property value"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "tax-deferred-exchange-1031",
    "title": "Tax Deferred Exchange 1031",
    "category": "finance-business",
    "description": "Free online tax deferred exchange 1031 calculator. Get accurate calculations instantly.",
    "seoTitle": "Tax Deferred Exchange 1031 | SectorCalc",
    "seoDescription": "Free online tax deferred exchange 1031 calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sellingPrice",
        "label": "Selling Price",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter selling price"
      },
      {
        "key": "remainingDebt",
        "label": "Remaining Debt",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter remaining debt"
      },
      {
        "key": "newInvestment",
        "label": "New Investment",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter new investment"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "budget-rule-50-30-20",
    "title": "Budget Rule 50 30 20",
    "category": "finance-business",
    "description": "Free online budget rule 50 30 20 calculator. Get accurate calculations instantly.",
    "seoTitle": "Budget Rule 50 30 20 | SectorCalc",
    "seoDescription": "Free online budget rule 50 30 20 calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "netIncome",
        "label": "Net Income",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter net income"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "asset-depreciation-methods",
    "title": "Asset Depreciation Methods",
    "category": "finance-business",
    "description": "Free online asset depreciation methods calculator. Get accurate calculations instantly.",
    "seoTitle": "Asset Depreciation Methods | SectorCalc",
    "seoDescription": "Free online asset depreciation methods calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "cost",
        "label": "Cost",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter cost"
      },
      {
        "key": "salvageValue",
        "label": "Salvage Value",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter salvage value"
      },
      {
        "key": "usefulLife",
        "label": "Useful Life",
        "unit": "years",
        "type": "number",
        "helper": "Enter useful life"
      },
      {
        "key": "method",
        "label": "Method",
        "unit": "Metin",
        "type": "select",
        "helper": "Enter method",
        "options": [
          {
            "label": "Straight Line",
            "value": "straight-line"
          },
          {
            "label": "Double Declining Balance",
            "value": "declining-balance"
          },
          {
            "label": "Sum of Years' Digits",
            "value": "syd"
          }
        ],
        "defaultValue": "straight-line"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "annuity-monthly-payout",
    "title": "Annuity Monthly Payout",
    "category": "finance-business",
    "description": "Free online annuity monthly payout calculator. Get accurate calculations instantly.",
    "seoTitle": "Annuity Monthly Payout | SectorCalc",
    "seoDescription": "Free online annuity monthly payout calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "principal",
        "label": "Principal",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter principal"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "period",
        "label": "Period",
        "unit": "months",
        "type": "number",
        "helper": "Enter period"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "annuity-annual-payout",
    "title": "Annuity Annual Payout",
    "category": "finance-business",
    "description": "Free online annuity annual payout calculator. Get accurate calculations instantly.",
    "seoTitle": "Annuity Annual Payout | SectorCalc",
    "seoDescription": "Free online annuity annual payout calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "savings",
        "label": "Savings",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter savings"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "duration",
        "label": "Duration",
        "unit": "years",
        "type": "number",
        "helper": "Enter duration"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "annual-percentage-rate-apr",
    "title": "Annual Percentage Rate Apr",
    "category": "finance-business",
    "description": "Free online annual percentage rate apr calculator. Get accurate calculations instantly.",
    "seoTitle": "Annual Percentage Rate Apr | SectorCalc",
    "seoDescription": "Free online annual percentage rate apr calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "loanAmount",
        "label": "Loan Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter loan amount"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "term",
        "label": "Term",
        "unit": "months",
        "type": "number",
        "helper": "Enter term"
      },
      {
        "key": "fees",
        "label": "Fees",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter fees"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "portfolio-asset-allocation",
    "title": "Portfolio Asset Allocation",
    "category": "finance-business",
    "description": "Free online portfolio asset allocation calculator. Get accurate calculations instantly.",
    "seoTitle": "Portfolio Asset Allocation | SectorCalc",
    "seoDescription": "Free online portfolio asset allocation calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "portfolioValue",
        "label": "Portfolio Value",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter portfolio value"
      },
      {
        "key": "stocks",
        "label": "Stocks",
        "unit": "%",
        "type": "number",
        "helper": "Enter stocks"
      },
      {
        "key": "bonds",
        "label": "Bonds",
        "unit": "%",
        "type": "number",
        "helper": "Enter bonds"
      },
      {
        "key": "cash",
        "label": "Cash",
        "unit": "%",
        "type": "number",
        "helper": "Enter cash"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "audit-risk-model",
    "title": "Audit Risk Model",
    "category": "finance-business",
    "description": "Free online audit risk model calculator. Get accurate calculations instantly.",
    "seoTitle": "Audit Risk Model | SectorCalc",
    "seoDescription": "Free online audit risk model calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "inherentRisk",
        "label": "Inherent Risk",
        "unit": "%",
        "type": "number",
        "helper": "Enter inherent risk"
      },
      {
        "key": "controlRisk",
        "label": "Control Risk",
        "unit": "%",
        "type": "number",
        "helper": "Enter control risk"
      },
      {
        "key": "detectionRisk",
        "label": "Detection Risk",
        "unit": "%",
        "type": "number",
        "helper": "Enter detection risk"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "simple-interest-yield",
    "title": "Simple Interest Yield",
    "category": "finance-business",
    "description": "Free online simple interest yield calculator. Get accurate calculations instantly.",
    "seoTitle": "Simple Interest Yield | SectorCalc",
    "seoDescription": "Free online simple interest yield calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "principal",
        "label": "Principal",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter principal"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "duration",
        "label": "Duration",
        "unit": "years",
        "type": "number",
        "helper": "Enter duration"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "compound-interest-growth",
    "title": "Compound Interest Growth",
    "category": "finance-business",
    "description": "Free online compound interest growth calculator. Get accurate calculations instantly.",
    "seoTitle": "Compound Interest Growth | SectorCalc",
    "seoDescription": "Free online compound interest growth calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "principal",
        "label": "Principal",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter principal"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "years",
        "label": "Years",
        "unit": "years",
        "type": "number",
        "helper": "Enter years"
      },
      {
        "key": "frequency",
        "label": "Frequency (Hz)",
        "unit": "units",
        "type": "number",
        "helper": "Enter frequency (hz)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "compound-interest-frequencies",
    "title": "Compound Interest Frequencies",
    "category": "finance-business",
    "description": "Free online compound interest frequencies calculator. Get accurate calculations instantly.",
    "seoTitle": "Compound Interest Frequencies | SectorCalc",
    "seoDescription": "Free online compound interest frequencies calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "principal",
        "label": "Principal",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter principal"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "days",
        "label": "Days",
        "unit": "days",
        "type": "number",
        "helper": "Enter days"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "continuous-compound-interest",
    "title": "Continuous Compound Interest",
    "category": "finance-business",
    "description": "Free online continuous compound interest calculator. Get accurate calculations instantly.",
    "seoTitle": "Continuous Compound Interest | SectorCalc",
    "seoDescription": "Free online continuous compound interest calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "principal",
        "label": "Principal",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter principal"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "years",
        "label": "Years",
        "unit": "years",
        "type": "number",
        "helper": "Enter years"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "nominal-effective-interest",
    "title": "Nominal Effective Interest",
    "category": "finance-business",
    "description": "Free online nominal effective interest calculator. Get accurate calculations instantly.",
    "seoTitle": "Nominal Effective Interest | SectorCalc",
    "seoDescription": "Free online nominal effective interest calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "nominalRate",
        "label": "Nominal Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter nominal rate"
      },
      {
        "key": "frequency",
        "label": "Frequency (Hz)",
        "unit": "units",
        "type": "number",
        "helper": "Enter frequency (hz)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "bond-price-yield-valuation",
    "title": "Bond Price Yield Valuation",
    "category": "finance-business",
    "description": "Free online bond price yield valuation calculator. Get accurate calculations instantly.",
    "seoTitle": "Bond Price Yield Valuation | SectorCalc",
    "seoDescription": "Free online bond price yield valuation calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "nominalRate",
        "label": "Nominal Rate",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter nominal rate"
      },
      {
        "key": "couponRate",
        "label": "Coupon Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter coupon rate"
      },
      {
        "key": "marketRate",
        "label": "Market Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter market rate"
      },
      {
        "key": "term",
        "label": "Term",
        "unit": "years",
        "type": "number",
        "helper": "Enter term"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "dividend-net-tax",
    "title": "Dividend Net Tax",
    "category": "finance-business",
    "description": "Free online dividend net tax calculator. Get accurate calculations instantly.",
    "seoTitle": "Dividend Net Tax | SectorCalc",
    "seoDescription": "Free online dividend net tax calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "dividend",
        "label": "Dividend",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter dividend"
      },
      {
        "key": "withholdingTax",
        "label": "Withholding Tax",
        "unit": "%",
        "type": "number",
        "helper": "Enter withholding tax"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "dividend-reinvestment-drip",
    "title": "Dividend Reinvestment Drip",
    "category": "finance-business",
    "description": "Free online dividend reinvestment drip calculator. Get accurate calculations instantly.",
    "seoTitle": "Dividend Reinvestment Drip | SectorCalc",
    "seoDescription": "Free online dividend reinvestment drip calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "stocks",
        "label": "Stocks",
        "unit": "units",
        "type": "number",
        "helper": "Enter stocks"
      },
      {
        "key": "dividend",
        "label": "Dividend",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter dividend"
      },
      {
        "key": "price",
        "label": "Vehicle Price",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter vehicle price"
      },
      {
        "key": "years",
        "label": "Years",
        "unit": "years",
        "type": "number",
        "helper": "Enter years"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "stock-investment-return",
    "title": "Stock Investment Return",
    "category": "finance-business",
    "description": "Free online stock investment return calculator. Get accurate calculations instantly.",
    "seoTitle": "Stock Investment Return | SectorCalc",
    "seoDescription": "Free online stock investment return calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "purchasePrice",
        "label": "Purchase Price",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter purchase price"
      },
      {
        "key": "sale",
        "label": "Sales Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter sales amount"
      },
      {
        "key": "dividend",
        "label": "Dividend",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter dividend"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "annualized-investment-return",
    "title": "Annualized Investment Return",
    "category": "finance-business",
    "description": "Free online annualized investment return calculator. Get accurate calculations instantly.",
    "seoTitle": "Annualized Investment Return | SectorCalc",
    "seoDescription": "Free online annualized investment return calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "initialValue",
        "label": "Initial Value",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter initial value"
      },
      {
        "key": "finalValue",
        "label": "Final Value",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter final value"
      },
      {
        "key": "years",
        "label": "Years",
        "unit": "years",
        "type": "number",
        "helper": "Enter years"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "cagr-growth-rate",
    "title": "Cagr Growth Rate",
    "category": "finance-business",
    "description": "Free online cagr growth rate calculator. Get accurate calculations instantly.",
    "seoTitle": "Cagr Growth Rate | SectorCalc",
    "seoDescription": "Free online cagr growth rate calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "startValue",
        "label": "Start Value",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter start value"
      },
      {
        "key": "endValue",
        "label": "End Value",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter end value"
      },
      {
        "key": "years",
        "label": "Years",
        "unit": "years",
        "type": "number",
        "helper": "Enter years"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "return-on-investment-roi",
    "title": "Return On Investment Roi",
    "category": "finance-business",
    "description": "Free online return on investment roi calculator. Get accurate calculations instantly.",
    "seoTitle": "Return On Investment Roi | SectorCalc",
    "seoDescription": "Free online return on investment roi calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "netProfit",
        "label": "Net Profit",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter net profit"
      },
      {
        "key": "cost",
        "label": "Cost",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter cost"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "net-present-value-npv",
    "title": "Net Present Value Npv",
    "category": "finance-business",
    "description": "Free online net present value npv calculator. Get accurate calculations instantly.",
    "seoTitle": "Net Present Value Npv | SectorCalc",
    "seoDescription": "Free online net present value npv calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "cashFlows",
        "label": "Cash Flows",
        "unit": "Dizi ₺",
        "type": "number",
        "helper": "Enter cash flows"
      },
      {
        "key": "discount",
        "label": "Option Discount (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter option discount (%)"
      },
      {
        "key": "investment",
        "label": "Investment",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter investment"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "internal-rate-of-return-irr",
    "title": "Internal Rate Of Return Irr",
    "category": "finance-business",
    "description": "Free online internal rate of return irr calculator. Get accurate calculations instantly.",
    "seoTitle": "Internal Rate Of Return Irr | SectorCalc",
    "seoDescription": "Free online internal rate of return irr calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "cashFlows",
        "label": "Cash Flows",
        "unit": "Dizi ₺",
        "type": "number",
        "helper": "Enter cash flows"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "discounted-payback-period",
    "title": "Discounted Payback Period",
    "category": "finance-business",
    "description": "Free online discounted payback period calculator. Get accurate calculations instantly.",
    "seoTitle": "Discounted Payback Period | SectorCalc",
    "seoDescription": "Free online discounted payback period calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "cashFlows",
        "label": "Cash Flows",
        "unit": "Dizi ₺",
        "type": "number",
        "helper": "Enter cash flows"
      },
      {
        "key": "discount",
        "label": "Option Discount (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter option discount (%)"
      },
      {
        "key": "investment",
        "label": "Investment",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter investment"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "profitability-index-pi",
    "title": "Profitability Index Pi",
    "category": "finance-business",
    "description": "Free online profitability index pi calculator. Get accurate calculations instantly.",
    "seoTitle": "Profitability Index Pi | SectorCalc",
    "seoDescription": "Free online profitability index pi calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "futureCashFlowPv",
        "label": "Future Cash Flow PV",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter future cash flow pv"
      },
      {
        "key": "investment",
        "label": "Investment",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter investment"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "wacc-capital-cost",
    "title": "Wacc Capital Cost",
    "category": "finance-business",
    "description": "Free online wacc capital cost calculator. Get accurate calculations instantly.",
    "seoTitle": "Wacc Capital Cost | SectorCalc",
    "seoDescription": "Free online wacc capital cost calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "equity",
        "label": "Equity",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter equity"
      },
      {
        "key": "debt",
        "label": "Debt",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter debt"
      },
      {
        "key": "costOfEquity",
        "label": "Cost of Equity",
        "unit": "%",
        "type": "number",
        "helper": "Enter cost of equity"
      },
      {
        "key": "costOfDebt",
        "label": "Cost of Debt",
        "unit": "%",
        "type": "number",
        "helper": "Enter cost of debt"
      },
      {
        "key": "tax",
        "label": "Tax",
        "unit": "%",
        "type": "number",
        "helper": "Enter tax"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "capm-equity-cost",
    "title": "Capm Equity Cost",
    "category": "finance-business",
    "description": "Free online capm equity cost calculator. Get accurate calculations instantly.",
    "seoTitle": "Capm Equity Cost | SectorCalc",
    "seoDescription": "Free online capm equity cost calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "riskFreeRate",
        "label": "Risk-Free Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter risk-free rate"
      },
      {
        "key": "beta",
        "label": "Beta",
        "unit": "Number",
        "type": "number",
        "helper": "Enter beta"
      },
      {
        "key": "marketPremium",
        "label": "Market Premium",
        "unit": "%",
        "type": "number",
        "helper": "Enter market premium"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "dcf-business-valuation",
    "title": "Dcf Business Valuation",
    "category": "finance-business",
    "description": "Free online dcf business valuation calculator. Get accurate calculations instantly.",
    "seoTitle": "Dcf Business Valuation | SectorCalc",
    "seoDescription": "Free online dcf business valuation calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "freeCashFlow",
        "label": "Free Cash Flow",
        "unit": "Dizi ₺",
        "type": "number",
        "helper": "Enter free cash flow"
      },
      {
        "key": "wacc",
        "label": "WACC",
        "unit": "%",
        "type": "number",
        "helper": "Enter wacc"
      },
      {
        "key": "terminalGrowth",
        "label": "Terminal Growth",
        "unit": "%",
        "type": "number",
        "helper": "Enter terminal growth"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "fcff-fcfe-cash-flows",
    "title": "Fcff Fcfe Cash Flows",
    "category": "finance-business",
    "description": "Free online fcff fcfe cash flows calculator. Get accurate calculations instantly.",
    "seoTitle": "Fcff Fcfe Cash Flows | SectorCalc",
    "seoDescription": "Free online fcff fcfe cash flows calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "netProfit",
        "label": "Net Profit",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter net profit"
      },
      {
        "key": "depreciation",
        "label": "Depreciation",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter depreciation"
      },
      {
        "key": "workingCapital",
        "label": "Working Capital",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter working capital"
      },
      {
        "key": "capex",
        "label": "CapEx",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter capex"
      },
      {
        "key": "debt",
        "label": "Debt",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter debt"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "ebitda-operating-earnings",
    "title": "Ebitda Operating Earnings",
    "category": "finance-business",
    "description": "Free online ebitda operating earnings calculator. Get accurate calculations instantly.",
    "seoTitle": "Ebitda Operating Earnings | SectorCalc",
    "seoDescription": "Free online ebitda operating earnings calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "netProfit",
        "label": "Net Profit",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter net profit"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "tax",
        "label": "Tax",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter tax"
      },
      {
        "key": "depreciation",
        "label": "Depreciation",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter depreciation"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "pe-ratio-valuation",
    "title": "Pe Ratio Valuation",
    "category": "finance-business",
    "description": "Free online pe ratio valuation calculator. Get accurate calculations instantly.",
    "seoTitle": "Pe Ratio Valuation | SectorCalc",
    "seoDescription": "Free online pe ratio valuation calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sharePrice",
        "label": "Share Price",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter share price"
      },
      {
        "key": "eps",
        "label": "Earnings Per Share (EPS)",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter earnings per share (eps)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "pb-ratio-valuation",
    "title": "Pb Ratio Valuation",
    "category": "finance-business",
    "description": "Free online pb ratio valuation calculator. Get accurate calculations instantly.",
    "seoTitle": "Pb Ratio Valuation | SectorCalc",
    "seoDescription": "Free online pb ratio valuation calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "marketCap",
        "label": "Market Cap",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter market cap"
      },
      {
        "key": "equity",
        "label": "Equity",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter equity"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "ps-ratio-valuation",
    "title": "Ps Ratio Valuation",
    "category": "finance-business",
    "description": "Free online ps ratio valuation calculator. Get accurate calculations instantly.",
    "seoTitle": "Ps Ratio Valuation | SectorCalc",
    "seoDescription": "Free online ps ratio valuation calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "marketCap",
        "label": "Market Cap",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter market cap"
      },
      {
        "key": "totalSales",
        "label": "Total Sales",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter total sales"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "roe-dupont-analysis",
    "title": "Roe Dupont Analysis",
    "category": "finance-business",
    "description": "Free online roe dupont analysis calculator. Get accurate calculations instantly.",
    "seoTitle": "Roe Dupont Analysis | SectorCalc",
    "seoDescription": "Free online roe dupont analysis calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "netProfit",
        "label": "Net Profit",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter net profit"
      },
      {
        "key": "sales",
        "label": "Sales",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter sales"
      },
      {
        "key": "assets",
        "label": "Assets",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter assets"
      },
      {
        "key": "equity",
        "label": "Equity",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter equity"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "roic-capital-return",
    "title": "Roic Capital Return",
    "category": "finance-business",
    "description": "Free online roic capital return calculator. Get accurate calculations instantly.",
    "seoTitle": "Roic Capital Return | SectorCalc",
    "seoDescription": "Free online roic capital return calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "nopat",
        "label": "NOPAT",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter nopat"
      },
      {
        "key": "investedCapital",
        "label": "Invested Capital",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter invested capital"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "eva-economic-value-added",
    "title": "Eva Economic Value Added",
    "category": "finance-business",
    "description": "Free online eva economic value added calculator. Get accurate calculations instantly.",
    "seoTitle": "Eva Economic Value Added | SectorCalc",
    "seoDescription": "Free online eva economic value added calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "nopat",
        "label": "NOPAT",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter nopat"
      },
      {
        "key": "capital",
        "label": "Capital",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter capital"
      },
      {
        "key": "wacc",
        "label": "WACC",
        "unit": "%",
        "type": "number",
        "helper": "Enter wacc"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "sharpe-ratio-volatility",
    "title": "Sharpe Ratio Volatility",
    "category": "finance-business",
    "description": "Free online sharpe ratio volatility calculator. Get accurate calculations instantly.",
    "seoTitle": "Sharpe Ratio Volatility | SectorCalc",
    "seoDescription": "Free online sharpe ratio volatility calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "portfolioReturn",
        "label": "Portfolio Return",
        "unit": "%",
        "type": "number",
        "helper": "Enter portfolio return"
      },
      {
        "key": "riskFreeRate",
        "label": "Risk-Free Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter risk-free rate"
      },
      {
        "key": "volatility",
        "label": "Volatility",
        "unit": "%",
        "type": "number",
        "helper": "Enter volatility"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "sortino-ratio-downside",
    "title": "Sortino Ratio Downside",
    "category": "finance-business",
    "description": "Free online sortino ratio downside calculator. Get accurate calculations instantly.",
    "seoTitle": "Sortino Ratio Downside | SectorCalc",
    "seoDescription": "Free online sortino ratio downside calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "portfolioReturn",
        "label": "Portfolio Return",
        "unit": "%",
        "type": "number",
        "helper": "Enter portfolio return"
      },
      {
        "key": "riskFreeRate",
        "label": "Risk-Free Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter risk-free rate"
      },
      {
        "key": "downsideDeviation",
        "label": "Downside Deviation",
        "unit": "%",
        "type": "number",
        "helper": "Enter downside deviation"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "treynor-ratio-risk",
    "title": "Treynor Ratio Risk",
    "category": "finance-business",
    "description": "Free online treynor ratio risk calculator. Get accurate calculations instantly.",
    "seoTitle": "Treynor Ratio Risk | SectorCalc",
    "seoDescription": "Free online treynor ratio risk calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "portfolioReturn",
        "label": "Portfolio Return",
        "unit": "%",
        "type": "number",
        "helper": "Enter portfolio return"
      },
      {
        "key": "riskFreeRate",
        "label": "Risk-Free Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter risk-free rate"
      },
      {
        "key": "beta",
        "label": "Beta",
        "unit": "Number",
        "type": "number",
        "helper": "Enter beta"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "portfolio-max-drawdown",
    "title": "Portfolio Max Drawdown",
    "category": "finance-business",
    "description": "Free online portfolio max drawdown calculator. Get accurate calculations instantly.",
    "seoTitle": "Portfolio Max Drawdown | SectorCalc",
    "seoDescription": "Free online portfolio max drawdown calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "peakValue",
        "label": "Peak Value",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter peak value"
      },
      {
        "key": "troughValue",
        "label": "Trough Value",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter trough value"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "portfolio-variance-optimizer",
    "title": "Portfolio Variance Optimizer",
    "category": "finance-business",
    "description": "Free online portfolio variance optimizer calculator. Get accurate calculations instantly.",
    "seoTitle": "Portfolio Variance Optimizer | SectorCalc",
    "seoDescription": "Free online portfolio variance optimizer calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "returns",
        "label": "Returns",
        "unit": "Dizi",
        "type": "number",
        "helper": "Enter returns"
      },
      {
        "key": "covariance",
        "label": "Covariance",
        "unit": "Matris",
        "type": "number",
        "helper": "Enter covariance"
      },
      {
        "key": "targetReturn",
        "label": "Target Return",
        "unit": "%",
        "type": "number",
        "helper": "Enter target return"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mutual-fund-nav-return",
    "title": "Mutual Fund Nav Return",
    "category": "finance-business",
    "description": "Free online mutual fund nav return calculator. Get accurate calculations instantly.",
    "seoTitle": "Mutual Fund Nav Return | SectorCalc",
    "seoDescription": "Free online mutual fund nav return calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "initialNav",
        "label": "Initial NAV",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter initial nav"
      },
      {
        "key": "finalNav",
        "label": "Final NAV",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter final nav"
      },
      {
        "key": "distributions",
        "label": "Distributions",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter distributions"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "etf-net-annual-return",
    "title": "Etf Net Annual Return",
    "category": "finance-business",
    "description": "Free online etf net annual return calculator. Get accurate calculations instantly.",
    "seoTitle": "Etf Net Annual Return | SectorCalc",
    "seoDescription": "Free online etf net annual return calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "purchasePrice",
        "label": "Purchase Price",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter purchase price"
      },
      {
        "key": "sellingPrice",
        "label": "Selling Price",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter selling price"
      },
      {
        "key": "dividend",
        "label": "Dividend",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter dividend"
      },
      {
        "key": "expenseRatio",
        "label": "Expense Ratio",
        "unit": "%",
        "type": "number",
        "helper": "Enter expense ratio"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "futures-contract-profit",
    "title": "Futures Contract Profit",
    "category": "finance-business",
    "description": "Free online futures contract profit calculator. Get accurate calculations instantly.",
    "seoTitle": "Futures Contract Profit | SectorCalc",
    "seoDescription": "Free online futures contract profit calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "entryPrice",
        "label": "Entry Price",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter entry price"
      },
      {
        "key": "exitPrice",
        "label": "Exit Price",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter exit price"
      },
      {
        "key": "multiplier",
        "label": "Multiplier",
        "unit": "Number",
        "type": "number",
        "helper": "Enter multiplier"
      },
      {
        "key": "lots",
        "label": "Lots",
        "unit": "units",
        "type": "number",
        "helper": "Enter lots"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "black-scholes-option-price",
    "title": "Black Scholes Option Price",
    "category": "finance-business",
    "description": "Free online black scholes option price calculator. Get accurate calculations instantly.",
    "seoTitle": "Black Scholes Option Price | SectorCalc",
    "seoDescription": "Free online black scholes option price calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "stockPrice",
        "label": "Stock Price (S)",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter stock price (s)"
      },
      {
        "key": "strikePrice",
        "label": "Strike Price (K)",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter strike price (k)"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "time",
        "label": "Time (Years)",
        "unit": "years",
        "type": "number",
        "helper": "Enter time (years)"
      },
      {
        "key": "volatility",
        "label": "Volatility",
        "unit": "%",
        "type": "number",
        "helper": "Enter volatility"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "forex-pip-profit-calculator",
    "title": "Forex Pip Profit Calculator",
    "category": "finance-business",
    "description": "Free online forex pip profit calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Forex Pip Profit Calculator | SectorCalc",
    "seoDescription": "Free online forex pip profit calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "lots",
        "label": "Lots",
        "unit": "Number",
        "type": "number",
        "helper": "Enter lots"
      },
      {
        "key": "pipValue",
        "label": "Pip Value",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter pip value"
      },
      {
        "key": "pipMovement",
        "label": "Pip Movement",
        "unit": "Number",
        "type": "number",
        "helper": "Enter pip movement"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "crypto-trade-net-profit",
    "title": "Crypto Trade Net Profit",
    "category": "finance-business",
    "description": "Free online crypto trade net profit calculator. Get accurate calculations instantly.",
    "seoTitle": "Crypto Trade Net Profit | SectorCalc",
    "seoDescription": "Free online crypto trade net profit calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "purchasePrice",
        "label": "Purchase Price",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter purchase price"
      },
      {
        "key": "sale",
        "label": "Sales Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter sales amount"
      },
      {
        "key": "quantity",
        "label": "Quantity",
        "unit": "units",
        "type": "number",
        "helper": "Enter quantity"
      },
      {
        "key": "commission",
        "label": "Commission (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter commission (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "nft-trade-net-profit-eth",
    "title": "Nft Trade Net Profit Eth",
    "category": "finance-business",
    "description": "Free online nft trade net profit eth calculator. Get accurate calculations instantly.",
    "seoTitle": "Nft Trade Net Profit Eth | SectorCalc",
    "seoDescription": "Free online nft trade net profit eth calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "purchasePrice",
        "label": "Purchase Price",
        "unit": "ETH",
        "type": "number",
        "helper": "Enter purchase price"
      },
      {
        "key": "sale",
        "label": "Sales Amount",
        "unit": "ETH",
        "type": "number",
        "helper": "Enter sales amount"
      },
      {
        "key": "gas",
        "label": "Gas Fee (ETH)",
        "unit": "ETH",
        "type": "number",
        "helper": "Enter gas fee (eth)"
      },
      {
        "key": "royalty",
        "label": "Royalty (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter royalty (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "inflation-purchasing-power",
    "title": "Inflation Purchasing Power",
    "category": "finance-business",
    "description": "Free online inflation purchasing power calculator. Get accurate calculations instantly.",
    "seoTitle": "Inflation Purchasing Power | SectorCalc",
    "seoDescription": "Free online inflation purchasing power calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "nominalValue",
        "label": "Nominal Value",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter nominal value"
      },
      {
        "key": "inflation",
        "label": "Inflation Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter inflation rate (%)"
      },
      {
        "key": "years",
        "label": "Years",
        "unit": "years",
        "type": "number",
        "helper": "Enter years"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "real-investment-return",
    "title": "Real Investment Return",
    "category": "finance-business",
    "description": "Free online real investment return calculator. Get accurate calculations instantly.",
    "seoTitle": "Real Investment Return | SectorCalc",
    "seoDescription": "Free online real investment return calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "nominalReturn",
        "label": "Nominal Return (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter nominal return (%)"
      },
      {
        "key": "inflation",
        "label": "Inflation Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter inflation rate (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "alternative-opportunity-cost",
    "title": "Alternative Opportunity Cost",
    "category": "finance-business",
    "description": "Free online alternative opportunity cost calculator. Get accurate calculations instantly.",
    "seoTitle": "Alternative Opportunity Cost | SectorCalc",
    "seoDescription": "Free online alternative opportunity cost calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "preferredReturn",
        "label": "Preferred Return",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter preferred return"
      },
      {
        "key": "foregoneReturn",
        "label": "Foregone Return",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter foregone return"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "capital-gains-tax-liability",
    "title": "Capital Gains Tax Liability",
    "category": "finance-business",
    "description": "Free online capital gains tax liability calculator. Get accurate calculations instantly.",
    "seoTitle": "Capital Gains Tax Liability | SectorCalc",
    "seoDescription": "Free online capital gains tax liability calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sale",
        "label": "Sales Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter sales amount"
      },
      {
        "key": "purchasePrice",
        "label": "Purchase Price",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter purchase price"
      },
      {
        "key": "taxRate",
        "label": "Tax Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter tax rate (%)"
      },
      {
        "key": "exemption",
        "label": "Exemption Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter exemption amount"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "real-estate-property-tax",
    "title": "Real Estate Property Tax",
    "category": "finance-business",
    "description": "Free online real estate property tax calculator. Get accurate calculations instantly.",
    "seoTitle": "Real Estate Property Tax | SectorCalc",
    "seoDescription": "Free online real estate property tax calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "assessedValue",
        "label": "Assessed Value",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter assessed value"
      },
      {
        "key": "taxRate",
        "label": "Tax Rate (%)",
        "unit": "‰",
        "type": "number",
        "helper": "Enter tax rate (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mortgage-monthly-payment",
    "title": "Mortgage Monthly Payment",
    "category": "finance-business",
    "description": "Free online mortgage monthly payment calculator. Get accurate calculations instantly.",
    "seoTitle": "Mortgage Monthly Payment | SectorCalc",
    "seoDescription": "Free online mortgage monthly payment calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "loanAmount",
        "label": "Loan Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter loan amount"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "term",
        "label": "Term",
        "unit": "months",
        "type": "number",
        "helper": "Enter term"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mortgage-comparison-tool",
    "title": "Mortgage Comparison Tool",
    "category": "finance-business",
    "description": "Free online mortgage comparison tool calculator. Get accurate calculations instantly.",
    "seoTitle": "Mortgage Comparison Tool | SectorCalc",
    "seoDescription": "Free online mortgage comparison tool calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "loanAmount1",
        "label": "First Loan Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter first loan amount"
      },
      {
        "key": "interestRate1",
        "label": "First Interest Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter first interest rate (%)"
      },
      {
        "key": "loanAmount2",
        "label": "Second Loan Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter second loan amount"
      },
      {
        "key": "interestRate2",
        "label": "Second Interest Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter second interest rate (%)"
      },
      {
        "key": "term",
        "label": "Term",
        "unit": "months",
        "type": "number",
        "helper": "Enter term"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mortgage-amortization-schedule",
    "title": "Mortgage Amortization Schedule",
    "category": "finance-business",
    "description": "Free online mortgage amortization schedule calculator. Get accurate calculations instantly.",
    "seoTitle": "Mortgage Amortization Schedule | SectorCalc",
    "seoDescription": "Free online mortgage amortization schedule calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "loanAmount",
        "label": "Loan Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter loan amount"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "term",
        "label": "Term",
        "unit": "months",
        "type": "number",
        "helper": "Enter term"
      },
      {
        "key": "period",
        "label": "Period",
        "unit": "months",
        "type": "number",
        "helper": "Enter period"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mortgage-discount-points",
    "title": "Mortgage Discount Points",
    "category": "finance-business",
    "description": "Free online mortgage discount points calculator. Get accurate calculations instantly.",
    "seoTitle": "Mortgage Discount Points | SectorCalc",
    "seoDescription": "Free online mortgage discount points calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "loanAmount",
        "label": "Loan Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter loan amount"
      },
      {
        "key": "pointsRate",
        "label": "Points Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter points rate (%)"
      },
      {
        "key": "monthlySavings",
        "label": "Monthly Savings",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter monthly savings"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mortgage-refinance-breakeven",
    "title": "Mortgage Refinance Breakeven",
    "category": "finance-business",
    "description": "Free online mortgage refinance breakeven calculator. Get accurate calculations instantly.",
    "seoTitle": "Mortgage Refinance Breakeven | SectorCalc",
    "seoDescription": "Free online mortgage refinance breakeven calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "oldPayment",
        "label": "Old Monthly Payment",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter old monthly payment"
      },
      {
        "key": "newPayment",
        "label": "New Monthly Payment",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter new monthly payment"
      },
      {
        "key": "closingCost",
        "label": "Closing Cost",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter closing cost"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "cash-out-refinance-net",
    "title": "Cash Out Refinance Net",
    "category": "finance-business",
    "description": "Free online cash out refinance net calculator. Get accurate calculations instantly.",
    "seoTitle": "Cash Out Refinance Net | SectorCalc",
    "seoDescription": "Free online cash out refinance net calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "propertyValue",
        "label": "Property Value",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter property value"
      },
      {
        "key": "remainingDebt",
        "label": "Remaining Debt",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter remaining debt"
      },
      {
        "key": "newLoan",
        "label": "New Loan Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter new loan amount"
      },
      {
        "key": "fees",
        "label": "Fees",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter fees"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "home-purchase-affordability",
    "title": "Home Purchase Affordability",
    "category": "finance-business",
    "description": "Free online home purchase affordability calculator. Get accurate calculations instantly.",
    "seoTitle": "Home Purchase Affordability | SectorCalc",
    "seoDescription": "Free online home purchase affordability calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "monthlyIncome",
        "label": "Monthly Income",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter monthly income"
      },
      {
        "key": "maxDti",
        "label": "Max DTI Ratio (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter max dti ratio (%)"
      },
      {
        "key": "monthlyDebt",
        "label": "Monthly Debt Payments",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter monthly debt payments"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "term",
        "label": "Term",
        "unit": "months",
        "type": "number",
        "helper": "Enter term"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "rent-vs-buy-decision-ratio",
    "title": "Rent Vs Buy Decision Ratio",
    "category": "finance-business",
    "description": "Free online rent vs buy decision ratio calculator. Get accurate calculations instantly.",
    "seoTitle": "Rent Vs Buy Decision Ratio | SectorCalc",
    "seoDescription": "Free online rent vs buy decision ratio calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "homePrice",
        "label": "Home Purchase Price",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter home purchase price"
      },
      {
        "key": "annualRent",
        "label": "Annual Rent Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter annual rent amount"
      },
      {
        "key": "annualExpense",
        "label": "Annual Operating Expense",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter annual operating expense"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "rental-cap-rate-yield",
    "title": "Rental Cap Rate Yield",
    "category": "finance-business",
    "description": "Free online rental cap rate yield calculator. Get accurate calculations instantly.",
    "seoTitle": "Rental Cap Rate Yield | SectorCalc",
    "seoDescription": "Free online rental cap rate yield calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "annualNetIncome",
        "label": "Annual Net Income",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter annual net income"
      },
      {
        "key": "propertyValue",
        "label": "Property Value",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter property value"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "cash-on-cash-return-coc",
    "title": "Cash On Cash Return Coc",
    "category": "finance-business",
    "description": "Free online cash on cash return coc calculator. Get accurate calculations instantly.",
    "seoTitle": "Cash On Cash Return Coc | SectorCalc",
    "seoDescription": "Free online cash on cash return coc calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "annualCashFlow",
        "label": "Annual Net Cash Flow",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter annual net cash flow"
      },
      {
        "key": "totalCashInvestment",
        "label": "Total Cash Invested",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter total cash invested"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "brrrr-investment-strategy",
    "title": "Brrrr Investment Strategy",
    "category": "finance-business",
    "description": "Free online brrrr investment strategy calculator. Get accurate calculations instantly.",
    "seoTitle": "Brrrr Investment Strategy | SectorCalc",
    "seoDescription": "Free online brrrr investment strategy calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "purchase",
        "label": "Purchase Cost",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter purchase cost"
      },
      {
        "key": "rehab",
        "label": "Rehab Cost",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter rehab cost"
      },
      {
        "key": "value",
        "label": "After Repair Value (ARV)",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter after repair value (arv)"
      },
      {
        "key": "loanAmount",
        "label": "Loan Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter loan amount"
      },
      {
        "key": "rent",
        "label": "Monthly Rent",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter monthly rent"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "rental-property-net-cashflow",
    "title": "Rental Property Net Cashflow",
    "category": "finance-business",
    "description": "Free online rental property net cashflow calculator. Get accurate calculations instantly.",
    "seoTitle": "Rental Property Net Cashflow | SectorCalc",
    "seoDescription": "Free online rental property net cashflow calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "grossRent",
        "label": "Gross Monthly Rent",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter gross monthly rent"
      },
      {
        "key": "vacancy",
        "label": "Vacancy Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter vacancy rate (%)"
      },
      {
        "key": "operating",
        "label": "Monthly Operating Expense",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter monthly operating expense"
      },
      {
        "key": "loanAmount",
        "label": "Loan Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter loan amount"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "real-estate-broker-commission",
    "title": "Real Estate Broker Commission",
    "category": "finance-business",
    "description": "Free online real estate broker commission calculator. Get accurate calculations instantly.",
    "seoTitle": "Real Estate Broker Commission | SectorCalc",
    "seoDescription": "Free online real estate broker commission calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "salesPrice",
        "label": "Property Sale Price",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter property sale price"
      },
      {
        "key": "commissionRate",
        "label": "Broker Commission Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter broker commission rate (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mortgage-closing-costs-total",
    "title": "Mortgage Closing Costs Total",
    "category": "finance-business",
    "description": "Free online mortgage closing costs total calculator. Get accurate calculations instantly.",
    "seoTitle": "Mortgage Closing Costs Total | SectorCalc",
    "seoDescription": "Free online mortgage closing costs total calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "loanAmount",
        "label": "Loan Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter loan amount"
      },
      {
        "key": "rate",
        "label": "rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter rate"
      },
      {
        "key": "fixedFees",
        "label": "Fixed Closing Fees",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter fixed closing fees"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "heloc-borrowing-limit",
    "title": "Heloc Borrowing Limit",
    "category": "finance-business",
    "description": "Free online heloc borrowing limit calculator. Get accurate calculations instantly.",
    "seoTitle": "Heloc Borrowing Limit | SectorCalc",
    "seoDescription": "Free online heloc borrowing limit calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "homeValue",
        "label": "Home Market Value",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter home market value"
      },
      {
        "key": "remainingDebt",
        "label": "Remaining Debt",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter remaining debt"
      },
      {
        "key": "maxRate",
        "label": "Max Financing Ratio (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter max financing ratio (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "pmi-monthly-cost-estimator",
    "title": "Pmi Monthly Cost Estimator",
    "category": "finance-business",
    "description": "Free online pmi monthly cost estimator calculator. Get accurate calculations instantly.",
    "seoTitle": "Pmi Monthly Cost Estimator | SectorCalc",
    "seoDescription": "Free online pmi monthly cost estimator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "loanAmount",
        "label": "Loan Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter loan amount"
      },
      {
        "key": "pmiRate",
        "label": "Annual PMI Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter annual pmi rate (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "fha-loan-mortgage-cost",
    "title": "Fha Loan Mortgage Cost",
    "category": "finance-business",
    "description": "Free online fha loan mortgage cost calculator. Get accurate calculations instantly.",
    "seoTitle": "Fha Loan Mortgage Cost | SectorCalc",
    "seoDescription": "Free online fha loan mortgage cost calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "loanAmount",
        "label": "Loan Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter loan amount"
      },
      {
        "key": "upfrontPremium",
        "label": "Upfront Premium (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter upfront premium (%)"
      },
      {
        "key": "annualPremium",
        "label": "Annual Premium (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter annual premium (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "va-loan-funding-fee",
    "title": "Va Loan Funding Fee",
    "category": "finance-business",
    "description": "Free online va loan funding fee calculator. Get accurate calculations instantly.",
    "seoTitle": "Va Loan Funding Fee | SectorCalc",
    "seoDescription": "Free online va loan funding fee calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "loanAmount",
        "label": "Loan Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter loan amount"
      },
      {
        "key": "fundingFee",
        "label": "Funding Fee (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter funding fee (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "personal-loan-payment",
    "title": "Personal Loan Payment",
    "category": "finance-business",
    "description": "Free online personal loan payment calculator. Get accurate calculations instantly.",
    "seoTitle": "Personal Loan Payment | SectorCalc",
    "seoDescription": "Free online personal loan payment calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "amount",
        "label": "Loan / Debt Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter loan / debt amount"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "term",
        "label": "Term",
        "unit": "months",
        "type": "number",
        "helper": "Enter term"
      },
      {
        "key": "fees",
        "label": "Fees",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter fees"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "auto-loan-monthly-payment",
    "title": "Auto Loan Monthly Payment",
    "category": "finance-business",
    "description": "Free online auto loan monthly payment calculator. Get accurate calculations instantly.",
    "seoTitle": "Auto Loan Monthly Payment | SectorCalc",
    "seoDescription": "Free online auto loan monthly payment calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "price",
        "label": "Vehicle Price",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter vehicle price"
      },
      {
        "key": "downPayment",
        "label": "Down Payment",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter down payment"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "term",
        "label": "Term",
        "unit": "months",
        "type": "number",
        "helper": "Enter term"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "boat-loan-monthly-payment",
    "title": "Boat Loan Monthly Payment",
    "category": "finance-business",
    "description": "Free online boat loan monthly payment calculator. Get accurate calculations instantly.",
    "seoTitle": "Boat Loan Monthly Payment | SectorCalc",
    "seoDescription": "Free online boat loan monthly payment calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "price",
        "label": "Vehicle Price",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter vehicle price"
      },
      {
        "key": "downPayment",
        "label": "Down Payment",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter down payment"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "term",
        "label": "Term",
        "unit": "months",
        "type": "number",
        "helper": "Enter term"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "motorcycle-loan-payment",
    "title": "Motorcycle Loan Payment",
    "category": "finance-business",
    "description": "Free online motorcycle loan payment calculator. Get accurate calculations instantly.",
    "seoTitle": "Motorcycle Loan Payment | SectorCalc",
    "seoDescription": "Free online motorcycle loan payment calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "price",
        "label": "Vehicle Price",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter vehicle price"
      },
      {
        "key": "downPayment",
        "label": "Down Payment",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter down payment"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "term",
        "label": "Term",
        "unit": "months",
        "type": "number",
        "helper": "Enter term"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "rv-recreational-vehicle-loan",
    "title": "Rv Recreational Vehicle Loan",
    "category": "finance-business",
    "description": "Free online rv recreational vehicle loan calculator. Get accurate calculations instantly.",
    "seoTitle": "Rv Recreational Vehicle Loan | SectorCalc",
    "seoDescription": "Free online rv recreational vehicle loan calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "price",
        "label": "Vehicle Price",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter vehicle price"
      },
      {
        "key": "downPayment",
        "label": "Down Payment",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter down payment"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "term",
        "label": "Term",
        "unit": "months",
        "type": "number",
        "helper": "Enter term"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "student-loan-grace-payment",
    "title": "Student Loan Grace Payment",
    "category": "finance-business",
    "description": "Free online student loan grace payment calculator. Get accurate calculations instantly.",
    "seoTitle": "Student Loan Grace Payment | SectorCalc",
    "seoDescription": "Free online student loan grace payment calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "amount",
        "label": "Loan / Debt Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter loan / debt amount"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "term",
        "label": "Term",
        "unit": "months",
        "type": "number",
        "helper": "Enter term"
      },
      {
        "key": "gracePeriod",
        "label": "Grace Period (Months)",
        "unit": "months",
        "type": "number",
        "helper": "Enter grace period (months)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "student-loan-refinance-savings",
    "title": "Student Loan Refinance Savings",
    "category": "finance-business",
    "description": "Free online student loan refinance savings calculator. Get accurate calculations instantly.",
    "seoTitle": "Student Loan Refinance Savings | SectorCalc",
    "seoDescription": "Free online student loan refinance savings calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "oldBalance",
        "label": "Old Loan Balance",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter old loan balance"
      },
      {
        "key": "oldInterest",
        "label": "Old Interest Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter old interest rate (%)"
      },
      {
        "key": "newInterest",
        "label": "New Interest Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter new interest rate (%)"
      },
      {
        "key": "term",
        "label": "Term",
        "unit": "months",
        "type": "number",
        "helper": "Enter term"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "credit-card-accrued-interest",
    "title": "Credit Card Accrued Interest",
    "category": "finance-business",
    "description": "Free online credit card accrued interest calculator. Get accurate calculations instantly.",
    "seoTitle": "Credit Card Accrued Interest | SectorCalc",
    "seoDescription": "Free online credit card accrued interest calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "balance",
        "label": "Card Balance",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter card balance"
      },
      {
        "key": "annualInterest",
        "label": "Annual Interest Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter annual interest rate (%)"
      },
      {
        "key": "days",
        "label": "Days",
        "unit": "days",
        "type": "number",
        "helper": "Enter days"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "credit-card-minimum-payment",
    "title": "Credit Card Minimum Payment",
    "category": "finance-business",
    "description": "Free online credit card minimum payment calculator. Get accurate calculations instantly.",
    "seoTitle": "Credit Card Minimum Payment | SectorCalc",
    "seoDescription": "Free online credit card minimum payment calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "balance",
        "label": "Card Balance",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter card balance"
      },
      {
        "key": "minimumRate",
        "label": "Minimum Payment Ratio (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter minimum payment ratio (%)"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter interest rate"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "credit-card-processing-fees",
    "title": "Credit Card Processing Fees",
    "category": "finance-business",
    "description": "Free online credit card processing fees calculator. Get accurate calculations instantly.",
    "seoTitle": "Credit Card Processing Fees | SectorCalc",
    "seoDescription": "Free online credit card processing fees calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sale",
        "label": "Sales Amount",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter sales amount"
      },
      {
        "key": "percent",
        "label": "Percentage Fee (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter percentage fee (%)"
      },
      {
        "key": "fixed",
        "label": "Fixed Fee",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter fixed fee"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "debt-payoff-accelerator",
    "title": "Debt Payoff Accelerator",
    "category": "finance-business",
    "description": "Free online debt payoff accelerator calculator. Get accurate calculations instantly.",
    "seoTitle": "Debt Payoff Accelerator | SectorCalc",
    "seoDescription": "Free online debt payoff accelerator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "principal",
        "label": "Principal",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter principal"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "payment",
        "label": "Monthly Payment",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter monthly payment"
      },
      {
        "key": "extraPayment",
        "label": "Extra Monthly Payment",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter extra monthly payment"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "debt-consolidation-payment",
    "title": "Debt Consolidation Payment",
    "category": "finance-business",
    "description": "Free online debt consolidation payment calculator. Get accurate calculations instantly.",
    "seoTitle": "Debt Consolidation Payment | SectorCalc",
    "seoDescription": "Free online debt consolidation payment calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "debts",
        "label": "Total Consolidated Debts",
        "unit": "Dizi ₺",
        "type": "number",
        "helper": "Enter total consolidated debts"
      },
      {
        "key": "interests",
        "label": "Average Interest Rate (%)",
        "unit": "Dizi %",
        "type": "number",
        "helper": "Enter average interest rate (%)"
      },
      {
        "key": "newInterest",
        "label": "New Interest Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter new interest rate (%)"
      },
      {
        "key": "term",
        "label": "Term",
        "unit": "months",
        "type": "number",
        "helper": "Enter term"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "debt-to-income-dti-ratio",
    "title": "Debt To Income Dti Ratio",
    "category": "finance-business",
    "description": "Free online debt to income dti ratio calculator. Get accurate calculations instantly.",
    "seoTitle": "Debt To Income Dti Ratio | SectorCalc",
    "seoDescription": "Free online debt to income dti ratio calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "monthlyDebt",
        "label": "Monthly Debt Payments",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter monthly debt payments"
      },
      {
        "key": "grossIncome",
        "label": "Gross Annual Income",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter gross annual income"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "debt-service-coverage-dscr",
    "title": "Debt Service Coverage Dscr",
    "category": "finance-business",
    "description": "Free online debt service coverage dscr calculator. Get accurate calculations instantly.",
    "seoTitle": "Debt Service Coverage Dscr | SectorCalc",
    "seoDescription": "Free online debt service coverage dscr calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "noi",
        "label": "Net Operating Income (NOI)",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter net operating income (noi)"
      },
      {
        "key": "annualDebtService",
        "label": "Annual Debt Service",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter annual debt service"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "maximum-affordable-loan-payment",
    "title": "Maximum Affordable Loan Payment",
    "category": "finance-business",
    "description": "Free online maximum affordable loan payment calculator. Get accurate calculations instantly.",
    "seoTitle": "Maximum Affordable Loan Payment | SectorCalc",
    "seoDescription": "Free online maximum affordable loan payment calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "netIncome",
        "label": "Net Income",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter net income"
      },
      {
        "key": "livingExpense",
        "label": "Monthly Living Expense",
        "unit": "TRY",
        "type": "number",
        "helper": "Enter monthly living expense"
      },
      {
        "key": "maxPaymentRatio",
        "label": "Max Payment-to-Income Ratio (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter max payment-to-income ratio (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "foreign-currency-usd-loan-risk",
    "title": "Foreign Currency Usd Loan Risk",
    "category": "finance-business",
    "description": "Free online foreign currency usd loan risk calculator. Get accurate calculations instantly.",
    "seoTitle": "Foreign Currency Usd Loan Risk | SectorCalc",
    "seoDescription": "Free online foreign currency usd loan risk calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "amount",
        "label": "Loan / Debt Amount",
        "unit": "USD",
        "type": "number",
        "helper": "Enter loan / debt amount"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "term",
        "label": "Term",
        "unit": "months",
        "type": "number",
        "helper": "Enter term"
      },
      {
        "key": "exchangeTrend",
        "label": "Expected Exchange Rate Trend (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter expected exchange rate trend (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "business-valuation-multiplier",
    "title": "Business Valuation Multiplier",
    "category": "finance-business",
    "description": "Free online business valuation multiplier calculator. Get accurate calculations instantly.",
    "seoTitle": "Business Valuation Multiplier | SectorCalc",
    "seoDescription": "Free online business valuation multiplier calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "ebitda",
        "label": "EBITDA",
        "unit": "TL",
        "type": "number",
        "helper": "Enter ebitda"
      },
      {
        "key": "multiplier",
        "label": "Multiplier",
        "unit": "Number",
        "type": "number",
        "helper": "Enter multiplier"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "startup-pre-post-valuation",
    "title": "Startup Pre Post Valuation",
    "category": "finance-business",
    "description": "Free online startup pre post valuation calculator. Get accurate calculations instantly.",
    "seoTitle": "Startup Pre Post Valuation | SectorCalc",
    "seoDescription": "Free online startup pre post valuation calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "investment",
        "label": "Investment",
        "unit": "TL",
        "type": "number",
        "helper": "Enter investment"
      },
      {
        "key": "equityPercent",
        "label": "Equity Stake Offered (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter equity stake offered (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "espp-discounted-stock-options",
    "title": "Espp Discounted Stock Options",
    "category": "finance-business",
    "description": "Free online espp discounted stock options calculator. Get accurate calculations instantly.",
    "seoTitle": "Espp Discounted Stock Options | SectorCalc",
    "seoDescription": "Free online espp discounted stock options calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "marketPrice",
        "label": "Current Market Price",
        "unit": "TL",
        "type": "number",
        "helper": "Enter current market price"
      },
      {
        "key": "discount",
        "label": "Discount",
        "unit": "%",
        "type": "number",
        "helper": "Enter discount percentage"
      },
      {
        "key": "contribution",
        "label": "Monthly Employee Contribution",
        "unit": "TL",
        "type": "number",
        "helper": "Enter monthly employee contribution"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "rsu-net-shares-vesting",
    "title": "Rsu Net Shares Vesting",
    "category": "finance-business",
    "description": "Free online rsu net shares vesting calculator. Get accurate calculations instantly.",
    "seoTitle": "Rsu Net Shares Vesting | SectorCalc",
    "seoDescription": "Free online rsu net shares vesting calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sharesCount",
        "label": "Number of Shares / Units",
        "unit": "units",
        "type": "number",
        "helper": "Enter number of shares / units"
      },
      {
        "key": "vesting",
        "label": "Vesting Percentage (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter vesting percentage (%)"
      },
      {
        "key": "tax",
        "label": "Tax",
        "unit": "%",
        "type": "number",
        "helper": "Enter tax"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "convertible-note-shares",
    "title": "Convertible Note Shares",
    "category": "finance-business",
    "description": "Free online convertible note shares calculator. Get accurate calculations instantly.",
    "seoTitle": "Convertible Note Shares | SectorCalc",
    "seoDescription": "Free online convertible note shares calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "investment",
        "label": "Investment",
        "unit": "TL",
        "type": "number",
        "helper": "Enter investment"
      },
      {
        "key": "valuation",
        "label": "Post-money Valuation Cap",
        "unit": "TL",
        "type": "number",
        "helper": "Enter post-money valuation cap"
      },
      {
        "key": "discount",
        "label": "Discount",
        "unit": "%",
        "type": "number",
        "helper": "Enter discount percentage"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "safe-note-equity-shares",
    "title": "Safe Note Equity Shares",
    "category": "finance-business",
    "description": "Free online safe note equity shares calculator. Get accurate calculations instantly.",
    "seoTitle": "Safe Note Equity Shares | SectorCalc",
    "seoDescription": "Free online safe note equity shares calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "investment",
        "label": "Investment",
        "unit": "TL",
        "type": "number",
        "helper": "Enter investment"
      },
      {
        "key": "capValue",
        "label": "Valuation Cap Amount",
        "unit": "TL",
        "type": "number",
        "helper": "Enter valuation cap amount"
      },
      {
        "key": "totalShares",
        "label": "Total Company Shares Outstanding",
        "unit": "units",
        "type": "number",
        "helper": "Enter total company shares outstanding"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "equity-share-dilution-percent",
    "title": "Equity Share Dilution Percent",
    "category": "finance-business",
    "description": "Free online equity share dilution percent calculator. Get accurate calculations instantly.",
    "seoTitle": "Equity Share Dilution Percent | SectorCalc",
    "seoDescription": "Free online equity share dilution percent calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "currentShares",
        "label": "Current Shares Outstanding",
        "unit": "units",
        "type": "number",
        "helper": "Enter current shares outstanding"
      },
      {
        "key": "newShares",
        "label": "New Shares to Issue",
        "unit": "units",
        "type": "number",
        "helper": "Enter new shares to issue"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "cap-table-ownership-spread",
    "title": "Cap Table Ownership Spread",
    "category": "finance-business",
    "description": "Free online cap table ownership spread calculator. Get accurate calculations instantly.",
    "seoTitle": "Cap Table Ownership Spread | SectorCalc",
    "seoDescription": "Free online cap table ownership spread calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "founders",
        "label": "Founders' Shares",
        "unit": "units",
        "type": "number",
        "helper": "Enter founders' shares"
      },
      {
        "key": "investors",
        "label": "Investors' Shares",
        "unit": "units",
        "type": "number",
        "helper": "Enter investors' shares"
      },
      {
        "key": "options",
        "label": "Option Pool Shares",
        "unit": "units",
        "type": "number",
        "helper": "Enter option pool shares"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "cac-customer-acquisition-cost",
    "title": "Cac Customer Acquisition Cost",
    "category": "finance-business",
    "description": "Free online cac customer acquisition cost calculator. Get accurate calculations instantly.",
    "seoTitle": "Cac Customer Acquisition Cost | SectorCalc",
    "seoDescription": "Free online cac customer acquisition cost calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "marketing",
        "label": "Marketing Expenses",
        "unit": "TL",
        "type": "number",
        "helper": "Enter marketing expenses"
      },
      {
        "key": "salesExpense",
        "label": "Sales Expenses",
        "unit": "TL",
        "type": "number",
        "helper": "Enter sales expenses"
      },
      {
        "key": "newCustomers",
        "label": "New Customers Acquired",
        "unit": "units",
        "type": "number",
        "helper": "Enter new customers acquired"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "clv-customer-lifetime-value",
    "title": "Clv Customer Lifetime Value",
    "category": "finance-business",
    "description": "Free online clv customer lifetime value calculator. Get accurate calculations instantly.",
    "seoTitle": "Clv Customer Lifetime Value | SectorCalc",
    "seoDescription": "Free online clv customer lifetime value calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "avgOrder",
        "label": "Average Order Value",
        "unit": "TL",
        "type": "number",
        "helper": "Enter average order value"
      },
      {
        "key": "frequency",
        "label": "Frequency (Hz)",
        "unit": "units",
        "type": "number",
        "helper": "Enter frequency (hz)"
      },
      {
        "key": "usefulLife",
        "label": "Useful Life",
        "unit": "years",
        "type": "number",
        "helper": "Enter useful life"
      },
      {
        "key": "margin",
        "label": "Gross Margin (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter gross margin (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "clv-to-cac-efficiency-ratio",
    "title": "Clv To Cac Efficiency Ratio",
    "category": "finance-business",
    "description": "Free online clv to cac efficiency ratio calculator. Get accurate calculations instantly.",
    "seoTitle": "Clv To Cac Efficiency Ratio | SectorCalc",
    "seoDescription": "Free online clv to cac efficiency ratio calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "clv",
        "label": "clv",
        "unit": "TL",
        "type": "number",
        "helper": "Enter clv"
      },
      {
        "key": "cac",
        "label": "cac",
        "unit": "TL",
        "type": "number",
        "helper": "Enter cac"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "marketing-campaign-roi",
    "title": "Marketing Campaign Roi",
    "category": "finance-business",
    "description": "Free online marketing campaign roi calculator. Get accurate calculations instantly.",
    "seoTitle": "Marketing Campaign Roi | SectorCalc",
    "seoDescription": "Free online marketing campaign roi calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "campaignRevenue",
        "label": "Campaign Revenue",
        "unit": "TL",
        "type": "number",
        "helper": "Enter campaign revenue"
      },
      {
        "key": "campaignCost",
        "label": "Campaign Cost",
        "unit": "TL",
        "type": "number",
        "helper": "Enter campaign cost"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "conversion-rate-optimization-cro",
    "title": "Conversion Rate Optimization Cro",
    "category": "finance-business",
    "description": "Free online conversion rate optimization cro calculator. Get accurate calculations instantly.",
    "seoTitle": "Conversion Rate Optimization Cro | SectorCalc",
    "seoDescription": "Free online conversion rate optimization cro calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "visitors",
        "label": "Total Visitors",
        "unit": "units",
        "type": "number",
        "helper": "Enter total visitors"
      },
      {
        "key": "conversion",
        "label": "Internal-to-External Conversion Rate (%)",
        "unit": "units",
        "type": "number",
        "helper": "Enter internal-to-external conversion rate (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "click-through-rate-ctr",
    "title": "Click Through Rate Ctr",
    "category": "finance-business",
    "description": "Free online click through rate ctr calculator. Get accurate calculations instantly.",
    "seoTitle": "Click Through Rate Ctr | SectorCalc",
    "seoDescription": "Free online click through rate ctr calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "clicks",
        "label": "Total Ad Clicks",
        "unit": "units",
        "type": "number",
        "helper": "Enter total ad clicks"
      },
      {
        "key": "impressions",
        "label": "Total Ad Impressions",
        "unit": "units",
        "type": "number",
        "helper": "Enter total ad impressions"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "cost-per-click-cpc",
    "title": "Cost Per Click Cpc",
    "category": "finance-business",
    "description": "Free online cost per click cpc calculator. Get accurate calculations instantly.",
    "seoTitle": "Cost Per Click Cpc | SectorCalc",
    "seoDescription": "Free online cost per click cpc calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "totalSpend",
        "label": "Total Advertising Budget Spent",
        "unit": "TL",
        "type": "number",
        "helper": "Enter total advertising budget spent"
      },
      {
        "key": "clicks",
        "label": "Total Ad Clicks",
        "unit": "units",
        "type": "number",
        "helper": "Enter total ad clicks"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "cost-per-mille-cpm",
    "title": "Cost Per Mille Cpm",
    "category": "finance-business",
    "description": "Free online cost per mille cpm calculator. Get accurate calculations instantly.",
    "seoTitle": "Cost Per Mille Cpm | SectorCalc",
    "seoDescription": "Free online cost per mille cpm calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "adCost",
        "label": "Total Campaign Cost",
        "unit": "TL",
        "type": "number",
        "helper": "Enter total campaign cost"
      },
      {
        "key": "impressions",
        "label": "Total Ad Impressions",
        "unit": "units",
        "type": "number",
        "helper": "Enter total ad impressions"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "customer-churn-rate-percent",
    "title": "Customer Churn Rate Percent",
    "category": "finance-business",
    "description": "Free online customer churn rate percent calculator. Get accurate calculations instantly.",
    "seoTitle": "Customer Churn Rate Percent | SectorCalc",
    "seoDescription": "Free online customer churn rate percent calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "startCustomers",
        "label": "Starting Customers",
        "unit": "units",
        "type": "number",
        "helper": "Enter starting customers"
      },
      {
        "key": "lostCustomers",
        "label": "Lost Customers",
        "unit": "units",
        "type": "number",
        "helper": "Enter lost customers"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "cash-runway-burn-rate",
    "title": "Cash Runway Burn Rate",
    "category": "finance-business",
    "description": "Free online cash runway burn rate calculator. Get accurate calculations instantly.",
    "seoTitle": "Cash Runway Burn Rate | SectorCalc",
    "seoDescription": "Free online cash runway burn rate calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "startCash",
        "label": "Starting Cash Balance",
        "unit": "TL",
        "type": "number",
        "helper": "Enter starting cash balance"
      },
      {
        "key": "endCash",
        "label": "Ending Cash Balance",
        "unit": "TL",
        "type": "number",
        "helper": "Enter ending cash balance"
      },
      {
        "key": "ay",
        "label": "ay",
        "unit": "months",
        "type": "number",
        "helper": "Enter ay"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "working-capital-liquidity",
    "title": "Working Capital Liquidity",
    "category": "finance-business",
    "description": "Free online working capital liquidity calculator. Get accurate calculations instantly.",
    "seoTitle": "Working Capital Liquidity | SectorCalc",
    "seoDescription": "Free online working capital liquidity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "currentAssets",
        "label": "Current Assets",
        "unit": "TL",
        "type": "number",
        "helper": "Enter current assets"
      },
      {
        "key": "currentLiabilities",
        "label": "Current Liabilities",
        "unit": "TL",
        "type": "number",
        "helper": "Enter current liabilities"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "receivables-turnover-days",
    "title": "Receivables Turnover Days",
    "category": "finance-business",
    "description": "Free online receivables turnover days calculator. Get accurate calculations instantly.",
    "seoTitle": "Receivables Turnover Days | SectorCalc",
    "seoDescription": "Free online receivables turnover days calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "annualSales",
        "label": "Annual Credit Sales",
        "unit": "TL",
        "type": "number",
        "helper": "Enter annual credit sales"
      },
      {
        "key": "avgReceivables",
        "label": "Average Accounts Receivable",
        "unit": "TL",
        "type": "number",
        "helper": "Enter average accounts receivable"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "payables-turnover-days",
    "title": "Payables Turnover Days",
    "category": "finance-business",
    "description": "Free online payables turnover days calculator. Get accurate calculations instantly.",
    "seoTitle": "Payables Turnover Days | SectorCalc",
    "seoDescription": "Free online payables turnover days calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "annualCogs",
        "label": "Annual COGS (Cost of Goods Sold)",
        "unit": "TL",
        "type": "number",
        "helper": "Enter annual cogs (cost of goods sold)"
      },
      {
        "key": "avgPayables",
        "label": "Average Accounts Payable",
        "unit": "TL",
        "type": "number",
        "helper": "Enter average accounts payable"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "inventory-turnover-days",
    "title": "Inventory Turnover Days",
    "category": "finance-business",
    "description": "Free online inventory turnover days calculator. Get accurate calculations instantly.",
    "seoTitle": "Inventory Turnover Days | SectorCalc",
    "seoDescription": "Free online inventory turnover days calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "annualCogs",
        "label": "Annual COGS (Cost of Goods Sold)",
        "unit": "TL",
        "type": "number",
        "helper": "Enter annual cogs (cost of goods sold)"
      },
      {
        "key": "avgInventory",
        "label": "Average Inventory",
        "unit": "TL",
        "type": "number",
        "helper": "Enter average inventory"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "cash-conversion-cycle-ccc",
    "title": "Cash Conversion Cycle Ccc",
    "category": "finance-business",
    "description": "Free online cash conversion cycle ccc calculator. Get accurate calculations instantly.",
    "seoTitle": "Cash Conversion Cycle Ccc | SectorCalc",
    "seoDescription": "Free online cash conversion cycle ccc calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "daysInventory",
        "label": "Days Inventory Outstanding",
        "unit": "days",
        "type": "number",
        "helper": "Enter days inventory outstanding"
      },
      {
        "key": "daysReceivables",
        "label": "Days Receivables Outstanding",
        "unit": "days",
        "type": "number",
        "helper": "Enter days receivables outstanding"
      },
      {
        "key": "daysPayables",
        "label": "Days Payables Outstanding",
        "unit": "days",
        "type": "number",
        "helper": "Enter days payables outstanding"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "unit-contribution-margin",
    "title": "Unit Contribution Margin",
    "category": "finance-business",
    "description": "Free online unit contribution margin calculator. Get accurate calculations instantly.",
    "seoTitle": "Unit Contribution Margin | SectorCalc",
    "seoDescription": "Free online unit contribution margin calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sellingPrice",
        "label": "Selling Price",
        "unit": "TL",
        "type": "number",
        "helper": "Enter selling price"
      },
      {
        "key": "degiskenmaliyet",
        "label": "degiskenmaliyet",
        "unit": "TL",
        "type": "number",
        "helper": "Enter degiskenmaliyet"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "gross-net-profit-margins",
    "title": "Gross Net Profit Margins",
    "category": "finance-business",
    "description": "Free online gross net profit margins calculator. Get accurate calculations instantly.",
    "seoTitle": "Gross Net Profit Margins | SectorCalc",
    "seoDescription": "Free online gross net profit margins calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "revenue",
        "label": "Gross Revenue",
        "unit": "TL",
        "type": "number",
        "helper": "Enter gross revenue"
      },
      {
        "key": "cogs",
        "label": "COGS",
        "unit": "TL",
        "type": "number",
        "helper": "Enter cogs"
      },
      {
        "key": "operatingExpense",
        "label": "Operating Expenses",
        "unit": "TL",
        "type": "number",
        "helper": "Enter operating expenses"
      },
      {
        "key": "tax",
        "label": "Tax",
        "unit": "TL",
        "type": "number",
        "helper": "Enter tax"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "operating-ebitda-margin-percent",
    "title": "Operating Ebitda Margin Percent",
    "category": "finance-business",
    "description": "Free online operating ebitda margin percent calculator. Get accurate calculations instantly.",
    "seoTitle": "Operating Ebitda Margin Percent | SectorCalc",
    "seoDescription": "Free online operating ebitda margin percent calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "ebitda",
        "label": "EBITDA",
        "unit": "TL",
        "type": "number",
        "helper": "Enter ebitda"
      },
      {
        "key": "revenue",
        "label": "Gross Revenue",
        "unit": "TL",
        "type": "number",
        "helper": "Enter gross revenue"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "consultant-minimum-hourly-rate",
    "title": "Consultant Minimum Hourly Rate",
    "category": "finance-business",
    "description": "Free online consultant minimum hourly rate calculator. Get accurate calculations instantly.",
    "seoTitle": "Consultant Minimum Hourly Rate | SectorCalc",
    "seoDescription": "Free online consultant minimum hourly rate calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "targetRevenue",
        "label": "Target Annual Revenue",
        "unit": "TL",
        "type": "number",
        "helper": "Enter target annual revenue"
      },
      {
        "key": "annualExpense",
        "label": "Annual Operating Expense",
        "unit": "TL",
        "type": "number",
        "helper": "Enter annual operating expense"
      },
      {
        "key": "billableHours",
        "label": "Annual Billable Hours",
        "unit": "Saat",
        "type": "number",
        "helper": "Enter annual billable hours"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "freelancer-target-hourly-rate",
    "title": "Freelancer Target Hourly Rate",
    "category": "finance-business",
    "description": "Free online freelancer target hourly rate calculator. Get accurate calculations instantly.",
    "seoTitle": "Freelancer Target Hourly Rate | SectorCalc",
    "seoDescription": "Free online freelancer target hourly rate calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "targetNet",
        "label": "Target Net Monthly Income",
        "unit": "TL",
        "type": "number",
        "helper": "Enter target net monthly income"
      },
      {
        "key": "tax",
        "label": "Tax",
        "unit": "%",
        "type": "number",
        "helper": "Enter tax"
      },
      {
        "key": "gider",
        "label": "gider",
        "unit": "TL",
        "type": "number",
        "helper": "Enter gider"
      },
      {
        "key": "workingHours",
        "label": "Monthly Working Hours",
        "unit": "Saat",
        "type": "number",
        "helper": "Enter monthly working hours"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "amazon-fba-net-profit",
    "title": "Amazon Fba Net Profit",
    "category": "finance-business",
    "description": "Free online amazon fba net profit calculator. Get accurate calculations instantly.",
    "seoTitle": "Amazon Fba Net Profit | SectorCalc",
    "seoDescription": "Free online amazon fba net profit calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sale",
        "label": "Sales Amount",
        "unit": "TL",
        "type": "number",
        "helper": "Enter sales amount"
      },
      {
        "key": "productCost",
        "label": "Product Cost per Unit",
        "unit": "TL",
        "type": "number",
        "helper": "Enter product cost per unit"
      },
      {
        "key": "fbaFee",
        "label": "Amazon FBA Fee per Unit",
        "unit": "TL",
        "type": "number",
        "helper": "Enter amazon fba fee per unit"
      },
      {
        "key": "commission",
        "label": "Commission (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter commission (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "shopify-store-net-profit",
    "title": "Shopify Store Net Profit",
    "category": "finance-business",
    "description": "Free online shopify store net profit calculator. Get accurate calculations instantly.",
    "seoTitle": "Shopify Store Net Profit | SectorCalc",
    "seoDescription": "Free online shopify store net profit calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sale",
        "label": "Sales Amount",
        "unit": "TL",
        "type": "number",
        "helper": "Enter sales amount"
      },
      {
        "key": "product",
        "label": "Product Cost",
        "unit": "TL",
        "type": "number",
        "helper": "Enter product cost"
      },
      {
        "key": "shipping",
        "label": "Shipping Cost per Order",
        "unit": "TL",
        "type": "number",
        "helper": "Enter shipping cost per order"
      },
      {
        "key": "platform",
        "label": "Platform Transaction Fee (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter platform transaction fee (%)"
      },
      {
        "key": "fixed",
        "label": "Fixed Fee",
        "unit": "TL",
        "type": "number",
        "helper": "Enter fixed fee"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "etsy-seller-fee-net",
    "title": "Etsy Seller Fee Net",
    "category": "finance-business",
    "description": "Free online etsy seller fee net calculator. Get accurate calculations instantly.",
    "seoTitle": "Etsy Seller Fee Net | SectorCalc",
    "seoDescription": "Free online etsy seller fee net calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sale",
        "label": "Sales Amount",
        "unit": "TL",
        "type": "number",
        "helper": "Enter sales amount"
      },
      {
        "key": "listing",
        "label": "Listing Fees",
        "unit": "TL",
        "type": "number",
        "helper": "Enter listing fees"
      },
      {
        "key": "transaction",
        "label": "Transaction Fee (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter transaction fee (%)"
      },
      {
        "key": "payment",
        "label": "Monthly Payment",
        "unit": "%",
        "type": "number",
        "helper": "Enter monthly payment"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "ebay-seller-fee-net",
    "title": "Ebay Seller Fee Net",
    "category": "finance-business",
    "description": "Free online ebay seller fee net calculator. Get accurate calculations instantly.",
    "seoTitle": "Ebay Seller Fee Net | SectorCalc",
    "seoDescription": "Free online ebay seller fee net calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sale",
        "label": "Sales Amount",
        "unit": "TL",
        "type": "number",
        "helper": "Enter sales amount"
      },
      {
        "key": "category",
        "label": "category",
        "unit": "%",
        "type": "number",
        "helper": "Enter category"
      },
      {
        "key": "fixed",
        "label": "Fixed Fee",
        "unit": "TL",
        "type": "number",
        "helper": "Enter fixed fee"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "dropshipping-net-profit",
    "title": "Dropshipping Net Profit",
    "category": "finance-business",
    "description": "Free online dropshipping net profit calculator. Get accurate calculations instantly.",
    "seoTitle": "Dropshipping Net Profit | SectorCalc",
    "seoDescription": "Free online dropshipping net profit calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sale",
        "label": "Sales Amount",
        "unit": "TL",
        "type": "number",
        "helper": "Enter sales amount"
      },
      {
        "key": "supply",
        "label": "Product Supply Cost",
        "unit": "TL",
        "type": "number",
        "helper": "Enter product supply cost"
      },
      {
        "key": "shipping",
        "label": "Shipping Cost per Order",
        "unit": "TL",
        "type": "number",
        "helper": "Enter shipping cost per order"
      },
      {
        "key": "ads",
        "label": "Advertising Cost",
        "unit": "TL",
        "type": "number",
        "helper": "Enter advertising cost"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "ecommerce-store-net-margin",
    "title": "Ecommerce Store Net Margin",
    "category": "finance-business",
    "description": "Free online ecommerce store net margin calculator. Get accurate calculations instantly.",
    "seoTitle": "Ecommerce Store Net Margin | SectorCalc",
    "seoDescription": "Free online ecommerce store net margin calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "revenue",
        "label": "Gross Revenue",
        "unit": "TL",
        "type": "number",
        "helper": "Enter gross revenue"
      },
      {
        "key": "cogs",
        "label": "COGS",
        "unit": "TL",
        "type": "number",
        "helper": "Enter cogs"
      },
      {
        "key": "marketing",
        "label": "Marketing Expenses",
        "unit": "TL",
        "type": "number",
        "helper": "Enter marketing expenses"
      },
      {
        "key": "operations",
        "label": "Operational Expenses",
        "unit": "TL",
        "type": "number",
        "helper": "Enter operational expenses"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "freight-shipping-desi-cost",
    "title": "Freight Shipping Desi Cost",
    "category": "finance-business",
    "description": "Free online freight shipping desi cost calculator. Get accurate calculations instantly.",
    "seoTitle": "Freight Shipping Desi Cost | SectorCalc",
    "seoDescription": "Free online freight shipping desi cost calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "weight",
        "label": "weight",
        "unit": "kg",
        "type": "number",
        "helper": "Enter weight"
      },
      {
        "key": "volume",
        "label": "volume",
        "unit": "m3",
        "type": "number",
        "helper": "Enter volume"
      },
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "km",
        "type": "number",
        "helper": "Enter distance traveled"
      },
      {
        "key": "unitPrice",
        "label": "unitPrice",
        "unit": "TL",
        "type": "number",
        "helper": "Enter unitprice"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "volumetric-weight-desi",
    "title": "Volumetric Weight Desi",
    "category": "finance-business",
    "description": "Free online volumetric weight desi calculator. Get accurate calculations instantly.",
    "seoTitle": "Volumetric Weight Desi | SectorCalc",
    "seoDescription": "Free online volumetric weight desi calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "width",
        "label": "Section Width (m)",
        "unit": "cm",
        "type": "number",
        "helper": "Enter section width (m)"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "cm",
        "type": "number",
        "helper": "Enter component length (m)"
      },
      {
        "key": "height",
        "label": "Section Height (m)",
        "unit": "cm",
        "type": "number",
        "helper": "Enter section height (m)"
      },
      {
        "key": "divisor",
        "label": "Volumetric Divisor",
        "unit": "Number",
        "type": "number",
        "helper": "Enter volumetric divisor"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "customs-duty-import-tariff",
    "title": "Customs Duty Import Tariff",
    "category": "finance-business",
    "description": "Free online customs duty import tariff calculator. Get accurate calculations instantly.",
    "seoTitle": "Customs Duty Import Tariff | SectorCalc",
    "seoDescription": "Free online customs duty import tariff calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "cifValue",
        "label": "CIF Value (Cost, Insurance & Freight)",
        "unit": "TL",
        "type": "number",
        "helper": "Enter cif value (cost, insurance & freight)"
      },
      {
        "key": "dutyRate",
        "label": "Customs Duty Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter customs duty rate (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "additional-origin-import-tax",
    "title": "Additional Origin Import Tax",
    "category": "finance-business",
    "description": "Free online additional origin import tax calculator. Get accurate calculations instantly.",
    "seoTitle": "Additional Origin Import Tax | SectorCalc",
    "seoDescription": "Free online additional origin import tax calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "productValue",
        "label": "Product Value",
        "unit": "TL",
        "type": "number",
        "helper": "Enter product value"
      },
      {
        "key": "additionalTax",
        "label": "Additional Tax Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter additional tax rate (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "eu-ioss-vat-vat-calculator",
    "title": "Eu Ioss Vat Vat Calculator",
    "category": "finance-business",
    "description": "Free online eu ioss vat vat calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Eu Ioss Vat Vat Calculator | SectorCalc",
    "seoDescription": "Free online eu ioss vat vat calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "netPrice",
        "label": "Net Price before VAT",
        "unit": "EUR",
        "type": "number",
        "helper": "Enter net price before vat"
      },
      {
        "key": "shipping",
        "label": "Shipping Cost per Order",
        "unit": "EUR",
        "type": "number",
        "helper": "Enter shipping cost per order"
      },
      {
        "key": "countryVat",
        "label": "Destination Country VAT Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter destination country vat rate (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "stripe-paypal-payment-processor",
    "title": "Stripe Paypal Payment Processor",
    "category": "finance-business",
    "description": "Free online stripe paypal payment processor calculator. Get accurate calculations instantly.",
    "seoTitle": "Stripe Paypal Payment Processor | SectorCalc",
    "seoDescription": "Free online stripe paypal payment processor calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sale",
        "label": "Sales Amount",
        "unit": "TL",
        "type": "number",
        "helper": "Enter sales amount"
      },
      {
        "key": "percent",
        "label": "Percentage Fee (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter percentage fee (%)"
      },
      {
        "key": "fixed",
        "label": "Fixed Fee",
        "unit": "TL",
        "type": "number",
        "helper": "Enter fixed fee"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "economic-order-quantity-eoq",
    "title": "Economic Order Quantity Eoq",
    "category": "logistics-travel",
    "description": "Free online economic order quantity eoq calculator. Get accurate calculations instantly.",
    "seoTitle": "Economic Order Quantity Eoq | SectorCalc",
    "seoDescription": "Free online economic order quantity eoq calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "annualDemand",
        "label": "Annual Product Demand",
        "unit": "units",
        "type": "number",
        "helper": "Enter annual product demand"
      },
      {
        "key": "orderingCost",
        "label": "Order Placement Cost per Order",
        "unit": "TL",
        "type": "number",
        "helper": "Enter order placement cost per order"
      },
      {
        "key": "holdingCost",
        "label": "Inventory Carrying Cost per Unit/Year",
        "unit": "TL",
        "type": "number",
        "helper": "Enter inventory carrying cost per unit/year"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "safety-stock-reorder-point",
    "title": "Safety Stock Reorder Point",
    "category": "logistics-travel",
    "description": "Free online safety stock reorder point calculator. Get accurate calculations instantly.",
    "seoTitle": "Safety Stock Reorder Point | SectorCalc",
    "seoDescription": "Free online safety stock reorder point calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "avgDemand",
        "label": "Average Daily Demand",
        "unit": "units",
        "type": "number",
        "helper": "Enter average daily demand"
      },
      {
        "key": "stdDev",
        "label": "Standard Deviation of Daily Demand",
        "unit": "units",
        "type": "number",
        "helper": "Enter standard deviation of daily demand"
      },
      {
        "key": "leadTime",
        "label": "Supplier Lead Time (Days)",
        "unit": "days",
        "type": "number",
        "helper": "Enter supplier lead time (days)"
      },
      {
        "key": "zScore",
        "label": "Service Level Factor (Z-Score)",
        "unit": "Number",
        "type": "number",
        "helper": "Enter service level factor (z-score)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "inventory-turnover-ratio",
    "title": "Inventory Turnover Ratio",
    "category": "logistics-travel",
    "description": "Free online inventory turnover ratio calculator. Get accurate calculations instantly.",
    "seoTitle": "Inventory Turnover Ratio | SectorCalc",
    "seoDescription": "Free online inventory turnover ratio calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "annualCogs",
        "label": "Annual COGS (Cost of Goods Sold)",
        "unit": "TL",
        "type": "number",
        "helper": "Enter annual cogs (cost of goods sold)"
      },
      {
        "key": "avgInventory",
        "label": "Average Inventory",
        "unit": "TL",
        "type": "number",
        "helper": "Enter average inventory"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "abc-inventory-classification",
    "title": "Abc Inventory Classification",
    "category": "logistics-travel",
    "description": "Free online abc inventory classification calculator. Get accurate calculations instantly.",
    "seoTitle": "Abc Inventory Classification | SectorCalc",
    "seoDescription": "Free online abc inventory classification calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "annualDemand",
        "label": "Annual Product Demand",
        "unit": "units",
        "type": "number",
        "helper": "Enter annual product demand"
      },
      {
        "key": "birimmaliyet",
        "label": "birimmaliyet",
        "unit": "TL",
        "type": "number",
        "helper": "Enter birimmaliyet"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "shipping-container-box-loading",
    "title": "Shipping Container Box Loading",
    "category": "logistics-travel",
    "description": "Free online shipping container box loading calculator. Get accurate calculations instantly.",
    "seoTitle": "Shipping Container Box Loading | SectorCalc",
    "seoDescription": "Free online shipping container box loading calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "konteynerhacim",
        "label": "konteynerhacim",
        "unit": "m3",
        "type": "number",
        "helper": "Enter konteynerhacim"
      },
      {
        "key": "kutuhacim",
        "label": "kutuhacim",
        "unit": "m3",
        "type": "number",
        "helper": "Enter kutuhacim"
      },
      {
        "key": "istifleme",
        "label": "istifleme",
        "unit": "%",
        "type": "number",
        "helper": "Enter istifleme"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "warehouse-pallet-storage-capacity",
    "title": "Warehouse Pallet Storage Capacity",
    "category": "logistics-travel",
    "description": "Free online warehouse pallet storage capacity calculator. Get accurate calculations instantly.",
    "seoTitle": "Warehouse Pallet Storage Capacity | SectorCalc",
    "seoDescription": "Free online warehouse pallet storage capacity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "toplamalan",
        "label": "toplamalan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter toplamalan"
      },
      {
        "key": "rafkullanimi",
        "label": "rafkullanimi",
        "unit": "%",
        "type": "number",
        "helper": "Enter rafkullanimi"
      },
      {
        "key": "paletalani",
        "label": "paletalani",
        "unit": "m2",
        "type": "number",
        "helper": "Enter paletalani"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "freight-trucking-distance-cost",
    "title": "Freight Trucking Distance Cost",
    "category": "logistics-travel",
    "description": "Free online freight trucking distance cost calculator. Get accurate calculations instantly.",
    "seoTitle": "Freight Trucking Distance Cost | SectorCalc",
    "seoDescription": "Free online freight trucking distance cost calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "km",
        "type": "number",
        "helper": "Enter distance traveled"
      },
      {
        "key": "tonaj",
        "label": "tonaj",
        "unit": "Ton",
        "type": "number",
        "helper": "Enter tonaj"
      },
      {
        "key": "unitPrice",
        "label": "unitPrice",
        "unit": "TL/Ton-km",
        "type": "number",
        "helper": "Enter unitprice"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "fleet-fuel-distance-cost",
    "title": "Fleet Fuel Distance Cost",
    "category": "logistics-travel",
    "description": "Free online fleet fuel distance cost calculator. Get accurate calculations instantly.",
    "seoTitle": "Fleet Fuel Distance Cost | SectorCalc",
    "seoDescription": "Free online fleet fuel distance cost calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "km",
        "type": "number",
        "helper": "Enter distance traveled"
      },
      {
        "key": "tuketim",
        "label": "tuketim",
        "unit": "L/100km",
        "type": "number",
        "helper": "Enter tuketim"
      },
      {
        "key": "litrefiyati",
        "label": "litrefiyati",
        "unit": "TL",
        "type": "number",
        "helper": "Enter litrefiyati"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "aviation-passenger-seat-cost",
    "title": "Aviation Passenger Seat Cost",
    "category": "logistics-travel",
    "description": "Free online aviation passenger seat cost calculator. Get accurate calculations instantly.",
    "seoTitle": "Aviation Passenger Seat Cost | SectorCalc",
    "seoDescription": "Free online aviation passenger seat cost calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "km",
        "type": "number",
        "helper": "Enter distance traveled"
      },
      {
        "key": "yolcusayisi",
        "label": "yolcusayisi",
        "unit": "units",
        "type": "number",
        "helper": "Enter yolcusayisi"
      },
      {
        "key": "koltukmaliyeti",
        "label": "koltukmaliyeti",
        "unit": "TL/km",
        "type": "number",
        "helper": "Enter koltukmaliyeti"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "ride-hailing-taxi-uber-fare",
    "title": "Ride Hailing Taxi Uber Fare",
    "category": "logistics-travel",
    "description": "Free online ride hailing taxi uber fare calculator. Get accurate calculations instantly.",
    "seoTitle": "Ride Hailing Taxi Uber Fare | SectorCalc",
    "seoDescription": "Free online ride hailing taxi uber fare calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "acilis",
        "label": "acilis",
        "unit": "TL",
        "type": "number",
        "helper": "Enter acilis"
      },
      {
        "key": "kmfiyati",
        "label": "kmfiyati",
        "unit": "TL",
        "type": "number",
        "helper": "Enter kmfiyati"
      },
      {
        "key": "dakikafiyati",
        "label": "dakikafiyati",
        "unit": "TL",
        "type": "number",
        "helper": "Enter dakikafiyati"
      },
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "km",
        "type": "number",
        "helper": "Enter distance traveled"
      },
      {
        "key": "duration",
        "label": "Duration",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter duration"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "overall-equipment-effectiveness-oee",
    "title": "Overall Equipment Effectiveness Oee",
    "category": "manufacturing-workshop",
    "description": "Free online overall equipment effectiveness oee calculator. Get accurate calculations instantly.",
    "seoTitle": "Overall Equipment Effectiveness Oee | SectorCalc",
    "seoDescription": "Free online overall equipment effectiveness oee calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "availability",
        "label": "Availability Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter availability rate (%)"
      },
      {
        "key": "performance",
        "label": "Performance Efficiency (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter performance efficiency (%)"
      },
      {
        "key": "quality",
        "label": "Quality Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter quality rate (%)"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "smed-mold-setup-reduction",
    "title": "Smed Mold Setup Reduction",
    "category": "manufacturing-workshop",
    "description": "Calculate machine setup time reduction, annual downtime hours saved, and total cost savings using Lean SMED methodologies.",
    "seoTitle": "SMED Setup Time & Cost Reduction Calculator | SectorCalc",
    "seoDescription": "Free online Lean SMED calculator. Estimate setup time reductions, annual machine capacity gain, and manufacturing cost savings.",
    "inputs": [
      {
        "key": "currentInternalTime",
        "label": "Current Internal Setup Time",
        "unit": "min",
        "type": "number",
        "helper": "Active setup duration when machine is fully stopped"
      },
      {
        "key": "currentExternalTime",
        "label": "Current External Setup Time",
        "unit": "min",
        "type": "number",
        "helper": "Setup tasks completed while machine is running"
      },
      {
        "key": "conversionPercentage",
        "label": "Internal-to-External Conversion",
        "unit": "%",
        "type": "number",
        "helper": "Percentage of internal tasks converted to external prep"
      },
      {
        "key": "reductionPercentage",
        "label": "Remaining Internal Task Reduction",
        "unit": "%",
        "type": "number",
        "helper": "Percentage reduction of the remaining internal task times"
      },
      {
        "key": "hourlyDowntimeCost",
        "label": "Hourly Machine Downtime Cost",
        "unit": "USD",
        "type": "number",
        "helper": "Cost of machine downtime per hour (labor + opportunity cost)"
      },
      {
        "key": "setupsPerYear",
        "label": "Setups Per Year",
        "unit": "count",
        "type": "number",
        "helper": "Total number of changeovers or setups performed annually"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Process standardization costs",
      "Operator training overhead",
      "Setup tooling capital expenditures"
    ]
  },
  {
    "slug": "manufacturing-learning-curve",
    "title": "Manufacturing Learning Curve",
    "category": "manufacturing-workshop",
    "description": "Free online manufacturing learning curve calculator. Get accurate calculations instantly.",
    "seoTitle": "Manufacturing Learning Curve | SectorCalc",
    "seoDescription": "Free online manufacturing learning curve calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "initialTime",
        "label": "Initial Cycle Time (Minutes)",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter initial cycle time (minutes)"
      },
      {
        "key": "learningRate",
        "label": "Learning Curve Slope Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter learning curve slope rate (%)"
      },
      {
        "key": "unitsProduced",
        "label": "Cumulative Units Produced",
        "unit": "units",
        "type": "number",
        "helper": "Enter cumulative units produced"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "standard-production-cycle-time",
    "title": "Standard Production Cycle Time",
    "category": "manufacturing-workshop",
    "description": "Free online standard production cycle time calculator. Get accurate calculations instantly.",
    "seoTitle": "Standard Production Cycle Time | SectorCalc",
    "seoDescription": "Free online standard production cycle time calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "observedTime",
        "label": "Observed Cycle Time (Minutes)",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter observed cycle time (minutes)"
      },
      {
        "key": "performance",
        "label": "Performance Efficiency (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter performance efficiency (%)"
      },
      {
        "key": "allowanceTime",
        "label": "Fatigue Allowance Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter fatigue allowance rate (%)"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "production-assembly-line-balance",
    "title": "Production Assembly Line Balance",
    "category": "manufacturing-workshop",
    "description": "Free online production assembly line balance calculator. Get accurate calculations instantly.",
    "seoTitle": "Production Assembly Line Balance | SectorCalc",
    "seoDescription": "Free online production assembly line balance calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "totalWork",
        "label": "Total Work Content (Minutes)",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter total work content (minutes)"
      },
      {
        "key": "taktTime",
        "label": "Takt Time (Seconds)",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter takt time (seconds)"
      },
      {
        "key": "istasyonsayisi",
        "label": "istasyonsayisi",
        "unit": "units",
        "type": "number",
        "helper": "Enter istasyonsayisi"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "assembly-line-bottleneck-capacity",
    "title": "Assembly Line Bottleneck Capacity",
    "category": "manufacturing-workshop",
    "description": "Free online assembly line bottleneck capacity calculator. Get accurate calculations instantly.",
    "seoTitle": "Assembly Line Bottleneck Capacity | SectorCalc",
    "seoDescription": "Free online assembly line bottleneck capacity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "stationTimes",
        "label": "Station Times (comma separated, mins)",
        "unit": "Dizi Dk",
        "type": "number",
        "helper": "Enter station times (comma separated, mins)"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "manufacturing-scrap-loss-cost",
    "title": "Manufacturing Scrap Loss Cost",
    "category": "manufacturing-workshop",
    "description": "Free online manufacturing scrap loss cost calculator. Get accurate calculations instantly.",
    "seoTitle": "Manufacturing Scrap Loss Cost | SectorCalc",
    "seoDescription": "Free online manufacturing scrap loss cost calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "production",
        "label": "Total Units Produced",
        "unit": "units",
        "type": "number",
        "helper": "Enter total units produced"
      },
      {
        "key": "scrap",
        "label": "Defective Units (Scrap)",
        "unit": "units",
        "type": "number",
        "helper": "Enter defective units (scrap)"
      },
      {
        "key": "birimmaliyet",
        "label": "birimmaliyet",
        "unit": "TL",
        "type": "number",
        "helper": "Enter birimmaliyet"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "measurement-gage-calibration-drift",
    "title": "Measurement Gage Calibration Drift",
    "category": "manufacturing-workshop",
    "description": "Free online measurement gage calibration drift calculator. Get accurate calculations instantly.",
    "seoTitle": "Measurement Gage Calibration Drift | SectorCalc",
    "seoDescription": "Free online measurement gage calibration drift calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "finalError",
        "label": "Final Measured Deviation",
        "unit": "Unit",
        "type": "number",
        "helper": "Enter final measured deviation"
      },
      {
        "key": "prevError",
        "label": "Previous Measured Deviation",
        "unit": "Unit",
        "type": "number",
        "helper": "Enter previous measured deviation"
      },
      {
        "key": "elapsedTime",
        "label": "Elapsed Time between Calibrations (Days)",
        "unit": "days",
        "type": "number",
        "helper": "Enter elapsed time between calibrations (days)"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "machine-capital-depreciation-rate",
    "title": "Machine Capital Depreciation Rate",
    "category": "manufacturing-workshop",
    "description": "Free online machine capital depreciation rate calculator. Get accurate calculations instantly.",
    "seoTitle": "Machine Capital Depreciation Rate | SectorCalc",
    "seoDescription": "Free online machine capital depreciation rate calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "cost",
        "label": "Cost",
        "unit": "TL",
        "type": "number",
        "helper": "Enter cost"
      },
      {
        "key": "salvageValue",
        "label": "Salvage Value",
        "unit": "TL",
        "type": "number",
        "helper": "Enter salvage value"
      },
      {
        "key": "usefulLife",
        "label": "Useful Life",
        "unit": "years",
        "type": "number",
        "helper": "Enter useful life"
      },
      {
        "key": "capacity",
        "label": "Total Production Capacity",
        "unit": "units",
        "type": "number",
        "helper": "Enter total production capacity"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "levelized-cost-of-energy-lcoe",
    "title": "Levelized Cost Of Energy Lcoe",
    "category": "manufacturing-workshop",
    "description": "Free online levelized cost of energy lcoe calculator. Get accurate calculations instantly.",
    "seoTitle": "Levelized Cost Of Energy Lcoe | SectorCalc",
    "seoDescription": "Free online levelized cost of energy lcoe calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "totalInvestment",
        "label": "Total Plant Capital Investment",
        "unit": "TL",
        "type": "number",
        "helper": "Enter total plant capital investment"
      },
      {
        "key": "totalOperating",
        "label": "Total Lifecycle Operating Costs",
        "unit": "TL",
        "type": "number",
        "helper": "Enter total lifecycle operating costs"
      },
      {
        "key": "totalGeneration",
        "label": "Total Projected Energy Output (kWh)",
        "unit": "kWh",
        "type": "number",
        "helper": "Enter total projected energy output (kwh)"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "apparel-sewing-line-balance",
    "title": "Apparel Sewing Line Balance",
    "category": "manufacturing-workshop",
    "description": "Free online apparel sewing line balance calculator. Get accurate calculations instantly.",
    "seoTitle": "Apparel Sewing Line Balance | SectorCalc",
    "seoDescription": "Free online apparel sewing line balance calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "totalSmv",
        "label": "Total Standard Minute Value (SMV)",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter total standard minute value (smv)"
      },
      {
        "key": "taktTime",
        "label": "Takt Time (Seconds)",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter takt time (seconds)"
      },
      {
        "key": "operators",
        "label": "Number of Line Operators",
        "unit": "units",
        "type": "number",
        "helper": "Enter number of line operators"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "measurement-gage-rr-percentage",
    "title": "Measurement Gage Rr Percentage",
    "category": "manufacturing-workshop",
    "description": "Free online measurement gage rr percentage calculator. Get accurate calculations instantly.",
    "seoTitle": "Measurement Gage Rr Percentage | SectorCalc",
    "seoDescription": "Free online measurement gage rr percentage calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "partVariance",
        "label": "Part-to-Part Variance (PV)",
        "unit": "VP",
        "type": "number",
        "helper": "Enter part-to-part variance (pv)"
      },
      {
        "key": "gageVariance",
        "label": "Measurement System Variance (GRR)",
        "unit": "VGRR",
        "type": "number",
        "helper": "Enter measurement system variance (grr)"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "term-life-insurance-needs",
    "title": "Term Life Insurance Needs",
    "category": "finance-business",
    "description": "Free online term life insurance needs calculator. Get accurate calculations instantly.",
    "seoTitle": "Term Life Insurance Needs | SectorCalc",
    "seoDescription": "Free online term life insurance needs calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "yillikgelir",
        "label": "yillikgelir",
        "unit": "TL",
        "type": "number",
        "helper": "Enter yillikgelir"
      },
      {
        "key": "dependents",
        "label": "Number of Dependents",
        "unit": "units",
        "type": "number",
        "helper": "Enter number of dependents"
      },
      {
        "key": "debts",
        "label": "Total Consolidated Debts",
        "unit": "TL",
        "type": "number",
        "helper": "Enter total consolidated debts"
      },
      {
        "key": "savings",
        "label": "Savings",
        "unit": "TL",
        "type": "number",
        "helper": "Enter savings"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "whole-life-insurance-value",
    "title": "Whole Life Insurance Value",
    "category": "finance-business",
    "description": "Free online whole life insurance value calculator. Get accurate calculations instantly.",
    "seoTitle": "Whole Life Insurance Value | SectorCalc",
    "seoDescription": "Free online whole life insurance value calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "annualPremium",
        "label": "Annual Premium (%)",
        "unit": "TL",
        "type": "number",
        "helper": "Enter annual premium (%)"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "years",
        "label": "Years",
        "unit": "years",
        "type": "number",
        "helper": "Enter years"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "term-life-insurance-premium",
    "title": "Term Life Insurance Premium",
    "category": "finance-business",
    "description": "Free online term life insurance premium calculator. Get accurate calculations instantly.",
    "seoTitle": "Term Life Insurance Premium | SectorCalc",
    "seoDescription": "Free online term life insurance premium calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "teminat",
        "label": "teminat",
        "unit": "TL",
        "type": "number",
        "helper": "Enter teminat"
      },
      {
        "key": "olumolasiligi",
        "label": "olumolasiligi",
        "unit": "%",
        "type": "number",
        "helper": "Enter olumolasiligi"
      },
      {
        "key": "gidermarji",
        "label": "gidermarji",
        "unit": "%",
        "type": "number",
        "helper": "Enter gidermarji"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "disability-income-replacement",
    "title": "Disability Income Replacement",
    "category": "finance-business",
    "description": "Free online disability income replacement calculator. Get accurate calculations instantly.",
    "seoTitle": "Disability Income Replacement | SectorCalc",
    "seoDescription": "Free online disability income replacement calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "monthlyIncome",
        "label": "Monthly Income",
        "unit": "TL",
        "type": "number",
        "helper": "Enter monthly income"
      },
      {
        "key": "odemeyuzdesi",
        "label": "odemeyuzdesi",
        "unit": "%",
        "type": "number",
        "helper": "Enter odemeyuzdesi"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "hsa-tax-saving-advantage",
    "title": "Hsa Tax Saving Advantage",
    "category": "finance-business",
    "description": "Free online hsa tax saving advantage calculator. Get accurate calculations instantly.",
    "seoTitle": "Hsa Tax Saving Advantage | SectorCalc",
    "seoDescription": "Free online hsa tax saving advantage calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "annualContribution",
        "label": "Annual HSA Contribution Amount",
        "unit": "TL",
        "type": "number",
        "helper": "Enter annual hsa contribution amount"
      },
      {
        "key": "marginalTax",
        "label": "Marginal Tax Bracket (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter marginal tax bracket (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "medicare-part-b-premium",
    "title": "Medicare Part B Premium",
    "category": "finance-business",
    "description": "Free online medicare part b premium calculator. Get accurate calculations instantly.",
    "seoTitle": "Medicare Part B Premium | SectorCalc",
    "seoDescription": "Free online medicare part b premium calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "yillikgelir",
        "label": "yillikgelir",
        "unit": "TL",
        "type": "number",
        "helper": "Enter yillikgelir"
      },
      {
        "key": "bazprim",
        "label": "bazprim",
        "unit": "TL",
        "type": "number",
        "helper": "Enter bazprim"
      },
      {
        "key": "extraRate",
        "label": "Surcharge Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter surcharge rate (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "high-deductible-health-plan-hsa",
    "title": "High Deductible Health Plan Hsa",
    "category": "finance-business",
    "description": "Free online high deductible health plan hsa calculator. Get accurate calculations instantly.",
    "seoTitle": "High Deductible Health Plan Hsa | SectorCalc",
    "seoDescription": "Free online high deductible health plan hsa calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "lowerPremium",
        "label": "Lower Premium Plan Option",
        "unit": "TL",
        "type": "number",
        "helper": "Enter lower premium plan option"
      },
      {
        "key": "higherPremium",
        "label": "Higher Premium Plan Option",
        "unit": "TL",
        "type": "number",
        "helper": "Enter higher premium plan option"
      },
      {
        "key": "deductibleDifference",
        "label": "Deductible Difference Cost",
        "unit": "TL",
        "type": "number",
        "helper": "Enter deductible difference cost"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "retirement-future-portfolio-value",
    "title": "Retirement Future Portfolio Value",
    "category": "finance-business",
    "description": "Free online retirement future portfolio value calculator. Get accurate calculations instantly.",
    "seoTitle": "Retirement Future Portfolio Value | SectorCalc",
    "seoDescription": "Free online retirement future portfolio value calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "currentSavings",
        "label": "Current Retirement Savings Portfolio",
        "unit": "TL",
        "type": "number",
        "helper": "Enter current retirement savings portfolio"
      },
      {
        "key": "monthlyContribution",
        "label": "Monthly Saving Contribution",
        "unit": "TL",
        "type": "number",
        "helper": "Enter monthly saving contribution"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "years",
        "label": "Years",
        "unit": "years",
        "type": "number",
        "helper": "Enter years"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "retirement-savings-horizon-months",
    "title": "Retirement Savings Horizon Months",
    "category": "finance-business",
    "description": "Free online retirement savings horizon months calculator. Get accurate calculations instantly.",
    "seoTitle": "Retirement Savings Horizon Months | SectorCalc",
    "seoDescription": "Free online retirement savings horizon months calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "hedefportfoy",
        "label": "hedefportfoy",
        "unit": "TL",
        "type": "number",
        "helper": "Enter hedefportfoy"
      },
      {
        "key": "currentSavings",
        "label": "Current Retirement Savings Portfolio",
        "unit": "TL",
        "type": "number",
        "helper": "Enter current retirement savings portfolio"
      },
      {
        "key": "monthlyContribution",
        "label": "Monthly Saving Contribution",
        "unit": "TL",
        "type": "number",
        "helper": "Enter monthly saving contribution"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "401k-contribution-employer-match",
    "title": "401k Contribution Employer Match",
    "category": "finance-business",
    "description": "Free online 401k contribution employer match calculator. Get accurate calculations instantly.",
    "seoTitle": "401k Contribution Employer Match | SectorCalc",
    "seoDescription": "Free online 401k contribution employer match calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "salary",
        "label": "Annual Base Salary",
        "unit": "TL",
        "type": "number",
        "helper": "Enter annual base salary"
      },
      {
        "key": "contributionRate",
        "label": "Employee Contribution Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter employee contribution rate (%)"
      },
      {
        "key": "employerMatch",
        "label": "Employer Matching Contribution (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter employer matching contribution (%)"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "%",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "years",
        "label": "Years",
        "unit": "years",
        "type": "number",
        "helper": "Enter years"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "traditional-vs-roth-ira-net",
    "title": "Traditional Vs Roth Ira Net",
    "category": "finance-business",
    "description": "Free online traditional vs roth ira net calculator. Get accurate calculations instantly.",
    "seoTitle": "Traditional Vs Roth Ira Net | SectorCalc",
    "seoDescription": "Free online traditional vs roth ira net calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "contribution",
        "label": "Monthly Employee Contribution",
        "unit": "TL",
        "type": "number",
        "helper": "Enter monthly employee contribution"
      },
      {
        "key": "taxRate",
        "label": "Tax Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter tax rate (%)"
      },
      {
        "key": "growthRate",
        "label": "Projected Investment Growth Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter projected investment growth rate (%)"
      },
      {
        "key": "years",
        "label": "Years",
        "unit": "years",
        "type": "number",
        "helper": "Enter years"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "backdoor-roth-ira-conversion",
    "title": "Backdoor Roth Ira Conversion",
    "category": "finance-business",
    "description": "Free online backdoor roth ira conversion calculator. Get accurate calculations instantly.",
    "seoTitle": "Backdoor Roth Ira Conversion | SectorCalc",
    "seoDescription": "Free online backdoor roth ira conversion calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "traditionalBalance",
        "label": "Traditional IRA Account Balance",
        "unit": "TL",
        "type": "number",
        "helper": "Enter traditional ira account balance"
      },
      {
        "key": "conversionAmount",
        "label": "Conversion Amount",
        "unit": "TL",
        "type": "number",
        "helper": "Enter conversion amount"
      },
      {
        "key": "taxRate",
        "label": "Tax Rate (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter tax rate (%)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "ira-required-minimum-distribution",
    "title": "Ira Required Minimum Distribution",
    "category": "finance-business",
    "description": "Free online ira required minimum distribution calculator. Get accurate calculations instantly.",
    "seoTitle": "Ira Required Minimum Distribution | SectorCalc",
    "seoDescription": "Free online ira required minimum distribution calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "balance",
        "label": "Card Balance",
        "unit": "TL",
        "type": "number",
        "helper": "Enter card balance"
      },
      {
        "key": "lifeExpectancy",
        "label": "Distribution Period (Years)",
        "unit": "years",
        "type": "number",
        "helper": "Enter distribution period (years)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "social-security-monthly-benefit",
    "title": "Social Security Monthly Benefit",
    "category": "finance-business",
    "description": "Free online social security monthly benefit calculator. Get accurate calculations instantly.",
    "seoTitle": "Social Security Monthly Benefit | SectorCalc",
    "seoDescription": "Free online social security monthly benefit calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "aime",
        "label": "Average Indexed Monthly Earnings (AIME)",
        "unit": "TL",
        "type": "number",
        "helper": "Enter average indexed monthly earnings (aime)"
      },
      {
        "key": "retirementAge",
        "label": "Claiming Age (Years)",
        "unit": "years",
        "type": "number",
        "helper": "Enter claiming age (years)"
      }
    ],
    "resultType": "cost",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mean-median-mode-averages",
    "title": "Mean Median Mode Averages",
    "category": "math-statistics",
    "description": "Free online mean median mode averages calculator. Get accurate calculations instantly.",
    "seoTitle": "Mean Median Mode Averages | SectorCalc",
    "seoDescription": "Free online mean median mode averages calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "dataSet",
        "label": "Values (comma separated)",
        "unit": "Dizi",
        "type": "number",
        "helper": "Enter values (comma separated)"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "variance-standard-deviation-pop",
    "title": "Variance Standard Deviation Pop",
    "category": "math-statistics",
    "description": "Free online variance standard deviation pop calculator. Get accurate calculations instantly.",
    "seoTitle": "Variance Standard Deviation Pop | SectorCalc",
    "seoDescription": "Free online variance standard deviation pop calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "dataSet",
        "label": "Values (comma separated)",
        "unit": "Dizi",
        "type": "number",
        "helper": "Enter values (comma separated)"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "confidence-interval-bounds",
    "title": "Confidence Interval Bounds",
    "category": "math-statistics",
    "description": "Free online confidence interval bounds calculator. Get accurate calculations instantly.",
    "seoTitle": "Confidence Interval Bounds | SectorCalc",
    "seoDescription": "Free online confidence interval bounds calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "mean",
        "label": "Mean",
        "unit": "Number",
        "type": "number",
        "helper": "Enter mean"
      },
      {
        "key": "stdError",
        "label": "Standard Error",
        "unit": "Number",
        "type": "number",
        "helper": "Enter standard error"
      },
      {
        "key": "confidenceLevel",
        "label": "Confidence Level (%)",
        "unit": "%",
        "type": "number",
        "helper": "Enter confidence level (%)"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "sample-size-estimation-stats",
    "title": "Sample Size Estimation Stats",
    "category": "math-statistics",
    "description": "Free online sample size estimation stats calculator. Get accurate calculations instantly.",
    "seoTitle": "Sample Size Estimation Stats | SectorCalc",
    "seoDescription": "Free online sample size estimation stats calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "zScore",
        "label": "Service Level Factor (Z-Score)",
        "unit": "Number",
        "type": "number",
        "helper": "Enter service level factor (z-score)"
      },
      {
        "key": "stdDev",
        "label": "Standard Deviation of Daily Demand",
        "unit": "Number",
        "type": "number",
        "helper": "Enter standard deviation of daily demand"
      },
      {
        "key": "marginOfError",
        "label": "Margin of Error",
        "unit": "Number",
        "type": "number",
        "helper": "Enter margin of error"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "linear-correlation-regression",
    "title": "Linear Correlation Regression",
    "category": "math-statistics",
    "description": "Free online linear correlation regression calculator. Get accurate calculations instantly.",
    "seoTitle": "Linear Correlation Regression | SectorCalc",
    "seoDescription": "Free online linear correlation regression calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "x",
        "label": "x",
        "unit": "Dizi",
        "type": "number",
        "helper": "Enter x"
      },
      {
        "key": "y",
        "label": "y",
        "unit": "Dizi",
        "type": "number",
        "helper": "Enter y"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "anova-f-statistic-variance",
    "title": "Anova F Statistic Variance",
    "category": "math-statistics",
    "description": "Free online anova f statistic variance calculator. Get accurate calculations instantly.",
    "seoTitle": "Anova F Statistic Variance | SectorCalc",
    "seoDescription": "Free online anova f statistic variance calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "groups",
        "label": "Groups",
        "unit": "Matris",
        "type": "number",
        "helper": "Enter groups"
      }
    ],
    "resultType": "statistics",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "body-mass-index-bmi",
    "title": "Body Mass Index Bmi",
    "category": "health-body",
    "description": "Free online body mass index bmi calculator. Get accurate calculations instantly.",
    "seoTitle": "Body Mass Index Bmi | SectorCalc",
    "seoDescription": "Free online body mass index bmi calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "weight",
        "label": "weight",
        "unit": "kg",
        "type": "number",
        "helper": "Enter weight"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      }
    ],
    "resultType": "health",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "body-fat-percentage-navy",
    "title": "Body Fat Percentage Navy",
    "category": "health-body",
    "description": "Free online body fat percentage navy calculator. Get accurate calculations instantly.",
    "seoTitle": "Body Fat Percentage Navy | SectorCalc",
    "seoDescription": "Free online body fat percentage navy calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "cm",
        "type": "number",
        "helper": "Enter component length (m)"
      },
      {
        "key": "waist",
        "label": "Waist Circumference",
        "unit": "cm",
        "type": "number",
        "helper": "Enter waist circumference"
      },
      {
        "key": "neck",
        "label": "Neck Circumference",
        "unit": "cm",
        "type": "number",
        "helper": "Enter neck circumference"
      },
      {
        "key": "gender",
        "label": "Gender",
        "unit": "Metin",
        "type": "select",
        "helper": "Enter gender",
        "options": [
          {
            "label": "Male",
            "value": "male"
          },
          {
            "label": "Female",
            "value": "female"
          }
        ],
        "defaultValue": "male"
      }
    ],
    "resultType": "health",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "basal-metabolic-rate-bmr",
    "title": "Basal Metabolic Rate Bmr",
    "category": "health-body",
    "description": "Free online basal metabolic rate bmr calculator. Get accurate calculations instantly.",
    "seoTitle": "Basal Metabolic Rate Bmr | SectorCalc",
    "seoDescription": "Free online basal metabolic rate bmr calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "weight",
        "label": "weight",
        "unit": "kg",
        "type": "number",
        "helper": "Enter weight"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "cm",
        "type": "number",
        "helper": "Enter component length (m)"
      },
      {
        "key": "yas",
        "label": "yas",
        "unit": "years",
        "type": "number",
        "helper": "Enter yas"
      },
      {
        "key": "gender",
        "label": "Gender",
        "unit": "Metin",
        "type": "select",
        "helper": "Enter gender",
        "options": [
          {
            "label": "Male",
            "value": "male"
          },
          {
            "label": "Female",
            "value": "female"
          }
        ],
        "defaultValue": "male"
      }
    ],
    "resultType": "health",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "daily-calorie-expenditure-tdee",
    "title": "Daily Calorie Expenditure Tdee",
    "category": "health-body",
    "description": "Free online daily calorie expenditure tdee calculator. Get accurate calculations instantly.",
    "seoTitle": "Daily Calorie Expenditure Tdee | SectorCalc",
    "seoDescription": "Free online daily calorie expenditure tdee calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "bmr",
        "label": "bmr",
        "unit": "kcal",
        "type": "number",
        "helper": "Enter bmr"
      },
      {
        "key": "activityLevel",
        "label": "Activity Level Factor",
        "unit": "Number",
        "type": "number",
        "helper": "Enter activity level factor"
      }
    ],
    "resultType": "health",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "target-heart-rate-karvonen",
    "title": "Target Heart Rate Karvonen",
    "category": "health-body",
    "description": "Free online target heart rate karvonen calculator. Get accurate calculations instantly.",
    "seoTitle": "Target Heart Rate Karvonen | SectorCalc",
    "seoDescription": "Free online target heart rate karvonen calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "yas",
        "label": "yas",
        "unit": "years",
        "type": "number",
        "helper": "Enter yas"
      },
      {
        "key": "restingHeartRate",
        "label": "Resting Heart Rate (BPM)",
        "unit": "BPM",
        "type": "number",
        "helper": "Enter resting heart rate (bpm)"
      },
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "%",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      }
    ],
    "resultType": "health",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "vo2max-aerobic-capacity-cooper",
    "title": "Vo2max Aerobic Capacity Cooper",
    "category": "health-body",
    "description": "Free online vo2max aerobic capacity cooper calculator. Get accurate calculations instantly.",
    "seoTitle": "Vo2max Aerobic Capacity Cooper | SectorCalc",
    "seoDescription": "Free online vo2max aerobic capacity cooper calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "runDistance",
        "label": "Run Distance (Meters)",
        "unit": "m",
        "type": "number",
        "helper": "Enter run distance (meters)"
      },
      {
        "key": "duration",
        "label": "Duration",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter duration"
      }
    ],
    "resultType": "health",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "macronutrient-gram-split-goals",
    "title": "Macronutrient Gram Split Goals",
    "category": "health-body",
    "description": "Free online macronutrient gram split goals calculator. Get accurate calculations instantly.",
    "seoTitle": "Macronutrient Gram Split Goals | SectorCalc",
    "seoDescription": "Free online macronutrient gram split goals calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "tdee",
        "label": "tdee",
        "unit": "kcal",
        "type": "number",
        "helper": "Enter tdee"
      },
      {
        "key": "protein",
        "label": "protein",
        "unit": "%",
        "type": "number",
        "helper": "Enter protein"
      },
      {
        "key": "yag",
        "label": "yag",
        "unit": "%",
        "type": "number",
        "helper": "Enter yag"
      },
      {
        "key": "karb",
        "label": "karb",
        "unit": "%",
        "type": "number",
        "helper": "Enter karb"
      }
    ],
    "resultType": "health",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "daily-water-hydration-intake",
    "title": "Daily Water Hydration Intake",
    "category": "health-body",
    "description": "Free online daily water hydration intake calculator. Get accurate calculations instantly.",
    "seoTitle": "Daily Water Hydration Intake | SectorCalc",
    "seoDescription": "Free online daily water hydration intake calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "weight",
        "label": "weight",
        "unit": "kg",
        "type": "number",
        "helper": "Enter weight"
      },
      {
        "key": "activityDuration",
        "label": "Activity Duration (Mins)",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter activity duration (mins)"
      }
    ],
    "resultType": "health",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "hookes-law-axial-stress",
    "title": "Hookes Law Axial Stress",
    "category": "manufacturing-workshop",
    "description": "Free online hookes law axial stress calculator. Get accurate calculations instantly.",
    "seoTitle": "Hookes Law Axial Stress | SectorCalc",
    "seoDescription": "Free online hookes law axial stress calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "elasticModulus",
        "label": "Young's Modulus of Elasticity (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter young's modulus of elasticity (pa)"
      },
      {
        "key": "strain",
        "label": "Normal Mechanical Strain",
        "unit": "Number",
        "type": "number",
        "helper": "Enter normal mechanical strain"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "interference-fit-pressure",
    "title": "Interference Fit Pressure",
    "category": "manufacturing-workshop",
    "description": "Calculate joint contact pressure, axial assembly force, and transmissible torque for press fits and shrink fits using Lame's thick-walled cylinder equations.",
    "seoTitle": "Press Fit & Shrink Fit Pressure Calculator | Lame's Equations | SectorCalc",
    "seoDescription": "Calculate press fit interference pressure, transmissible torque, and assembly force. Supports solid and hollow shafts.",
    "inputs": [
      {
        "key": "diametralInterference",
        "label": "Diametral Interference",
        "unit": "mm",
        "type": "number",
        "helper": "Total interference on diameter (difference between shaft and hub)"
      },
      {
        "key": "shaftOuterDiameter",
        "label": "Contact Diameter (Shaft OD)",
        "unit": "mm",
        "type": "number",
        "helper": "Nominal diameter at the fit interface"
      },
      {
        "key": "shaftInnerDiameter",
        "label": "Shaft Inner Diameter",
        "unit": "mm",
        "type": "number",
        "helper": "Internal diameter of shaft (enter 0 for solid shaft)"
      },
      {
        "key": "hubOuterDiameter",
        "label": "Hub Outer Diameter",
        "unit": "mm",
        "type": "number",
        "helper": "External diameter of the surrounding hub or collar"
      },
      {
        "key": "shaftYoungsModulus",
        "label": "Shaft Young's Modulus",
        "unit": "GPa",
        "type": "number",
        "helper": "Modulus of elasticity of the shaft material (e.g. Steel = 200 GPa)"
      },
      {
        "key": "hubYoungsModulus",
        "label": "Hub Young's Modulus",
        "unit": "GPa",
        "type": "number",
        "helper": "Modulus of elasticity of the hub material (e.g. Cast Iron = 100 GPa)"
      },
      {
        "key": "shaftPoissonsRatio",
        "label": "Shaft Poisson's Ratio",
        "unit": "ratio",
        "type": "number",
        "helper": "Poisson's ratio of shaft material (typically 0.27 to 0.33)"
      },
      {
        "key": "hubPoissonsRatio",
        "label": "Hub Poisson's Ratio",
        "unit": "ratio",
        "type": "number",
        "helper": "Poisson's ratio of hub material (typically 0.25 to 0.30)"
      },
      {
        "key": "hubLength",
        "label": "Contact Joint Length",
        "unit": "mm",
        "type": "number",
        "helper": "Axial length of the fit contact area"
      },
      {
        "key": "frictionCoefficient",
        "label": "Friction Coefficient",
        "unit": "ratio",
        "type": "number",
        "helper": "Coefficient of friction at interface (e.g., 0.15 for steel/steel)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Centrifugal force stress effects",
      "Thermal expansion variations",
      "Surface finish roughness reduction factor"
    ]
  },
  {
    "slug": "thin-walled-pressure-vessel",
    "title": "Thin Walled Pressure Vessel",
    "category": "manufacturing-workshop",
    "description": "Free online thin walled pressure vessel calculator. Get accurate calculations instantly.",
    "seoTitle": "Thin Walled Pressure Vessel | SectorCalc",
    "seoDescription": "Free online thin walled pressure vessel calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "pressure",
        "label": "Internal Operating Pressure (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter internal operating pressure (pa)"
      },
      {
        "key": "diameter",
        "label": "Diameter (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter diameter (m)"
      },
      {
        "key": "thickness",
        "label": "Wall Thickness (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter wall thickness (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "weld-joint-throat-thickness",
    "title": "Weld Joint Throat Thickness",
    "category": "manufacturing-workshop",
    "description": "Calculate the required weld throat thickness and leg size for fillet and butt joints under load, matching AISC welding design principles.",
    "seoTitle": "Weld Joint Throat Thickness & Leg Size Sizing | SectorCalc",
    "seoDescription": "Calculate weld throat thickness and leg size for fillet and butt welds under static load. Free engineering calculation tool.",
    "inputs": [
      {
        "key": "jointType",
        "label": "Weld Joint Type",
        "unit": "select",
        "type": "select",
        "helper": "Select the weld joint configuration",
        "options": [
          { "label": "Fillet Weld (Shear Limit)", "value": "fillet" },
          { "label": "Butt Weld (Tension/Compression)", "value": "butt" }
        ],
        "defaultValue": "fillet"
      },
      {
        "key": "load",
        "label": "Applied Force",
        "unit": "kN",
        "type": "number",
        "helper": "Total force acting on the weld joint"
      },
      {
        "key": "weldLength",
        "label": "Total Weld Length",
        "unit": "mm",
        "type": "number",
        "helper": "Sum of effective weld bead lengths"
      },
      {
        "key": "electrodeStrength",
        "label": "Electrode Tensile Strength",
        "unit": "MPa",
        "type": "number",
        "helper": "Classification strength of electrode (e.g. E70xx = 482 MPa)"
      },
      {
        "key": "safetyFactor",
        "label": "Design Safety Factor",
        "unit": "ratio",
        "type": "number",
        "helper": "Design code safety factor (typically 1.5 to 2.5)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic fatigue load factors",
      "Welder joint penetration efficiency",
      "Thermal welding stress concentration"
    ]
  },
  {
    "slug": "simple-beam-deflection-load",
    "title": "Simple Beam Deflection Load",
    "category": "manufacturing-workshop",
    "description": "Free online simple beam deflection load calculator. Get accurate calculations instantly.",
    "seoTitle": "Simple Beam Deflection Load | SectorCalc",
    "seoDescription": "Free online simple beam deflection load calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "load",
        "label": "Applied External Force (N)",
        "unit": "N",
        "type": "number",
        "helper": "Enter applied external force (n)"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      },
      {
        "key": "elasticModulus",
        "label": "Young's Modulus of Elasticity (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter young's modulus of elasticity (pa)"
      },
      {
        "key": "momentOfInertia",
        "label": "Area Moment of Inertia (m4)",
        "unit": "m4",
        "type": "number",
        "helper": "Enter area moment of inertia (m4)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "laser-welding-energy-density",
    "title": "Laser Welding Energy Density",
    "category": "manufacturing-workshop",
    "description": "Free online laser welding energy density calculator. Get accurate calculations instantly.",
    "seoTitle": "Laser Welding Energy Density | SectorCalc",
    "seoDescription": "Free online laser welding energy density calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "laserPower",
        "label": "Laser Power Output (Watts)",
        "unit": "W",
        "type": "number",
        "helper": "Enter laser power output (watts)"
      },
      {
        "key": "cuttingSpeed",
        "label": "cuttingSpeed",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter cuttingspeed"
      },
      {
        "key": "focusDistance",
        "label": "Focus Area Diameter (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter focus area diameter (m)"
      },
      {
        "key": "materialThickness",
        "label": "Material Thickness (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter material thickness (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "beam-lintel-bending-stress",
    "title": "Beam Lintel Bending Stress",
    "category": "manufacturing-workshop",
    "description": "Free online beam lintel bending stress calculator. Get accurate calculations instantly.",
    "seoTitle": "Beam Lintel Bending Stress | SectorCalc",
    "seoDescription": "Free online beam lintel bending stress calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "load",
        "label": "Applied External Force (N)",
        "unit": "N",
        "type": "number",
        "helper": "Enter applied external force (n)"
      },
      {
        "key": "span",
        "label": "Clear Span length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter clear span length (m)"
      },
      {
        "key": "width",
        "label": "Section Width (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section width (m)"
      },
      {
        "key": "height",
        "label": "Section Height (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section height (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mohrs-circle-stress-transformation",
    "title": "Mohrs Circle Stress Transformation",
    "category": "manufacturing-workshop",
    "description": "Free online mohrs circle stress transformation calculator. Get accurate calculations instantly.",
    "seoTitle": "Mohrs Circle Stress Transformation | SectorCalc",
    "seoDescription": "Free online mohrs circle stress transformation calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sigmaX",
        "label": "Normal Stress in X-Direction (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter normal stress in x-direction (pa)"
      },
      {
        "key": "sigmaY",
        "label": "Normal Stress in Y-Direction (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter normal stress in y-direction (pa)"
      },
      {
        "key": "tauXY",
        "label": "Shear Stress on XY-Plane (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter shear stress on xy-plane (pa)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "rectangle-area-moment-inertia",
    "title": "Rectangle Area Moment Inertia",
    "category": "manufacturing-workshop",
    "description": "Free online rectangle area moment inertia calculator. Get accurate calculations instantly.",
    "seoTitle": "Rectangle Area Moment Inertia | SectorCalc",
    "seoDescription": "Free online rectangle area moment inertia calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "width",
        "label": "Section Width (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section width (m)"
      },
      {
        "key": "height",
        "label": "Section Height (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section height (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "normal-shock-wave-relations",
    "title": "Normal Shock Wave Relations",
    "category": "manufacturing-workshop",
    "description": "Free online normal shock wave relations calculator. Get accurate calculations instantly.",
    "seoTitle": "Normal Shock Wave Relations | SectorCalc",
    "seoDescription": "Free online normal shock wave relations calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "mach",
        "label": "Inlet Mach Number",
        "unit": "Number",
        "type": "number",
        "helper": "Enter inlet mach number"
      },
      {
        "key": "pressure1",
        "label": "Inlet Static Pressure (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter inlet static pressure (pa)"
      },
      {
        "key": "temperature1",
        "label": "Inlet Static Temperature (K)",
        "unit": "K",
        "type": "number",
        "helper": "Enter inlet static temperature (k)"
      },
      {
        "key": "strikePrice",
        "label": "Strike Price (K)",
        "unit": "Number",
        "type": "number",
        "helper": "Enter strike price (k)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "pump-npsh-cavitation-margin",
    "title": "Pump Npsh Cavitation Margin",
    "category": "manufacturing-workshop",
    "description": "Free online pump npsh cavitation margin calculator. Get accurate calculations instantly.",
    "seoTitle": "Pump Npsh Cavitation Margin | SectorCalc",
    "seoDescription": "Free online pump npsh cavitation margin calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "pressure",
        "label": "Internal Operating Pressure (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter internal operating pressure (pa)"
      },
      {
        "key": "vaporPressure",
        "label": "Liquid Vapor Pressure (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter liquid vapor pressure (pa)"
      },
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      },
      {
        "key": "height",
        "label": "Section Height (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section height (m)"
      },
      {
        "key": "loss",
        "label": "Frictional Head Loss (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter frictional head loss (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "thermal-pipe-expansion-stress",
    "title": "Thermal Pipe Expansion Stress",
    "category": "manufacturing-workshop",
    "description": "Free online thermal pipe expansion stress calculator. Get accurate calculations instantly.",
    "seoTitle": "Thermal Pipe Expansion Stress | SectorCalc",
    "seoDescription": "Free online thermal pipe expansion stress calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "elasticModulus",
        "label": "Young's Modulus of Elasticity (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter young's modulus of elasticity (pa)"
      },
      {
        "key": "expansionCoefficient",
        "label": "Thermal Expansion Coefficient (1/K)",
        "unit": "1/K",
        "type": "number",
        "helper": "Enter thermal expansion coefficient (1/k)"
      },
      {
        "key": "temperatureDifference",
        "label": "Temperature Difference (K)",
        "unit": "K",
        "type": "number",
        "helper": "Enter temperature difference (k)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "flat-belt-drive-tension",
    "title": "Flat Belt Drive Tension",
    "category": "manufacturing-workshop",
    "description": "Free online flat belt drive tension calculator. Get accurate calculations instantly.",
    "seoTitle": "Flat Belt Drive Tension | SectorCalc",
    "seoDescription": "Free online flat belt drive tension calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "power",
        "label": "Transmitted Power (Watts)",
        "unit": "W",
        "type": "number",
        "helper": "Enter transmitted power (watts)"
      },
      {
        "key": "speed",
        "label": "Belt Speed (m/s)",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter belt speed (m/s)"
      },
      {
        "key": "wrapAngle",
        "label": "Pulley Wrap Angle (Radians)",
        "unit": "Rad",
        "type": "number",
        "helper": "Enter pulley wrap angle (radians)"
      },
      {
        "key": "friction",
        "label": "Belt-to-Pulley Friction Coefficient",
        "unit": "Number",
        "type": "number",
        "helper": "Enter belt-to-pulley friction coefficient"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "natural-resonance-frequency",
    "title": "Natural Resonance Frequency",
    "category": "manufacturing-workshop",
    "description": "Free online natural resonance frequency calculator. Get accurate calculations instantly.",
    "seoTitle": "Natural Resonance Frequency | SectorCalc",
    "seoDescription": "Free online natural resonance frequency calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "mass",
        "label": "Total Vibrating Mass (kg)",
        "unit": "kg",
        "type": "number",
        "helper": "Enter total vibrating mass (kg)"
      },
      {
        "key": "springConstant",
        "label": "Spring Constant / Stiffness (N/m)",
        "unit": "N/m",
        "type": "number",
        "helper": "Enter spring constant / stiffness (n/m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "shaft-diameter-torsion-bending",
    "title": "Shaft Diameter Torsion Bending",
    "category": "manufacturing-workshop",
    "description": "Calculate minimum required transmission shaft diameter under combined torsion and bending according to the ASME B106.1M code.",
    "seoTitle": "ASME Shaft Diameter combined Torsion & Bending Calculator | SectorCalc",
    "seoDescription": "Size a mechanical shaft diameter based on ASME code. Inputs power, RPM, bending, yield, and tensile strengths.",
    "inputs": [
      {
        "key": "power",
        "label": "Transmitted Power",
        "unit": "kW",
        "type": "number",
        "helper": "Total power transmitted through the shaft"
      },
      {
        "key": "rpm",
        "label": "Rotational Speed",
        "unit": "RPM",
        "type": "number",
        "helper": "Shaft rotational speed in revolutions per minute"
      },
      {
        "key": "bendingMoment",
        "label": "Max Bending Moment",
        "unit": "N.m",
        "type": "number",
        "helper": "Peak bending moment acting along the shaft length"
      },
      {
        "key": "yieldStrength",
        "label": "Material Yield Strength",
        "unit": "MPa",
        "type": "number",
        "helper": "Yield strength ($S_y$) of the shaft material"
      },
      {
        "key": "tensileStrength",
        "label": "Material Tensile Strength",
        "unit": "MPa",
        "type": "number",
        "helper": "Ultimate tensile strength ($S_u$) of the shaft material"
      },
      {
        "key": "loadingType",
        "label": "Loading & Shock Conditions",
        "unit": "select",
        "type": "select",
        "helper": "Type of mechanical load and fatigue shock",
        "options": [
          { "label": "Gradual Loading (No Shock)", "value": "gradual" },
          { "label": "Minor Shock Loading", "value": "minor_shock" },
          { "label": "Heavy Shock Loading", "value": "heavy_shock" }
        ],
        "defaultValue": "gradual"
      },
      {
        "key": "hasKeyway",
        "label": "Keyway Stress Reduction",
        "unit": "select",
        "type": "select",
        "helper": "Does the shaft feature keyways or splines (reduces allowable stress by 25%)?",
        "options": [
          { "label": "No Keyways Present", "value": "no" },
          { "label": "Keyways / Splines Present", "value": "yes" }
        ],
        "defaultValue": "no"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic shaft deflection limits",
      "Critical rotational speed limits",
      "Fatigue stress concentration notch factors"
    ]
  },
  {
    "slug": "shaft-torsional-shear-stress",
    "title": "Shaft Torsional Shear Stress",
    "category": "manufacturing-workshop",
    "description": "Free online shaft torsional shear stress calculator. Get accurate calculations instantly.",
    "seoTitle": "Shaft Torsional Shear Stress | SectorCalc",
    "seoDescription": "Free online shaft torsional shear stress calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "torque",
        "label": "Applied Torsional Torque (N.m)",
        "unit": "N.m",
        "type": "number",
        "helper": "Enter applied torsional torque (n.m)"
      },
      {
        "key": "radius",
        "label": "Component Outer Radius (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component outer radius (m)"
      },
      {
        "key": "polarInertia",
        "label": "Polar Area Moment of Inertia (m4)",
        "unit": "m4",
        "type": "number",
        "helper": "Enter polar area moment of inertia (m4)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "spring-force-compression",
    "title": "Spring Force Compression",
    "category": "manufacturing-workshop",
    "description": "Free online spring force compression calculator. Get accurate calculations instantly.",
    "seoTitle": "Spring Force Compression | SectorCalc",
    "seoDescription": "Free online spring force compression calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "springConstant",
        "label": "Spring Constant / Stiffness (N/m)",
        "unit": "N/m",
        "type": "number",
        "helper": "Enter spring constant / stiffness (n/m)"
      },
      {
        "key": "displacement",
        "label": "Spring Compression Displacement (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter spring compression displacement (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mass-spring-angular-frequency",
    "title": "Mass Spring Angular Frequency",
    "category": "manufacturing-workshop",
    "description": "Free online mass spring angular frequency calculator. Get accurate calculations instantly.",
    "seoTitle": "Mass Spring Angular Frequency | SectorCalc",
    "seoDescription": "Free online mass spring angular frequency calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "mass",
        "label": "Total Vibrating Mass (kg)",
        "unit": "kg",
        "type": "number",
        "helper": "Enter total vibrating mass (kg)"
      },
      {
        "key": "springConstant",
        "label": "Spring Constant / Stiffness (N/m)",
        "unit": "N/m",
        "type": "number",
        "helper": "Enter spring constant / stiffness (n/m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "spur-gear-lewis-bending-stress",
    "title": "Spur Gear Lewis Bending Stress",
    "category": "manufacturing-workshop",
    "description": "Calculate theoretical tooth bending stress in a spur gear using the Lewis Bending Stress formula, including Barth velocity dynamic impact factor.",
    "seoTitle": "Spur Gear Lewis Bending Stress Calculator | SectorCalc",
    "seoDescription": "Calculate spur gear bending stress using the Lewis Equation and Barth dynamic factors. Inputs power, speed, module, face width, and teeth count.",
    "inputs": [
      {
        "key": "power",
        "label": "Transmitted Power",
        "unit": "kW",
        "type": "number",
        "helper": "Input mechanical power transmitted through the gear"
      },
      {
        "key": "rpm",
        "label": "Gear Speed",
        "unit": "RPM",
        "type": "number",
        "helper": "Gear rotational velocity in revolutions per minute"
      },
      {
        "key": "pitchDiameter",
        "label": "Pitch Diameter",
        "unit": "mm",
        "type": "number",
        "helper": "Reference pitch diameter of the spur gear"
      },
      {
        "key": "faceWidth",
        "label": "Face Width",
        "unit": "mm",
        "type": "number",
        "helper": "Axial tooth width of the gear"
      },
      {
        "key": "module",
        "label": "Module",
        "unit": "mm",
        "type": "number",
        "helper": "Gear module (pitch diameter divided by teeth count)"
      },
      {
        "key": "teethCount",
        "label": "Number of Teeth",
        "unit": "count",
        "type": "number",
        "helper": "Total tooth count on the gear wheel"
      },
      {
        "key": "toothSystem",
        "label": "Pressure Angle & Tooth System",
        "unit": "select",
        "type": "select",
        "helper": "Select pressure angle and profile configuration",
        "options": [
          { "label": "20° Full Depth System", "value": "20_deg_full_depth" },
          { "label": "14.5° Full Depth System", "value": "14.5_deg_full_depth" }
        ],
        "defaultValue": "20_deg_full_depth"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "AGMA load distribution coefficients",
      "Dynamic tooth error overload factors",
      "Surface contact fatigue limits"
    ]
  },
  {
    "slug": "hydrostatic-fluid-pressure-depth",
    "title": "Hydrostatic Fluid Pressure Depth",
    "category": "manufacturing-workshop",
    "description": "Free online hydrostatic fluid pressure depth calculator. Get accurate calculations instantly.",
    "seoTitle": "Hydrostatic Fluid Pressure Depth | SectorCalc",
    "seoDescription": "Free online hydrostatic fluid pressure depth calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      },
      {
        "key": "depth",
        "label": "Fluid Depth (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter fluid depth (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "steel-beam-bending",
    "title": "Steel Beam Bending",
    "category": "manufacturing-workshop",
    "description": "Free online steel beam bending calculator. Get accurate calculations instantly.",
    "seoTitle": "Steel Beam Bending | SectorCalc",
    "seoDescription": "Free online steel beam bending calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "moment",
        "label": "Applied Bending Moment (N.m)",
        "unit": "N.m",
        "type": "number",
        "helper": "Enter applied bending moment (n.m)"
      },
      {
        "key": "kesitmodulu",
        "label": "kesitmodulu",
        "unit": "m3",
        "type": "number",
        "helper": "Enter kesitmodulu"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "strain-calculator",
    "title": "Strain Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online strain calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Strain Calculator | SectorCalc",
    "seoDescription": "Free online strain calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "ilkboy",
        "label": "ilkboy",
        "unit": "m",
        "type": "number",
        "helper": "Enter ilkboy"
      },
      {
        "key": "sonboy",
        "label": "sonboy",
        "unit": "m",
        "type": "number",
        "helper": "Enter sonboy"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "stress-calculator",
    "title": "Stress Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online stress calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Stress Calculator | SectorCalc",
    "seoDescription": "Free online stress calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kuvvet",
        "label": "kuvvet",
        "unit": "N",
        "type": "number",
        "helper": "Enter kuvvet"
      },
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "tolerance-and-fit",
    "title": "Tolerance And Fit",
    "category": "manufacturing-workshop",
    "description": "Find upper/lower limit deviations and determine the type of fit (Clearance, Transition, or Interference) under the ISO 286 metric standard.",
    "seoTitle": "ISO 286 Limits & Fits Calculator | Clearance & Interference | SectorCalc",
    "seoDescription": "Free ISO 286 Limits and Fits calculator. Check hole and shaft tolerances, clearances, interferences, and fit types.",
    "inputs": [
      {
        "key": "nominalSize",
        "label": "Nominal Size",
        "unit": "mm",
        "type": "number",
        "helper": "Target dimension (nominal diameter from 1 to 500 mm)"
      },
      {
        "key": "holeToleranceClass",
        "label": "Hole Tolerance Class",
        "unit": "select",
        "type": "select",
        "helper": "ISO 286 Hole symbol (e.g. H7)",
        "options": [
          { "label": "H7 (Standard)", "value": "H7" },
          { "label": "H8 (Coarse)", "value": "H8" },
          { "label": "H9 (Wide)", "value": "H9" },
          { "label": "F7 (Clearance)", "value": "F7" },
          { "label": "G7 (Slide Clearance)", "value": "G7" },
          { "label": "JS7 (Symmetrical)", "value": "JS7" },
          { "label": "K7 (Transition)", "value": "K7" },
          { "label": "M7 (Tight Transition)", "value": "M7" },
          { "label": "N7 (Press Transition)", "value": "N7" },
          { "label": "P7 (Interference Fit)", "value": "P7" }
        ],
        "defaultValue": "H7"
      },
      {
        "key": "shaftToleranceClass",
        "label": "Shaft Tolerance Class",
        "unit": "select",
        "type": "select",
        "helper": "ISO 286 Shaft symbol (e.g. g6)",
        "options": [
          { "label": "g6 (Sliding Fit)", "value": "g6" },
          { "label": "h6 (Locating Fit)", "value": "h6" },
          { "label": "h7 (General Locating)", "value": "h7" },
          { "label": "f7 (Running Clearance)", "value": "f7" },
          { "label": "js6 (Symmetrical)", "value": "js6" },
          { "label": "k6 (Transition Fit)", "value": "k6" },
          { "label": "m6 (Tapping Fit)", "value": "m6" },
          { "label": "n6 (Light Press Fit)", "value": "n6" },
          { "label": "p6 (Medium Press Fit)", "value": "p6" },
          { "label": "r6 (Heavy Press Fit)", "value": "r6" },
          { "label": "s6 (Force/Shrink Fit)", "value": "s6" }
        ],
        "defaultValue": "g6"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Thermal expansion allowance",
      "Dynamic operating fits",
      "Geometric dimensioning & tolerancing (GD&T)"
    ]
  },
  {
    "slug": "soil-bearing-capacity",
    "title": "Soil Bearing Capacity",
    "category": "manufacturing-workshop",
    "description": "Free online soil bearing capacity calculator. Get accurate calculations instantly.",
    "seoTitle": "Soil Bearing Capacity | SectorCalc",
    "seoDescription": "Free online soil bearing capacity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kohezyon",
        "label": "kohezyon",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter kohezyon"
      },
      {
        "key": "temelgenislik",
        "label": "temelgenislik",
        "unit": "m",
        "type": "number",
        "helper": "Enter temelgenislik"
      },
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      },
      {
        "key": "depth",
        "label": "Fluid Depth (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter fluid depth (m)"
      },
      {
        "key": "nc",
        "label": "nc",
        "unit": "Number",
        "type": "number",
        "helper": "Enter nc"
      },
      {
        "key": "nq",
        "label": "nq",
        "unit": "Number",
        "type": "number",
        "helper": "Enter nq"
      },
      {
        "key": "ng",
        "label": "ng",
        "unit": "Number",
        "type": "number",
        "helper": "Enter ng"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "torque-converter",
    "title": "Torque Converter",
    "category": "manufacturing-workshop",
    "description": "Free online torque converter calculator. Get accurate calculations instantly.",
    "seoTitle": "Torque Converter | SectorCalc",
    "seoDescription": "Free online torque converter calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "value",
        "label": "After Repair Value (ARV)",
        "unit": "Number",
        "type": "number",
        "helper": "Enter after repair value (arv)"
      },
      {
        "key": "kaynak",
        "label": "kaynak",
        "unit": "Nm/lbft/kgfm",
        "type": "number",
        "helper": "Enter kaynak"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "angle-of-twist",
    "title": "Angle Of Twist",
    "category": "manufacturing-workshop",
    "description": "Free online angle of twist calculator. Get accurate calculations instantly.",
    "seoTitle": "Angle Of Twist | SectorCalc",
    "seoDescription": "Free online angle of twist calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "torque",
        "label": "Applied Torsional Torque (N.m)",
        "unit": "N.m",
        "type": "number",
        "helper": "Enter applied torsional torque (n.m)"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      },
      {
        "key": "kaymamodulu",
        "label": "kaymamodulu",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter kaymamodulu"
      },
      {
        "key": "polarInertia",
        "label": "Polar Area Moment of Inertia (m4)",
        "unit": "m4",
        "type": "number",
        "helper": "Enter polar area moment of inertia (m4)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "torsion-spring",
    "title": "Torsion Spring",
    "category": "manufacturing-workshop",
    "description": "Free online torsion spring calculator. Get accurate calculations instantly.",
    "seoTitle": "Torsion Spring | SectorCalc",
    "seoDescription": "Free online torsion spring calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "moment",
        "label": "Applied Bending Moment (N.m)",
        "unit": "N.m",
        "type": "number",
        "helper": "Enter applied bending moment (n.m)"
      },
      {
        "key": "springConstant",
        "label": "Spring Constant / Stiffness (N/m)",
        "unit": "N.m/rad",
        "type": "number",
        "helper": "Enter spring constant / stiffness (n/m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "von-mises-stress",
    "title": "Von Mises Stress",
    "category": "manufacturing-workshop",
    "description": "Calculate Von Mises equivalent stress for 2D plane stress or 3D triaxial stress states and determine structural safety factors against yielding.",
    "seoTitle": "Von Mises Equivalent Stress & Safety Factor Calculator | SectorCalc",
    "seoDescription": "Calculate Von Mises equivalent stress and yield safety factor. Supports 2D and 3D stress tensors.",
    "inputs": [
      {
        "key": "stressState",
        "label": "Stress State Dimensions",
        "unit": "select",
        "type": "select",
        "helper": "Select 2D (Plane Stress) or full 3D stress tensor",
        "options": [
          { "label": "2D Stress State (Plane Stress)", "value": "2d" },
          { "label": "3D Triaxial Stress State", "value": "3d" }
        ],
        "defaultValue": "2d"
      },
      {
        "key": "sigmaX",
        "label": "Normal Stress X (σx)",
        "unit": "MPa",
        "type": "number",
        "helper": "Normal stress acting in the X direction"
      },
      {
        "key": "sigmaY",
        "label": "Normal Stress Y (σy)",
        "unit": "MPa",
        "type": "number",
        "helper": "Normal stress acting in the Y direction"
      },
      {
        "key": "sigmaZ",
        "label": "Normal Stress Z (σz)",
        "unit": "MPa",
        "type": "number",
        "helper": "Normal stress acting in the Z direction (ignored for 2D)"
      },
      {
        "key": "tauXY",
        "label": "Shear Stress XY (τxy)",
        "unit": "MPa",
        "type": "number",
        "helper": "Shear stress acting on the XY plane"
      },
      {
        "key": "tauYZ",
        "label": "Shear Stress YZ (τyz)",
        "unit": "MPa",
        "type": "number",
        "helper": "Shear stress acting on the YZ plane (ignored for 2D)"
      },
      {
        "key": "tauXZ",
        "label": "Shear Stress XZ (τxz)",
        "unit": "MPa",
        "type": "number",
        "helper": "Shear stress acting on the XZ plane (ignored for 2D)"
      },
      {
        "key": "yieldStrength",
        "label": "Material Yield Strength",
        "unit": "MPa",
        "type": "number",
        "helper": "Yield limit ($S_y$) of structural material to assess safety factor"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cyclic load fatigue",
      "Stress concentration factors (Kt)",
      "Anisotropic material behavior"
    ]
  },
    {
    "slug": "welding-heat-input",
    "title": "Welding Heat Input",
    "category": "manufacturing-workshop",
    "description": "Determine the arc heat input in kJ/mm or kJ/in during welding according to EN 1011-1 and ASME Section IX, matching process thermal efficiencies.",
    "seoTitle": "ASME Sec IX Welding Heat Input Calculator | SectorCalc",
    "seoDescription": "Calculate weld heat input using EN 1011-1 / ASME Sec IX formulas. Supports SMAW, GMAW, GTAW, and SAW processes.",
    "inputs": [
      {
        "key": "current",
        "label": "Welding Current",
        "unit": "A",
        "type": "number",
        "helper": "Amperage read from welding machine display"
      },
      {
        "key": "voltage",
        "label": "Arc Voltage",
        "unit": "V",
        "type": "number",
        "helper": "Voltage measured across the arc"
      },
      {
        "key": "travelSpeed",
        "label": "Travel Speed",
        "unit": "mm/min",
        "type": "number",
        "helper": "Speed of torch advancement along the joint"
      },
      {
        "key": "weldingProcess",
        "label": "Welding Process",
        "unit": "select",
        "type": "select",
        "helper": "Select process (automatically defines process efficiency)",
        "options": [
          { "label": "SMAW / MMA (Stick) (η = 0.8)", "value": "smaw" },
          { "label": "GMAW / MIG / MAG (η = 0.8)", "value": "gmaw" },
          { "label": "GTAW / TIG (η = 0.6)", "value": "gtaw" },
          { "label": "SAW (Submerged Arc) (η = 1.0)", "value": "saw" }
        ],
        "defaultValue": "gmaw"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Welding joint geometry heat sinks",
      "Base metal preheat temperature",
      "Post-weld cooling rate variables"
    ]
  },
  {
    "slug": "wood-beam-shear",
    "title": "Wood Beam Shear",
    "category": "manufacturing-workshop",
    "description": "Free online wood beam shear calculator. Get accurate calculations instantly.",
    "seoTitle": "Wood Beam Shear | SectorCalc",
    "seoDescription": "Free online wood beam shear calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kesmekuvveti",
        "label": "kesmekuvveti",
        "unit": "N",
        "type": "number",
        "helper": "Enter kesmekuvveti"
      },
      {
        "key": "width",
        "label": "Section Width (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section width (m)"
      },
      {
        "key": "height",
        "label": "Section Height (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section height (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "worm-gear-efficiency",
    "title": "Worm Gear Efficiency",
    "category": "manufacturing-workshop",
    "description": "Free online worm gear efficiency calculator. Get accurate calculations instantly.",
    "seoTitle": "Worm Gear Efficiency | SectorCalc",
    "seoDescription": "Free online worm gear efficiency calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "helisacisi",
        "label": "helisacisi",
        "unit": "Rad",
        "type": "number",
        "helper": "Enter helisacisi"
      },
      {
        "key": "suratmaacisi",
        "label": "suratmaacisi",
        "unit": "Rad",
        "type": "number",
        "helper": "Enter suratmaacisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "load-bearing-wall",
    "title": "Load Bearing Wall",
    "category": "manufacturing-workshop",
    "description": "Free online load bearing wall calculator. Get accurate calculations instantly.",
    "seoTitle": "Load Bearing Wall | SectorCalc",
    "seoDescription": "Free online load bearing wall calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "load",
        "label": "Applied External Force (N)",
        "unit": "N",
        "type": "number",
        "helper": "Enter applied external force (n)"
      },
      {
        "key": "duvaralani",
        "label": "duvaralani",
        "unit": "m2",
        "type": "number",
        "helper": "Enter duvaralani"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "surface-roughness-ra",
    "title": "Surface Roughness Ra",
    "category": "manufacturing-workshop",
    "description": "Calculate theoretical arithmetic average roughness (Ra) and peak-to-valley roughness (Rz) based on turning feed rate and insert nose radius.",
    "seoTitle": "Theoretical Surface Roughness Ra & Rz Turning Calculator | SectorCalc",
    "seoDescription": "Calculate theoretical turning surface roughness Ra and Rz from feed rate and tool insert nose radius. Free CNC machinist tool.",
    "inputs": [
      {
        "key": "feedRate",
        "label": "Feed Rate",
        "unit": "mm/rev",
        "type": "number",
        "helper": "Distance traveled by the tool insert per spindle revolution"
      },
      {
        "key": "noseRadius",
        "label": "Insert Nose Radius",
        "unit": "mm",
        "type": "number",
        "helper": "Insert tip radius (standard values e.g. 0.2, 0.4, 0.8, 1.2, 1.6 mm)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Machine spindle vibration and chatter",
      "Workpiece material built-up edge (BUE)",
      "Cutting fluid coolants lubrication"
    ]
  },
  {
    "slug": "floor-joist-deflection",
    "title": "Floor Joist Deflection",
    "category": "manufacturing-workshop",
    "description": "Free online floor joist deflection calculator. Get accurate calculations instantly.",
    "seoTitle": "Floor Joist Deflection | SectorCalc",
    "seoDescription": "Free online floor joist deflection calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "load",
        "label": "Applied External Force (N)",
        "unit": "N",
        "type": "number",
        "helper": "Enter applied external force (n)"
      },
      {
        "key": "span",
        "label": "Clear Span length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter clear span length (m)"
      },
      {
        "key": "elasticModulus",
        "label": "Young's Modulus of Elasticity (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter young's modulus of elasticity (pa)"
      },
      {
        "key": "momentOfInertia",
        "label": "Area Moment of Inertia (m4)",
        "unit": "m4",
        "type": "number",
        "helper": "Enter area moment of inertia (m4)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "lvl-beam-capacity",
    "title": "Lvl Beam Capacity",
    "category": "manufacturing-workshop",
    "description": "Free online lvl beam capacity calculator. Get accurate calculations instantly.",
    "seoTitle": "Lvl Beam Capacity | SectorCalc",
    "seoDescription": "Free online lvl beam capacity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kesitmodulu",
        "label": "kesitmodulu",
        "unit": "m3",
        "type": "number",
        "helper": "Enter kesitmodulu"
      },
      {
        "key": "egilmedayanimi",
        "label": "egilmedayanimi",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter egilmedayanimi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "ridge-beam-calculator",
    "title": "Ridge Beam Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online ridge beam calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Ridge Beam Calculator | SectorCalc",
    "seoDescription": "Free online ridge beam calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "ridgeLoad",
        "label": "ridgeLoad",
        "unit": "N/m",
        "type": "number",
        "helper": "Enter ridgeLoad"
      },
      {
        "key": "span",
        "label": "Clear Span length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter clear span length (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "shear-force-diagram",
    "title": "Shear Force Diagram",
    "category": "manufacturing-workshop",
    "description": "Free online shear force diagram calculator. Get accurate calculations instantly.",
    "seoTitle": "Shear Force Diagram | SectorCalc",
    "seoDescription": "Free online shear force diagram calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "load",
        "label": "Applied External Force (N)",
        "unit": "N",
        "type": "number",
        "helper": "Enter applied external force (n)"
      },
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "m",
        "type": "number",
        "helper": "Enter distance traveled"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "archimedes-principle",
    "title": "Archimedes Principle",
    "category": "manufacturing-workshop",
    "description": "Free online archimedes principle calculator. Get accurate calculations instantly.",
    "seoTitle": "Archimedes Principle | SectorCalc",
    "seoDescription": "Free online archimedes principle calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      },
      {
        "key": "volume",
        "label": "volume",
        "unit": "m3",
        "type": "number",
        "helper": "Enter volume"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "bernoulli-equation",
    "title": "Bernoulli Equation",
    "category": "manufacturing-workshop",
    "description": "Free online bernoulli equation calculator. Get accurate calculations instantly.",
    "seoTitle": "Bernoulli Equation | SectorCalc",
    "seoDescription": "Free online bernoulli equation calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "p1",
        "label": "p1",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter p1"
      },
      {
        "key": "v1",
        "label": "v1",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter v1"
      },
      {
        "key": "v2",
        "label": "v2",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter v2"
      },
      {
        "key": "h1",
        "label": "h1",
        "unit": "m",
        "type": "number",
        "helper": "Enter h1"
      },
      {
        "key": "h2",
        "label": "h2",
        "unit": "m",
        "type": "number",
        "helper": "Enter h2"
      },
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "brinell-rockwell-conversion",
    "title": "Brinell Rockwell Conversion",
    "category": "manufacturing-workshop",
    "description": "Convert hardness values for steel between Brinell (HBW), Rockwell C (HRC), Vickers (HV), and Tensile Strength (Rm) scales based on ASTM E140 and ISO 18265.",
    "seoTitle": "Metal Hardness Conversion Calculator | HBW, HRC, HV, Rm | SectorCalc",
    "seoDescription": "Convert steel hardness values between Brinell HBW, Rockwell C HRC, Vickers HV, and Tensile Strength Rm using non-linear ASTM E140 polynomials.",
    "inputs": [
      {
        "key": "inputHardness",
        "label": "Input Hardness Value",
        "unit": "value",
        "type": "number",
        "helper": "Hardness number to convert (e.g. 300 for HV, 35 for HRC)"
      },
      {
        "key": "inputType",
        "label": "Source Hardness Scale",
        "unit": "select",
        "type": "select",
        "helper": "Select input hardness testing method and scale",
        "options": [
          { "label": "Brinell Hardness (HBW)", "value": "hbw" },
          { "label": "Rockwell C Hardness (HRC)", "value": "hrc" },
          { "label": "Vickers Hardness (HV)", "value": "hv" },
          { "label": "Tensile Strength (Rm) (MPa)", "value": "tensile" }
        ],
        "defaultValue": "hrc"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Non-steel metal calibration tables",
      "Test indentation temperature effects",
      "Varying crystal grain alignments"
    ]
  },
  {
    "slug": "capillary-action",
    "title": "Capillary Action",
    "category": "manufacturing-workshop",
    "description": "Free online capillary action calculator. Get accurate calculations instantly.",
    "seoTitle": "Capillary Action | SectorCalc",
    "seoDescription": "Free online capillary action calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "yuzeygerilimi",
        "label": "yuzeygerilimi",
        "unit": "N/m",
        "type": "number",
        "helper": "Enter yuzeygerilimi"
      },
      {
        "key": "temasacisi",
        "label": "temasacisi",
        "unit": "Rad",
        "type": "number",
        "helper": "Enter temasacisi"
      },
      {
        "key": "radius",
        "label": "Component Outer Radius (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component outer radius (m)"
      },
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "heat-conduction-fourier",
    "title": "Heat Conduction Fourier",
    "category": "manufacturing-workshop",
    "description": "Free online heat conduction fourier calculator. Get accurate calculations instantly.",
    "seoTitle": "Heat Conduction Fourier | SectorCalc",
    "seoDescription": "Free online heat conduction fourier calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "strikePrice",
        "label": "Strike Price (K)",
        "unit": "W/mK",
        "type": "number",
        "helper": "Enter strike price (k)"
      },
      {
        "key": "thickness",
        "label": "Wall Thickness (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter wall thickness (m)"
      },
      {
        "key": "temperatureDifference",
        "label": "Temperature Difference (K)",
        "unit": "K",
        "type": "number",
        "helper": "Enter temperature difference (k)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "energy-density",
    "title": "Energy Density",
    "category": "manufacturing-workshop",
    "description": "Free online energy density calculator. Get accurate calculations instantly.",
    "seoTitle": "Energy Density | SectorCalc",
    "seoDescription": "Free online energy density calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "enerji",
        "label": "enerji",
        "unit": "J",
        "type": "number",
        "helper": "Enter enerji"
      },
      {
        "key": "volume",
        "label": "volume",
        "unit": "m3",
        "type": "number",
        "helper": "Enter volume"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "phase-diagram-lever-rule",
    "title": "Phase Diagram Lever Rule",
    "category": "manufacturing-workshop",
    "description": "Free online phase diagram lever rule calculator. Get accurate calculations instantly.",
    "seoTitle": "Phase Diagram Lever Rule | SectorCalc",
    "seoDescription": "Free online phase diagram lever rule calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "c0",
        "label": "c0",
        "unit": "%",
        "type": "number",
        "helper": "Enter c0"
      },
      {
        "key": "cl",
        "label": "cl",
        "unit": "%",
        "type": "number",
        "helper": "Enter cl"
      },
      {
        "key": "cs",
        "label": "cs",
        "unit": "%",
        "type": "number",
        "helper": "Enter cs"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "photoelectric-effect",
    "title": "Photoelectric Effect",
    "category": "manufacturing-workshop",
    "description": "Free online photoelectric effect calculator. Get accurate calculations instantly.",
    "seoTitle": "Photoelectric Effect | SectorCalc",
    "seoDescription": "Free online photoelectric effect calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "frequency",
        "label": "Frequency (Hz)",
        "unit": "Hz",
        "type": "number",
        "helper": "Enter frequency (hz)"
      },
      {
        "key": "esikenerji",
        "label": "esikenerji",
        "unit": "J",
        "type": "number",
        "helper": "Enter esikenerji"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "porosity-calculator",
    "title": "Porosity Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online porosity calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Porosity Calculator | SectorCalc",
    "seoDescription": "Free online porosity calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "boslukhacim",
        "label": "boslukhacim",
        "unit": "m3",
        "type": "number",
        "helper": "Enter boslukhacim"
      },
      {
        "key": "toplamhacim",
        "label": "toplamhacim",
        "unit": "m3",
        "type": "number",
        "helper": "Enter toplamhacim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "stokes-law",
    "title": "Stokes Law",
    "category": "manufacturing-workshop",
    "description": "Free online stokes law calculator. Get accurate calculations instantly.",
    "seoTitle": "Stokes Law | SectorCalc",
    "seoDescription": "Free online stokes law calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "radius",
        "label": "Component Outer Radius (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component outer radius (m)"
      },
      {
        "key": "parcacikyogunluk",
        "label": "parcacikyogunluk",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter parcacikyogunluk"
      },
      {
        "key": "akiskanyogunluk",
        "label": "akiskanyogunluk",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter akiskanyogunluk"
      },
      {
        "key": "viskozite",
        "label": "viskozite",
        "unit": "Pa.s",
        "type": "number",
        "helper": "Enter viskozite"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "terminal-velocity",
    "title": "Terminal Velocity",
    "category": "manufacturing-workshop",
    "description": "Free online terminal velocity calculator. Get accurate calculations instantly.",
    "seoTitle": "Terminal Velocity | SectorCalc",
    "seoDescription": "Free online terminal velocity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "mass",
        "label": "Total Vibrating Mass (kg)",
        "unit": "kg",
        "type": "number",
        "helper": "Enter total vibrating mass (kg)"
      },
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      },
      {
        "key": "direnckatsayisi",
        "label": "direnckatsayisi",
        "unit": "Number",
        "type": "number",
        "helper": "Enter direnckatsayisi"
      },
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "wavelength-frequency-speed",
    "title": "Wavelength Frequency Speed",
    "category": "manufacturing-workshop",
    "description": "Free online wavelength frequency speed calculator. Get accurate calculations instantly.",
    "seoTitle": "Wavelength Frequency Speed | SectorCalc",
    "seoDescription": "Free online wavelength frequency speed calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "hiz",
        "label": "hiz",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter hiz"
      },
      {
        "key": "frequency",
        "label": "Frequency (Hz)",
        "unit": "Hz",
        "type": "number",
        "helper": "Enter frequency (hz)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "density-converter",
    "title": "Density Converter",
    "category": "manufacturing-workshop",
    "description": "Free online density converter calculator. Get accurate calculations instantly.",
    "seoTitle": "Density Converter | SectorCalc",
    "seoDescription": "Free online density converter calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "value",
        "label": "After Repair Value (ARV)",
        "unit": "Number",
        "type": "number",
        "helper": "Enter after repair value (arv)"
      },
      {
        "key": "kaynak",
        "label": "kaynak",
        "unit": "kgm3/gcm3/lbft3",
        "type": "number",
        "helper": "Enter kaynak"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "surface-tension",
    "title": "Surface Tension",
    "category": "manufacturing-workshop",
    "description": "Free online surface tension calculator. Get accurate calculations instantly.",
    "seoTitle": "Surface Tension | SectorCalc",
    "seoDescription": "Free online surface tension calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kuvvet",
        "label": "kuvvet",
        "unit": "N",
        "type": "number",
        "helper": "Enter kuvvet"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "thermal-conductivity-converter",
    "title": "Thermal Conductivity Converter",
    "category": "manufacturing-workshop",
    "description": "Free online thermal conductivity converter calculator. Get accurate calculations instantly.",
    "seoTitle": "Thermal Conductivity Converter | SectorCalc",
    "seoDescription": "Free online thermal conductivity converter calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "value",
        "label": "After Repair Value (ARV)",
        "unit": "Number",
        "type": "number",
        "helper": "Enter after repair value (arv)"
      },
      {
        "key": "kaynak",
        "label": "kaynak",
        "unit": "WmK/kcalmhC",
        "type": "number",
        "helper": "Enter kaynak"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "adhesive-amount",
    "title": "Adhesive Amount",
    "category": "manufacturing-workshop",
    "description": "Estimate structural or wall tiling wet volume and dry weight of adhesive needed for an installation area including process waste margins.",
    "seoTitle": "Structural & Tile Adhesive Amount Calculator | Weight & Volume | SectorCalc",
    "seoDescription": "Calculate structural adhesive, epoxy, or tile thinset weight and volume. Inputs area, thickness, and material type.",
    "inputs": [
      {
        "key": "area",
        "label": "Tiling / Bonding Area",
        "unit": "m²",
        "type": "number",
        "helper": "Total target contact surface area"
      },
      {
        "key": "thickness",
        "label": "Adhesive Layer Thickness",
        "unit": "mm",
        "type": "number",
        "helper": "Average wet thickness of adhesive coating"
      },
      {
        "key": "adhesiveType",
        "label": "Adhesive Compound Type",
        "unit": "select",
        "type": "select",
        "helper": "Select material type (defines material density)",
        "options": [
          { "label": "Tile Thinset Mortar (Density ~ 1.6 kg/L)", "value": "tile_thinset" },
          { "label": "Contact Cement (Density ~ 0.85 kg/L)", "value": "contact_cement" },
          { "label": "Epoxy Adhesive (Density ~ 1.2 kg/L)", "value": "epoxy" },
          { "label": "Polyurethane Adhesive (Density ~ 1.4 kg/L)", "value": "polyurethane" }
        ],
        "defaultValue": "tile_thinset"
      },
      {
        "key": "wastePercent",
        "label": "Trowel & Scrap Waste Allowance",
        "unit": "%",
        "type": "number",
        "helper": "Extra material margins (normally 5% to 12%)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Substrate absorption porosity rates",
      "Trowel notch geometry profiles",
      "Two-part mixture blending losses"
    ]
  },
  {
    "slug": "wood-deck-calculator",
    "title": "Wood Deck Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online wood deck calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Wood Deck Calculator | SectorCalc",
    "seoDescription": "Free online wood deck calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "tahtaen",
        "label": "tahtaen",
        "unit": "m",
        "type": "number",
        "helper": "Enter tahtaen"
      },
      {
        "key": "tahtaboy",
        "label": "tahtaboy",
        "unit": "m",
        "type": "number",
        "helper": "Enter tahtaboy"
      },
      {
        "key": "fire",
        "label": "fire",
        "unit": "%",
        "type": "number",
        "helper": "Enter fire"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
    {
    "slug": "drywall-calculator",
    "title": "Drywall Calculator",
    "category": "manufacturing-workshop",
    "description": "Estimate total drywall sheets, joint compound, drywall screws, joint tape, and vertical wall studs needed for a specific partition area.",
    "seoTitle": "Drywall Material Estimator Calculator | Sheets, Studs, Screws | SectorCalc",
    "seoDescription": "Free drywall materials calculator. Estimate drywall sheets, framing studs, joint compound, screws, and tape for walls.",
    "inputs": [
      {
        "key": "wallArea",
        "label": "Total Partition Wall Area",
        "unit": "m²",
        "type": "number",
        "helper": "Sum of total surface areas of walls or ceilings to board"
      },
      {
        "key": "sheetSize",
        "label": "Drywall Sheet Dimensions",
        "unit": "select",
        "type": "select",
        "helper": "Select sheet size (defines area per sheet)",
        "options": [
          { "label": "1.2m × 2.4m (Standard 2.88 m²)", "value": "1.2x2.4" },
          { "label": "1.2m × 3.6m (Long 4.32 m²)", "value": "1.2x3.6" }
        ],
        "defaultValue": "1.2x2.4"
      },
      {
        "key": "wastePercent",
        "label": "Cutting Waste Factor",
        "unit": "%",
        "type": "number",
        "helper": "Scrap waste margin (typically 8% to 15% depending on corners)"
      },
      {
        "key": "studSpacing",
        "label": "Stud Spacing Center-to-Center",
        "unit": "select",
        "type": "select",
        "helper": "Distance between vertical framing studs",
        "options": [
          { "label": "400 mm spacing", "value": "400" },
          { "label": "600 mm spacing", "value": "600" }
        ],
        "defaultValue": "600"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "L-trim and corner bead allowances",
      "Door and window header extra framing studs",
      "Moisture-resistant greenboard pricing upgrades"
    ]
  },
  {
    "slug": "drywall-joint-compound",
    "title": "Drywall Joint Compound",
    "category": "manufacturing-workshop",
    "description": "Free online drywall joint compound calculator. Get accurate calculations instantly.",
    "seoTitle": "Drywall Joint Compound | SectorCalc",
    "seoDescription": "Free online drywall joint compound calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "sarfiyat",
        "label": "sarfiyat",
        "unit": "kg/m2",
        "type": "number",
        "helper": "Enter sarfiyat"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "siding-calculator",
    "title": "Siding Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online siding calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Siding Calculator | SectorCalc",
    "seoDescription": "Free online siding calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "panelen",
        "label": "panelen",
        "unit": "m",
        "type": "number",
        "helper": "Enter panelen"
      },
      {
        "key": "panelboy",
        "label": "panelboy",
        "unit": "m",
        "type": "number",
        "helper": "Enter panelboy"
      },
      {
        "key": "fire",
        "label": "fire",
        "unit": "%",
        "type": "number",
        "helper": "Enter fire"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "soffit-calculator",
    "title": "Soffit Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online soffit calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Soffit Calculator | SectorCalc",
    "seoDescription": "Free online soffit calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "cevre",
        "label": "cevre",
        "unit": "m",
        "type": "number",
        "helper": "Enter cevre"
      },
      {
        "key": "width",
        "label": "Section Width (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section width (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "spray-paint-calculator",
    "title": "Spray Paint Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online spray paint calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Spray Paint Calculator | SectorCalc",
    "seoDescription": "Free online spray paint calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "katsayisi",
        "label": "katsayisi",
        "unit": "units",
        "type": "number",
        "helper": "Enter katsayisi"
      },
      {
        "key": "ortimeorani",
        "label": "ortimeorani",
        "unit": "m2/L",
        "type": "number",
        "helper": "Enter ortimeorani"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "wood-stain-calculator",
    "title": "Wood Stain Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online wood stain calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Wood Stain Calculator | SectorCalc",
    "seoDescription": "Free online wood stain calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "sarfiyat",
        "label": "sarfiyat",
        "unit": "m2/L",
        "type": "number",
        "helper": "Enter sarfiyat"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "exterior-stucco",
    "title": "Exterior Stucco",
    "category": "manufacturing-workshop",
    "description": "Free online exterior stucco calculator. Get accurate calculations instantly.",
    "seoTitle": "Exterior Stucco | SectorCalc",
    "seoDescription": "Free online exterior stucco calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "thickness",
        "label": "Wall Thickness (m)",
        "unit": "cm",
        "type": "number",
        "helper": "Enter wall thickness (m)"
      },
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "baseboard-calculator",
    "title": "Baseboard Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online baseboard calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Baseboard Calculator | SectorCalc",
    "seoDescription": "Free online baseboard calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "odacevresi",
        "label": "odacevresi",
        "unit": "m",
        "type": "number",
        "helper": "Enter odacevresi"
      },
      {
        "key": "kapigenisligi",
        "label": "kapigenisligi",
        "unit": "m",
        "type": "number",
        "helper": "Enter kapigenisligi"
      },
      {
        "key": "kapisayisi",
        "label": "kapisayisi",
        "unit": "units",
        "type": "number",
        "helper": "Enter kapisayisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "chair-rail-calculator",
    "title": "Chair Rail Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online chair rail calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Chair Rail Calculator | SectorCalc",
    "seoDescription": "Free online chair rail calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "duvaruzunlugu",
        "label": "duvaruzunlugu",
        "unit": "m",
        "type": "number",
        "helper": "Enter duvaruzunlugu"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "wallpaper-calculator",
    "title": "Wallpaper Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online wallpaper calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Wallpaper Calculator | SectorCalc",
    "seoDescription": "Free online wallpaper calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "ruloen",
        "label": "ruloen",
        "unit": "m",
        "type": "number",
        "helper": "Enter ruloen"
      },
      {
        "key": "ruloboy",
        "label": "ruloboy",
        "unit": "m",
        "type": "number",
        "helper": "Enter ruloboy"
      },
      {
        "key": "desentekrari",
        "label": "desentekrari",
        "unit": "m",
        "type": "number",
        "helper": "Enter desentekrari"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "tile-layout-calculator",
    "title": "Tile Layout Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online tile layout calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Tile Layout Calculator | SectorCalc",
    "seoDescription": "Free online tile layout calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alanen",
        "label": "alanen",
        "unit": "m",
        "type": "number",
        "helper": "Enter alanen"
      },
      {
        "key": "fayansen",
        "label": "fayansen",
        "unit": "m",
        "type": "number",
        "helper": "Enter fayansen"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "linoleum-vinyl-calculator",
    "title": "Linoleum Vinyl Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online linoleum vinyl calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Linoleum Vinyl Calculator | SectorCalc",
    "seoDescription": "Free online linoleum vinyl calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "ruloen",
        "label": "ruloen",
        "unit": "m",
        "type": "number",
        "helper": "Enter ruloen"
      },
      {
        "key": "fire",
        "label": "fire",
        "unit": "%",
        "type": "number",
        "helper": "Enter fire"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "wood-siding-calculator",
    "title": "Wood Siding Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online wood siding calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Wood Siding Calculator | SectorCalc",
    "seoDescription": "Free online wood siding calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "tahtaen",
        "label": "tahtaen",
        "unit": "m",
        "type": "number",
        "helper": "Enter tahtaen"
      },
      {
        "key": "bindirmepayi",
        "label": "bindirmepayi",
        "unit": "m",
        "type": "number",
        "helper": "Enter bindirmepayi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "paver-calculator",
    "title": "Paver Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online paver calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Paver Calculator | SectorCalc",
    "seoDescription": "Free online paver calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "tasen",
        "label": "tasen",
        "unit": "m",
        "type": "number",
        "helper": "Enter tasen"
      },
      {
        "key": "tasboy",
        "label": "tasboy",
        "unit": "m",
        "type": "number",
        "helper": "Enter tasboy"
      },
      {
        "key": "fire",
        "label": "fire",
        "unit": "%",
        "type": "number",
        "helper": "Enter fire"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "gravel-sand-calculator",
    "title": "Gravel Sand Calculator",
    "category": "manufacturing-workshop",
    "description": "Free online gravel sand calculator calculator. Get accurate calculations instantly.",
    "seoTitle": "Gravel Sand Calculator | SectorCalc",
    "seoDescription": "Free online gravel sand calculator calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "thickness",
        "label": "Wall Thickness (m)",
        "unit": "cm",
        "type": "number",
        "helper": "Enter wall thickness (m)"
      },
      {
        "key": "density",
        "label": "Fluid Density (kg/m3)",
        "unit": "ton/m3",
        "type": "number",
        "helper": "Enter fluid density (kg/m3)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "rainwater-harvesting",
    "title": "Rainwater Harvesting",
    "category": "manufacturing-workshop",
    "description": "Free online rainwater harvesting calculator. Get accurate calculations instantly.",
    "seoTitle": "Rainwater Harvesting | SectorCalc",
    "seoDescription": "Free online rainwater harvesting calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "catialani",
        "label": "catialani",
        "unit": "m2",
        "type": "number",
        "helper": "Enter catialani"
      },
      {
        "key": "yillikyagis",
        "label": "yillikyagis",
        "unit": "mm",
        "type": "number",
        "helper": "Enter yillikyagis"
      },
      {
        "key": "verim",
        "label": "verim",
        "unit": "%",
        "type": "number",
        "helper": "Enter verim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "well-pump-capacity",
    "title": "Well Pump Capacity",
    "category": "manufacturing-workshop",
    "description": "Free online well pump capacity calculator. Get accurate calculations instantly.",
    "seoTitle": "Well Pump Capacity | SectorCalc",
    "seoDescription": "Free online well pump capacity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "debi",
        "label": "debi",
        "unit": "m3/saat",
        "type": "number",
        "helper": "Enter debi"
      },
      {
        "key": "height",
        "label": "Section Height (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section height (m)"
      },
      {
        "key": "verim",
        "label": "verim",
        "unit": "%",
        "type": "number",
        "helper": "Enter verim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "building-load-factor",
    "title": "Building Load Factor",
    "category": "manufacturing-workshop",
    "description": "Free online building load factor calculator. Get accurate calculations instantly.",
    "seoTitle": "Building Load Factor | SectorCalc",
    "seoDescription": "Free online building load factor calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "makstalep",
        "label": "makstalep",
        "unit": "kW",
        "type": "number",
        "helper": "Enter makstalep"
      },
      {
        "key": "kuruluguc",
        "label": "kuruluguc",
        "unit": "kW",
        "type": "number",
        "helper": "Enter kuruluguc"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "breeam-leed-score",
    "title": "Breeam Leed Score",
    "category": "manufacturing-workshop",
    "description": "Free online breeam leed score calculator. Get accurate calculations instantly.",
    "seoTitle": "Breeam Leed Score | SectorCalc",
    "seoDescription": "Free online breeam leed score calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "enerji",
        "label": "enerji",
        "unit": "Number",
        "type": "number",
        "helper": "Enter enerji"
      },
      {
        "key": "su",
        "label": "su",
        "unit": "Number",
        "type": "number",
        "helper": "Enter su"
      },
      {
        "key": "malzeme",
        "label": "malzeme",
        "unit": "Number",
        "type": "number",
        "helper": "Enter malzeme"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "carbon-footprint",
    "title": "Carbon Footprint",
    "category": "manufacturing-workshop",
    "description": "Free online carbon footprint calculator. Get accurate calculations instantly.",
    "seoTitle": "Carbon Footprint | SectorCalc",
    "seoDescription": "Free online carbon footprint calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "yakit",
        "label": "yakit",
        "unit": "L",
        "type": "number",
        "helper": "Enter yakit"
      },
      {
        "key": "elektrik",
        "label": "elektrik",
        "unit": "kWh",
        "type": "number",
        "helper": "Enter elektrik"
      },
      {
        "key": "supply",
        "label": "Product Supply Cost",
        "unit": "kgCO2",
        "type": "number",
        "helper": "Enter product supply cost"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "esg-score",
    "title": "Esg Score",
    "category": "manufacturing-workshop",
    "description": "Free online esg score calculator. Get accurate calculations instantly.",
    "seoTitle": "Esg Score | SectorCalc",
    "seoDescription": "Free online esg score calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "cevre",
        "label": "cevre",
        "unit": "0-100",
        "type": "number",
        "helper": "Enter cevre"
      },
      {
        "key": "sosyal",
        "label": "sosyal",
        "unit": "0-100",
        "type": "number",
        "helper": "Enter sosyal"
      },
      {
        "key": "yonetisim",
        "label": "yonetisim",
        "unit": "0-100",
        "type": "number",
        "helper": "Enter yonetisim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "circular-economy",
    "title": "Circular Economy",
    "category": "manufacturing-workshop",
    "description": "Free online circular economy calculator. Get accurate calculations instantly.",
    "seoTitle": "Circular Economy | SectorCalc",
    "seoDescription": "Free online circular economy calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "gerikazanilan",
        "label": "gerikazanilan",
        "unit": "ton",
        "type": "number",
        "helper": "Enter gerikazanilan"
      },
      {
        "key": "toplamgirdi",
        "label": "toplamgirdi",
        "unit": "ton",
        "type": "number",
        "helper": "Enter toplamgirdi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "water-footprint",
    "title": "Water Footprint",
    "category": "manufacturing-workshop",
    "description": "Free online water footprint calculator. Get accurate calculations instantly.",
    "seoTitle": "Water Footprint | SectorCalc",
    "seoDescription": "Free online water footprint calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "uretimhacmi",
        "label": "uretimhacmi",
        "unit": "Ton",
        "type": "number",
        "helper": "Enter uretimhacmi"
      },
      {
        "key": "tuketilensu",
        "label": "tuketilensu",
        "unit": "m3",
        "type": "number",
        "helper": "Enter tuketilensu"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "landfill-storage",
    "title": "Landfill Storage",
    "category": "manufacturing-workshop",
    "description": "Free online landfill storage calculator. Get accurate calculations instantly.",
    "seoTitle": "Landfill Storage | SectorCalc",
    "seoDescription": "Free online landfill storage calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "atikhacmi",
        "label": "atikhacmi",
        "unit": "m3",
        "type": "number",
        "helper": "Enter atikhacmi"
      },
      {
        "key": "sikistirma",
        "label": "sikistirma",
        "unit": "%",
        "type": "number",
        "helper": "Enter sikistirma"
      },
      {
        "key": "depth",
        "label": "Fluid Depth (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter fluid depth (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "recycling-rate",
    "title": "Recycling Rate",
    "category": "manufacturing-workshop",
    "description": "Free online recycling rate calculator. Get accurate calculations instantly.",
    "seoTitle": "Recycling Rate | SectorCalc",
    "seoDescription": "Free online recycling rate calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "geridonusen",
        "label": "geridonusen",
        "unit": "ton",
        "type": "number",
        "helper": "Enter geridonusen"
      },
      {
        "key": "toplamatik",
        "label": "toplamatik",
        "unit": "ton",
        "type": "number",
        "helper": "Enter toplamatik"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "watershed-management",
    "title": "Watershed Management",
    "category": "manufacturing-workshop",
    "description": "Free online watershed management calculator. Get accurate calculations instantly.",
    "seoTitle": "Watershed Management | SectorCalc",
    "seoDescription": "Free online watershed management calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "havzaalani",
        "label": "havzaalani",
        "unit": "km2",
        "type": "number",
        "helper": "Enter havzaalani"
      },
      {
        "key": "yagis",
        "label": "yagis",
        "unit": "mm",
        "type": "number",
        "helper": "Enter yagis"
      },
      {
        "key": "akiskatsayisi",
        "label": "akiskatsayisi",
        "unit": "Number",
        "type": "number",
        "helper": "Enter akiskatsayisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "greywater-recovery",
    "title": "Greywater Recovery",
    "category": "manufacturing-workshop",
    "description": "Free online greywater recovery calculator. Get accurate calculations instantly.",
    "seoTitle": "Greywater Recovery | SectorCalc",
    "seoDescription": "Free online greywater recovery calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "grisuhacmi",
        "label": "grisuhacmi",
        "unit": "m3/gun",
        "type": "number",
        "helper": "Enter grisuhacmi"
      },
      {
        "key": "aritmamaliyet",
        "label": "aritmamaliyet",
        "unit": "TL/m3",
        "type": "number",
        "helper": "Enter aritmamaliyet"
      },
      {
        "key": "sebekefiyat",
        "label": "sebekefiyat",
        "unit": "TL/m3",
        "type": "number",
        "helper": "Enter sebekefiyat"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "quantum-tunneling",
    "title": "Quantum Tunneling",
    "category": "manufacturing-workshop",
    "description": "Free online quantum tunneling calculator. Get accurate calculations instantly.",
    "seoTitle": "Quantum Tunneling | SectorCalc",
    "seoDescription": "Free online quantum tunneling calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "engelgenisligi",
        "label": "engelgenisligi",
        "unit": "m",
        "type": "number",
        "helper": "Enter engelgenisligi"
      },
      {
        "key": "engelyuksekligi",
        "label": "engelyuksekligi",
        "unit": "J",
        "type": "number",
        "helper": "Enter engelyuksekligi"
      },
      {
        "key": "enerji",
        "label": "enerji",
        "unit": "J",
        "type": "number",
        "helper": "Enter enerji"
      },
      {
        "key": "mass",
        "label": "Total Vibrating Mass (kg)",
        "unit": "kg",
        "type": "number",
        "helper": "Enter total vibrating mass (kg)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "schrodinger-equation-1d",
    "title": "Schrodinger Equation 1d",
    "category": "manufacturing-workshop",
    "description": "Free online schrodinger equation 1d calculator. Get accurate calculations instantly.",
    "seoTitle": "Schrodinger Equation 1d | SectorCalc",
    "seoDescription": "Free online schrodinger equation 1d calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kuyugenisligi",
        "label": "kuyugenisligi",
        "unit": "m",
        "type": "number",
        "helper": "Enter kuyugenisligi"
      },
      {
        "key": "mass",
        "label": "Total Vibrating Mass (kg)",
        "unit": "kg",
        "type": "number",
        "helper": "Enter total vibrating mass (kg)"
      },
      {
        "key": "kuantumsayisi",
        "label": "kuantumsayisi",
        "unit": "n",
        "type": "number",
        "helper": "Enter kuantumsayisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "compton-scattering",
    "title": "Compton Scattering",
    "category": "manufacturing-workshop",
    "description": "Free online compton scattering calculator. Get accurate calculations instantly.",
    "seoTitle": "Compton Scattering | SectorCalc",
    "seoDescription": "Free online compton scattering calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sacilmaacisi",
        "label": "sacilmaacisi",
        "unit": "Derece",
        "type": "number",
        "helper": "Enter sacilmaacisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "chandrasekhar-limit",
    "title": "Chandrasekhar Limit",
    "category": "manufacturing-workshop",
    "description": "Free online chandrasekhar limit calculator. Get accurate calculations instantly.",
    "seoTitle": "Chandrasekhar Limit | SectorCalc",
    "seoDescription": "Free online chandrasekhar limit calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "guneskutlesi",
        "label": "guneskutlesi",
        "unit": "Number",
        "type": "number",
        "helper": "Enter guneskutlesi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "electrical-load-factor",
    "title": "Electrical Load Factor",
    "category": "manufacturing-workshop",
    "description": "Free online electrical load factor calculator. Get accurate calculations instantly.",
    "seoTitle": "Electrical Load Factor | SectorCalc",
    "seoDescription": "Free online electrical load factor calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "ortalamaguc",
        "label": "Average Power",
        "unit": "kW",
        "type": "number",
        "helper": "Enter average power consumption"
      },
      {
        "key": "pikguc",
        "label": "Peak Power",
        "unit": "kW",
        "type": "number",
        "helper": "Enter peak power demand"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "fiber-optic-attenuation",
    "title": "Fiber Optic Attenuation",
    "category": "manufacturing-workshop",
    "description": "Free online fiber optic attenuation calculator. Get accurate calculations instantly.",
    "seoTitle": "Fiber Optic Attenuation | SectorCalc",
    "seoDescription": "Free online fiber optic attenuation calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "km",
        "type": "number",
        "helper": "Enter component length (m)"
      },
      {
        "key": "birimkayip",
        "label": "birimkayip",
        "unit": "dB/km",
        "type": "number",
        "helper": "Enter birimkayip"
      },
      {
        "key": "ekkayip",
        "label": "ekkayip",
        "unit": "dB",
        "type": "number",
        "helper": "Enter ekkayip"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "rf-antenna-sizing",
    "title": "Rf Antenna Sizing",
    "category": "manufacturing-workshop",
    "description": "Free online rf antenna sizing calculator. Get accurate calculations instantly.",
    "seoTitle": "Rf Antenna Sizing | SectorCalc",
    "seoDescription": "Free online rf antenna sizing calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "frequency",
        "label": "Frequency (Hz)",
        "unit": "MHz",
        "type": "number",
        "helper": "Enter frequency (hz)"
      },
      {
        "key": "tip",
        "label": "tip",
        "unit": "Dipole/Yagi",
        "type": "number",
        "helper": "Enter tip"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "beam-support-reactions",
    "title": "Beam Support Reactions",
    "category": "manufacturing-workshop",
    "description": "Free online beam support reactions calculator. Get accurate calculations instantly.",
    "seoTitle": "Beam Support Reactions | SectorCalc",
    "seoDescription": "Free online beam support reactions calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "load",
        "label": "Applied External Force (N)",
        "unit": "N",
        "type": "number",
        "helper": "Enter applied external force (n)"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      },
      {
        "key": "yukkonum",
        "label": "yukkonum",
        "unit": "m",
        "type": "number",
        "helper": "Enter yukkonum"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "seed-sowing-density",
    "title": "Seed Sowing Density",
    "category": "manufacturing-workshop",
    "description": "Free online seed sowing density calculator. Get accurate calculations instantly.",
    "seoTitle": "Seed Sowing Density | SectorCalc",
    "seoDescription": "Free online seed sowing density calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "siraaraligi",
        "label": "siraaraligi",
        "unit": "m",
        "type": "number",
        "helper": "Enter siraaraligi"
      },
      {
        "key": "uzerimesafe",
        "label": "uzerimesafe",
        "unit": "m",
        "type": "number",
        "helper": "Enter uzerimesafe"
      },
      {
        "key": "bintaneagirlik",
        "label": "bintaneagirlik",
        "unit": "g",
        "type": "number",
        "helper": "Enter bintaneagirlik"
      },
      {
        "key": "cimlenme",
        "label": "cimlenme",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter cimlenme"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "drip-irrigation-pipe-size",
    "title": "Drip Irrigation Pipe Size",
    "category": "manufacturing-workshop",
    "description": "Free online drip irrigation pipe size calculator. Get accurate calculations instantly.",
    "seoTitle": "Drip Irrigation Pipe Size | SectorCalc",
    "seoDescription": "Free online drip irrigation pipe size calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "damaticidebi",
        "label": "damaticidebi",
        "unit": "L/h",
        "type": "number",
        "helper": "Enter damaticidebi"
      },
      {
        "key": "damaticisayisi",
        "label": "damaticisayisi",
        "unit": "units",
        "type": "number",
        "helper": "Enter damaticisayisi"
      },
      {
        "key": "maxhiz",
        "label": "maxhiz",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter maxhiz"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "aerated-drying",
    "title": "Aerated Drying",
    "category": "manufacturing-workshop",
    "description": "Free online aerated drying calculator. Get accurate calculations instantly.",
    "seoTitle": "Aerated Drying | SectorCalc",
    "seoDescription": "Free online aerated drying calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "urunkutlesi",
        "label": "urunkutlesi",
        "unit": "kg",
        "type": "number",
        "helper": "Enter urunkutlesi"
      },
      {
        "key": "baslangicnem",
        "label": "baslangicnem",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter baslangicnem"
      },
      {
        "key": "hedefnem",
        "label": "hedefnem",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter hedefnem"
      },
      {
        "key": "havadebi",
        "label": "havadebi",
        "unit": "kg/s",
        "type": "number",
        "helper": "Enter havadebi"
      },
      {
        "key": "nemfarki",
        "label": "nemfarki",
        "unit": "kg/kg",
        "type": "number",
        "helper": "Enter nemfarki"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "silage-volume",
    "title": "Silage Volume",
    "category": "manufacturing-workshop",
    "description": "Free online silage volume calculator. Get accurate calculations instantly.",
    "seoTitle": "Silage Volume | SectorCalc",
    "seoDescription": "Free online silage volume calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "silohacim",
        "label": "silohacim",
        "unit": "m3",
        "type": "number",
        "helper": "Enter silohacim"
      },
      {
        "key": "sikistirmayogunlugu",
        "label": "sikistirmayogunlugu",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter sikistirmayogunlugu"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "barn-ventilation",
    "title": "Barn Ventilation",
    "category": "manufacturing-workshop",
    "description": "Free online barn ventilation calculator. Get accurate calculations instantly.",
    "seoTitle": "Barn Ventilation | SectorCalc",
    "seoDescription": "Free online barn ventilation calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "height",
        "label": "Section Height (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section height (m)"
      },
      {
        "key": "havadegisimsayisi",
        "label": "havadegisimsayisi",
        "unit": "Adet/saat",
        "type": "number",
        "helper": "Enter havadegisimsayisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "ship-draft",
    "title": "Ship Draft",
    "category": "manufacturing-workshop",
    "description": "Free online ship draft calculator. Get accurate calculations instantly.",
    "seoTitle": "Ship Draft | SectorCalc",
    "seoDescription": "Free online ship draft calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "displacement",
        "label": "Spring Compression Displacement (m)",
        "unit": "ton",
        "type": "number",
        "helper": "Enter spring compression displacement (m)"
      },
      {
        "key": "suyogunlugu",
        "label": "suyogunlugu",
        "unit": "t/m3",
        "type": "number",
        "helper": "Enter suyogunlugu"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      },
      {
        "key": "width",
        "label": "Section Width (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section width (m)"
      },
      {
        "key": "blokkatsayi",
        "label": "blokkatsayi",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter blokkatsayi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "ship-stability-gm",
    "title": "Ship Stability Gm",
    "category": "manufacturing-workshop",
    "description": "Free online ship stability gm calculator. Get accurate calculations instantly.",
    "seoTitle": "Ship Stability Gm | SectorCalc",
    "seoDescription": "Free online ship stability gm calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kb",
        "label": "kb",
        "unit": "m",
        "type": "number",
        "helper": "Enter kb"
      },
      {
        "key": "bm",
        "label": "bm",
        "unit": "m",
        "type": "number",
        "helper": "Enter bm"
      },
      {
        "key": "kg",
        "label": "kg",
        "unit": "m",
        "type": "number",
        "helper": "Enter kg"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mooring-rope-breaking",
    "title": "Mooring Rope Breaking",
    "category": "manufacturing-workshop",
    "description": "Free online mooring rope breaking calculator. Get accurate calculations instantly.",
    "seoTitle": "Mooring Rope Breaking | SectorCalc",
    "seoDescription": "Free online mooring rope breaking calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "halatcapi",
        "label": "halatcapi",
        "unit": "mm",
        "type": "number",
        "helper": "Enter halatcapi"
      },
      {
        "key": "malzemekatsayisi",
        "label": "malzemekatsayisi",
        "unit": "N/mm2",
        "type": "number",
        "helper": "Enter malzemekatsayisi"
      },
      {
        "key": "guvenlikfaktoru",
        "label": "guvenlikfaktoru",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter guvenlikfaktoru"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "anchor-chain",
    "title": "Anchor Chain",
    "category": "manufacturing-workshop",
    "description": "Free online anchor chain calculator. Get accurate calculations instantly.",
    "seoTitle": "Anchor Chain | SectorCalc",
    "seoDescription": "Free online anchor chain calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "suderinligi",
        "label": "suderinligi",
        "unit": "m",
        "type": "number",
        "helper": "Enter suderinligi"
      },
      {
        "key": "ruzgarhizi",
        "label": "ruzgarhizi",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter ruzgarhizi"
      },
      {
        "key": "dipkatsayisi",
        "label": "dipkatsayisi",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter dipkatsayisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "bilge-discharge",
    "title": "Bilge Discharge",
    "category": "manufacturing-workshop",
    "description": "Free online bilge discharge calculator. Get accurate calculations instantly.",
    "seoTitle": "Bilge Discharge | SectorCalc",
    "seoDescription": "Free online bilge discharge calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "tankhacim",
        "label": "tankhacim",
        "unit": "m3",
        "type": "number",
        "helper": "Enter tankhacim"
      },
      {
        "key": "pompadebi",
        "label": "pompadebi",
        "unit": "m3/saat",
        "type": "number",
        "helper": "Enter pompadebi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "bottom-hole-pressure",
    "title": "Bottom Hole Pressure",
    "category": "manufacturing-workshop",
    "description": "Free online bottom hole pressure calculator. Get accurate calculations instantly.",
    "seoTitle": "Bottom Hole Pressure | SectorCalc",
    "seoDescription": "Free online bottom hole pressure calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "camuryogunlugu",
        "label": "camuryogunlugu",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter camuryogunlugu"
      },
      {
        "key": "depth",
        "label": "Fluid Depth (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter fluid depth (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "rotary-drilling-torque",
    "title": "Rotary Drilling Torque",
    "category": "manufacturing-workshop",
    "description": "Free online rotary drilling torque calculator. Get accurate calculations instantly.",
    "seoTitle": "Rotary Drilling Torque | SectorCalc",
    "seoDescription": "Free online rotary drilling torque calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "matkapcapi",
        "label": "matkapcapi",
        "unit": "m",
        "type": "number",
        "helper": "Enter matkapcapi"
      },
      {
        "key": "kayadayanim",
        "label": "kayadayanim",
        "unit": "MPa",
        "type": "number",
        "helper": "Enter kayadayanim"
      },
      {
        "key": "kesicikatsayi",
        "label": "kesicikatsayi",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter kesicikatsayi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mud-circulation-velocity",
    "title": "Mud Circulation Velocity",
    "category": "manufacturing-workshop",
    "description": "Free online mud circulation velocity calculator. Get accurate calculations instantly.",
    "seoTitle": "Mud Circulation Velocity | SectorCalc",
    "seoDescription": "Free online mud circulation velocity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "camurdebi",
        "label": "camurdebi",
        "unit": "m3/s",
        "type": "number",
        "helper": "Enter camurdebi"
      },
      {
        "key": "kuyucapi",
        "label": "kuyucapi",
        "unit": "m",
        "type": "number",
        "helper": "Enter kuyucapi"
      },
      {
        "key": "matkapcapi",
        "label": "matkapcapi",
        "unit": "m",
        "type": "number",
        "helper": "Enter matkapcapi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "bored-pile-bearing-capacity",
    "title": "Bored Pile Bearing Capacity",
    "category": "manufacturing-workshop",
    "description": "Free online bored pile bearing capacity calculator. Get accurate calculations instantly.",
    "seoTitle": "Bored Pile Bearing Capacity | SectorCalc",
    "seoDescription": "Free online bored pile bearing capacity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "diameter",
        "label": "Diameter (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter diameter (m)"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      },
      {
        "key": "kohezyon",
        "label": "kohezyon",
        "unit": "kPa",
        "type": "number",
        "helper": "Enter kohezyon"
      },
      {
        "key": "friction",
        "label": "Belt-to-Pulley Friction Coefficient",
        "unit": "kPa",
        "type": "number",
        "helper": "Enter belt-to-pulley friction coefficient"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "slope-safety-factor",
    "title": "Slope Safety Factor",
    "category": "manufacturing-workshop",
    "description": "Free online slope safety factor calculator. Get accurate calculations instantly.",
    "seoTitle": "Slope Safety Factor | SectorCalc",
    "seoDescription": "Free online slope safety factor calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kohezyon",
        "label": "kohezyon",
        "unit": "kPa",
        "type": "number",
        "helper": "Enter kohezyon"
      },
      {
        "key": "normalgerilme",
        "label": "normalgerilme",
        "unit": "kPa",
        "type": "number",
        "helper": "Enter normalgerilme"
      },
      {
        "key": "icsuratmaacisi",
        "label": "icsuratmaacisi",
        "unit": "Derece",
        "type": "number",
        "helper": "Enter icsuratmaacisi"
      },
      {
        "key": "kaymagerilmesi",
        "label": "kaymagerilmesi",
        "unit": "kPa",
        "type": "number",
        "helper": "Enter kaymagerilmesi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "fabric-weight",
    "title": "Fabric Weight",
    "category": "manufacturing-workshop",
    "description": "Free online fabric weight calculator. Get accurate calculations instantly.",
    "seoTitle": "Fabric Weight | SectorCalc",
    "seoDescription": "Free online fabric weight calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "width",
        "label": "Section Width (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter section width (m)"
      },
      {
        "key": "gramaj",
        "label": "gramaj",
        "unit": "g/m2",
        "type": "number",
        "helper": "Enter gramaj"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "sewing-machine-cycle-time",
    "title": "Sewing Machine Cycle Time",
    "category": "manufacturing-workshop",
    "description": "Free online sewing machine cycle time calculator. Get accurate calculations instantly.",
    "seoTitle": "Sewing Machine Cycle Time | SectorCalc",
    "seoDescription": "Free online sewing machine cycle time calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "dikisuzunluk",
        "label": "dikisuzunluk",
        "unit": "mm",
        "type": "number",
        "helper": "Enter dikisuzunluk"
      },
      {
        "key": "devirsayisi",
        "label": "devirsayisi",
        "unit": "devir/dk",
        "type": "number",
        "helper": "Enter devirsayisi"
      },
      {
        "key": "dikissikligi",
        "label": "dikissikligi",
        "unit": "dikis/mm",
        "type": "number",
        "helper": "Enter dikissikligi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "bobbin-yarn-capacity",
    "title": "Bobbin Yarn Capacity",
    "category": "manufacturing-workshop",
    "description": "Free online bobbin yarn capacity calculator. Get accurate calculations instantly.",
    "seoTitle": "Bobbin Yarn Capacity | SectorCalc",
    "seoDescription": "Free online bobbin yarn capacity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "bobinagirlik",
        "label": "bobinagirlik",
        "unit": "g",
        "type": "number",
        "helper": "Enter bobinagirlik"
      },
      {
        "key": "ipliknumara",
        "label": "ipliknumara",
        "unit": "Nm",
        "type": "number",
        "helper": "Enter ipliknumara"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "fabric-shrinkage",
    "title": "Fabric Shrinkage",
    "category": "manufacturing-workshop",
    "description": "Free online fabric shrinkage calculator. Get accurate calculations instantly.",
    "seoTitle": "Fabric Shrinkage | SectorCalc",
    "seoDescription": "Free online fabric shrinkage calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "hamolcu",
        "label": "hamolcu",
        "unit": "cm",
        "type": "number",
        "helper": "Enter hamolcu"
      },
      {
        "key": "bitmisolcu",
        "label": "bitmisolcu",
        "unit": "cm",
        "type": "number",
        "helper": "Enter bitmisolcu"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "weaving-loom-efficiency",
    "title": "Weaving Loom Efficiency",
    "category": "manufacturing-workshop",
    "description": "Free online weaving loom efficiency calculator. Get accurate calculations instantly.",
    "seoTitle": "Weaving Loom Efficiency | SectorCalc",
    "seoDescription": "Free online weaving loom efficiency calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "atimsayisi",
        "label": "atimsayisi",
        "unit": "atim/dk",
        "type": "number",
        "helper": "Enter atimsayisi"
      },
      {
        "key": "durussure",
        "label": "durussure",
        "unit": "dk",
        "type": "number",
        "helper": "Enter durussure"
      },
      {
        "key": "vardiyasure",
        "label": "vardiyasure",
        "unit": "dk",
        "type": "number",
        "helper": "Enter vardiyasure"
      },
      {
        "key": "kumassikligi",
        "label": "kumassikligi",
        "unit": "atim/cm",
        "type": "number",
        "helper": "Enter kumassikligi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "cold-storage-heat-gain",
    "title": "Cold Storage Heat Gain",
    "category": "manufacturing-workshop",
    "description": "Free online cold storage heat gain calculator. Get accurate calculations instantly.",
    "seoTitle": "Cold Storage Heat Gain | SectorCalc",
    "seoDescription": "Free online cold storage heat gain calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "u_katsayi",
        "label": "u_katsayi",
        "unit": "W/m2K",
        "type": "number",
        "helper": "Enter u_katsayi"
      },
      {
        "key": "dissicaklik",
        "label": "dissicaklik",
        "unit": "C",
        "type": "number",
        "helper": "Enter dissicaklik"
      },
      {
        "key": "icsicaklik",
        "label": "icsicaklik",
        "unit": "C",
        "type": "number",
        "helper": "Enter icsicaklik"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "liquid-food-flow-energy",
    "title": "Liquid Food Flow Energy",
    "category": "manufacturing-workshop",
    "description": "Free online liquid food flow energy calculator. Get accurate calculations instantly.",
    "seoTitle": "Liquid Food Flow Energy | SectorCalc",
    "seoDescription": "Free online liquid food flow energy calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "debi",
        "label": "debi",
        "unit": "m3/s",
        "type": "number",
        "helper": "Enter debi"
      },
      {
        "key": "basincdusumu",
        "label": "basincdusumu",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter basincdusumu"
      },
      {
        "key": "pompaverim",
        "label": "pompaverim",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter pompaverim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "pasteurization-time",
    "title": "Pasteurization Time",
    "category": "manufacturing-workshop",
    "description": "Free online pasteurization time calculator. Get accurate calculations instantly.",
    "seoTitle": "Pasteurization Time | SectorCalc",
    "seoDescription": "Free online pasteurization time calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "volume",
        "label": "volume",
        "unit": "m3",
        "type": "number",
        "helper": "Enter volume"
      },
      {
        "key": "debi",
        "label": "debi",
        "unit": "m3/s",
        "type": "number",
        "helper": "Enter debi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "vacuum-packaging",
    "title": "Vacuum Packaging",
    "category": "manufacturing-workshop",
    "description": "Free online vacuum packaging calculator. Get accurate calculations instantly.",
    "seoTitle": "Vacuum Packaging | SectorCalc",
    "seoDescription": "Free online vacuum packaging calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "posethacim",
        "label": "posethacim",
        "unit": "m3",
        "type": "number",
        "helper": "Enter posethacim"
      },
      {
        "key": "pompadebi",
        "label": "pompadebi",
        "unit": "m3/s",
        "type": "number",
        "helper": "Enter pompadebi"
      },
      {
        "key": "baslangicbasinc",
        "label": "baslangicbasinc",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter baslangicbasinc"
      },
      {
        "key": "hedefbasinc",
        "label": "hedefbasinc",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter hedefbasinc"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "oven-capacity",
    "title": "Oven Capacity",
    "category": "manufacturing-workshop",
    "description": "Free online oven capacity calculator. Get accurate calculations instantly.",
    "seoTitle": "Oven Capacity | SectorCalc",
    "seoDescription": "Free online oven capacity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "tavasayisi",
        "label": "tavasayisi",
        "unit": "units",
        "type": "number",
        "helper": "Enter tavasayisi"
      },
      {
        "key": "tavakapasite",
        "label": "tavakapasite",
        "unit": "kg",
        "type": "number",
        "helper": "Enter tavakapasite"
      },
      {
        "key": "pismesure",
        "label": "pismesure",
        "unit": "dk",
        "type": "number",
        "helper": "Enter pismesure"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "injection-clamping-tonnage",
    "title": "Injection Clamping Tonnage",
    "category": "manufacturing-workshop",
    "description": "Free online injection clamping tonnage calculator. Get accurate calculations instantly.",
    "seoTitle": "Injection Clamping Tonnage | SectorCalc",
    "seoDescription": "Free online injection clamping tonnage calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "projeksiyonalani",
        "label": "projeksiyonalani",
        "unit": "cm2",
        "type": "number",
        "helper": "Enter projeksiyonalani"
      },
      {
        "key": "kalipicbasinc",
        "label": "kalipicbasinc",
        "unit": "bar",
        "type": "number",
        "helper": "Enter kalipicbasinc"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "plastic-cooling-time",
    "title": "Plastic Cooling Time",
    "category": "manufacturing-workshop",
    "description": "Free online plastic cooling time calculator. Get accurate calculations instantly.",
    "seoTitle": "Plastic Cooling Time | SectorCalc",
    "seoDescription": "Free online plastic cooling time calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "etkalinlik",
        "label": "etkalinlik",
        "unit": "mm",
        "type": "number",
        "helper": "Enter etkalinlik"
      },
      {
        "key": "termaldifuzyon",
        "label": "termaldifuzyon",
        "unit": "mm2/s",
        "type": "number",
        "helper": "Enter termaldifuzyon"
      },
      {
        "key": "erimesicaklik",
        "label": "erimesicaklik",
        "unit": "C",
        "type": "number",
        "helper": "Enter erimesicaklik"
      },
      {
        "key": "kalipsicaklik",
        "label": "kalipsicaklik",
        "unit": "C",
        "type": "number",
        "helper": "Enter kalipsicaklik"
      },
      {
        "key": "firinsicaklik",
        "label": "firinsicaklik",
        "unit": "C",
        "type": "number",
        "helper": "Enter firinsicaklik"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "plastic-drying-time",
    "title": "Plastic Drying Time",
    "category": "manufacturing-workshop",
    "description": "Free online plastic drying time calculator. Get accurate calculations instantly.",
    "seoTitle": "Plastic Drying Time | SectorCalc",
    "seoDescription": "Free online plastic drying time calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "malzemekutle",
        "label": "malzemekutle",
        "unit": "kg",
        "type": "number",
        "helper": "Enter malzemekutle"
      },
      {
        "key": "nemorani",
        "label": "nemorani",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter nemorani"
      },
      {
        "key": "havadebi",
        "label": "havadebi",
        "unit": "kg/s",
        "type": "number",
        "helper": "Enter havadebi"
      },
      {
        "key": "nemalmakapasite",
        "label": "nemalmakapasite",
        "unit": "kg/kg",
        "type": "number",
        "helper": "Enter nemalmakapasite"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "extruder-output",
    "title": "Extruder Output",
    "category": "manufacturing-workshop",
    "description": "Free online extruder output calculator. Get accurate calculations instantly.",
    "seoTitle": "Extruder Output | SectorCalc",
    "seoDescription": "Free online extruder output calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "vidahacim",
        "label": "vidahacim",
        "unit": "cm3/devir",
        "type": "number",
        "helper": "Enter vidahacim"
      },
      {
        "key": "devir",
        "label": "devir",
        "unit": "devir/dk",
        "type": "number",
        "helper": "Enter devir"
      },
      {
        "key": "eriyikyogunluk",
        "label": "eriyikyogunluk",
        "unit": "g/cm3",
        "type": "number",
        "helper": "Enter eriyikyogunluk"
      },
      {
        "key": "verim",
        "label": "verim",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter verim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mold-draft-angle",
    "title": "Mold Draft Angle",
    "category": "manufacturing-workshop",
    "description": "Free online mold draft angle calculator. Get accurate calculations instantly.",
    "seoTitle": "Mold Draft Angle | SectorCalc",
    "seoDescription": "Free online mold draft angle calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "parcaderinlik",
        "label": "parcaderinlik",
        "unit": "mm",
        "type": "number",
        "helper": "Enter parcaderinlik"
      },
      {
        "key": "buzulmeorani",
        "label": "buzulmeorani",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter buzulmeorani"
      },
      {
        "key": "yanyuzeyuzunluk",
        "label": "yanyuzeyuzunluk",
        "unit": "mm",
        "type": "number",
        "helper": "Enter yanyuzeyuzunluk"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "fire-pump-power",
    "title": "Fire Pump Power",
    "category": "manufacturing-workshop",
    "description": "Free online fire pump power calculator. Get accurate calculations instantly.",
    "seoTitle": "Fire Pump Power | SectorCalc",
    "seoDescription": "Free online fire pump power calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "debi",
        "label": "debi",
        "unit": "L/dk",
        "type": "number",
        "helper": "Enter debi"
      },
      {
        "key": "pressure",
        "label": "Internal Operating Pressure (Pa)",
        "unit": "bar",
        "type": "number",
        "helper": "Enter internal operating pressure (pa)"
      },
      {
        "key": "pompaverim",
        "label": "pompaverim",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter pompaverim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "building-fire-load",
    "title": "Building Fire Load",
    "category": "manufacturing-workshop",
    "description": "Free online building fire load calculator. Get accurate calculations instantly.",
    "seoTitle": "Building Fire Load | SectorCalc",
    "seoDescription": "Free online building fire load calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "yanicikutle",
        "label": "yanicikutle",
        "unit": "kg",
        "type": "number",
        "helper": "Enter yanicikutle"
      },
      {
        "key": "isildeger",
        "label": "isildeger",
        "unit": "MJ/kg",
        "type": "number",
        "helper": "Enter isildeger"
      },
      {
        "key": "katalani",
        "label": "katalani",
        "unit": "m2",
        "type": "number",
        "helper": "Enter katalani"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "sprinkler-flow-rate",
    "title": "Sprinkler Flow Rate",
    "category": "manufacturing-workshop",
    "description": "Free online sprinkler flow rate calculator. Get accurate calculations instantly.",
    "seoTitle": "Sprinkler Flow Rate | SectorCalc",
    "seoDescription": "Free online sprinkler flow rate calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "k_faktoru",
        "label": "k_faktoru",
        "unit": "L/dk/bar^0.5",
        "type": "number",
        "helper": "Enter k_faktoru"
      },
      {
        "key": "pressure",
        "label": "Internal Operating Pressure (Pa)",
        "unit": "bar",
        "type": "number",
        "helper": "Enter internal operating pressure (pa)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "adc-resolution",
    "title": "Adc Resolution",
    "category": "manufacturing-workshop",
    "description": "Free online adc resolution calculator. Get accurate calculations instantly.",
    "seoTitle": "Adc Resolution | SectorCalc",
    "seoDescription": "Free online adc resolution calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "bitsayisi",
        "label": "bitsayisi",
        "unit": "N",
        "type": "number",
        "helper": "Enter bitsayisi"
      },
      {
        "key": "refvoltaj",
        "label": "refvoltaj",
        "unit": "V",
        "type": "number",
        "helper": "Enter refvoltaj"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "amperes-law",
    "title": "Amperes Law",
    "category": "manufacturing-workshop",
    "description": "Free online amperes law calculator. Get accurate calculations instantly.",
    "seoTitle": "Amperes Law | SectorCalc",
    "seoDescription": "Free online amperes law calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "akim",
        "label": "akim",
        "unit": "A",
        "type": "number",
        "helper": "Enter akim"
      },
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "m",
        "type": "number",
        "helper": "Enter distance traveled"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "biot-savart-law",
    "title": "Biot Savart Law",
    "category": "manufacturing-workshop",
    "description": "Free online biot savart law calculator. Get accurate calculations instantly.",
    "seoTitle": "Biot Savart Law | SectorCalc",
    "seoDescription": "Free online biot savart law calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "akim",
        "label": "akim",
        "unit": "A",
        "type": "number",
        "helper": "Enter akim"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      },
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "m",
        "type": "number",
        "helper": "Enter distance traveled"
      },
      {
        "key": "aci",
        "label": "aci",
        "unit": "Derece",
        "type": "number",
        "helper": "Enter aci"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "capacitive-reactance",
    "title": "Capacitive Reactance",
    "category": "manufacturing-workshop",
    "description": "Free online capacitive reactance calculator. Get accurate calculations instantly.",
    "seoTitle": "Capacitive Reactance | SectorCalc",
    "seoDescription": "Free online capacitive reactance calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "frequency",
        "label": "Frequency (Hz)",
        "unit": "Hz",
        "type": "number",
        "helper": "Enter frequency (hz)"
      },
      {
        "key": "kapasite",
        "label": "kapasite",
        "unit": "F",
        "type": "number",
        "helper": "Enter kapasite"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "inductive-reactance",
    "title": "Inductive Reactance",
    "category": "manufacturing-workshop",
    "description": "Free online inductive reactance calculator. Get accurate calculations instantly.",
    "seoTitle": "Inductive Reactance | SectorCalc",
    "seoDescription": "Free online inductive reactance calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "frequency",
        "label": "Frequency (Hz)",
        "unit": "Hz",
        "type": "number",
        "helper": "Enter frequency (hz)"
      },
      {
        "key": "induktans",
        "label": "induktans",
        "unit": "H",
        "type": "number",
        "helper": "Enter induktans"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "rc-time-constant",
    "title": "Rc Time Constant",
    "category": "manufacturing-workshop",
    "description": "Free online rc time constant calculator. Get accurate calculations instantly.",
    "seoTitle": "Rc Time Constant | SectorCalc",
    "seoDescription": "Free online rc time constant calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "ohm",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "c",
        "label": "c",
        "unit": "F",
        "type": "number",
        "helper": "Enter c"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "rlc-resonant-frequency",
    "title": "Rlc Resonant Frequency",
    "category": "manufacturing-workshop",
    "description": "Free online rlc resonant frequency calculator. Get accurate calculations instantly.",
    "seoTitle": "Rlc Resonant Frequency | SectorCalc",
    "seoDescription": "Free online rlc resonant frequency calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "l",
        "label": "l",
        "unit": "H",
        "type": "number",
        "helper": "Enter l"
      },
      {
        "key": "c",
        "label": "c",
        "unit": "F",
        "type": "number",
        "helper": "Enter c"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "ohm",
        "type": "number",
        "helper": "Enter interest rate"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "smith-chart-vswr",
    "title": "Smith Chart Vswr",
    "category": "manufacturing-workshop",
    "description": "Free online smith chart vswr calculator. Get accurate calculations instantly.",
    "seoTitle": "Smith Chart Vswr | SectorCalc",
    "seoDescription": "Free online smith chart vswr calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "yukempedans",
        "label": "yukempedans",
        "unit": "ohm",
        "type": "number",
        "helper": "Enter yukempedans"
      },
      {
        "key": "hatempedans",
        "label": "hatempedans",
        "unit": "ohm",
        "type": "number",
        "helper": "Enter hatempedans"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "signal-to-noise-ratio",
    "title": "Signal To Noise Ratio",
    "category": "manufacturing-workshop",
    "description": "Free online signal to noise ratio calculator. Get accurate calculations instantly.",
    "seoTitle": "Signal To Noise Ratio | SectorCalc",
    "seoDescription": "Free online signal to noise ratio calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sinyalguc",
        "label": "sinyalguc",
        "unit": "W",
        "type": "number",
        "helper": "Enter sinyalguc"
      },
      {
        "key": "gurultuguc",
        "label": "gurultuguc",
        "unit": "W",
        "type": "number",
        "helper": "Enter gurultuguc"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "zero-to-hundred-acceleration",
    "title": "Zero To Hundred Acceleration",
    "category": "manufacturing-workshop",
    "description": "Free online zero to hundred acceleration calculator. Get accurate calculations instantly.",
    "seoTitle": "Zero To Hundred Acceleration | SectorCalc",
    "seoDescription": "Free online zero to hundred acceleration calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "mass",
        "label": "Total Vibrating Mass (kg)",
        "unit": "kg",
        "type": "number",
        "helper": "Enter total vibrating mass (kg)"
      },
      {
        "key": "torque",
        "label": "Applied Torsional Torque (N.m)",
        "unit": "N.m",
        "type": "number",
        "helper": "Enter applied torsional torque (n.m)"
      },
      {
        "key": "cekiskatsayisi",
        "label": "cekiskatsayisi",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter cekiskatsayisi"
      },
      {
        "key": "havadirenci",
        "label": "havadirenci",
        "unit": "N",
        "type": "number",
        "helper": "Enter havadirenci"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "chain-drive",
    "title": "Chain Drive",
    "category": "manufacturing-workshop",
    "description": "Free online chain drive calculator. Get accurate calculations instantly.",
    "seoTitle": "Chain Drive | SectorCalc",
    "seoDescription": "Free online chain drive calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "z1",
        "label": "z1",
        "unit": "Dis",
        "type": "number",
        "helper": "Enter z1"
      },
      {
        "key": "z2",
        "label": "z2",
        "unit": "Dis",
        "type": "number",
        "helper": "Enter z2"
      },
      {
        "key": "adim",
        "label": "adim",
        "unit": "mm",
        "type": "number",
        "helper": "Enter adim"
      },
      {
        "key": "merkezc",
        "label": "merkezc",
        "unit": "mm",
        "type": "number",
        "helper": "Enter merkezc"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "ev-charging-time",
    "title": "Ev Charging Time",
    "category": "manufacturing-workshop",
    "description": "Free online ev charging time calculator. Get accurate calculations instantly.",
    "seoTitle": "Ev Charging Time | SectorCalc",
    "seoDescription": "Free online ev charging time calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "bataryakapasite",
        "label": "bataryakapasite",
        "unit": "kWh",
        "type": "number",
        "helper": "Enter bataryakapasite"
      },
      {
        "key": "sarjguc",
        "label": "sarjguc",
        "unit": "kW",
        "type": "number",
        "helper": "Enter sarjguc"
      },
      {
        "key": "verim",
        "label": "verim",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter verim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "ev-range",
    "title": "Ev Range",
    "category": "manufacturing-workshop",
    "description": "Free online ev range calculator. Get accurate calculations instantly.",
    "seoTitle": "Ev Range | SectorCalc",
    "seoDescription": "Free online ev range calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "bataryaenerji",
        "label": "bataryaenerji",
        "unit": "kWh",
        "type": "number",
        "helper": "Enter bataryaenerji"
      },
      {
        "key": "tuketim",
        "label": "tuketim",
        "unit": "Wh/km",
        "type": "number",
        "helper": "Enter tuketim"
      },
      {
        "key": "verim",
        "label": "verim",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter verim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "horsepower-converter",
    "title": "Horsepower Converter",
    "category": "manufacturing-workshop",
    "description": "Free online horsepower converter calculator. Get accurate calculations instantly.",
    "seoTitle": "Horsepower Converter | SectorCalc",
    "seoDescription": "Free online horsepower converter calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "value",
        "label": "After Repair Value (ARV)",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter after repair value (arv)"
      },
      {
        "key": "kaynak",
        "label": "kaynak",
        "unit": "HP/kW/PS",
        "type": "number",
        "helper": "Enter kaynak"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "indicated-horsepower",
    "title": "Indicated Horsepower",
    "category": "manufacturing-workshop",
    "description": "Free online indicated horsepower calculator. Get accurate calculations instantly.",
    "seoTitle": "Indicated Horsepower | SectorCalc",
    "seoDescription": "Free online indicated horsepower calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "pressure",
        "label": "Internal Operating Pressure (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter internal operating pressure (pa)"
      },
      {
        "key": "strok",
        "label": "strok",
        "unit": "m",
        "type": "number",
        "helper": "Enter strok"
      },
      {
        "key": "alan",
        "label": "alan",
        "unit": "m2",
        "type": "number",
        "helper": "Enter alan"
      },
      {
        "key": "devir",
        "label": "devir",
        "unit": "devir/dk",
        "type": "number",
        "helper": "Enter devir"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "engine-speed-torque",
    "title": "Engine Speed Torque",
    "category": "manufacturing-workshop",
    "description": "Free online engine speed torque calculator. Get accurate calculations instantly.",
    "seoTitle": "Engine Speed Torque | SectorCalc",
    "seoDescription": "Free online engine speed torque calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "power",
        "label": "Transmitted Power (Watts)",
        "unit": "kW",
        "type": "number",
        "helper": "Enter transmitted power (watts)"
      },
      {
        "key": "devir",
        "label": "devir",
        "unit": "devir/dk",
        "type": "number",
        "helper": "Enter devir"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "motor-efficiency",
    "title": "Motor Efficiency",
    "category": "manufacturing-workshop",
    "description": "Free online motor efficiency calculator. Get accurate calculations instantly.",
    "seoTitle": "Motor Efficiency | SectorCalc",
    "seoDescription": "Free online motor efficiency calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "cikisguc",
        "label": "cikisguc",
        "unit": "W",
        "type": "number",
        "helper": "Enter cikisguc"
      },
      {
        "key": "girisguc",
        "label": "girisguc",
        "unit": "W",
        "type": "number",
        "helper": "Enter girisguc"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "vehicle-top-speed",
    "title": "Vehicle Top Speed",
    "category": "manufacturing-workshop",
    "description": "Free online vehicle top speed calculator. Get accurate calculations instantly.",
    "seoTitle": "Vehicle Top Speed | SectorCalc",
    "seoDescription": "Free online vehicle top speed calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "power",
        "label": "Transmitted Power (Watts)",
        "unit": "W",
        "type": "number",
        "helper": "Enter transmitted power (watts)"
      },
      {
        "key": "mass",
        "label": "Total Vibrating Mass (kg)",
        "unit": "kg",
        "type": "number",
        "helper": "Enter total vibrating mass (kg)"
      },
      {
        "key": "suratmakatsayi",
        "label": "suratmakatsayi",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter suratmakatsayi"
      },
      {
        "key": "havadirenckatsayi",
        "label": "havadirenckatsayi",
        "unit": "kg/m",
        "type": "number",
        "helper": "Enter havadirenckatsayi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "runway-length-required",
    "title": "Runway Length Required",
    "category": "manufacturing-workshop",
    "description": "Free online runway length required calculator. Get accurate calculations instantly.",
    "seoTitle": "Runway Length Required | SectorCalc",
    "seoDescription": "Free online runway length required calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kalkishiz",
        "label": "kalkishiz",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter kalkishiz"
      },
      {
        "key": "ivme",
        "label": "ivme",
        "unit": "m/s2",
        "type": "number",
        "helper": "Enter ivme"
      },
      {
        "key": "ruzgarhiz",
        "label": "ruzgarhiz",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter ruzgarhiz"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "de-broglie-wavelength",
    "title": "De Broglie Wavelength",
    "category": "manufacturing-workshop",
    "description": "Free online de broglie wavelength calculator. Get accurate calculations instantly.",
    "seoTitle": "De Broglie Wavelength | SectorCalc",
    "seoDescription": "Free online de broglie wavelength calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "mass",
        "label": "Total Vibrating Mass (kg)",
        "unit": "kg",
        "type": "number",
        "helper": "Enter total vibrating mass (kg)"
      },
      {
        "key": "hiz",
        "label": "hiz",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter hiz"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "decibel-converter",
    "title": "Decibel Converter",
    "category": "manufacturing-workshop",
    "description": "Free online decibel converter calculator. Get accurate calculations instantly.",
    "seoTitle": "Decibel Converter | SectorCalc",
    "seoDescription": "Free online decibel converter calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "rate",
        "label": "rate",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter rate"
      },
      {
        "key": "tip",
        "label": "tip",
        "unit": "Guc/Voltaj",
        "type": "number",
        "helper": "Enter tip"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "diopter-lens-power",
    "title": "Diopter Lens Power",
    "category": "manufacturing-workshop",
    "description": "Free online diopter lens power calculator. Get accurate calculations instantly.",
    "seoTitle": "Diopter Lens Power | SectorCalc",
    "seoDescription": "Free online diopter lens power calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "odakuzaklik",
        "label": "odakuzaklik",
        "unit": "m",
        "type": "number",
        "helper": "Enter odakuzaklik"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "faraday-electrolysis",
    "title": "Faraday Electrolysis",
    "category": "manufacturing-workshop",
    "description": "Free online faraday electrolysis calculator. Get accurate calculations instantly.",
    "seoTitle": "Faraday Electrolysis | SectorCalc",
    "seoDescription": "Free online faraday electrolysis calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "akim",
        "label": "akim",
        "unit": "A",
        "type": "number",
        "helper": "Enter akim"
      },
      {
        "key": "duration",
        "label": "Duration",
        "unit": "s",
        "type": "number",
        "helper": "Enter duration"
      },
      {
        "key": "esdegeragirlik",
        "label": "esdegeragirlik",
        "unit": "g/mol",
        "type": "number",
        "helper": "Enter esdegeragirlik"
      },
      {
        "key": "elektronsayisi",
        "label": "elektronsayisi",
        "unit": "n",
        "type": "number",
        "helper": "Enter elektronsayisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "magnetic-field-solenoid",
    "title": "Magnetic Field Solenoid",
    "category": "manufacturing-workshop",
    "description": "Free online magnetic field solenoid calculator. Get accurate calculations instantly.",
    "seoTitle": "Magnetic Field Solenoid | SectorCalc",
    "seoDescription": "Free online magnetic field solenoid calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "akim",
        "label": "akim",
        "unit": "A",
        "type": "number",
        "helper": "Enter akim"
      },
      {
        "key": "sarimsayisi",
        "label": "sarimsayisi",
        "unit": "units",
        "type": "number",
        "helper": "Enter sarimsayisi"
      },
      {
        "key": "length",
        "label": "Component Length (m)",
        "unit": "m",
        "type": "number",
        "helper": "Enter component length (m)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "propagation-constant",
    "title": "Propagation Constant",
    "category": "manufacturing-workshop",
    "description": "Free online propagation constant calculator. Get accurate calculations instantly.",
    "seoTitle": "Propagation Constant | SectorCalc",
    "seoDescription": "Free online propagation constant calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "direnc",
        "label": "direnc",
        "unit": "ohm/m",
        "type": "number",
        "helper": "Enter direnc"
      },
      {
        "key": "induktans",
        "label": "induktans",
        "unit": "H/m",
        "type": "number",
        "helper": "Enter induktans"
      },
      {
        "key": "kapasite",
        "label": "kapasite",
        "unit": "F/m",
        "type": "number",
        "helper": "Enter kapasite"
      },
      {
        "key": "iletkenlik",
        "label": "iletkenlik",
        "unit": "S/m",
        "type": "number",
        "helper": "Enter iletkenlik"
      },
      {
        "key": "frequency",
        "label": "Frequency (Hz)",
        "unit": "Hz",
        "type": "number",
        "helper": "Enter frequency (hz)"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "quality-factor-q",
    "title": "Quality Factor Q",
    "category": "manufacturing-workshop",
    "description": "Free online quality factor q calculator. Get accurate calculations instantly.",
    "seoTitle": "Quality Factor Q | SectorCalc",
    "seoDescription": "Free online quality factor q calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "rezonansfrekans",
        "label": "rezonansfrekans",
        "unit": "Hz",
        "type": "number",
        "helper": "Enter rezonansfrekans"
      },
      {
        "key": "bantgenislik",
        "label": "bantgenislik",
        "unit": "Hz",
        "type": "number",
        "helper": "Enter bantgenislik"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "quantization-noise-sqnr",
    "title": "Quantization Noise Sqnr",
    "category": "manufacturing-workshop",
    "description": "Free online quantization noise sqnr calculator. Get accurate calculations instantly.",
    "seoTitle": "Quantization Noise Sqnr | SectorCalc",
    "seoDescription": "Free online quantization noise sqnr calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "bitsayisi",
        "label": "bitsayisi",
        "unit": "N",
        "type": "number",
        "helper": "Enter bitsayisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "tesla-unit-converter",
    "title": "Tesla Unit Converter",
    "category": "manufacturing-workshop",
    "description": "Free online tesla unit converter calculator. Get accurate calculations instantly.",
    "seoTitle": "Tesla Unit Converter | SectorCalc",
    "seoDescription": "Free online tesla unit converter calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "value",
        "label": "After Repair Value (ARV)",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter after repair value (arv)"
      },
      {
        "key": "kaynak",
        "label": "kaynak",
        "unit": "T/G/Wb",
        "type": "number",
        "helper": "Enter kaynak"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "battery-backup-capacity",
    "title": "Battery Backup Capacity",
    "category": "manufacturing-workshop",
    "description": "Free online battery backup capacity calculator. Get accurate calculations instantly.",
    "seoTitle": "Battery Backup Capacity | SectorCalc",
    "seoDescription": "Free online battery backup capacity calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "akukapasite",
        "label": "akukapasite",
        "unit": "Ah",
        "type": "number",
        "helper": "Enter akukapasite"
      },
      {
        "key": "yukgucu",
        "label": "yukgucu",
        "unit": "W",
        "type": "number",
        "helper": "Enter yukgucu"
      },
      {
        "key": "dcvoltaj",
        "label": "dcvoltaj",
        "unit": "V",
        "type": "number",
        "helper": "Enter dcvoltaj"
      },
      {
        "key": "desarjderinligi",
        "label": "desarjderinligi",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter desarjderinligi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "hydroelectric-power",
    "title": "Hydroelectric Power",
    "category": "manufacturing-workshop",
    "description": "Free online hydroelectric power calculator. Get accurate calculations instantly.",
    "seoTitle": "Hydroelectric Power | SectorCalc",
    "seoDescription": "Free online hydroelectric power calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "debi",
        "label": "debi",
        "unit": "m3/s",
        "type": "number",
        "helper": "Enter debi"
      },
      {
        "key": "dusuyuksekligi",
        "label": "dusuyuksekligi",
        "unit": "m",
        "type": "number",
        "helper": "Enter dusuyuksekligi"
      },
      {
        "key": "turbinverim",
        "label": "turbinverim",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter turbinverim"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "wind-turbine-energy",
    "title": "Wind Turbine Energy",
    "category": "manufacturing-workshop",
    "description": "Free online wind turbine energy calculator. Get accurate calculations instantly.",
    "seoTitle": "Wind Turbine Energy | SectorCalc",
    "seoDescription": "Free online wind turbine energy calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kanatcapi",
        "label": "kanatcapi",
        "unit": "m",
        "type": "number",
        "helper": "Enter kanatcapi"
      },
      {
        "key": "ruzgarhizi",
        "label": "ruzgarhizi",
        "unit": "m/s",
        "type": "number",
        "helper": "Enter ruzgarhizi"
      },
      {
        "key": "havayogunlugu",
        "label": "havayogunlugu",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter havayogunlugu"
      },
      {
        "key": "cp",
        "label": "cp",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter cp"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "carnot-efficiency",
    "title": "Carnot Efficiency",
    "category": "manufacturing-workshop",
    "description": "Free online carnot efficiency calculator. Get accurate calculations instantly.",
    "seoTitle": "Carnot Efficiency | SectorCalc",
    "seoDescription": "Free online carnot efficiency calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sicakkaynak",
        "label": "sicakkaynak",
        "unit": "K",
        "type": "number",
        "helper": "Enter sicakkaynak"
      },
      {
        "key": "sogukkaynak",
        "label": "sogukkaynak",
        "unit": "K",
        "type": "number",
        "helper": "Enter sogukkaynak"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "ideal-gas-law",
    "title": "Ideal Gas Law",
    "category": "manufacturing-workshop",
    "description": "Free online ideal gas law calculator. Get accurate calculations instantly.",
    "seoTitle": "Ideal Gas Law | SectorCalc",
    "seoDescription": "Free online ideal gas law calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "pressure",
        "label": "Internal Operating Pressure (Pa)",
        "unit": "Pa",
        "type": "number",
        "helper": "Enter internal operating pressure (pa)"
      },
      {
        "key": "volume",
        "label": "volume",
        "unit": "m3",
        "type": "number",
        "helper": "Enter volume"
      },
      {
        "key": "mol",
        "label": "mol",
        "unit": "n",
        "type": "number",
        "helper": "Enter mol"
      },
      {
        "key": "sicaklik",
        "label": "sicaklik",
        "unit": "K",
        "type": "number",
        "helper": "Enter sicaklik"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "carbon-offset",
    "title": "Carbon Offset",
    "category": "manufacturing-workshop",
    "description": "Free online carbon offset calculator. Get accurate calculations instantly.",
    "seoTitle": "Carbon Offset | SectorCalc",
    "seoDescription": "Free online carbon offset calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "emisyon",
        "label": "emisyon",
        "unit": "tonCO2",
        "type": "number",
        "helper": "Enter emisyon"
      },
      {
        "key": "agacyillikyutak",
        "label": "agacyillikyutak",
        "unit": "kgCO2",
        "type": "number",
        "helper": "Enter agacyillikyutak"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "data-backup-time",
    "title": "Data Backup Time",
    "category": "manufacturing-workshop",
    "description": "Free online data backup time calculator. Get accurate calculations instantly.",
    "seoTitle": "Data Backup Time | SectorCalc",
    "seoDescription": "Free online data backup time calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "veriboyutu",
        "label": "veriboyutu",
        "unit": "TB",
        "type": "number",
        "helper": "Enter veriboyutu"
      },
      {
        "key": "sikistirmaorani",
        "label": "sikistirmaorani",
        "unit": "Oran",
        "type": "number",
        "helper": "Enter sikistirmaorani"
      },
      {
        "key": "aghizi",
        "label": "aghizi",
        "unit": "Gbps",
        "type": "number",
        "helper": "Enter aghizi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "rsa-encryption-security",
    "title": "Rsa Encryption Security",
    "category": "manufacturing-workshop",
    "description": "Free online rsa encryption security calculator. Get accurate calculations instantly.",
    "seoTitle": "Rsa Encryption Security | SectorCalc",
    "seoDescription": "Free online rsa encryption security calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "rsa_anahtaruzunlugu",
        "label": "rsa_anahtaruzunlugu",
        "unit": "Bit",
        "type": "number",
        "helper": "Enter rsa_anahtaruzunlugu"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "api-latency-sla",
    "title": "Api Latency Sla",
    "category": "manufacturing-workshop",
    "description": "Free online api latency sla calculator. Get accurate calculations instantly.",
    "seoTitle": "Api Latency Sla | SectorCalc",
    "seoDescription": "Free online api latency sla calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "toplamistek",
        "label": "toplamistek",
        "unit": "units",
        "type": "number",
        "helper": "Enter toplamistek"
      },
      {
        "key": "hataliistek",
        "label": "Faulty Requests",
        "unit": "units",
        "type": "number",
        "helper": "Enter number of faulty requests"
      },
      {
        "key": "toplamgecikme",
        "label": "toplamgecikme",
        "unit": "ms",
        "type": "number",
        "helper": "Enter toplamgecikme"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "drug-half-life",
    "title": "Drug Half Life",
    "category": "manufacturing-workshop",
    "description": "Free online drug half life calculator. Get accurate calculations instantly.",
    "seoTitle": "Drug Half Life | SectorCalc",
    "seoDescription": "Free online drug half life calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "yarilanmaomru",
        "label": "yarilanmaomru",
        "unit": "Saat",
        "type": "number",
        "helper": "Enter yarilanmaomru"
      },
      {
        "key": "dozaraligi",
        "label": "dozaraligi",
        "unit": "Saat",
        "type": "number",
        "helper": "Enter dozaraligi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "effective-radiation-dose",
    "title": "Effective Radiation Dose",
    "category": "manufacturing-workshop",
    "description": "Free online effective radiation dose calculator. Get accurate calculations instantly.",
    "seoTitle": "Effective Radiation Dose | SectorCalc",
    "seoDescription": "Free online effective radiation dose calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sogurulandoz",
        "label": "sogurulandoz",
        "unit": "mGy",
        "type": "number",
        "helper": "Enter sogurulandoz"
      },
      {
        "key": "dokuagirlikfaktoru",
        "label": "dokuagirlikfaktoru",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter dokuagirlikfaktoru"
      },
      {
        "key": "radyasyonturufaktoru",
        "label": "radyasyonturufaktoru",
        "unit": "Sayi",
        "type": "number",
        "helper": "Enter radyasyonturufaktoru"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "biosignal-sampling",
    "title": "Biosignal Sampling",
    "category": "manufacturing-workshop",
    "description": "Free online biosignal sampling calculator. Get accurate calculations instantly.",
    "seoTitle": "Biosignal Sampling | SectorCalc",
    "seoDescription": "Free online biosignal sampling calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "makssinyalfrekansi",
        "label": "makssinyalfrekansi",
        "unit": "Hz",
        "type": "number",
        "helper": "Enter makssinyalfrekansi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "mine-reserve-volume",
    "title": "Mine Reserve Volume",
    "category": "manufacturing-workshop",
    "description": "Free online mine reserve volume calculator. Get accurate calculations instantly.",
    "seoTitle": "Mine Reserve Volume | SectorCalc",
    "seoDescription": "Free online mine reserve volume calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "blokhacim",
        "label": "blokhacim",
        "unit": "m3",
        "type": "number",
        "helper": "Enter blokhacim"
      },
      {
        "key": "cevheryogunlugu",
        "label": "cevheryogunlugu",
        "unit": "ton/m3",
        "type": "number",
        "helper": "Enter cevheryogunlugu"
      },
      {
        "key": "tenor",
        "label": "tenor",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter tenor"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "drilling-well-pressure",
    "title": "Drilling Well Pressure",
    "category": "manufacturing-workshop",
    "description": "Free online drilling well pressure calculator. Get accurate calculations instantly.",
    "seoTitle": "Drilling Well Pressure | SectorCalc",
    "seoDescription": "Free online drilling well pressure calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "dikeyderinlik",
        "label": "dikeyderinlik",
        "unit": "m",
        "type": "number",
        "helper": "Enter dikeyderinlik"
      },
      {
        "key": "camuryogunlugu",
        "label": "camuryogunlugu",
        "unit": "kg/m3",
        "type": "number",
        "helper": "Enter camuryogunlugu"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "earthquake-magnitude-pga",
    "title": "Earthquake Magnitude Pga",
    "category": "manufacturing-workshop",
    "description": "Free online earthquake magnitude pga calculator. Get accurate calculations instantly.",
    "seoTitle": "Earthquake Magnitude Pga | SectorCalc",
    "seoDescription": "Free online earthquake magnitude pga calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "momentmagnitudu",
        "label": "momentmagnitudu",
        "unit": "Mw",
        "type": "number",
        "helper": "Enter momentmagnitudu"
      },
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "km",
        "type": "number",
        "helper": "Enter distance traveled"
      },
      {
        "key": "zeminkatsayisi",
        "label": "zeminkatsayisi",
        "unit": "Number",
        "type": "number",
        "helper": "Enter zeminkatsayisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "joint-angular-velocity-torque",
    "title": "Joint Angular Velocity Torque",
    "category": "manufacturing-workshop",
    "description": "Free online joint angular velocity torque calculator. Get accurate calculations instantly.",
    "seoTitle": "Joint Angular Velocity Torque | SectorCalc",
    "seoDescription": "Free online joint angular velocity torque calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "eylemsizlikmomenti",
        "label": "eylemsizlikmomenti",
        "unit": "kg.m2",
        "type": "number",
        "helper": "Enter eylemsizlikmomenti"
      },
      {
        "key": "acisalivme",
        "label": "acisalivme",
        "unit": "rad/s2",
        "type": "number",
        "helper": "Enter acisalivme"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "training-load-trimp",
    "title": "Training Load Trimp",
    "category": "manufacturing-workshop",
    "description": "Free online training load trimp calculator. Get accurate calculations instantly.",
    "seoTitle": "Training Load Trimp | SectorCalc",
    "seoDescription": "Free online training load trimp calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "duration",
        "label": "Duration",
        "unit": "Dk",
        "type": "number",
        "helper": "Enter duration"
      },
      {
        "key": "ortalamanabiz",
        "label": "Average Heart Rate",
        "unit": "BPM",
        "type": "number",
        "helper": "Enter average heart rate in BPM"
      },
      {
        "key": "restingHeartRate",
        "label": "Resting Heart Rate (BPM)",
        "unit": "BPM",
        "type": "number",
        "helper": "Enter resting heart rate (bpm)"
      },
      {
        "key": "maksnabiz",
        "label": "maksnabiz",
        "unit": "BPM",
        "type": "number",
        "helper": "Enter maksnabiz"
      },
      {
        "key": "gender",
        "label": "Gender",
        "unit": "Metin",
        "type": "select",
        "helper": "Enter gender",
        "options": [
          {
            "label": "Male",
            "value": "male"
          },
          {
            "label": "Female",
            "value": "female"
          }
        ],
        "defaultValue": "male"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "injury-risk-asymmetry",
    "title": "Injury Risk Asymmetry",
    "category": "manufacturing-workshop",
    "description": "Free online injury risk asymmetry calculator. Get accurate calculations instantly.",
    "seoTitle": "Injury Risk Asymmetry | SectorCalc",
    "seoDescription": "Free online injury risk asymmetry calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sagkuvvet",
        "label": "sagkuvvet",
        "unit": "N",
        "type": "number",
        "helper": "Enter sagkuvvet"
      },
      {
        "key": "solkuvvet",
        "label": "solkuvvet",
        "unit": "N",
        "type": "number",
        "helper": "Enter solkuvvet"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "building-solar-exposure",
    "title": "Building Solar Exposure",
    "category": "manufacturing-workshop",
    "description": "Free online building solar exposure calculator. Get accurate calculations instantly.",
    "seoTitle": "Building Solar Exposure | SectorCalc",
    "seoDescription": "Free online building solar exposure calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "enlem",
        "label": "enlem",
        "unit": "Derece",
        "type": "number",
        "helper": "Enter enlem"
      },
      {
        "key": "gunsayisi",
        "label": "gunsayisi",
        "unit": "1-365",
        "type": "number",
        "helper": "Enter gunsayisi"
      },
      {
        "key": "engelyukseklik",
        "label": "engelyukseklik",
        "unit": "m",
        "type": "number",
        "helper": "Enter engelyukseklik"
      },
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "m",
        "type": "number",
        "helper": "Enter distance traveled"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "traffic-signal-timing",
    "title": "Traffic Signal Timing",
    "category": "manufacturing-workshop",
    "description": "Free online traffic signal timing calculator. Get accurate calculations instantly.",
    "seoTitle": "Traffic Signal Timing | SectorCalc",
    "seoDescription": "Free online traffic signal timing calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "dongusuresi",
        "label": "dongusuresi",
        "unit": "s",
        "type": "number",
        "helper": "Enter dongusuresi"
      },
      {
        "key": "yesilsure",
        "label": "yesilsure",
        "unit": "s",
        "type": "number",
        "helper": "Enter yesilsure"
      },
      {
        "key": "akishizi",
        "label": "akishizi",
        "unit": "arac/s",
        "type": "number",
        "helper": "Enter akishizi"
      },
      {
        "key": "doygunakis",
        "label": "doygunakis",
        "unit": "arac/s",
        "type": "number",
        "helper": "Enter doygunakis"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "environmental-noise-propagation",
    "title": "Environmental Noise Propagation",
    "category": "manufacturing-workshop",
    "description": "Free online environmental noise propagation calculator. Get accurate calculations instantly.",
    "seoTitle": "Environmental Noise Propagation | SectorCalc",
    "seoDescription": "Free online environmental noise propagation calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "sesgucu",
        "label": "sesgucu",
        "unit": "dB",
        "type": "number",
        "helper": "Enter sesgucu"
      },
      {
        "key": "distance",
        "label": "Distance Traveled",
        "unit": "m",
        "type": "number",
        "helper": "Enter distance traveled"
      },
      {
        "key": "zeminzayiflama",
        "label": "zeminzayiflama",
        "unit": "dB",
        "type": "number",
        "helper": "Enter zeminzayiflama"
      },
      {
        "key": "engelzayiflama",
        "label": "engelzayiflama",
        "unit": "dB",
        "type": "number",
        "helper": "Enter engelzayiflama"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "inverse-kinematics-2d-arm",
    "title": "Inverse Kinematics 2d Arm",
    "category": "manufacturing-workshop",
    "description": "Free online inverse kinematics 2d arm calculator. Get accurate calculations instantly.",
    "seoTitle": "Inverse Kinematics 2d Arm | SectorCalc",
    "seoDescription": "Free online inverse kinematics 2d arm calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "hedefx",
        "label": "hedefx",
        "unit": "m",
        "type": "number",
        "helper": "Enter hedefx"
      },
      {
        "key": "hedefy",
        "label": "hedefy",
        "unit": "m",
        "type": "number",
        "helper": "Enter hedefy"
      },
      {
        "key": "kol1uzunluk",
        "label": "kol1uzunluk",
        "unit": "m",
        "type": "number",
        "helper": "Enter kol1uzunluk"
      },
      {
        "key": "kol2uzunluk",
        "label": "kol2uzunluk",
        "unit": "m",
        "type": "number",
        "helper": "Enter kol2uzunluk"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "pid-controller-ziegler",
    "title": "Pid Controller Ziegler",
    "category": "manufacturing-workshop",
    "description": "Free online pid controller ziegler calculator. Get accurate calculations instantly.",
    "seoTitle": "Pid Controller Ziegler | SectorCalc",
    "seoDescription": "Free online pid controller ziegler calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "kritikkazanc",
        "label": "Critical Gain",
        "unit": "Ku",
        "type": "number",
        "helper": "Enter critical gain value"
      },
      {
        "key": "kritikperiyot",
        "label": "Critical Period",
        "unit": "Tu",
        "type": "number",
        "helper": "Enter critical period value"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "kalman-filter-prediction",
    "title": "Kalman Filter Prediction",
    "category": "manufacturing-workshop",
    "description": "Free online kalman filter prediction calculator. Get accurate calculations instantly.",
    "seoTitle": "Kalman Filter Prediction | SectorCalc",
    "seoDescription": "Free online kalman filter prediction calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "oncekidurum",
        "label": "oncekidurum",
        "unit": "Matris",
        "type": "number",
        "helper": "Enter oncekidurum"
      },
      {
        "key": "durumgecis",
        "label": "durumgecis",
        "unit": "Matris",
        "type": "number",
        "helper": "Enter durumgecis"
      },
      {
        "key": "kontrolgirdisi",
        "label": "kontrolgirdisi",
        "unit": "Matris",
        "type": "number",
        "helper": "Enter kontrolgirdisi"
      },
      {
        "key": "covariance",
        "label": "Covariance",
        "unit": "Matris",
        "type": "number",
        "helper": "Enter covariance"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "h-index",
    "title": "H Index",
    "category": "manufacturing-workshop",
    "description": "Free online h index calculator. Get accurate calculations instantly.",
    "seoTitle": "H Index | SectorCalc",
    "seoDescription": "Free online h index calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "atifsayisi",
        "label": "atifsayisi",
        "unit": "Number",
        "type": "number",
        "helper": "Enter atifsayisi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "item-difficulty-discrimination",
    "title": "Item Difficulty Discrimination",
    "category": "manufacturing-workshop",
    "description": "Free online item difficulty discrimination calculator. Get accurate calculations instantly.",
    "seoTitle": "Item Difficulty Discrimination | SectorCalc",
    "seoDescription": "Free online item difficulty discrimination calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "dogrucevap",
        "label": "dogrucevap",
        "unit": "units",
        "type": "number",
        "helper": "Enter dogrucevap"
      },
      {
        "key": "toplamogrenci",
        "label": "toplamogrenci",
        "unit": "units",
        "type": "number",
        "helper": "Enter toplamogrenci"
      },
      {
        "key": "ustgrupdogru",
        "label": "ustgrupdogru",
        "unit": "units",
        "type": "number",
        "helper": "Enter ustgrupdogru"
      },
      {
        "key": "altgrupdogru",
        "label": "altgrupdogru",
        "unit": "units",
        "type": "number",
        "helper": "Enter altgrupdogru"
      },
      {
        "key": "grupboyutu",
        "label": "grupboyutu",
        "unit": "units",
        "type": "number",
        "helper": "Enter grupboyutu"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "sample-weighting",
    "title": "Sample Weighting",
    "category": "manufacturing-workshop",
    "description": "Free online sample weighting calculator. Get accurate calculations instantly.",
    "seoTitle": "Sample Weighting | SectorCalc",
    "seoDescription": "Free online sample weighting calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "tabakapopulasyon",
        "label": "tabakapopulasyon",
        "unit": "N_h",
        "type": "number",
        "helper": "Enter tabakapopulasyon"
      },
      {
        "key": "toplampopulasyon",
        "label": "toplampopulasyon",
        "unit": "N",
        "type": "number",
        "helper": "Enter toplampopulasyon"
      },
      {
        "key": "tabakaorneklem",
        "label": "tabakaorneklem",
        "unit": "n_h",
        "type": "number",
        "helper": "Enter tabakaorneklem"
      },
      {
        "key": "toplamorneklem",
        "label": "toplamorneklem",
        "unit": "n",
        "type": "number",
        "helper": "Enter toplamorneklem"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "life-insurance-premium",
    "title": "Life Insurance Premium",
    "category": "manufacturing-workshop",
    "description": "Free online life insurance premium calculator. Get accurate calculations instantly.",
    "seoTitle": "Life Insurance Premium | SectorCalc",
    "seoDescription": "Free online life insurance premium calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "beklenenhasar",
        "label": "beklenenhasar",
        "unit": "TL",
        "type": "number",
        "helper": "Enter beklenenhasar"
      },
      {
        "key": "gideryuklemesi",
        "label": "gideryuklemesi",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter gideryuklemesi"
      },
      {
        "key": "karmarji",
        "label": "karmarji",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter karmarji"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "compound-default-interest",
    "title": "Compound Default Interest",
    "category": "manufacturing-workshop",
    "description": "Free online compound default interest calculator. Get accurate calculations instantly.",
    "seoTitle": "Compound Default Interest | SectorCalc",
    "seoDescription": "Free online compound default interest calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "principal",
        "label": "Principal",
        "unit": "TL",
        "type": "number",
        "helper": "Enter principal"
      },
      {
        "key": "annualInterest",
        "label": "Annual Interest Rate (%)",
        "unit": "Yuzde",
        "type": "number",
        "helper": "Enter annual interest rate (%)"
      },
      {
        "key": "gecikmegun",
        "label": "gecikmegun",
        "unit": "Gun",
        "type": "number",
        "helper": "Enter gecikmegun"
      },
      {
        "key": "bilesimsikligi",
        "label": "bilesimsikligi",
        "unit": "Gun",
        "type": "number",
        "helper": "Enter bilesimsikligi"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  },
  {
    "slug": "statute-of-limitations-period",
    "title": "Statute Of Limitations Period",
    "category": "manufacturing-workshop",
    "description": "Free online statute of limitations period calculator. Get accurate calculations instantly.",
    "seoTitle": "Statute Of Limitations Period | SectorCalc",
    "seoDescription": "Free online statute of limitations period calculator. Get accurate calculations instantly.",
    "inputs": [
      {
        "key": "yasalsure",
        "label": "yasalsure",
        "unit": "years",
        "type": "number",
        "helper": "Enter yasalsure"
      },
      {
        "key": "kesintidurumu",
        "label": "Interruption Status",
        "unit": "Number",
        "type": "number",
        "helper": "Enter interruption status indicator"
      }
    ],
    "resultType": "quantity",
    "missingFactors": [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  }
];

export const FREE_TRAFFIC_CATEGORIES: readonly FreeTrafficCategory[] = [
  "construction-measurement",
  "finance-business",
  "manufacturing-workshop",
  "energy-carbon",
  "logistics-travel",
  "agriculture-food",
  "everyday-life",
  "math-statistics",
  "conversion",
  "health-body",
] as const;

export const FEATURED_TRAFFIC_SLUGS: readonly string[] = [
  "rental-yield-one-percent-rule",
  "mortgage-monthly-payment",
  "budget-rule-50-30-20",
  "cagr-growth-rate",
  "overall-equipment-effectiveness-oee",
  "body-mass-index-bmi"
] as const;

export function getFreeTrafficToolBySlug(slug: string): FreeTrafficTool | undefined {
  return FREE_TRAFFIC_TOOLS.find((tool) => tool.slug === slug);
}

export function listFreeTrafficToolsByCategory(
  category: FreeTrafficCategory,
): readonly FreeTrafficTool[] {
  return FREE_TRAFFIC_TOOLS.filter((tool) => tool.category === category);
}

export function listRelatedTrafficTools(
  tool: FreeTrafficTool,
  limit = 6,
): readonly FreeTrafficTool[] {
  return FREE_TRAFFIC_TOOLS.filter(
    (candidate) => candidate.category === tool.category && candidate.slug !== tool.slug,
  ).slice(0, limit);
}

export function listFreeTrafficSlugs(): string[] {
  return FREE_TRAFFIC_TOOLS.map((t) => t.slug);
}

export function getFreeTrafficCategoryLabelKey(category: FreeTrafficCategory): string {
  return `categories.${category}`;
}
