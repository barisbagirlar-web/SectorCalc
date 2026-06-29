import type { FreeTrafficTool } from "./types";

export const FINANCE_BUSINESS_TOOLS: readonly FreeTrafficTool[] = [
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter monthly rent"
      },
      {
        "key": "propertyValue",
        "label": "Property Value",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter selling price"
      },
      {
        "key": "remainingDebt",
        "label": "Remaining Debt",
        "unit": "USD",
        "type": "number",
        "helper": "Enter remaining debt"
      },
      {
        "key": "newInvestment",
        "label": "New Investment",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter cost"
      },
      {
        "key": "salvageValue",
        "label": "Salvage Value",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter dividend"
      },
      {
        "key": "price",
        "label": "Vehicle Price",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter purchase price"
      },
      {
        "key": "sale",
        "label": "Sales Amount",
        "unit": "USD",
        "type": "number",
        "helper": "Enter sales amount"
      },
      {
        "key": "dividend",
        "label": "Dividend",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter initial value"
      },
      {
        "key": "finalValue",
        "label": "Final Value",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter start value"
      },
      {
        "key": "endValue",
        "label": "End Value",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter net profit"
      },
      {
        "key": "cost",
        "label": "Cost",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter future cash flow pv"
      },
      {
        "key": "investment",
        "label": "Investment",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter equity"
      },
      {
        "key": "debt",
        "label": "Debt",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter net profit"
      },
      {
        "key": "depreciation",
        "label": "Depreciation",
        "unit": "USD",
        "type": "number",
        "helper": "Enter depreciation"
      },
      {
        "key": "workingCapital",
        "label": "Working Capital",
        "unit": "USD",
        "type": "number",
        "helper": "Enter working capital"
      },
      {
        "key": "capex",
        "label": "CapEx",
        "unit": "USD",
        "type": "number",
        "helper": "Enter capex"
      },
      {
        "key": "debt",
        "label": "Debt",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter net profit"
      },
      {
        "key": "interestRate",
        "label": "Interest Rate",
        "unit": "USD",
        "type": "number",
        "helper": "Enter interest rate"
      },
      {
        "key": "tax",
        "label": "Tax",
        "unit": "USD",
        "type": "number",
        "helper": "Enter tax"
      },
      {
        "key": "depreciation",
        "label": "Depreciation",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter share price"
      },
      {
        "key": "eps",
        "label": "Earnings Per Share (EPS)",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter market cap"
      },
      {
        "key": "equity",
        "label": "Equity",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter market cap"
      },
      {
        "key": "totalSales",
        "label": "Total Sales",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter net profit"
      },
      {
        "key": "sales",
        "label": "Sales",
        "unit": "USD",
        "type": "number",
        "helper": "Enter sales"
      },
      {
        "key": "assets",
        "label": "Assets",
        "unit": "USD",
        "type": "number",
        "helper": "Enter assets"
      },
      {
        "key": "equity",
        "label": "Equity",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter nopat"
      },
      {
        "key": "investedCapital",
        "label": "Invested Capital",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter nopat"
      },
      {
        "key": "capital",
        "label": "Capital",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter peak value"
      },
      {
        "key": "troughValue",
        "label": "Trough Value",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter initial nav"
      },
      {
        "key": "finalNav",
        "label": "Final NAV",
        "unit": "USD",
        "type": "number",
        "helper": "Enter final nav"
      },
      {
        "key": "distributions",
        "label": "Distributions",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter purchase price"
      },
      {
        "key": "sellingPrice",
        "label": "Selling Price",
        "unit": "USD",
        "type": "number",
        "helper": "Enter selling price"
      },
      {
        "key": "dividend",
        "label": "Dividend",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter entry price"
      },
      {
        "key": "exitPrice",
        "label": "Exit Price",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter stock price (s)"
      },
      {
        "key": "strikePrice",
        "label": "Strike Price (K)",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter purchase price"
      },
      {
        "key": "sale",
        "label": "Sales Amount",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter preferred return"
      },
      {
        "key": "foregoneReturn",
        "label": "Foregone Return",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter sales amount"
      },
      {
        "key": "purchasePrice",
        "label": "Purchase Price",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter old monthly payment"
      },
      {
        "key": "newPayment",
        "label": "New Monthly Payment",
        "unit": "USD",
        "type": "number",
        "helper": "Enter new monthly payment"
      },
      {
        "key": "closingCost",
        "label": "Closing Cost",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter property value"
      },
      {
        "key": "remainingDebt",
        "label": "Remaining Debt",
        "unit": "USD",
        "type": "number",
        "helper": "Enter remaining debt"
      },
      {
        "key": "newLoan",
        "label": "New Loan Amount",
        "unit": "USD",
        "type": "number",
        "helper": "Enter new loan amount"
      },
      {
        "key": "fees",
        "label": "Fees",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter home purchase price"
      },
      {
        "key": "annualRent",
        "label": "Annual Rent Amount",
        "unit": "USD",
        "type": "number",
        "helper": "Enter annual rent amount"
      },
      {
        "key": "annualExpense",
        "label": "Annual Operating Expense",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter annual net income"
      },
      {
        "key": "propertyValue",
        "label": "Property Value",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter annual net cash flow"
      },
      {
        "key": "totalCashInvestment",
        "label": "Total Cash Invested",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter purchase cost"
      },
      {
        "key": "rehab",
        "label": "Rehab Cost",
        "unit": "USD",
        "type": "number",
        "helper": "Enter rehab cost"
      },
      {
        "key": "value",
        "label": "After Repair Value (ARV)",
        "unit": "USD",
        "type": "number",
        "helper": "Enter after repair value (arv)"
      },
      {
        "key": "loanAmount",
        "label": "Loan Amount",
        "unit": "USD",
        "type": "number",
        "helper": "Enter loan amount"
      },
      {
        "key": "rent",
        "label": "Monthly Rent",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter monthly operating expense"
      },
      {
        "key": "loanAmount",
        "label": "Loan Amount",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter home market value"
      },
      {
        "key": "remainingDebt",
        "label": "Remaining Debt",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "key": "fees",
        "label": "Fees",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter vehicle price"
      },
      {
        "key": "downPayment",
        "label": "Down Payment",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter vehicle price"
      },
      {
        "key": "downPayment",
        "label": "Down Payment",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter vehicle price"
      },
      {
        "key": "downPayment",
        "label": "Down Payment",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter vehicle price"
      },
      {
        "key": "downPayment",
        "label": "Down Payment",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter monthly payment"
      },
      {
        "key": "extraPayment",
        "label": "Extra Monthly Payment",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter monthly debt payments"
      },
      {
        "key": "grossIncome",
        "label": "Gross Annual Income",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter net operating income (noi)"
      },
      {
        "key": "annualDebtService",
        "label": "Annual Debt Service",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter net income"
      },
      {
        "key": "livingExpense",
        "label": "Monthly Living Expense",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter investment"
      },
      {
        "key": "valuation",
        "label": "Post-money Valuation Cap",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter investment"
      },
      {
        "key": "capValue",
        "label": "Valuation Cap Amount",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter marketing expenses"
      },
      {
        "key": "salesExpense",
        "label": "Sales Expenses",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter clv"
      },
      {
        "key": "cac",
        "label": "cac",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter campaign revenue"
      },
      {
        "key": "campaignCost",
        "label": "Campaign Cost",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter starting cash balance"
      },
      {
        "key": "endCash",
        "label": "Ending Cash Balance",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter current assets"
      },
      {
        "key": "currentLiabilities",
        "label": "Current Liabilities",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter annual credit sales"
      },
      {
        "key": "avgReceivables",
        "label": "Average Accounts Receivable",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter annual cogs (cost of goods sold)"
      },
      {
        "key": "avgPayables",
        "label": "Average Accounts Payable",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter annual cogs (cost of goods sold)"
      },
      {
        "key": "avgInventory",
        "label": "Average Inventory",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter selling price"
      },
      {
        "key": "degiskenmaliyet",
        "label": "degiskenmaliyet",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter gross revenue"
      },
      {
        "key": "cogs",
        "label": "COGS",
        "unit": "USD",
        "type": "number",
        "helper": "Enter cogs"
      },
      {
        "key": "operatingExpense",
        "label": "Operating Expenses",
        "unit": "USD",
        "type": "number",
        "helper": "Enter operating expenses"
      },
      {
        "key": "tax",
        "label": "Tax",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter ebitda"
      },
      {
        "key": "revenue",
        "label": "Gross Revenue",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter target annual revenue"
      },
      {
        "key": "annualExpense",
        "label": "Annual Operating Expense",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter sales amount"
      },
      {
        "key": "productCost",
        "label": "Product Cost per Unit",
        "unit": "USD",
        "type": "number",
        "helper": "Enter product cost per unit"
      },
      {
        "key": "fbaFee",
        "label": "Amazon FBA Fee per Unit",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter sales amount"
      },
      {
        "key": "product",
        "label": "Product Cost",
        "unit": "USD",
        "type": "number",
        "helper": "Enter product cost"
      },
      {
        "key": "shipping",
        "label": "Shipping Cost per Order",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter sales amount"
      },
      {
        "key": "listing",
        "label": "Listing Fees",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter sales amount"
      },
      {
        "key": "supply",
        "label": "Product Supply Cost",
        "unit": "USD",
        "type": "number",
        "helper": "Enter product supply cost"
      },
      {
        "key": "shipping",
        "label": "Shipping Cost per Order",
        "unit": "USD",
        "type": "number",
        "helper": "Enter shipping cost per order"
      },
      {
        "key": "ads",
        "label": "Advertising Cost",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter gross revenue"
      },
      {
        "key": "cogs",
        "label": "COGS",
        "unit": "USD",
        "type": "number",
        "helper": "Enter cogs"
      },
      {
        "key": "marketing",
        "label": "Marketing Expenses",
        "unit": "USD",
        "type": "number",
        "helper": "Enter marketing expenses"
      },
      {
        "key": "operations",
        "label": "Operational Expenses",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter total consolidated debts"
      },
      {
        "key": "savings",
        "label": "Savings",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter yillikgelir"
      },
      {
        "key": "bazprim",
        "label": "bazprim",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter lower premium plan option"
      },
      {
        "key": "higherPremium",
        "label": "Higher Premium Plan Option",
        "unit": "USD",
        "type": "number",
        "helper": "Enter higher premium plan option"
      },
      {
        "key": "deductibleDifference",
        "label": "Deductible Difference Cost",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter current retirement savings portfolio"
      },
      {
        "key": "monthlyContribution",
        "label": "Monthly Saving Contribution",
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter hedefportfoy"
      },
      {
        "key": "currentSavings",
        "label": "Current Retirement Savings Portfolio",
        "unit": "USD",
        "type": "number",
        "helper": "Enter current retirement savings portfolio"
      },
      {
        "key": "monthlyContribution",
        "label": "Monthly Saving Contribution",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
        "type": "number",
        "helper": "Enter traditional ira account balance"
      },
      {
        "key": "conversionAmount",
        "label": "Conversion Amount",
        "unit": "USD",
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
        "unit": "USD",
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
        "unit": "USD",
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
];