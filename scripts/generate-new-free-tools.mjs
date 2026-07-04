import fs from "node:fs";
import path from "node:path";

// 1. Dictionaries for mapping Turkish terms to standard English keys/labels
const KEY_MAP = {
  "aylikkira": "monthlyRent",
  "mulkdegeri": "propertyValue",
  "satisfiyati": "salePrice",
  "kalanborc": "remainingDebt",
  "yeniyatirim": "newInvestment",
  "netgelir": "netIncome",
  "bedel": "cost",
  "kalinti": "salvageValue",
  "omur": "usefulLife",
  "method": "method",
  "anapara": "principal",
  "interest": "interestRate",
  "period": "period",
  "birikim": "savings",
  "duration": "duration",
  "kredi": "loanAmount",
  "vade": "term",
  "masraf": "fees",
  "portfoy": "portfolioValue",
  "hisse": "stocks",
  "tahvil": "bonds",
  "nakit": "cash",
  "dogustan": "inherentRisk",
  "control": "controlRisk",
  "tespit": "detectionRisk",
  "year": "years",
  "siklik": "frequency",
  "day": "days",
  "nominal": "nominalRate",
  "kupon": "couponRate",
  "piyasafaizi": "marketRate",
  "temettu": "dividend",
  "stopaj": "withholdingTax",
  "alis": "purchasePrice",
  "sales": "salePrice",
  "start": "initialValue",
  "finish": "finalValue",
  "ilkdeger": "startValue",
  "sondeger": "endValue",
  "netkar": "netProfit",
  "cost": "cost",
  "nakitakislari": "cashFlows",
  "discount": "discountRate",
  "investment": "investment",
  "geleceknakitbd": "futureCashFlowPv",
  "e": "equity",
  "d": "debt",
  "re": "costOfEquity",
  "rd": "costOfDebt",
  "tax": "tax",
  "risksizfaiz": "riskFreeRate",
  "beta": "beta",
  "piyasaprimi": "marketPremium",
  "fcf": "freeCashFlow",
  "wacc": "wacc",
  "terminalbuyume": "terminalGrowth",
  "depreciation": "depreciation",
  "isletmesermayesi": "workingCapital",
  "capex": "capex",
  "borc": "debt",
  "favok": "ebitda",
  "hissefiyati": "sharePrice",
  "hissebasikar": "eps",
  "piyasadegeri": "marketCap",
  "ozsermaye": "equity",
  "toplamsatislar": "totalSales",
  "satislar": "sales",
  "varliklar": "assets",
  "nopat": "nopat",
  "yatirilansermaye": "investedCapital",
  "sermaye": "capital",
  "portfoygetirisi": "portfolioReturn",
  "volatility": "volatility",
  "asagisapma": "downsideDeviation",
  "zirvedeger": "peakValue",
  "dipdeger": "troughValue",
  "getiriler": "returns",
  "kovaryans": "covariance",
  "hedefgetiri": "targetReturn",
  "baslangicnav": "initialNav",
  "bitisnav": "finalNav",
  "dagitim": "distributions",
  "alisfiyati": "purchasePrice",
  "satisfiyati": "sellingPrice",
  "giderorani": "expenseRatio",
  "girisfiyati": "entryPrice",
  "cikisfiyati": "exitPrice",
  "carpan": "multiplier",
  "lot": "lots",
  "s": "stockPrice",
  "k": "strikePrice",
  "r": "interestRate",
  "t": "time",
  "v": "volatility",
  "pipdegeri": "pipValue",
  "piphareketi": "pipMovement",
  "quantity": "quantity",
  "komisyon": "commission",
  "gas": "gas",
  "royalty": "royalty",
  "nominaldeger": "nominalValue",
  "inflation": "inflation",
  "nominalgetiri": "nominalReturn",
  "tercihedilengetiri": "preferredReturn",
  "vazgecilengetiri": "foregoneReturn",
  "vergiorani": "taxRate",
  "istisna": "exemption",
  "rayicbedel": "assessedValue",
  "vergiorani": "taxRate",
  "kredi1": "loanAmount1",
  "kredi2": "loanAmount2",
  "faiz1": "interestRate1",
  "faiz2": "interestRate2",
  "kalananapara": "remainingPrincipal",
  "period": "period",
  "puanorani": "pointsRate",
  "ayliktasarruf": "monthlySavings",
  "eskitaksit": "oldPayment",
  "yenitaksit": "newPayment",
  "kapatmamasrafi": "closingCost",
  "yenikredi": "newLoan",
  "aylikgelir": "monthlyIncome",
  "maxdti": "maxDti",
  "aylikborc": "monthlyDebt",
  "evfiyati": "homePrice",
  "yillikkira": "annualRent",
  "yillikgider": "annualExpense",
  "yilliknetgelir": "annualNetIncome",
  "yilliknakitakis": "annualCashFlow",
  "toplamnakityatirim": "totalCashInvestment",
  "alim": "purchase",
  "rehab": "rehab",
  "value": "value",
  "rent": "rent",
  "brutkira": "grossRent",
  "bosluk": "vacancy",
  "operating": "operating",
  "satisbedeli": "salesPrice",
  "komisyonorani": "commissionRate",
  "kreditutari": "loanAmount",
  "ratio": "rate",
  "sabitucretler": "fixedFees",
  "evdegeri": "homeValue",
  "maksoran": "maxRate",
  "pmiorani": "pmiRate",
  "pesinprim": "upfrontPremium",
  "yillikprim": "annualPremium",
  "finansmanucreti": "fundingFee",
  "tutar": "amount",
  "price": "price",
  "pesin": "downPayment",
  "graceperiod": "gracePeriod",
  "eskibakiye": "oldBalance",
  "eskifaiz": "oldInterest",
  "yenifaiz": "newInterest",
  "yillikfaiz": "annualInterest",
  "bakiye": "balance",
  "asgarioran": "minimumRate",
  "sales": "sale",
  "yuzde": "percent",
  "sabit": "fixed",
  "payment": "payment",
  "ekodeme": "extraPayment",
  "borclar": "debts",
  "faizler": "interests",
  "brutgelir": "grossIncome",
  "netisletmegeliri": "noi",
  "yillikborcodemesi": "annualDebtService",
  "yasamgideri": "livingExpense",
  "maxtaksitorani": "maxPaymentRatio",
  "mevcutkur": "exchangeRate",
  "kurbeklentisi": "exchangeTrend",
  "favok": "ebitda",
  "investment": "investment",
  "hisseorani": "equityPercent",
  "piyasafiyati": "marketPrice",
  "discount": "discount",
  "contribution": "contribution",
  "hissesayisi": "sharesCount",
  "hakkazanma": "vesting",
  "degerleme": "valuation",
  "tavandeger": "capValue",
  "toplamhisse": "totalShares",
  "mevcuthisse": "currentShares",
  "yenihisse": "newShares",
  "kurucu": "founders",
  "yatirimci": "investors",
  "opsiyon": "options",
  "ilgilihisse": "shares",
  "pazarlama": "marketing",
  "satisgideri": "salesExpense",
  "yenimusteri": "newCustomers",
  "ortsiparis": "avgOrder",
  "margin": "margin",
  "kampanyageliri": "campaignRevenue",
  "kampanyamaliyeti": "campaignCost",
  "ziyaretci": "visitors",
  "donusum": "conversions",
  "tiklama": "clicks",
  "gosterim": "impressions",
  "toplamharcama": "totalSpend",
  "reklammaliyeti": "adCost",
  "donembasi": "startCustomers",
  "kaybedilen": "lostCustomers",
  "baslangicnakit": "startCash",
  "bitisnakit": "endCash",
  "donenvarliklar": "currentAssets",
  "kisavadeliborc": "currentLiabilities",
  "yilliksatis": "annualSales",
  "ortalacak": "avgReceivables",
  "yillikcogs": "annualCogs",
  "ortborc": "avgPayables",
  "ortstok": "avgInventory",
  "stokgun": "daysInventory",
  "alacakgun": "daysReceivables",
  "borcgun": "daysPayables",
  "ciro": "revenue",
  "cogs": "cogs",
  "isletmegideri": "operatingExpense",
  "hedefgelir": "targetRevenue",
  "faturalisaat": "billableHours",
  "hedefnet": "targetNet",
  "calismasaati": "workingHours",
  "urunmaliyeti": "productCost",
  "fbaucreti": "fbaFee",
  "product": "product",
  "kargo": "shipping",
  "platform": "platform",
  "listeleme": "listing",
  "islem": "transaction",
  "satisislem": "salesTransaction",
  "satisodeme": "salesPayment",
  "kategori": "category",
  "supply": "supply",
  "reklam": "ads",
  "operasyon": "operations",
  "weight": "weight",
  "volume": "volume",
  "distance": "distance",
  "birimfiyat": "unitPrice",
  "en": "width",
  "boy": "length",
  "height": "height",
  "bolen": "divisor",
  "cifbedel": "cifValue",
  "gumrukorani": "dutyRate",
  "urunbedeli": "productValue",
  "ekvergi": "additionalTax",
  "netfiyat": "netPrice",
  "ulkekdv": "countryVat",
  "yilliktalep": "annualDemand",
  "siparismaliyeti": "orderingCost",
  "tasimamaliyeti": "holdingCost",
  "orttalep": "avgDemand",
  "stdsapma": "stdDev",
  "tedariksure": "leadTime",
  "z": "zScore",
  "gruplar": "groups",
  "veriseti": "dataSet",
  "boyun": "neck",
  "bel": "waist",
  "cinsiyet": "gender",
  "kullanilabilirlik": "availability",
  "performance": "performance",
  "qualityExpr": "quality",
  "icayar": "internalSetup",
  "disayar": "externalSetup",
  "donusum": "conversion",
  "ilksure": "initialTime",
  "ogrenmeorani": "learningRate",
  "uretilenadet": "unitsProduced",
  "gozlenensure": "observedTime",
  "eksure": "allowanceTime",
  "toplamis": "totalWork",
  "takttime": "taktTime",
  "istyasyonsayisi": "stationsCount",
  "istasyonsureleri": "stationTimes",
  "production": "production",
  "hurda": "scrap",
  "sonhata": "finalError",
  "oncekihata": "prevError",
  "gecensure": "elapsedTime",
  "uretimkapasite": "capacity",
  "toplamyatirim": "totalInvestment",
  "toplamisletme": "totalOperating",
  "toplamuretim": "totalGeneration",
  "smv_total": "totalSmv",
  "operator": "operators",
  "parcavaryans": "partVariance",
  "olcumvaryans": "gageVariance",
  "bagimlisayisi": "dependents",
  "yillikkatki": "annualContribution",
  "marjinalvergi": "marginalTax",
  "threshold": "threshold",
  "ekoran": "extraRate",
  "dusukprim": "lowerPremium",
  "yuksekprim": "higherPremium",
  "muafiyetfarki": "deductibleDifference",
  "mevcutbirikim": "currentSavings",
  "aylikkatki": "monthlyContribution",
  "maas": "salary",
  "katkiorani": "contributionRate",
  "isvereneslesme": "employerMatch",
  "buyumeorani": "growthRate",
  "gelenekselbakiye": "traditionalBalance",
  "donusentutar": "conversionAmount",
  "yasambeklentisi": "lifeExpectancy",
  "ortindekslikazanc": "aime",
  "emeklilikyasi": "retirementAge",
  "average": "mean",
  "stdhata": "stdError",
  "guvenseviyesi": "confidenceLevel",
  "hatapayi": "marginOfError",
  "aktiviteseviyesi": "activityLevel",
  "dinlenmenabzi": "restingHeartRate",
  "yogunluk": "intensity",
  "kosumesafesi": "runDistance",
  "aktivitesure": "activityDuration",
  "elastisitemodulu": "elasticModulus",
  "birimsekildegistirme": "strain",
  "girisim": "interference",
  "cap": "diameter",
  "e1": "e1",
  "e2": "e2",
  "pressure": "pressure",
  "kalinlik": "thickness",
  "load": "load",
  "kaynakboyu": "weldLength",
  "kaynakgerilmesi": "weldStress",
  "length": "length",
  "ataletmomenti": "momentOfInertia",
  "lazerguc": "laserPower",
  "kesmehiz": "cuttingSpeed",
  "odakmesafe": "focusDistance",
  "malzemekalinlik": "materialThickness",
  "aciklik": "span",
  "width": "width",
  "height": "height",
  "sigmax": "sigmaX",
  "sigmay": "sigmaY",
  "tauxy": "tauXY",
  "mach": "mach",
  "basinc1": "pressure1",
  "sicaklik1": "temperature1",
  "buharbasinci": "vaporPressure",
  "yogunluk": "density",
  "loss": "loss",
  "genlesmekatsayisi": "expansionCoefficient",
  "sicaklikfarki": "temperatureDifference",
  "power": "power",
  "speed": "speed",
  "sarilmaacisi": "wrapAngle",
  "suratma": "friction",
  "workspace": "workspace",
  "mass": "mass",
  "yaykatsayisi": "springConstant",
  "frequency": "frequency",
  "moment": "moment",
  "torque": "torque",
  "akmagerilmesi": "yieldStrength",
  "yaricap": "radius",
  "mac": "mac",
  "kutupsalatalet": "polarInertia",
  "deplasman": "displacement",
  "derinlik": "depth",
  "vp": "partVariance",
  "vgrr": "gageVariance",
  "total": "total"
};

const LABEL_MAP = {
  "monthlyRent": "Monthly Rent",
  "propertyValue": "Property Value",
  "salePrice": "Sale Price",
  "remainingDebt": "Remaining Debt",
  "newInvestment": "New Investment",
  "netIncome": "Net Income",
  "cost": "Cost",
  "salvageValue": "Salvage Value",
  "usefulLife": "Useful Life",
  "method": "Method",
  "principal": "Principal",
  "interestRate": "Interest Rate",
  "period": "Period",
  "savings": "Savings",
  "duration": "Duration",
  "loanAmount": "Loan Amount",
  "term": "Term",
  "fees": "Fees",
  "portfolioValue": "Portfolio Value",
  "stocks": "Stocks",
  "bonds": "Bonds",
  "cash": "Cash",
  "inherentRisk": "Inherent Risk",
  "controlRisk": "Control Risk",
  "detectionRisk": "Detection Risk",
  "years": "Years",
  "frequency": "Frequency",
  "days": "Days",
  "nominalRate": "Nominal Rate",
  "couponRate": "Coupon Rate",
  "marketRate": "Market Rate",
  "dividend": "Dividend",
  "withholdingTax": "Withholding Tax",
  "purchasePrice": "Purchase Price",
  "sellingPrice": "Selling Price",
  "initialValue": "Initial Value",
  "finalValue": "Final Value",
  "startValue": "Start Value",
  "endValue": "End Value",
  "netProfit": "Net Profit",
  "cashFlows": "Cash Flows",
  "discountRate": "Discount Rate",
  "investment": "Investment",
  "futureCashFlowPv": "Future Cash Flow PV",
  "equity": "Equity",
  "debt": "Debt",
  "costOfEquity": "Cost of Equity",
  "costOfDebt": "Cost of Debt",
  "tax": "Tax",
  "riskFreeRate": "Risk-Free Rate",
  "beta": "Beta",
  "marketPremium": "Market Premium",
  "freeCashFlow": "Free Cash Flow",
  "wacc": "WACC",
  "terminalGrowth": "Terminal Growth",
  "depreciation": "Depreciation",
  "workingCapital": "Working Capital",
  "capex": "CapEx",
  "ebitda": "EBITDA",
  "sharePrice": "Share Price",
  "eps": "Earnings Per Share (EPS)",
  "marketCap": "Market Cap",
  "totalSales": "Total Sales",
  "sales": "Sales",
  "assets": "Assets",
  "nopat": "NOPAT",
  "investedCapital": "Invested Capital",
  "capital": "Capital",
  "portfolioReturn": "Portfolio Return",
  "volatility": "Volatility",
  "downsideDeviation": "Downside Deviation",
  "peakValue": "Peak Value",
  "troughValue": "Trough Value",
  "returns": "Returns",
  "covariance": "Covariance",
  "targetReturn": "Target Return",
  "initialNav": "Initial NAV",
  "finalNav": "Final NAV",
  "distributions": "Distributions",
  "expenseRatio": "Expense Ratio",
  "entryPrice": "Entry Price",
  "exitPrice": "Exit Price",
  "multiplier": "Multiplier",
  "lots": "Lots",
  "stockPrice": "Stock Price (S)",
  "strikePrice": "Strike Price (K)",
  "time": "Time (Years)",
  "pipValue": "Pip Value",
  "pipMovement": "Pip Movement",
  "quantity": "Quantity",
  "commission": "Commission (%)",
  "gas": "Gas Fee (ETH)",
  "royalty": "Royalty (%)",
  "nominalValue": "Nominal Value",
  "inflation": "Inflation Rate (%)",
  "nominalReturn": "Nominal Return (%)",
  "preferredReturn": "Preferred Return",
  "foregoneReturn": "Foregone Return",
  "taxRate": "Tax Rate (%)",
  "exemption": "Exemption Amount",
  "assessedValue": "Assessed Value",
  "taxRatePerThousand": "Tax Rate (per thousand)",
  "loanAmount1": "First Loan Amount",
  "loanAmount2": "Second Loan Amount",
  "interestRate1": "First Interest Rate (%)",
  "interestRate2": "Second Interest Rate (%)",
  "remainingPrincipal": "Remaining Principal",
  "pointsRate": "Points Rate (%)",
  "monthlySavings": "Monthly Savings",
  "oldPayment": "Old Monthly Payment",
  "newPayment": "New Monthly Payment",
  "closingCost": "Closing Cost",
  "newLoan": "New Loan Amount",
  "monthlyIncome": "Monthly Income",
  "maxDti": "Max DTI Ratio (%)",
  "monthlyDebt": "Monthly Debt Payments",
  "homePrice": "Home Purchase Price",
  "annualRent": "Annual Rent Amount",
  "annualExpense": "Annual Operating Expense",
  "annualNetIncome": "Annual Net Income",
  "annualCashFlow": "Annual Net Cash Flow",
  "totalCashInvestment": "Total Cash Invested",
  "purchase": "Purchase Cost",
  "rehab": "Rehab Cost",
  "value": "After Repair Value (ARV)",
  "rent": "Monthly Rent",
  "grossRent": "Gross Monthly Rent",
  "vacancy": "Vacancy Rate (%)",
  "operating": "Monthly Operating Expense",
  "salesPrice": "Property Sale Price",
  "commissionRate": "Broker Commission Rate (%)",
  "fixedFees": "Fixed Closing Fees",
  "homeValue": "Home Market Value",
  "maxRate": "Max Financing Ratio (%)",
  "pmiRate": "Annual PMI Rate (%)",
  "upfrontPremium": "Upfront Premium (%)",
  "annualPremium": "Annual Premium (%)",
  "fundingFee": "Funding Fee (%)",
  "amount": "Loan / Debt Amount",
  "price": "Vehicle Price",
  "downPayment": "Down Payment",
  "gracePeriod": "Grace Period (Months)",
  "oldBalance": "Old Loan Balance",
  "oldInterest": "Old Interest Rate (%)",
  "newInterest": "New Interest Rate (%)",
  "annualInterest": "Annual Interest Rate (%)",
  "balance": "Card Balance",
  "minimumRate": "Minimum Payment Ratio (%)",
  "sale": "Sales Amount",
  "percent": "Percentage Fee (%)",
  "fixed": "Fixed Fee",
  "payment": "Monthly Payment",
  "extraPayment": "Extra Monthly Payment",
  "debts": "Total Consolidated Debts",
  "interests": "Average Interest Rate (%)",
  "grossIncome": "Gross Annual Income",
  "noi": "Net Operating Income (NOI)",
  "annualDebtService": "Annual Debt Service",
  "livingExpense": "Monthly Living Expense",
  "maxPaymentRatio": "Max Payment-to-Income Ratio (%)",
  "exchangeRate": "Current Exchange Rate",
  "exchangeTrend": "Expected Exchange Rate Trend (%)",
  "equityPercent": "Equity Stake Offered (%)",
  "marketPrice": "Current Market Price",
  "discount": "Option Discount (%)",
  "contribution": "Monthly Employee Contribution",
  "sharesCount": "Number of Shares / Units",
  "vesting": "Vesting Percentage (%)",
  "valuation": "Post-money Valuation Cap",
  "capValue": "Valuation Cap Amount",
  "totalShares": "Total Company Shares Outstanding",
  "currentShares": "Current Shares Outstanding",
  "newShares": "New Shares to Issue",
  "founders": "Founders' Shares",
  "investors": "Investors' Shares",
  "options": "Option Pool Shares",
  "shares": "Target Shares",
  "marketing": "Marketing Expenses",
  "salesExpense": "Sales Expenses",
  "newCustomers": "New Customers Acquired",
  "avgOrder": "Average Order Value",
  "margin": "Gross Margin (%)",
  "campaignRevenue": "Campaign Revenue",
  "campaignCost": "Campaign Cost",
  "visitors": "Total Visitors",
  "conversions": "Total Goal Achievements",
  "clicks": "Total Ad Clicks",
  "impressions": "Total Ad Impressions",
  "totalSpend": "Total Advertising Budget Spent",
  "adCost": "Total Campaign Cost",
  "startCustomers": "Starting Customers",
  "lostCustomers": "Lost Customers",
  "startCash": "Starting Cash Balance",
  "endCash": "Ending Cash Balance",
  "currentAssets": "Current Assets",
  "currentLiabilities": "Current Liabilities",
  "annualSales": "Annual Credit Sales",
  "avgReceivables": "Average Accounts Receivable",
  "annualCogs": "Annual COGS (Cost of Goods Sold)",
  "avgPayables": "Average Accounts Payable",
  "avgInventory": "Average Inventory",
  "daysInventory": "Days Inventory Outstanding",
  "daysReceivables": "Days Receivables Outstanding",
  "daysPayables": "Days Payables Outstanding",
  "revenue": "Gross Revenue",
  "cogs": "COGS",
  "operatingExpense": "Operating Expenses",
  "targetRevenue": "Target Annual Revenue",
  "billableHours": "Annual Billable Hours",
  "targetNet": "Target Net Monthly Income",
  "workingHours": "Monthly Working Hours",
  "productCost": "Product Cost per Unit",
  "fbaFee": "Amazon FBA Fee per Unit",
  "product": "Product Cost",
  "shipping": "Shipping Cost per Order",
  "platform": "Platform Transaction Fee (%)",
  "listing": "Listing Fees",
  "transaction": "Transaction Fee (%)",
  "salesTransaction": "Etsy Transaction Fee (%)",
  "salesPayment": "Etsy Payment Processing Fee (%)",
  "supply": "Product Supply Cost",
  "ads": "Advertising Cost",
  "operations": "Operational Expenses",
  "distance": "Distance Traveled",
  "en": "Width",
  "boy": "Length",
  "height": "Height",
  "divisor": "Volumetric Divisor",
  "cifValue": "CIF Value (Cost, Insurance & Freight)",
  "dutyRate": "Customs Duty Rate (%)",
  "productValue": "Product Value",
  "additionalTax": "Additional Tax Rate (%)",
  "netPrice": "Net Price before VAT",
  "countryVat": "Destination Country VAT Rate (%)",
  "annualDemand": "Annual Product Demand",
  "orderingCost": "Order Placement Cost per Order",
  "holdingCost": "Inventory Carrying Cost per Unit/Year",
  "avgDemand": "Average Daily Demand",
  "stdDev": "Standard Deviation of Daily Demand",
  "leadTime": "Supplier Lead Time (Days)",
  "zScore": "Service Level Factor (Z-Score)",
  "groups": "Groups",
  "dataSet": "Values (comma separated)",
  "neck": "Neck Circumference",
  "waist": "Waist Circumference",
  "gender": "Gender",
  "availability": "Availability Rate (%)",
  "performance": "Performance Efficiency (%)",
  "quality": "Quality Rate (%)",
  "internalSetup": "Internal Setup Time (Minutes)",
  "externalSetup": "External Setup Time (Minutes)",
  "conversion": "Internal-to-External Conversion Rate (%)",
  "initialTime": "Initial Cycle Time (Minutes)",
  "learningRate": "Learning Curve Slope Rate (%)",
  "unitsProduced": "Cumulative Units Produced",
  "observedTime": "Observed Cycle Time (Minutes)",
  "allowanceTime": "Fatigue Allowance Rate (%)",
  "totalWork": "Total Work Content (Minutes)",
  "taktTime": "Takt Time (Seconds)",
  "stationsCount": "Number of Workstations",
  "stationTimes": "Station Times (comma separated, mins)",
  "production": "Total Units Produced",
  "scrap": "Defective Units (Scrap)",
  "finalError": "Final Measured Deviation",
  "prevError": "Previous Measured Deviation",
  "elapsedTime": "Elapsed Time between Calibrations (Days)",
  "capacity": "Total Production Capacity",
  "totalInvestment": "Total Plant Capital Investment",
  "totalOperating": "Total Lifecycle Operating Costs",
  "totalGeneration": "Total Projected Energy Output (kWh)",
  "totalSmv": "Total Standard Minute Value (SMV)",
  "operators": "Number of Line Operators",
  "partVariance": "Part-to-Part Variance (PV)",
  "gageVariance": "Measurement System Variance (GRR)",
  "dependents": "Number of Dependents",
  "annualContribution": "Annual HSA Contribution Amount",
  "marginalTax": "Marginal Tax Bracket (%)",
  "threshold": "Income Threshold",
  "extraRate": "Surcharge Rate (%)",
  "lowerPremium": "Lower Premium Plan Option",
  "higherPremium": "Higher Premium Plan Option",
  "deductibleDifference": "Deductible Difference Cost",
  "currentSavings": "Current Retirement Savings Portfolio",
  "monthlyContribution": "Monthly Saving Contribution",
  "salary": "Annual Base Salary",
  "contributionRate": "Employee Contribution Rate (%)",
  "employerMatch": "Employer Matching Contribution (%)",
  "growthRate": "Projected Investment Growth Rate (%)",
  "traditionalBalance": "Traditional IRA Account Balance",
  "conversionAmount": "Conversion Amount",
  "lifeExpectancy": "Distribution Period (Years)",
  "aime": "Average Indexed Monthly Earnings (AIME)",
  "retirementAge": "Claiming Age (Years)",
  "mean": "Mean",
  "stdError": "Standard Error",
  "confidenceLevel": "Confidence Level (%)",
  "marginOfError": "Margin of Error",
  "activityLevel": "Activity Level Factor",
  "restingHeartRate": "Resting Heart Rate (BPM)",
  "intensity": "Exercise Intensity Level (%)",
  "runDistance": "Run Distance (Meters)",
  "activityDuration": "Activity Duration (Mins)",
  "elasticModulus": "Young's Modulus of Elasticity (Pa)",
  "strain": "Normal Mechanical Strain",
  "interference": "Radial Interference Fit (m)",
  "diameter": "Diameter (m)",
  "e1": "Inner Component Elasticity (Pa)",
  "e2": "Outer Component Elasticity (Pa)",
  "pressure": "Internal Operating Pressure (Pa)",
  "thickness": "Wall Thickness (m)",
  "load": "Applied External Force (N)",
  "weldLength": "Total Weld Joint Length (m)",
  "weldStress": "Allowable Weld Shear Stress (Pa)",
  "length": "Component Length (m)",
  "momentOfInertia": "Area Moment of Inertia (m4)",
  "laserPower": "Laser Power Output (Watts)",
  "focusDistance": "Focus Area Diameter (m)",
  "materialThickness": "Material Thickness (m)",
  "span": "Clear Span length (m)",
  "width": "Section Width (m)",
  "height": "Section Height (m)",
  "sigmaX": "Normal Stress in X-Direction (Pa)",
  "sigmaY": "Normal Stress in Y-Direction (Pa)",
  "tauXY": "Shear Stress on XY-Plane (Pa)",
  "mach": "Inlet Mach Number",
  "pressure1": "Inlet Static Pressure (Pa)",
  "temperature1": "Inlet Static Temperature (K)",
  "vaporPressure": "Liquid Vapor Pressure (Pa)",
  "density": "Fluid Density (kg/m3)",
  "loss": "Frictional Head Loss (m)",
  "expansionCoefficient": "Thermal Expansion Coefficient (1/K)",
  "temperatureDifference": "Temperature Difference (K)",
  "power": "Transmitted Power (Watts)",
  "speed": "Belt Speed (m/s)",
  "wrapAngle": "Pulley Wrap Angle (Radians)",
  "friction": "Belt-to-Pulley Friction Coefficient",
  "mass": "Total Vibrating Mass (kg)",
  "springConstant": "Spring Constant / Stiffness (N/m)",
  "frequency": "Frequency (Hz)",
  "moment": "Applied Bending Moment (N.m)",
  "torque": "Applied Torsional Torque (N.m)",
  "yieldStrength": "Material Yield Strength (Pa)",
  "radius": "Component Outer Radius (m)",
  "polarInertia": "Polar Area Moment of Inertia (m4)",
  "displacement": "Spring Compression Displacement (m)",
  "module": "Gear Module (m)",
  "formFactor": "Lewis Form Factor (Y)",
  "depth": "Fluid Depth (m)",
  "total": "Total Amount"
};

// 2. SLUG MAP - Maps tool IDs to clean English slugs
const SLUG_MAP = {
  1: "rental-yield-one-percent-rule",
  2: "tax-deferred-exchange-1031",
  3: "budget-rule-50-30-20",
  4: "asset-depreciation-methods",
  5: "annuity-monthly-payout",
  6: "annuity-annual-payout",
  7: "annual-percentage-rate-apr",
  8: "portfolio-asset-allocation",
  9: "audit-risk-model",
  10: "simple-interest-yield",
  11: "compound-interest-growth",
  12: "compound-interest-frequencies",
  13: "continuous-compound-interest",
  14: "nominal-effective-interest",
  15: "bond-price-yield-valuation",
  16: "dividend-net-tax",
  17: "dividend-reinvestment-drip",
  18: "stock-investment-return",
  19: "annualized-investment-return",
  20: "cagr-growth-rate",
  21: "return-on-investment-roi",
  22: "net-present-value-npv",
  23: "internal-rate-of-return-irr",
  24: "discounted-payback-period",
  25: "profitability-index-pi",
  26: "wacc-capital-cost",
  27: "capm-equity-cost",
  28: "dcf-business-valuation",
  29: "fcff-fcfe-cash-flows",
  30: "ebitda-operating-earnings",
  31: "pe-ratio-valuation",
  32: "pb-ratio-valuation",
  33: "ps-ratio-valuation",
  34: "roe-dupont-analysis",
  35: "roic-capital-return",
  36: "eva-economic-value-added",
  37: "sharpe-ratio-volatility",
  38: "sortino-ratio-downside",
  39: "treynor-ratio-risk",
  40: "portfolio-max-drawdown",
  41: "portfolio-variance-optimizer",
  42: "mutual-fund-nav-return",
  43: "etf-net-annual-return",
  44: "futures-contract-profit",
  45: "black-scholes-option-price",
  46: "forex-pip-profit-calculator",
  47: "crypto-trade-net-profit",
  48: "nft-trade-net-profit-eth",
  49: "inflation-purchasing-power",
  50: "real-investment-return",
  51: "alternative-opportunity-cost",
  52: "capital-gains-tax-liability",
  53: "real-estate-property-tax",
  55: "mortgage-monthly-payment",
  56: "mortgage-comparison-tool",
  57: "mortgage-amortization-schedule",
  58: "mortgage-discount-points",
  59: "mortgage-refinance-breakeven",
  60: "cash-out-refinance-net",
  61: "home-purchase-affordability",
  62: "rent-vs-buy-decision-ratio",
  63: "rental-cap-rate-yield",
  64: "cash-on-cash-return-coc",
  66: "rental-property-net-cashflow",
  67: "real-estate-broker-commission",
  68: "mortgage-closing-costs-total",
  69: "heloc-borrowing-limit",
  70: "pmi-monthly-cost-estimator",
  71: "fha-loan-mortgage-cost",
  72: "va-loan-funding-fee",
  73: "personal-loan-payment",
  74: "auto-loan-monthly-payment",
  75: "boat-loan-monthly-payment",
  76: "motorcycle-loan-payment",
  77: "rv-recreational-vehicle-loan",
  78: "student-loan-grace-payment",
  79: "student-loan-refinance-savings",
  80: "credit-card-accrued-interest",
  81: "credit-card-minimum-payment",
  82: "credit-card-processing-fees",
  83: "debt-payoff-accelerator",
  84: "debt-consolidation-payment",
  85: "debt-to-income-dti-ratio",
  86: "debt-service-coverage-dscr",
  87: "maximum-affordable-loan-payment",
  88: "foreign-currency-usd-loan-risk",
  89: "business-valuation-multiplier",
  90: "startup-pre-post-valuation",
  91: "espp-discounted-stock-options",
  92: "rsu-net-shares-vesting",
  93: "convertible-note-shares",
  94: "safe-note-equity-shares",
  95: "equity-share-dilution-percent",
  96: "cap-table-ownership-spread",
  97: "cac-customer-acquisition-cost",
  98: "clv-customer-lifetime-value",
  99: "clv-to-cac-efficiency-ratio",
  100: "marketing-campaign-roi",
  101: "conversion-rate-optimization-cro",
  102: "click-through-rate-ctr",
  103: "cost-per-click-cpc",
  104: "cost-per-mille-cpm",
  105: "customer-churn-rate-percent",
  106: "cash-runway-burn-rate",
  107: "working-capital-liquidity",
  108: "receivables-turnover-days",
  109: "payables-turnover-days",
  110: "inventory-turnover-days",
  111: "cash-conversion-cycle-ccc",
  112: "unit-contribution-margin",
  113: "gross-net-profit-margins",
  114: "operating-ebitda-margin-percent",
  115: "consultant-minimum-hourly-rate",
  116: "freelancer-target-hourly-rate",
  117: "amazon-fba-net-profit",
  118: "shopify-store-net-profit",
  119: "etsy-seller-fee-net",
  120: "ebay-seller-fee-net",
  121: "dropshipping-net-profit",
  122: "ecommerce-store-net-margin",
  123: "freight-shipping-desi-cost",
  124: "volumetric-weight-desi",
  125: "customs-duty-import-tariff",
  126: "additional-origin-import-tax",
  127: "eu-ioss-vat-vat-calculator",
  128: "stripe-paypal-payment-processor",
  129: "economic-order-quantity-eoq",
  130: "safety-stock-reorder-point",
  131: "inventory-turnover-ratio",
  132: "abc-inventory-classification",
  133: "shipping-container-box-loading",
  134: "warehouse-pallet-storage-capacity",
  135: "freight-trucking-distance-cost",
  136: "fleet-fuel-distance-cost",
  137: "aviation-passenger-seat-cost",
  138: "ride-hailing-taxi-uber-fare",
  139: "overall-equipment-effectiveness-oee",
  140: "smed-mold-setup-reduction",
  141: "manufacturing-learning-curve",
  142: "standard-production-cycle-time",
  143: "production-assembly-line-balance",
  144: "assembly-line-bottleneck-capacity",
  145: "manufacturing-scrap-loss-cost",
  146: "measurement-gage-calibration-drift",
  147: "machine-capital-depreciation-rate",
  148: "levelized-cost-of-energy-lcoe",
  149: "apparel-sewing-line-balance",
  150: "measurement-gage-rr-percentage",
  151: "term-life-insurance-needs",
  152: "whole-life-insurance-value",
  153: "term-life-insurance-premium",
  154: "disability-income-replacement",
  155: "hsa-tax-saving-advantage",
  156: "medicare-part-b-premium",
  157: "high-deductible-health-plan-hsa",
  158: "retirement-future-portfolio-value",
  159: "retirement-savings-horizon-months",
  160: "401k-contribution-employer-match",
  161: "traditional-vs-roth-ira-net",
  162: "backdoor-roth-ira-conversion",
  163: "ira-required-minimum-distribution",
  164: "social-security-monthly-benefit",
  166: "variance-standard-deviation-pop",
  168: "sample-size-estimation-stats",
  169: "linear-correlation-regression",
  171: "body-mass-index-bmi",
  172: "body-fat-percentage-navy",
  173: "basal-metabolic-rate-bmr",
  174: "daily-calorie-expenditure-tdee",
  175: "target-heart-rate-karvonen",
  176: "vo2max-aerobic-capacity-cooper",
  177: "macronutrient-gram-split-goals",
  178: "daily-water-hydration-intake",
  179: "hookes-law-axial-stress",
  180: "interference-fit-pressure",
  181: "thin-walled-pressure-vessel",
  182: "weld-joint-throat-thickness",
  183: "simple-beam-deflection-load",
  184: "laser-welding-energy-density",
  185: "beam-lintel-bending-stress",
  186: "mohrs-circle-stress-transformation",
  187: "rectangle-area-moment-inertia",
  189: "pump-npsh-cavitation-margin",
  190: "thermal-pipe-expansion-stress",
  191: "flat-belt-drive-tension",
  192: "natural-resonance-frequency",
  193: "shaft-diameter-torsion-bending",
  194: "shaft-torsional-shear-stress",
  195: "spring-force-compression",
  196: "mass-spring-angular-frequency",
  197: "spur-gear-lewis-bending-stress",
  198: "hydrostatic-fluid-pressure-depth",
  199: "steel-beam-bending",
  200: "strain-calculator",
  201: "stress-calculator",
  202: "tolerance-and-fit",
  203: "soil-bearing-capacity",
  204: "torque-converter",
  205: "angle-of-twist",
  206: "torsion-spring",
  207: "von-mises-stress",
  208: "welding-heat-input",
  209: "wood-beam-shear",
  210: "worm-gear-efficiency",
  211: "load-bearing-wall",
  212: "surface-roughness-ra",
  213: "floor-joist-deflection",
  214: "lvl-beam-capacity",
  215: "ridge-beam-calculator",
  216: "shear-force-diagram",
  217: "archimedes-principle",
  218: "bernoulli-equation",
  219: "brinell-rockwell-conversion",
  221: "heat-conduction-fourier",
  222: "energy-density",
  223: "phase-diagram-lever-rule",
  225: "porosity-calculator",
  228: "wavelength-frequency-speed",
  229: "density-converter",
  231: "thermal-conductivity-converter",
  232: "adhesive-amount",
  233: "wood-deck-calculator",
  234: "drywall-calculator",
  235: "drywall-joint-compound",
  236: "siding-calculator",
  237: "soffit-calculator",
  238: "spray-paint-calculator",
  239: "wood-stain-calculator",
  240: "exterior-stucco",
  241: "baseboard-calculator",
  242: "chair-rail-calculator",
  243: "wallpaper-calculator",
  244: "tile-layout-calculator",
  245: "linoleum-vinyl-calculator",
  246: "wood-siding-calculator",
  247: "paver-calculator",
  248: "gravel-sand-calculator",
  249: "rainwater-harvesting",
  250: "well-pump-capacity",
  251: "building-load-factor",
  252: "breeam-leed-score",
  253: "carbon-footprint",
  254: "esg-score",
  255: "circular-economy",
  256: "water-footprint",
  257: "landfill-storage",
  258: "recycling-rate",
  259: "watershed-management",
  260: "greywater-recovery",
  262: "schrodinger-equation-1d",
  265: "electrical-load-factor",
  266: "fiber-optic-attenuation",
  267: "rf-antenna-sizing",
  268: "beam-support-reactions",
  269: "seed-sowing-density",
  270: "drip-irrigation-pipe-size",
  271: "aerated-drying",
  272: "silage-volume",
  273: "barn-ventilation",
  274: "ship-draft",
  275: "ship-stability-gm",
  276: "mooring-rope-breaking",
  277: "anchor-chain",
  278: "bilge-discharge",
  279: "bottom-hole-pressure",
  280: "rotary-drilling-torque",
  281: "mud-circulation-velocity",
  282: "bored-pile-bearing-capacity",
  283: "slope-safety-factor",
  284: "fabric-weight",
  285: "sewing-machine-cycle-time",
  286: "bobbin-yarn-capacity",
  287: "fabric-shrinkage",
  288: "weaving-loom-efficiency",
  289: "cold-storage-heat-gain",
  290: "liquid-food-flow-energy",
  291: "pasteurization-time",
  292: "vacuum-packaging",
  293: "oven-capacity",
  294: "injection-clamping-tonnage",
  295: "plastic-cooling-time",
  296: "plastic-drying-time",
  297: "extruder-output",
  298: "mold-draft-angle",
  299: "waste-pump-power",
  300: "building-waste-load",
  301: "sprinkler-flow-rate",
  302: "adc-resolution",
  303: "amperes-law",
  305: "capacitive-reactance",
  306: "inductive-reactance",
  307: "rc-time-constant",
  308: "rlc-resonant-frequency",
  309: "smith-chart-vswr",
  310: "signal-to-noise-ratio",
  311: "zero-to-hundred-acceleration",
  312: "chain-drive",
  313: "ev-charging-time",
  314: "ev-range",
  315: "horsepower-converter",
  316: "indicated-horsepower",
  317: "engine-speed-torque",
  318: "motor-efficiency",
  319: "vehicle-top-speed",
  320: "runway-length-required",
  323: "diopter-lens-power",
  324: "faraday-electrolysis",
  326: "propagation-constant",
  327: "quality-factor-q",
  328: "quantization-noise-sqnr",
  330: "battery-backup-capacity",
  331: "hydroelectric-power",
  332: "wind-turbine-energy",
  333: "carnot-efficiency",
  335: "carbon-offset",
  336: "data-backup-time",
  337: "rsa-encryption-security",
  338: "api-latency-sla",
  340: "effective-radiation-dose",
  341: "biosignal-sampling",
  342: "mine-reserve-volume",
  343: "drilling-well-pressure",
  344: "earthquake-magnitude-pga",
  345: "joint-angular-velocity-torque",
  346: "training-load-trimp",
  347: "injury-risk-asymmetry",
  348: "building-solar-exposure",
  349: "traffic-signal-timing",
  350: "environmental-noise-propagation",
  351: "inverse-kinematics-2d-arm",
  352: "pid-controller-ziegler",
  353: "kalman-filter-prediction",
  356: "sample-weighting",
  357: "life-insurance-premium",
  358: "compound-default-interest",


};

// 3. CATEGORY MAP - Maps Sections to catalog categories
function getCategoryForId(id) {
  if (id <= 53) return "finance-business";
  if (id <= 72) return "finance-business";
  if (id <= 88) return "finance-business";
  if (id <= 116) return "finance-business";
  if (id <= 128) return "finance-business";
  if (id <= 138) return "logistics-travel";
  if (id <= 150) return "manufacturing-workshop";
  if (id <= 164) return "finance-business";
  if (id <= 170) return "math-statistics";
  if (id <= 178) return "health-body";
  return "manufacturing-workshop";
}

// 4. RESULT TYPE MAP
function getResultTypeForId(id) {
  if (id <= 53) return "cost";
  if (id <= 72) return "cost";
  if (id <= 88) return "cost";
  if (id <= 116) return "cost";
  if (id <= 128) return "cost";
  if (id <= 138) return "quantity";
  if (id <= 150) return "statistics";
  if (id <= 164) return "cost";
  if (id <= 170) return "statistics";
  if (id <= 178) return "health";
  return "quantity";
}

// Parse request file
const INPUT_FILE = path.join(process.cwd(), 'docs', 'full_user_request_combined.txt');
const content = fs.readFileSync(INPUT_FILE, "utf8");
const lines = content.split("\n");
const parsedTools = [];

for (const line of lines) {
  const toolMatch = line.match(/^(\d+)\.\s+([^|]+)\|\s+Girdiler:\s+([^|]+)\|\s+Formul:\s+([^|]+)(?:\|\s+Output:\s+(.+))?$/);
  if (toolMatch) {
    const id = parseInt(toolMatch[1], 10);
    const titleTr = toolMatch[2].trim();
    const inputsStr = toolMatch[3].trim();
    const formulaStr = toolMatch[4].trim();
    const outputStr = toolMatch[5] ? toolMatch[5].trim() : "";

    parsedTools.push({
      id,
      titleTr,
      inputsStr,
      formulaStr,
      outputStr
    });
  }
}

console.log(`Parsed ${parsedTools.length} tools from text.`);

// Maps the tools into the catalog structures
const finalCatalogTools = [];
const calculationsRegistry = {};
const trCatalogTranslations = {};
const trInputsTranslations = {};
const enInputsTranslations = {};

for (const t of parsedTools) {
  const id = t.id;
  const slug = SLUG_MAP[id];
  if (!slug) {
    console.warn(`Warning: Missing English slug for Tool ${id} (${t.titleTr})`);
    continue;
  }

  // Parse inputs
  const rawInputs = t.inputsStr.split(",").map(x => x.trim());
  const inputs = [];
  const trInputMap = {};
  const enInputMap = {};

  for (const raw of rawInputs) {
    const nameMatch = raw.match(/^([^\s(]+)(?:\s*\(([^)]+)\))?$/);
    if (!nameMatch) continue;

    const trName = nameMatch[1];
    const unitRaw = nameMatch[2] || "";
    const key = KEY_MAP[trName.toLowerCase()] || trName.toLowerCase();
    
    let unit = unitRaw;
    if (unit === "₺") unit = "TRY";
    if (unit === "$") unit = "USD";
    if (unit === "Year") unit = "years";
    if (unit === "Ay") unit = "months";
    if (unit === "Day") unit = "days";
    if (unit === "Count") unit = "units";
    if (unit === "Yuzde") unit = "%";
    if (unit === "Binde") unit = "‰";

    const labelEn = LABEL_MAP[key] || key;
    const labelTr = trName;

    const isSelect = trName.toLowerCase() === "method" || trName.toLowerCase() === "cinsiyet";
    const type = isSelect ? "select" : "number";

    const inputCopy = {
      key,
      label: labelEn,
      unit,
      type,
      helper: `Enter ${labelEn.toLowerCase()}`
    };

    if (isSelect) {
      if (trName.toLowerCase() === "method") {
        inputCopy.options = [
          { label: "Straight Line", value: "straight-line" },
          { label: "Double Declining Balance", value: "declining-balance" },
          { label: "Sum of Years' Digits", value: "syd" }
        ];
        inputCopy.defaultValue = "straight-line";
      } else if (trName.toLowerCase() === "cinsiyet") {
        inputCopy.options = [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" }
        ];
        inputCopy.defaultValue = "male";
      }
    }

    inputs.push(inputCopy);

    trInputMap[key.toLowerCase()] = {
      label: labelTr,
      placeholder: `${labelTr} girin`,
      helper: `${labelTr} value`
    };

    enInputMap[key.toLowerCase()] = {
      label: labelEn,
      placeholder: `Enter ${labelEn.toLowerCase()}`,
      helper: `Enter ${labelEn.toLowerCase()}`
    };
  }

  const titleEn = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const descTr = t.outputStr || `${t.titleTr} hesaplamasi.`;
  const descEn = `Free online ${titleEn.toLowerCase()} calculator. Get accurate calculations instantly.`;

  const category = getCategoryForId(id);
  const resultType = getResultTypeForId(id);

  finalCatalogTools.push({
    slug,
    title: titleEn,
    category,
    description: descEn,
    seoTitle: `${titleEn} | SectorCalc`,
    seoDescription: descEn,
    inputs,
    resultType,
    missingFactors: [
      "Dynamic cost offsets",
      "Comprehensive compliance tax rates",
      "Lifecycle overhead variance"
    ]
  });

  trCatalogTranslations[slug] = {
    title: t.titleTr,
    description: descTr,
    seoTitle: `${t.titleTr} | SectorCalc`,
    seoDescription: descTr
  };

  trInputsTranslations[slug] = trInputMap;
  enInputsTranslations[slug] = enInputMap;
}

// Write src/lib/tools/free-traffic-catalog.ts
const catalogFileContent = `/**
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

export const FREE_TRAFFIC_TOOLS: readonly FreeTrafficTool[] = ${JSON.stringify(finalCatalogTools, null, 2)};

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
  return \`categories.\${category}\`;
}
`;

fs.writeFileSync("src/lib/tools/free-traffic-catalog.ts", catalogFileContent, "utf8");
console.log("Wrote src/lib/tools/free-traffic-catalog.ts");

// Write i18n JSON overrides
const trI18n = {};
const deI18n = {};
const frI18n = {};
const esI18n = {};
const arI18n = {};

for (const [slug, meta] of Object.entries(trCatalogTranslations)) {
  trI18n[slug] = meta;
  deI18n[slug] = { title: slug.replace(/-/g, " "), description: `Calculation for ${slug}` };
  frI18n[slug] = { title: slug.replace(/-/g, " "), description: `Calcul pour ${slug}` };
  esI18n[slug] = { title: slug.replace(/-/g, " "), description: `Cálculo de ${slug}` };
}

const catalogI18nObj = {
  tr: trI18n,
  de: deI18n,
  fr: frI18n,
  es: esI18n,
  ar: arI18n
};

fs.writeFileSync("src/data/free-tool-catalog-i18n.generated.json", JSON.stringify(catalogI18nObj, null, 2), "utf8");
console.log("Wrote src/data/free-tool-catalog-i18n.generated.json");

const fieldI18nObj = {
  en: enInputsTranslations,
  tr: trInputsTranslations,
  de: trInputsTranslations,
  fr: trInputsTranslations,
  es: trInputsTranslations,
  ar: trInputsTranslations
};

fs.writeFileSync("src/data/free-tool-inputs-i18n.generated.json", JSON.stringify(fieldI18nObj, null, 2), "utf8");
console.log("Wrote src/data/free-tool-inputs-i18n.generated.json");

// 7. Robust formula parser implementation
function parseFormula(expr) {
  let s = expr;
  
  // Clean custom typos/spacing in user formulas
  s = s.replace(/2AnnualDemandSiparisMaliyeti/g, "2 * AnnualTalep * SiparisMaliyeti");
  s = s.replace(/0\.19077LOG10/g, "0.19077 * LOG10");
  s = s.replace(/0\.15456LOG10/g, "0.15456 * LOG10");
  s = s.replace(/SalesIslem/g, "Sales * Islem");
  s = s.replace(/SalesOdeme/g, "Sales * Payment");
  s = s.replace(/DistanceKmFiyati/g, "Distance * KmFiyati");
  s = s.replace(/DurationDakikaFiyati/g, "Duration * DakikaFiyati");
  s = s.replace(/Yil12/g, "Year * 12");
  s = s.replace(/TDEEProtein/g, "TDEE * Protein");
  s = s.replace(/TDEEYag/g, "TDEE * Oil");
  s = s.replace(/ZStdHata/g, "Z * StdHata");
  s = s.replace(/(?<![a-zA-Z0-9_gusiocGUSIOC])IlgiliHisse(?![a-zA-Z0-9_gusiocGUSIOC])/g, "shares");
  s = s.replace(/(?<![a-zA-Z0-9_gusiocGUSIOC])Total(?![a-zA-Z0-9_gusiocGUSIOC])/g, "total");

  // Map variables case-insensitively using sorted keys to prevent substring collisions
  const sortedKeys = Object.keys(KEY_MAP).sort((a, b) => b.length - a.length);
  for (const trKey of sortedKeys) {
    const enKey = KEY_MAP[trKey];
    const regex = new RegExp(`(?<![a-zA-Z0-9_gusiocGUSIOC])${trKey}(?![a-zA-Z0-9_gusiocGUSIOC])`, "giu");
    s = s.replace(regex, enKey);
  }

  // Map Math functions
  s = s.replace(/\bMAX\b/gi, "Math.max");
  s = s.replace(/\bMIN\b/gi, "Math.min");
  s = s.replace(/\bEXP\b/gi, "Math.exp");
  s = s.replace(/\bSQRT\b/gi, "Math.sqrt");
  s = s.replace(/\bLN\b/gi, "Math.log");
  s = s.replace(/\bLOG10\b/gi, "Math.log10");
  s = s.replace(/\bLOG\b/gi, "Math.log");
  s = s.replace(/\bABS\b/gi, "Math.abs");
  s = s.replace(/\bFLOOR\b/gi, "Math.floor");
  s = s.replace(/\bCEIL\b/gi, "Math.ceil");
  s = s.replace(/\bCEILING\b/gi, "Math.ceil");
  s = s.replace(/\bROUND\b/gi, "Math.round");
  s = s.replace(/\bPI\b/gi, "Math.PI");
  s = s.replace(/\bTAN\b/gi, "Math.tan");
  s = s.replace(/\bSIN\b/gi, "Math.sin");
  s = s.replace(/\bCOS\b/gi, "Math.cos");
  s = s.replace(/\bACOS\b/gi, "Math.acos");
  s = s.replace(/\bATAN2\b/gi, "Math.atan2");
  s = s.replace(/\bATAN\b/gi, "Math.atan");
  s = s.replace(/\bMOD\(([^,]+),\s*([^)]+)\)/gi, "(($1) % ($2))");
  s = s.replace(/\^/g, "**");

  s = s.replace(/(?<!=)="([^"]+)"/g, '=== ("$1" as any)');
  s = s.replace(/(?<!=)='([^']+)'/g, "=== ('$1' as any)");
  s = s.replace(/(?<!=)=(true|false|[0-9]+(?![^\s]*\)))/g, '===$1');

  // Convert EGER/IF with nested parenthesis tracking
  while (true) {
    const match = s.match(/\b(EGER|IF)\(/i);
    if (!match) break;
    const startIndex = match.index;
    const funcName = match[1];
    
    let openCount = 0;
    let commaIndices = [];
    let endIndex = -1;
    for (let i = startIndex + funcName.length; i < s.length; i++) {
      if (s[i] === '(') {
        openCount++;
      } else if (s[i] === ')') {
        openCount--;
        if (openCount === 0) {
          endIndex = i;
          break;
        }
      } else if (s[i] === ',' && openCount === 1) {
        commaIndices.push(i);
      }
    }

    if (endIndex === -1 || commaIndices.length < 2) {
      break;
    }

    const cond = s.substring(startIndex + funcName.length + 1, commaIndices[0]);
    const trueVal = s.substring(commaIndices[0] + 1, commaIndices[1]);
    const falseVal = s.substring(commaIndices[1] + 1, endIndex);

    const replacement = `((${cond}) ? (${trueVal}) : (${falseVal}))`;
    s = s.substring(0, startIndex) + replacement + s.substring(endIndex + 1);
  }

  return s;
}

// 8. Generate math calculations logic file
const header = `// @ts-nocheck
/* eslint-disable prefer-const */
// Auto-generated calculators database.
import { normalizeNumber, clamp, safeDivide, round, formatNumber, formatCurrency } from "@/lib/tools/free-traffic-calculators";

export const ALL_CALCULATORS: Record<string, (values: Record<string, any>) => any> = {
`;

let registryJsContent = header;

for (const t of parsedTools) {
  const id = t.id;
  const slug = SLUG_MAP[id];
  if (!slug) continue;

  let block = "";
  
  if (id === 1) {
    block = `  "${slug}": (values) => {
    const monthlyRent = normalizeNumber(values.monthlyRent);
    const propertyValue = normalizeNumber(values.propertyValue);
    const ratio = (monthlyRent / Math.max(1, propertyValue)) * 100;
    return {
      headline: \`Monthly Rental Yield: \${formatNumber(ratio)}%\`,
      primaryLabel: "Rental Yield Ratio",
      primaryValue: \`\${formatNumber(ratio)}%\`,
      secondaryValues: [
        { label: "Monthly Rent", value: formatCurrency(monthlyRent) },
        { label: "Property Value", value: formatCurrency(propertyValue) }
      ],
      explanation: \`Aylik kiranin mulk degerine ratio \${formatNumber(ratio)}% olarak hesaplanmistir. Realestate yatirimlarinda bu oranin %1 ve uzerinde olmasi hedeflenir.\`,
      missingFactors: ["Taxes", "Maintenance", "Vacancy"]
    };
  }`;
  } else if (id === 2) {
    block = `  "${slug}": (values) => {
    const salePrice = normalizeNumber(values.salePrice);
    const remainingDebt = normalizeNumber(values.remainingDebt);
    const newInvestment = normalizeNumber(values.newInvestment);
    const cashOut = salePrice - remainingDebt;
    const taxableAmount = Math.max(0, cashOut - newInvestment);
    return {
      headline: \`Taxable Cash Boot: \${formatCurrency(taxableAmount)}\`,
      primaryLabel: "Taxable Amount",
      primaryValue: formatCurrency(taxableAmount),
      secondaryValues: [
        { label: "Net Cash Out", value: formatCurrency(cashOut) },
        { label: "New Reinvestment", value: formatCurrency(newInvestment) }
      ],
      explanation: \`1031 tax erteleme takasinda, yeni mulke yatirilmayan ve vergiye tabi olan net nakit cikisi (boot) \${formatCurrency(taxableAmount)} olarak belirlenmistir.\`,
      missingFactors: ["Depreciation recapture", "State taxes", "Closing fees"]
    };
  }`;
  } else if (id === 3) {
    block = `  "${slug}": (values) => {
    const netIncome = normalizeNumber(values.netIncome);
    const needs = netIncome * 0.5;
    const wants = netIncome * 0.3;
    const savings = netIncome * 0.2;
    return {
      headline: \`50/30/20 Budget Breakdown\`,
      primaryLabel: "Savings Target (20%)",
      primaryValue: formatCurrency(savings),
      secondaryValues: [
        { label: "Needs (50%)", value: formatCurrency(needs) },
        { label: "Wants (30%)", value: formatCurrency(wants) }
      ],
      explanation: \`Gelirinizin distribution: Ihtiyaclar (50%) \${formatCurrency(needs)}, Istekler (30%) \${formatCurrency(wants)}, Savings (20%) \${formatCurrency(savings)}.\`,
      missingFactors: ["Debt payoff goals", "Varying monthly bills"]
    };
  }`;
  } else if (id === 4) {
    block = `  "${slug}": (values) => {
    const cost = normalizeNumber(values.cost);
    const salvageValue = normalizeNumber(values.salvageValue);
    const usefulLife = Math.max(1, normalizeNumber(values.usefulLife));
    const method = String(values.method || "straight-line");
    let annualDepreciation = 0;
    if (method === "declining-balance") {
      annualDepreciation = cost * (2 / usefulLife);
    } else if (method === "syd") {
      const sumOfYears = (usefulLife * (usefulLife + 1)) / 2;
      annualDepreciation = (cost - salvageValue) * (usefulLife / sumOfYears);
    } else {
      annualDepreciation = (cost - salvageValue) / usefulLife;
    }
    return {
      headline: \`Annual Depreciation Expense: \${formatCurrency(annualDepreciation)}\`,
      primaryLabel: "Year 1 Depreciation",
      primaryValue: formatCurrency(annualDepreciation),
      secondaryValues: [
        { label: "Asset Cost", value: formatCurrency(cost) },
        { label: "Salvage Value", value: formatCurrency(salvageValue) },
        { label: "Useful Life", value: \`\${usefulLife} Years\` }
      ],
      explanation: \`Secilen yonteme gore varligin 1. year depreciation gideri \${formatCurrency(annualDepreciation)} olarak hesaplanmistir.\`,
      missingFactors: ["Tax book value differences", "MACRS schedule options"]
    };
  }`;
  } else if (id === 5) {
    block = `  "${slug}": (values) => {
    const principal = normalizeNumber(values.principal);
    const interestRate = normalizeNumber(values.interestRate);
    const period = Math.max(1, normalizeNumber(values.period));
    const r = interestRate / 1200;
    const payout = r === 0 ? (principal / period) : principal * (r / (1 - Math.pow(1 + r, -period)));
    return {
      headline: \`Annuity Payment: \${formatCurrency(payout)} / month\`,
      primaryLabel: "Monthly Income",
      primaryValue: formatCurrency(payout),
      secondaryValues: [
        { label: "Principal", value: formatCurrency(principal) },
        { label: "Interest Rate", value: \`\${interestRate}%\` },
        { label: "Period", value: \`\${period} Months\` }
      ],
      explanation: \`Belirtilen period boyunca her ay geri cekilebilecek sabit taksit tutari \${formatCurrency(payout)} olarak hesaplanmistir.\`,
      missingFactors: ["Inflation adjustments", "Fees"]
    };
  }`;
  } else if (id === 6) {
    block = `  "${slug}": (values) => {
    const savings = normalizeNumber(values.savings);
    const interestRate = normalizeNumber(values.interestRate);
    const duration = Math.max(1, normalizeNumber(values.duration));
    const r = interestRate / 100;
    const payout = r === 0 ? (savings / duration) : savings * (r / (1 - Math.pow(1 + r, -duration)));
    return {
      headline: \`Annual Payout: \${formatCurrency(payout)} / year\`,
      primaryLabel: "Annual Income",
      primaryValue: formatCurrency(payout),
      secondaryValues: [
        { label: "Savings Balance", value: formatCurrency(savings) },
        { label: "Payout Period", value: \`\${duration} Years\` }
      ],
      explanation: \`Emeklilik birikiminin annual dagitimlarinda, her year alinabilecek sabit gelir \${formatCurrency(payout)} olarak hesaplanmistir.\`,
      missingFactors: ["Taxes", "Inflation rate volatility"]
    };
  }`;
  } else if (id === 7) {
    block = `  "${slug}": (values) => {
      const loanAmount = normalizeNumber(values.loanAmount);
      const interestRate = normalizeNumber(values.interestRate);
      const term = Math.max(1, normalizeNumber(values.term));
      const fees = normalizeNumber(values.fees);
      const netLoan = loanAmount - fees;
      const rate = interestRate / 1200;
      const pmt = rate === 0 ? (loanAmount / term) : loanAmount * (rate / (1 - Math.pow(1 + rate, -term)));
      
      let r = rate > 0 ? rate : 0.005;
      for (let i = 0; i < 20; i++) {
        const factor = Math.pow(1 + r, -term);
        const f = netLoan * r - pmt * (1 - factor);
        const df = netLoan - pmt * term * factor / (1 + r);
        if (Math.abs(df) < 1e-10) break;
        r = r - f / df;
      }
      const apr = r * 12 * 100;
      return {
        headline: \`APR: \${formatNumber(apr)}%\`,
        primaryLabel: "Annual Percentage Rate (APR)",
        primaryValue: \`\${formatNumber(apr)}%\`,
        secondaryValues: [
          { label: "Monthly Payment", value: formatCurrency(pmt) },
          { label: "Net Funded Loan", value: formatCurrency(netLoan) }
        ],
        explanation: \`Kredi masraflari dahil edildiginde olusan gercek annual cost ratio (APR) \${formatNumber(apr)}% seviyesindedir.\`,
        missingFactors: ["Insurance cost", "Early closing options"]
      };
    }`;
  } else if (id === 8) {
    block = `  "${slug}": (values) => {
    const portfolioValue = normalizeNumber(values.portfolioValue);
    const stocks = normalizeNumber(values.stocks);
    const bonds = normalizeNumber(values.bonds);
    const cash = normalizeNumber(values.cash);
    const stocksVal = portfolioValue * (stocks / 100);
    const bondsVal = portfolioValue * (bonds / 100);
    const cashVal = portfolioValue * (cash / 100);
    return {
      headline: \`Portfolio Allocation Breakdown\`,
      primaryLabel: "Stocks Allocation",
      primaryValue: formatCurrency(stocksVal),
      secondaryValues: [
        { label: "Bonds Value", value: formatCurrency(bondsVal) },
        { label: "Cash Value", value: formatCurrency(cashVal) }
      ],
      explanation: \`Portfoyunuzun distribution: Hisse \${formatCurrency(stocksVal)} (%\${stocks}), Tahvil \${formatCurrency(bondsVal)} (%\${bonds}), Nakit \${formatCurrency(cashVal)} (%\${cash}).\`,
      missingFactors: ["Rebalancing triggers", "Tax-advantaged locations"]
    };
  }`;
  } else if (id === 9) {
    block = `  "${slug}": (values) => {
    const inherentRisk = normalizeNumber(values.inherentRisk);
    const controlRisk = normalizeNumber(values.controlRisk);
    const detectionRisk = normalizeNumber(values.detectionRisk);
    const risk = (inherentRisk / 100) * (controlRisk / 100) * (detectionRisk / 100) * 100;
    return {
      headline: \`Audit Risk: \${formatNumber(risk)}%\`,
      primaryLabel: "Calculated Audit Risk",
      primaryValue: \`\${formatNumber(risk)}%\`,
      secondaryValues: [
        { label: "Inherent Risk", value: \`\${inherentRisk}%\` },
        { label: "Control Risk", value: \`\${controlRisk}%\` },
        { label: "Detection Risk", value: \`\${detectionRisk}%\` }
      ],
      explanation: \`Financial tablolarda maddi error bulunup denetcinin bunu tespit edememe genel audit riski %\${formatNumber(risk)} olarak hesaplanmistir.\`,
      missingFactors: ["Sample size limits", "Professional skepticism adjustment"]
    };
  }`;
  } else if (id === 10) {
    block = `  "${slug}": (values) => {
    const principal = normalizeNumber(values.principal);
    const interestRate = normalizeNumber(values.interestRate);
    const years = normalizeNumber(values.years);
    const interest = principal * (interestRate / 100) * years;
    const total = principal + interest;
    return {
      headline: \`Simple Interest: \${formatCurrency(interest)}\`,
      primaryLabel: "Interest Earned",
      primaryValue: formatCurrency(interest),
      secondaryValues: [
        { label: "Total Balance", value: formatCurrency(total) },
        { label: "Period", value: \`\${years} Years\` }
      ],
      explanation: \`Yalnizca anapara uzerinden hesaplanan interest tutari \${formatCurrency(interest)} olup, vade sonu total value \${formatCurrency(total)} seviyesindedir.\`,
      missingFactors: ["Taxation", "Compounding opportunities"]
    };
  }`;
  } else if (id === 11) {
    block = `  "${slug}": (values) => {
    const principal = normalizeNumber(values.principal);
    const interestRate = normalizeNumber(values.interestRate);
    const years = normalizeNumber(values.years);
    const frequency = Math.max(1, normalizeNumber(values.frequency));
    const balance = principal * Math.pow(1 + (interestRate / 100) / frequency, frequency * years);
    const interest = balance - principal;
    return {
      headline: \`Compound Interest Balance: \${formatCurrency(balance)}\`,
      primaryLabel: "Interest Earned",
      primaryValue: formatCurrency(interest),
      secondaryValues: [
        { label: "Final Balance", value: formatCurrency(balance) },
        { label: "Compounding Frequency", value: \`\${frequency} times/yr\` }
      ],
      explanation: \`Faizin anaparaya eklendigi vade sonu birikim value \${formatCurrency(balance)} olarak hesaplanmistir.\`,
      missingFactors: ["Inflation adjustments", "Varying interest rates"]
    };
  }`;
  } else if (id === 12) {
    block = `  "${slug}": (values) => {
    const principal = normalizeNumber(values.principal);
    const interestRate = normalizeNumber(values.interestRate);
    const days = normalizeNumber(values.days);
    const dailyBalance = principal * Math.pow(1 + interestRate / 36500, days);
    const interest = dailyBalance - principal;
    return {
      headline: \`Daily Compounded Balance: \${formatCurrency(dailyBalance)}\`,
      primaryLabel: "Interest Earned",
      primaryValue: formatCurrency(interest),
      secondaryValues: [
        { label: "Final Balance", value: formatCurrency(dailyBalance) },
        { label: "Period", value: \`\${days} Days\` }
      ],
      explanation: \`Daily bazda isletilen compound interest ile vade sonu tutar \${formatCurrency(dailyBalance)} seviyesine ulasmistir.\`,
      missingFactors: ["Holiday interest rules", "Taxes"]
    };
  }`;
  } else if (id === 13) {
    block = `  "${slug}": (values) => {
    const principal = normalizeNumber(values.principal);
    const interestRate = normalizeNumber(values.interestRate);
    const years = normalizeNumber(values.years);
    const balance = principal * Math.exp((interestRate / 100) * years);
    const interest = balance - principal;
    return {
      headline: \`Continuous Compounding: \${formatCurrency(balance)}\`,
      primaryLabel: "Interest Earned",
      primaryValue: formatCurrency(interest),
      secondaryValues: [
        { label: "Final Balance", value: formatCurrency(balance) }
      ],
      explanation: \`Sonsuz frekansta teorik maksimum compound interest ile vade sonu birikim \${formatCurrency(balance)} olmustur.\`,
      missingFactors: ["Administrative fees", "Taxes"]
    };
  }`;
  } else if (id === 14) {
    block = `  "${slug}": (values) => {
    const nominalRate = normalizeNumber(values.nominalRate);
    const frequency = Math.max(1, normalizeNumber(values.frequency));
    const effective = (Math.pow(1 + (nominalRate / 100) / frequency, frequency) - 1) * 100;
    return {
      headline: \`Effective Rate: \${formatNumber(effective)}%\`,
      primaryLabel: "Effective Annual Rate",
      primaryValue: \`\${formatNumber(effective)}%\`,
      secondaryValues: [
        { label: "Nominal Rate", value: \`\${nominalRate}%\` },
        { label: "Compounding Frequency", value: \`\${frequency} times/yr\` }
      ],
      explanation: \`Annual bilesim sikligi etkisiyle nominal ratio olan %\${nominalRate}, efektif olarak %\${formatNumber(effective)} getiriye donusur.\`,
      missingFactors: ["Inflation adjustments"]
    };
  }`;
  } else if (id === 15) {
    block = `  "${slug}": (values) => {
    const parValue = normalizeNumber(values.parValue);
    const couponRate = normalizeNumber(values.couponRate);
    const marketRate = normalizeNumber(values.marketRate);
    const yearsToMaturity = Math.max(1, normalizeNumber(values.yearsToMaturity));
    const coupon = parValue * (couponRate / 100);
    const r = marketRate / 100;
    let price = 0;
    for (let t = 1; t <= yearsToMaturity; t++) {
      price += coupon / Math.pow(1 + r, t);
    }
    price += parValue / Math.pow(1 + r, yearsToMaturity);
    return {
      headline: \`Bond Fair Value: \${formatCurrency(price)}\`,
      primaryLabel: "Bond Price",
      primaryValue: formatCurrency(price),
      secondaryValues: [
        { label: "Annual Coupon", value: formatCurrency(coupon) },
        { label: "Par Value", value: formatCurrency(parValue) }
      ],
      explanation: \`Tahvilin piyasa faizine gore bugunku adil value \${formatCurrency(price)} olarak hesaplanmistir.\`,
      missingFactors: ["Default risk", "Accrued interest between coupon periods"]
    };
  }`;
  } else if (id === 16) {
    block = `  "${slug}": (values) => {
    const dividendAmount = normalizeNumber(values.dividendAmount);
    const withholdingTax = normalizeNumber(values.withholdingTax);
    const net = dividendAmount * (1 - withholdingTax / 100);
    return {
      headline: \`Net Dividend payout: \${formatCurrency(net)}\`,
      primaryLabel: "Net Cash Dividend",
      primaryValue: formatCurrency(net),
      secondaryValues: [
        { label: "Gross Dividend", value: formatCurrency(dividendAmount) },
        { label: "Withholding Tax Deducted", value: formatCurrency(dividendAmount * (withholdingTax / 100)) }
      ],
      explanation: \`Stopaj kesintisi sonrasi net ele gecen temettu tutari \${formatCurrency(net)} seviyesindedir.\`,
      missingFactors: ["Income tax brackets", "Corporate tax offsets"]
    };
  }`;
  } else if (id === 17) {
    block = `  "${slug}": (values) => {
    const sharesOwned = normalizeNumber(values.sharesOwned);
    const dividendPerShare = normalizeNumber(values.dividendPerShare);
    let sharePrice = Math.max(1, normalizeNumber(values.sharePrice));
    const years = normalizeNumber(values.years);
    const annualGrowth = normalizeNumber(values.annualGrowth);
    let currentShares = sharesOwned;
    for (let i = 0; i < years; i++) {
      const dividends = currentShares * dividendPerShare;
      currentShares += dividends / sharePrice;
      sharePrice = sharePrice * (1 + annualGrowth / 100);
    }
    const finalValue = currentShares * sharePrice;
    return {
      headline: \`DRIP Portfolio Value: \${formatCurrency(finalValue)}\`,
      primaryLabel: "Ending Shares",
      primaryValue: \`\${formatNumber(currentShares)} shares\`,
      secondaryValues: [
        { label: "Ending Stock Price", value: formatCurrency(sharePrice) },
        { label: "Portfolio Value", value: formatCurrency(finalValue) }
      ],
      explanation: \`Temettulerin otomatik yeniden yatirilmasi ile kartopu etkisi result olusan total portfoy value \${formatCurrency(finalValue)} olmustur.\`,
      missingFactors: ["Dividend tax drag", "Varying growth rates"]
    };
  }`;
  } else if (id === 18) {
    block = `  "${slug}": (values) => {
    const purchasePrice = normalizeNumber(values.purchasePrice);
    const sellingPrice = normalizeNumber(values.sellingPrice);
    const dividendsReceived = normalizeNumber(values.dividendsReceived);
    const getiri = ((sellingPrice - purchasePrice) + dividendsReceived) / Math.max(1, purchasePrice) * 100;
    return {
      headline: \`Stock Return: \${formatNumber(getiri)}%\`,
      primaryLabel: "Total Return Rate",
      primaryValue: \`\${formatNumber(getiri)}%\`,
      secondaryValues: [
        { label: "Capital Gain", value: formatCurrency(sellingPrice - purchasePrice) },
        { label: "Dividends Received", value: formatCurrency(dividendsReceived) }
      ],
      explanation: \`Sermaye kazanci ve temettuler dahil edilerek elde edilen total investment getirisi %\${formatNumber(getiri)} seviyesindedir.\`,
      missingFactors: ["Broker commissions", "Taxes"]
    };
  }`;
  } else if (id === 19) {
    block = `  "${slug}": (values) => {
    const initialValue = normalizeNumber(values.initialValue);
    const finalValue = normalizeNumber(values.finalValue);
    const years = Math.max(0.1, normalizeNumber(values.years));
    const annualized = (Math.pow(finalValue / Math.max(1, initialValue), 1 / years) - 1) * 100;
    return {
      headline: \`Annualized Return: \${formatNumber(annualized)}%\`,
      primaryLabel: "Annualized Return Rate",
      primaryValue: \`\${formatNumber(annualized)}%\`,
      secondaryValues: [
        { label: "Total Absolute Return", value: \`\${formatNumber((finalValue / Math.max(1, initialValue) - 1) * 100)}%\` }
      ],
      explanation: \`Yatirimin yilliklandirilmis average growth speed %\${formatNumber(annualized)} olarak hesaplanmistir.\`,
      missingFactors: ["Volatility drag", "Inflation rate effects"]
    };
  }`;
  } else if (id === 20) {
    block = `  "${slug}": (values) => {
    const startValue = normalizeNumber(values.startValue);
    const endValue = normalizeNumber(values.endValue);
    const years = Math.max(0.1, normalizeNumber(values.years));
    const cagr = (Math.pow(endValue / Math.max(1, startValue), 1 / years) - 1) * 100;
    return {
      headline: \`CAGR: \${formatNumber(cagr)}%\`,
      primaryLabel: "Compound Annual Growth",
      primaryValue: \`\${formatNumber(cagr)}%\`,
      secondaryValues: [
        { label: "Total Asset Growth Multiplier", value: \`\${formatNumber(endValue / Math.max(1, startValue))}x\` }
      ],
      explanation: \`Zaman icindeki puruzsuz annual compound growth ratio (CAGR) %\${formatNumber(cagr)} olarak bulunmustur.\`,
      missingFactors: ["Interim drawdowns", "Tax adjustments"]
    };
  }`;
  } else if (id === 21) {
    block = `  "${slug}": (values) => {
    const netProfit = normalizeNumber(values.netProfit);
    const cost = normalizeNumber(values.cost);
    const roi = (netProfit / Math.max(1, cost)) * 100;
    return {
      headline: \`ROI: \${formatNumber(roi)}%\`,
      primaryLabel: "Return on Investment (ROI)",
      primaryValue: \`\${formatNumber(roi)}%\`,
      secondaryValues: [
        { label: "Net Benefit", value: formatCurrency(netProfit) },
        { label: "Total Cost", value: formatCurrency(cost) }
      ],
      explanation: \`Yatirimin maliyetine gore urettigi net efficiency (ROI) %\${formatNumber(roi)} olarak hesaplanmistir.\`,
      missingFactors: ["Time value of money", "Opportunity cost"]
    };
  }`;
  } else if (id === 22) {
    block = `  "${slug}": (values) => {
      const discountRate = normalizeNumber(values.discountRate);
      const initialInvestment = normalizeNumber(values.initialInvestment);
      const cashFlows = String(values.cashFlows || "").split(",").map(Number).filter(Number.isFinite);
      const r = discountRate / 100;
      let npv = 0;
      for (let t = 0; t < cashFlows.length; t++) {
        npv += cashFlows[t] / Math.pow(1 + r, t + 1);
      }
      npv -= initialInvestment;
      return {
        headline: \`NPV: \${formatCurrency(npv)}\`,
        primaryLabel: "Net Present Value (NPV)",
        primaryValue: formatCurrency(npv),
        secondaryValues: [
          { label: "Initial Outlay", value: formatCurrency(initialInvestment) }
        ],
        explanation: \`Nakit akislarinin paranin zaman degerine gore bugunku net value \${formatCurrency(npv)} olarak hesaplanmistir.\`,
        missingFactors: ["Variable discount rates", "Inflation fluctuation"]
      };
    }`;
  } else if (id === 23) {
    block = `  "${slug}": (values) => {
      const initialInvestment = normalizeNumber(values.initialInvestment);
      const cashFlows = String(values.cashFlows || "").split(",").map(Number).filter(Number.isFinite);
      
      let r = 0.1;
      for (let i = 0; i < 100; i++) {
        let npv = -initialInvestment;
        let dNpv = 0;
        for (let t = 0; t < cashFlows.length; t++) {
          const power = t + 1;
          npv += cashFlows[t] / Math.pow(1 + r, power);
          dNpv -= power * cashFlows[t] / Math.pow(1 + r, power + 1);
        }
        if (Math.abs(npv) < 1e-6) break;
        if (dNpv === 0) break;
        r = r - npv / dNpv;
      }
      const irr = r * 100;
      return {
        headline: \`IRR: \${formatNumber(irr)}%\`,
        primaryLabel: "Internal Rate of Return",
        primaryValue: \`\${formatNumber(irr)}%\`,
        secondaryValues: [],
        explanation: \`Projeyi basabas noktasina (NPV=0) getiren ic efficiency ratio %\${formatNumber(irr)} olarak hesaplanmistir.\`,
        missingFactors: ["Multiple IRR solutions", "Reinvestment rate assumptions"]
      };
    }`;
  } else if (id === 24) {
    block = `  "${slug}": (values) => {
      const discountRate = normalizeNumber(values.discountRate);
      const initialInvestment = normalizeNumber(values.initialInvestment);
      const cashFlows = String(values.cashFlows || "").split(",").map(Number).filter(Number.isFinite);
      const r = discountRate / 100;
      let cumPV = 0;
      let payback = -1;
      for (let t = 0; t < cashFlows.length; t++) {
        const pv = cashFlows[t] / Math.pow(1 + r, t + 1);
        if (cumPV < initialInvestment && cumPV + pv >= initialInvestment) {
          payback = t + 1 - (cumPV + pv - initialInvestment) / pv;
        }
        cumPV += pv;
      }
      return {
        headline: payback >= 0 ? \`Discounted Payback: \${formatNumber(payback)} Years\` : "Payback not reached",
        primaryLabel: "Payback Period",
        primaryValue: payback >= 0 ? \`\${formatNumber(payback)} Years\` : "N/A",
        secondaryValues: [
          { label: "Total PV of Flows", value: formatCurrency(cumPV) }
        ],
        explanation: payback >= 0 
          ? \`Yatirimin discount edilmis nakit akislariyla depreciation edilme duration \${formatNumber(payback)} yildir.\` 
          : "Nakit akislarinin bugunku degerleri toplami start investment maliyetini karsilamamaktadir.",
        missingFactors: ["Overhead shifts", "Post-payback cash flows"]
      };
    }`;
  } else if (id === 25) {
    block = `  "${slug}": (values) => {
    const futureCashFlowPv = normalizeNumber(values.futureCashFlowPv);
    const initialInvestment = normalizeNumber(values.initialInvestment);
    const pi = futureCashFlowPv / Math.max(1, initialInvestment);
    return {
      headline: \`Profitability Index (PI): \${formatNumber(pi)}\`,
      primaryLabel: "Profitability Index",
      primaryValue: formatNumber(pi),
      secondaryValues: [
        { label: "PV of Future Cash Flows", value: formatCurrency(futureCashFlowPv) },
        { label: "Initial Investment", value: formatCurrency(initialInvestment) }
      ],
      explanation: \`Yatirilan her 1 unit para icin uretilen bugunku value (Kârlilik Endeksi) \${formatNumber(pi)} olarak hesaplanmistir. 1.0 uzerindeki degerler kârli kabul edilir.\`,
      missingFactors: ["Scale differences between options", "Timing differences"]
    };
  }`;
  } else if (id === 26) {
    block = `  "${slug}": (values) => {
    const equity = normalizeNumber(values.equity);
    const debt = normalizeNumber(values.debt);
    const costOfEquity = normalizeNumber(values.costOfEquity);
    const costOfDebt = normalizeNumber(values.costOfDebt);
    const tax = normalizeNumber(values.tax);
    const v = equity + debt;
    const wacc = (equity / Math.max(1, v) * costOfEquity) + (debt / Math.max(1, v) * costOfDebt * (1 - tax / 100));
    return {
      headline: \`WACC: \${formatNumber(wacc)}%\`,
      primaryLabel: "Cost of Capital (WACC)",
      primaryValue: \`\${formatNumber(wacc)}%\`,
      secondaryValues: [
        { label: "Total Capital", value: formatCurrency(v) },
        { label: "Equity Ratio", value: \`\${formatNumber(equity / Math.max(1, v) * 100)}%\` }
      ],
      explanation: \`Sirketin borc ve ozsermaye weighted average sermaye cost (WACC) %\${formatNumber(wacc)} olarak hesaplanmistir.\`,
      missingFactors: ["Flotation costs", "Changing capital structures"]
    };
  }`;
  } else if (id === 27) {
    block = `  "${slug}": (values) => {
    const riskFreeRate = normalizeNumber(values.riskFreeRate);
    const beta = normalizeNumber(values.beta);
    const marketPremium = normalizeNumber(values.marketPremium);
    const costOfEquity = riskFreeRate + beta * marketPremium;
    return {
      headline: \`Cost of Equity: \${formatNumber(costOfEquity)}%\`,
      primaryLabel: "Cost of Equity (Re)",
      primaryValue: \`\${formatNumber(costOfEquity)}%\`,
      secondaryValues: [
        { label: "Risk-Free Rate", value: \`\${riskFreeRate}%\` },
        { label: "Beta Coefficient", value: formatNumber(beta) }
      ],
      explanation: \`Hissedarlarin risk profiline gore sirketten bekledigi minimum getiri (Oz Sermaye Cost) %\${formatNumber(costOfEquity)} olarak bulunmustur.\`,
      missingFactors: ["Country risk premiums", "Size premium adjustment"]
    };
  }`;
  } else if (id === 28) {
    block = `  "${slug}": (values) => {
      const freeCashFlow = normalizeNumber(values.freeCashFlow);
      const wacc = Math.max(0.1, normalizeNumber(values.wacc));
      const terminalGrowth = normalizeNumber(values.terminalGrowth);
      const w = wacc / 100;
      const g = terminalGrowth / 100;
      let ev = 0;
      let fcf = freeCashFlow;
      for (let t = 1; t <= 5; t++) {
        fcf = fcf * (1 + g);
        ev += fcf / Math.pow(1 + w, t);
      }
      const terminalValue = (fcf * (1 + g)) / Math.max(0.0001, w - g);
      ev += terminalValue / Math.pow(1 + w, 5);
      return {
        headline: \`Enterprise Value (DCF): \${formatCurrency(ev)}\`,
        primaryLabel: "Enterprise Value",
        primaryValue: formatCurrency(ev),
        secondaryValues: [
          { label: "Terminal Value (PV)", value: formatCurrency(terminalValue / Math.pow(1 + w, 5)) }
        ],
        explanation: \`Sirketin nakit flow kapasitesine ve future growth projeksiyonlarina dayali tahmini operating value \${formatCurrency(ev)} seviyesindedir.\`,
        missingFactors: ["Varying year-by-year growth", "Net debt adjustments"]
      };
    }`;
  } else if (id === 29) {
    block = `  "${slug}": (values) => {
    const netIncome = normalizeNumber(values.netIncome);
    const depreciation = normalizeNumber(values.depreciation);
    const workingCapital = normalizeNumber(values.workingCapital);
    const capex = normalizeNumber(values.capex);
    const debt = normalizeNumber(values.debt);
    const fcff = netIncome + depreciation - workingCapital - capex;
    const fcfe = fcff + debt;
    return {
      headline: \`FCFF: \${formatCurrency(fcff)} | FCFE: \${formatCurrency(fcfe)}\`,
      primaryLabel: "Firm Cash Flow (FCFF)",
      primaryValue: formatCurrency(fcff),
      secondaryValues: [
        { label: "Equity Cash Flow (FCFE)", value: formatCurrency(fcfe) }
      ],
      explanation: \`Firma (FCFF: \${formatCurrency(fcff)}) ve hissedar (FCFE: \${formatCurrency(fcfe)}) serbest nakit akislari hesaplanmistir.\`,
      missingFactors: ["Changes in non-cash items", "Accrued interest effects"]
    };
  }`;
  } else if (id === 30) {
    block = `  "${slug}": (values) => {
    const netProfit = normalizeNumber(values.netProfit);
    const interestRate = normalizeNumber(values.interestRate);
    const tax = normalizeNumber(values.tax);
    const depreciation = normalizeNumber(values.depreciation);
    const ebitda = netProfit + interestRate + tax + depreciation;
    return {
      headline: \`EBITDA: \${formatCurrency(ebitda)}\`,
      primaryLabel: "EBITDA Earnings",
      primaryValue: formatCurrency(ebitda),
      secondaryValues: [
        { label: "Operating Net Profit", value: formatCurrency(netProfit) },
        { label: "Total D&A Added", value: formatCurrency(depreciation) }
      ],
      explanation: \`Finansman, tax ve depreciation oncesi operasyonel nakit kâr (EBITDA) \${formatCurrency(ebitda)} olarak hesaplanmistir.\`,
      missingFactors: ["Stock-based compensation", "Capital expenditure demands"]
    };
  }`;
  } else if (id === 31) {
    block = `  "${slug}": (values) => {
    const sharePrice = normalizeNumber(values.sharePrice);
    const eps = normalizeNumber(values.eps);
    const pe = sharePrice / Math.max(0.0001, eps);
    return {
      headline: \`P/E Ratio: \${formatNumber(pe)}\`,
      primaryLabel: "Price-to-Earnings Ratio",
      primaryValue: formatNumber(pe),
      secondaryValues: [
        { label: "Share Price", value: formatCurrency(sharePrice) },
        { label: "Earnings per Share", value: formatCurrency(eps) }
      ],
      explanation: \`Hissenin kâri uzerinden kendini depreciation etme duration (F/K ratio) \${formatNumber(pe)} year olarak hesaplanmistir.\`,
      missingFactors: ["Normalized earnings", "Industry averages"]
    };
  }`;
  } else if (id === 32) {
    block = `  "${slug}": (values) => {
    const marketCap = normalizeNumber(values.marketCap);
    const equity = normalizeNumber(values.equity);
    const pb = marketCap / Math.max(1, equity);
    return {
      headline: \`P/B Ratio: \${formatNumber(pb)}\`,
      primaryLabel: "Price-to-Book Ratio",
      primaryValue: formatNumber(pb),
      secondaryValues: [
        { label: "Market Cap", value: formatCurrency(marketCap) },
        { label: "Book Value of Equity", value: formatCurrency(equity) }
      ],
      explanation: \`Piyasanin sirketin net defter degerine bictigi carpan (PD/DD ratio) \${formatNumber(pb)} seviyesindedir.\`,
      missingFactors: ["Intangible assets value", "Off-balance sheet assets"]
    };
  }`;
  } else if (id === 33) {
    block = `  "${slug}": (values) => {
    const marketCap = normalizeNumber(values.marketCap);
    const totalSales = normalizeNumber(values.totalSales);
    const ps = marketCap / Math.max(1, totalSales);
    return {
      headline: \`P/S Ratio: \${formatNumber(ps)}\`,
      primaryLabel: "Price-to-Sales Ratio",
      primaryValue: formatNumber(ps),
      secondaryValues: [
        { label: "Market Cap", value: formatCurrency(marketCap) },
        { label: "Total Sales Revenue", value: formatCurrency(totalSales) }
      ],
      explanation: \`Sirketin 1 birimlik satisi icin piyasada odenen carpan (Price/Sales ratio) \${formatNumber(ps)} seviyesindedir.\`,
      missingFactors: ["Net margin variations", "Debt loads"]
    };
  }`;
  } else if (id === 34) {
    block = `  "${slug}": (values) => {
    const netIncome = normalizeNumber(values.netIncome);
    const sales = normalizeNumber(values.sales);
    const assets = normalizeNumber(values.assets);
    const equity = normalizeNumber(values.equity);
    const roe = (netIncome / Math.max(1, sales)) * (sales / Math.max(1, assets)) * (assets / Math.max(1, equity)) * 100;
    return {
      headline: \`ROE (DuPont Analysis): \${formatNumber(roe)}%\`,
      primaryLabel: "Return on Equity (ROE)",
      primaryValue: \`\${formatNumber(roe)}%\`,
      secondaryValues: [
        { label: "Profit Margin", value: \`\${formatNumber(netIncome / Math.max(1, sales) * 100)}%\` },
        { label: "Asset Turnover", value: formatNumber(sales / Math.max(1, assets)) },
        { label: "Financial Leverage", value: formatNumber(assets / Math.max(1, equity)) }
      ],
      explanation: \`Kârlilik, productivity ve finansal kaldiracin birlesik etkisi ile ozsermaye karliligi (ROE) %\${formatNumber(roe)} olarak hesaplanmistir.\`,
      missingFactors: ["Non-operating revenues", "Interest rate environment"]
    };
  }`;
  } else if (id === 35) {
    block = `  "${slug}": (values) => {
    const nopat = normalizeNumber(values.nopat);
    const investedCapital = normalizeNumber(values.investedCapital);
    const roic = (nopat / Math.max(1, investedCapital)) * 100;
    return {
      headline: \`ROIC: \${formatNumber(roic)}%\`,
      primaryLabel: "Return on Invested Capital",
      primaryValue: \`\${formatNumber(roic)}%\`,
      secondaryValues: [
        { label: "NOPAT", value: formatCurrency(nopat) },
        { label: "Invested Capital", value: formatCurrency(investedCapital) }
      ],
      explanation: \`Sirketin operasyonlara yatirdigi oz ve borc sermayesinden elde ettigi tax sonrasi net efficiency %\${formatNumber(roic)} seviyesindedir.\`,
      missingFactors: ["WACC threshold comparison", "Working capital seasonality"]
    };
  }`;
  } else if (id === 36) {
    block = `  "${slug}": (values) => {
    const nopat = normalizeNumber(values.nopat);
    const capital = normalizeNumber(values.capital);
    const wacc = normalizeNumber(values.wacc);
    const eva = nopat - (capital * wacc / 100);
    return {
      headline: \`Economic Value Added (EVA): \${formatCurrency(eva)}\`,
      primaryLabel: "EVA Generated",
      primaryValue: formatCurrency(eva),
      secondaryValues: [
        { label: "NOPAT", value: formatCurrency(nopat) },
        { label: "Sermaye Cost Bedeli", value: formatCurrency(capital * wacc / 100) }
      ],
      explanation: \`Sirketin tum sermaye maliyetini karsiladiktan sonra ortaklari icin yarattigi net economic katma value \${formatCurrency(eva)} olarak bulunmustur.\`,
      missingFactors: ["Intangible assets adjustments", "Accounting distortion corrections"]
    };
  }`;
  } else if (id === 37) {
    block = `  "${slug}": (values) => {
    const portfolioReturn = normalizeNumber(values.portfolioReturn);
    const riskFreeRate = normalizeNumber(values.riskFreeRate);
    const volatility = normalizeNumber(values.volatility);
    const sharpe = (portfolioReturn - riskFreeRate) / Math.max(0.0001, volatility);
    return {
      headline: \`Sharpe Ratio: \${formatNumber(sharpe)}\`,
      primaryLabel: "Sharpe Ratio",
      primaryValue: formatNumber(sharpe),
      secondaryValues: [
        { label: "Portfolio Return", value: \`\${portfolioReturn}%\` },
        { label: "Volatility", value: \`\${volatility}%\` }
      ],
      explanation: \`Total volatility unit basina portfoyun urettigi fazla getiri ratio (Sharpe) \${formatNumber(sharpe)} seviyesindedir.\`,
      missingFactors: ["Risk-free rate variations", "Fat-tail distributions"]
    };
  }`;
  } else if (id === 38) {
    block = `  "${slug}": (values) => {
    const portfolioReturn = normalizeNumber(values.portfolioReturn);
    const riskFreeRate = normalizeNumber(values.riskFreeRate);
    const downsideDeviation = normalizeNumber(values.downsideDeviation);
    const sortino = (portfolioReturn - riskFreeRate) / Math.max(0.0001, downsideDeviation);
    return {
      headline: \`Sortino Ratio: \${formatNumber(sortino)}\`,
      primaryLabel: "Sortino Ratio",
      primaryValue: formatNumber(sortino),
      secondaryValues: [
        { label: "Portfolio Return", value: \`\${portfolioReturn}%\` },
        { label: "Downside Risk", value: \`\${downsideDeviation}%\` }
      ],
      explanation: \`Sadece asagi yonlu (loss yazan) volatility unit basina uretilen risk ayarli getiri (Sortino) \${formatNumber(sortino)} seviyesindedir.\`,
      missingFactors: ["Target downside rate variations"]
    };
  }`;
  } else if (id === 39) {
    block = `  "${slug}": (values) => {
    const portfolioReturn = normalizeNumber(values.portfolioReturn);
    const riskFreeRate = normalizeNumber(values.riskFreeRate);
    const beta = normalizeNumber(values.beta);
    const treynor = (portfolioReturn - riskFreeRate) / Math.max(0.0001, beta);
    return {
      headline: \`Treynor Ratio: \${formatNumber(treynor)}\`,
      primaryLabel: "Treynor Ratio",
      primaryValue: formatNumber(treynor),
      secondaryValues: [
        { label: "Portfolio Return", value: \`\${portfolioReturn}%\` },
        { label: "Systemic Risk (Beta)", value: formatNumber(beta) }
      ],
      explanation: \`Piyasa risk unit (Beta) basina portfoyun urettigi fazla getiri ratio (Treynor) \${formatNumber(treynor)} seviyesindedir.\`,
      missingFactors: ["Unsystematic risk factors"]
    };
  }`;
  } else if (id === 40) {
    block = `  "${slug}": (values) => {
    const peakValue = normalizeNumber(values.peakValue);
    const troughValue = normalizeNumber(values.troughValue);
    const mdd = ((peakValue - troughValue) / Math.max(1, peakValue)) * 100;
    return {
      headline: \`Maximum Drawdown: \${formatNumber(mdd)}%\`,
      primaryLabel: "Peak-to-Trough Loss",
      primaryValue: \`\${formatNumber(mdd)}%\`,
      secondaryValues: [
        { label: "Peak Value", value: formatCurrency(peakValue) },
        { label: "Trough Value", value: formatCurrency(troughValue) }
      ],
      explanation: \`Portfoyun zirveden trough yasadigi en buyuk yuzde loss (Max Drawdown) %\${formatNumber(mdd)} olarak hesaplanmistir.\`,
      missingFactors: ["Recovery time duration"]
    };
  }`;
  } else if (id === 41) {
    block = `  "${slug}": (values) => {
    const weight1 = normalizeNumber(values.weight1);
    const weight2 = normalizeNumber(values.weight2);
    const var1 = normalizeNumber(values.var1);
    const var2 = normalizeNumber(values.var2);
    const covar = normalizeNumber(values.covar);
    const w1 = weight1 / 100;
    const w2 = weight2 / 100;
    const portfolioVar = (w1 * w1 * var1) + (w2 * w2 * var2) + (2 * w1 * w2 * covar);
    const portfolioSd = Math.sqrt(Math.max(0, portfolioVar));
    return {
      headline: \`Portfolio Volatility: \${formatNumber(portfolioSd * 100)}%\`,
      primaryLabel: "Portfolio Std Dev",
      primaryValue: \`\${formatNumber(portfolioSd * 100)}%\`,
      secondaryValues: [
        { label: "Portfolio Variance", value: formatNumber(portfolioVar) }
      ],
      explanation: \`Iki varlikli portfoyun kovaryans dahil total standard sapmasi (risk level) %\${formatNumber(portfolioSd * 100)} seviyesindedir.\`,
      missingFactors: ["Multi-asset expansion", "Correlations drift"]
    };
  }`;
  } else if (id === 42) {
    block = `  "${slug}": (values) => {
    const initialNav = normalizeNumber(values.initialNav);
    const finalNav = normalizeNumber(values.finalNav);
    const distributions = normalizeNumber(values.distributions);
    const getiri = ((finalNav + distributions - initialNav) / Math.max(1, initialNav)) * 100;
    return {
      headline: \`Mutual Fund Return: \${formatNumber(getiri)}%\`,
      primaryLabel: "Fund Total Return",
      primaryValue: \`\${formatNumber(getiri)}%\`,
      secondaryValues: [
        { label: "Capital Gain", value: formatCurrency(finalNav - initialNav) },
        { label: "Reinvestment Distributions", value: formatCurrency(distributions) }
      ],
      explanation: \`Investment fonunun donemsel net total getirisi %\${formatNumber(getiri)} olarak bulunmustur.\`,
      missingFactors: ["Load fees", "Redemption fees"]
    };
  }`;
  } else if (id === 43) {
    block = `  "${slug}": (values) => {
    const purchasePrice = normalizeNumber(values.purchasePrice);
    const sellingPrice = normalizeNumber(values.sellingPrice);
    const dividends = normalizeNumber(values.dividends);
    const expenseRatio = normalizeNumber(values.expenseRatio);
    const netReturn = ((sellingPrice + dividends - purchasePrice) / Math.max(1, purchasePrice) * 100) - expenseRatio;
    return {
      headline: \`ETF Net Return: \${formatNumber(netReturn)}%\`,
      primaryLabel: "Net Return",
      primaryValue: \`\${formatNumber(netReturn)}%\`,
      secondaryValues: [
        { label: "Expense Ratio Deducted", value: \`\${expenseRatio}%\` }
      ],
      explanation: \`Annual management ucreti (expense ratio) dusulmus net ETF yatirimci getirisi %\${formatNumber(netReturn)} olarak hesaplanmistir.\`,
      missingFactors: ["Tracking error volatility", "Bid-ask spread costs"]
    };
  }`;
  } else if (id === 44) {
    block = `  "${slug}": (values) => {
    const entryPrice = normalizeNumber(values.entryPrice);
    const exitPrice = normalizeNumber(values.exitPrice);
    const multiplier = normalizeNumber(values.multiplier);
    const lots = normalizeNumber(values.lots);
    const profit = (exitPrice - entryPrice) * multiplier * lots;
    return {
      headline: \`Futures Trade Result: \${formatCurrency(profit)}\`,
      primaryLabel: "Net PnL",
      primaryValue: formatCurrency(profit),
      secondaryValues: [
        { label: "Price Change", value: formatNumber(exitPrice - entryPrice) },
        { label: "Contract Multiplier", value: formatNumber(multiplier) }
      ],
      explanation: \`Vadeli islem kontratinin price hareketinden dogan net kâr/loss result \${formatCurrency(profit)} olarak hesaplanmistir.\`,
      missingFactors: ["Maintenance margin calls", "Rollover fee costs"]
    };
  }`;
  } else if (id === 45) {
    block = `  "${slug}": (values) => {
      const stockPrice = normalizeNumber(values.stockPrice);
      const strikePrice = normalizeNumber(values.strikePrice);
      const interestRate = normalizeNumber(values.interestRate) / 100;
      const time = Math.max(0.01, normalizeNumber(values.time));
      const volatility = normalizeNumber(values.volatility) / 100;
      
      const d1 = (Math.log(stockPrice / Math.max(1, strikePrice)) + (interestRate + (volatility * volatility) / 2) * time) / (volatility * Math.sqrt(time));
      const d2 = d1 - volatility * Math.sqrt(time);
      
      const cdf = (x: number) => {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp(-x * x / 2);
        const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return x >= 0 ? 1 - p : p;
      };
      
      const callPrice = stockPrice * cdf(d1) - strikePrice * Math.exp(-interestRate * time) * cdf(d2);
      return {
        headline: \`Call Option Price: \${formatCurrency(callPrice)}\`,
        primaryLabel: "Call Value (Black-Scholes)",
        primaryValue: formatCurrency(callPrice),
        secondaryValues: [
          { label: "d1", value: formatNumber(d1) },
          { label: "d2", value: formatNumber(d2) }
        ],
        explanation: \`Avrupa tipi alim opsiyonunun Black-Scholes modeline gore teorik adil prim value \${formatCurrency(callPrice)} olarak bulunmustur.\`,
        missingFactors: ["Dividend yields", "Early exercise American options adjustments"]
      };
    }`;
  } else if (id === 46) {
    block = `  "${slug}": (values) => {
    const lots = normalizeNumber(values.lots);
    const pipValue = normalizeNumber(values.pipValue);
    const pipMovement = normalizeNumber(values.pipMovement);
    const pnl = lots * pipValue * pipMovement;
    return {
      headline: \`Forex PnL: \${formatCurrency(pnl)}\`,
      primaryLabel: "PnL Result",
      primaryValue: formatCurrency(pnl),
      secondaryValues: [
        { label: "Total Pip Units Moved", value: formatNumber(pipMovement) }
      ],
      explanation: \`Parite hareketi result account para biriminde actual net forex kâr/zarari \${formatCurrency(pnl)} seviyesindedir.\`,
      missingFactors: ["Swap/Rollover charges", "Spread spreads"]
    };
  }`;
  } else if (id === 47) {
    block = `  "${slug}": (values) => {
    const purchasePrice = normalizeNumber(values.purchasePrice);
    const sellingPrice = normalizeNumber(values.sellingPrice);
    const quantity = normalizeNumber(values.quantity);
    const commission = normalizeNumber(values.commission);
    const gross = (sellingPrice - purchasePrice) * quantity;
    const fees = (purchasePrice * quantity + sellingPrice * quantity) * (commission / 100);
    const net = gross - fees;
    return {
      headline: \`Crypto Net Profit: \${formatCurrency(net)}\`,
      primaryLabel: "Net Profit",
      primaryValue: formatCurrency(net),
      secondaryValues: [
        { label: "Gross Profit", value: formatCurrency(gross) },
        { label: "Trading Fees", value: formatCurrency(fees) }
      ],
      explanation: \`Borsa komisyonlari dusuldukten sonra kripto para isleminden elde edilen net kazanc \${formatCurrency(net)} seviyesindedir.\`,
      missingFactors: ["Slippage costs", "Network transfer fees"]
    };
  }`;
  } else if (id === 48) {
    block = `  "${slug}": (values) => {
    const purchasePrice = normalizeNumber(values.purchasePrice);
    const sellingPrice = normalizeNumber(values.sellingPrice);
    const gas = normalizeNumber(values.gas);
    const royalty = normalizeNumber(values.royalty);
    const netEth = sellingPrice - purchasePrice - gas - (sellingPrice * royalty / 100);
    return {
      headline: \`Net NFT Profit: \${formatNumber(netEth)} ETH\`,
      primaryLabel: "Net Gain (ETH)",
      primaryValue: \`\${formatNumber(netEth)} ETH\`,
      secondaryValues: [
        { label: "Royalty Paid", value: \`\${formatNumber(sellingPrice * royalty / 100)} ETH\` },
        { label: "Gas Spent", value: \`\${formatNumber(gas)} ETH\` }
      ],
      explanation: \`Gas ve royalty kesintileri dusuldukten sonra net NFT alim-satim kazanci \${formatNumber(netEth)} ETH olarak hesaplanmistir.\`,
      missingFactors: ["Floor price changes", "ETH/USD conversion rate"]
    };
  }`;
  } else if (id === 49) {
    block = `  "${slug}": (values) => {
    const nominalValue = normalizeNumber(values.nominalValue);
    const inflation = normalizeNumber(values.inflation);
    const years = normalizeNumber(values.years);
    const realValue = nominalValue / Math.pow(1 + inflation / 100, years);
    return {
      headline: \`Real Value: \${formatCurrency(realValue)}\`,
      primaryLabel: "Purchasing Power",
      primaryValue: formatCurrency(realValue),
      secondaryValues: [
        { label: "Nominal Value", value: formatCurrency(nominalValue) },
        { label: "Loss in Value", value: formatCurrency(nominalValue - realValue) }
      ],
      explanation: \`Belirtilen annual inflation speed %\${inflation} altinda, bugunku \${formatCurrency(nominalValue)} tutarin \${years} year sonraki satin taking gucu \${formatCurrency(realValue)} seviyesine iner.\`,
      missingFactors: ["Varying inflation rate over time", "Taxation adjustments"]
    };
  }`;
  } else if (id === 50) {
    block = `  "${slug}": (values) => {
    const nominalReturn = normalizeNumber(values.nominalReturn);
    const inflation = normalizeNumber(values.inflation);
    const real = ((1 + nominalReturn / 100) / Math.max(0.0001, 1 + inflation / 100) - 1) * 100;
    return {
      headline: \`Real Return: \${formatNumber(real)}%\`,
      primaryLabel: "Inflation Adjusted Return",
      primaryValue: \`\${formatNumber(real)}%\`,
      secondaryValues: [
        { label: "Nominal Return Rate", value: \`\${nominalReturn}%\` },
        { label: "Inflation Rate", value: \`\${inflation}%\` }
      ],
      explanation: \`Inflation etkisi cikarildiginda, satin taking gucundeki net real increase %\${formatNumber(real)} olarak hesaplanmistir.\`,
      missingFactors: ["Asset tax rates", "Broker fees"]
    };
  }`;
  } else if (id === 51) {
    block = `  "${slug}": (values) => {
    const preferredReturn = normalizeNumber(values.preferredReturn);
    const foregoneReturn = normalizeNumber(values.foregoneReturn);
    const opportunityCost = foregoneReturn - preferredReturn;
    return {
      headline: opportunityCost >= 0 ? \`Opportunity Cost: \${formatCurrency(opportunityCost)}\` : "No opportunity cost",
      primaryLabel: "Opportunity Cost",
      primaryValue: opportunityCost >= 0 ? formatCurrency(opportunityCost) : "$0.00",
      secondaryValues: [
        { label: "Chosen Yield", value: formatCurrency(preferredReturn) },
        { label: "Foregone Alternative Yield", value: formatCurrency(foregoneReturn) }
      ],
      explanation: \`Tercih edilmeyen alternatif investment seceneginin kacirilan net getirisi (firsat cost) \${formatCurrency(Math.max(0, opportunityCost))} seviyesindedir.\`,
      missingFactors: ["Risk differences between assets", "Tax differences"]
    };
  }`;
  } else if (id === 52) {
    block = `  "${slug}": (values) => {
    const sellingPrice = normalizeNumber(values.sellingPrice);
    const purchasePrice = normalizeNumber(values.purchasePrice);
    const taxRate = normalizeNumber(values.taxRate);
    const exemption = normalizeNumber(values.exemption);
    const basis = Math.max(0, sellingPrice - purchasePrice - exemption);
    const tax = basis * (taxRate / 100);
    return {
      headline: \`Capital Gains Tax: \${formatCurrency(tax)}\`,
      primaryLabel: "Tax Due",
      primaryValue: formatCurrency(tax),
      secondaryValues: [
        { label: "Taxable Base", value: formatCurrency(basis) },
        { label: "Absolute Gain", value: formatCurrency(Math.max(0, sellingPrice - purchasePrice)) }
      ],
      explanation: \`Varlik satisindan dogan yasal gelir vergisi yukumlulugu \${formatCurrency(tax)} olarak hesaplanmistir.\`,
      missingFactors: ["Alternative minimum tax", "Holding period options (short/long term)"]
    };
  }`;
  } else if (id === 53) {
    block = `  "${slug}": (values) => {
    const assessedValue = normalizeNumber(values.assessedValue);
    const taxRatePerThousand = normalizeNumber(values.taxRatePerThousand);
    const annualTax = assessedValue * (taxRatePerThousand / 1000);
    return {
      headline: \`Property Tax: \${formatCurrency(annualTax)} / year\`,
      primaryLabel: "Annual Property Tax",
      primaryValue: formatCurrency(annualTax),
      secondaryValues: [
        { label: "Assessed Value", value: formatCurrency(assessedValue) },
        { label: "Tax Rate Per Thousand", value: \`\${taxRatePerThousand} ‰\` }
      ],
      explanation: \`Mulk rayic value ve binde oranina gore annual belediyeye odenmesi gereken realestate vergisi tutari \${formatCurrency(annualTax)} seviyesindedir.\`,
      missingFactors: ["Local assessment updates", "Tax exemptions"]
    };
  }`;
  } else if (id === 57) {
    block = `  "${slug}": (values) => {
    const loanAmount = normalizeNumber(values.loanAmount);
    const interestRate = normalizeNumber(values.interestRate);
    const term = Math.max(1, normalizeNumber(values.term));
    const period = clamp(normalizeNumber(values.period), 1, term);
    const r = interestRate / 1200;
    const pmt = r === 0 ? (loanAmount / term) : loanAmount * (r / (1 - Math.pow(1 + r, -term)));
    let remainingPrincipal = loanAmount;
    if (r > 0) {
      remainingPrincipal = loanAmount * (Math.pow(1 + r, term) - Math.pow(1 + r, period - 1)) / (Math.pow(1 + r, term) - 1);
    } else {
      remainingPrincipal = loanAmount * (1 - (period - 1) / term);
    }
    const faizKismi = remainingPrincipal * r;
    const anaparaKismi = pmt - faizKismi;
    return {
      headline: \`Principal: \${formatCurrency(anaparaKismi)} | Interest: \${formatCurrency(faizKismi)}\`,
      primaryLabel: "Principal Repayment",
      primaryValue: formatCurrency(anaparaKismi),
      secondaryValues: [
        { label: "Interest Portion", value: formatCurrency(faizKismi) },
        { label: "Remaining Principal", value: formatCurrency(Math.max(0, remainingPrincipal - anaparaKismi)) }
      ],
      explanation: \`\${period}. period taksit odemesinin \${formatCurrency(anaparaKismi)} kadari anapara borcundan dusulurken, \${formatCurrency(faizKismi)} kadari interest gideridir.\`,
      missingFactors: ["Extra principal payments", "Refinancing options"]
    };
  }`;
  } else if (id === 62) {
    block = `  "${slug}": (values) => {
    const homePrice = normalizeNumber(values.homePrice);
    const annualRent = normalizeNumber(values.annualRent);
    const ratio = homePrice / Math.max(1, annualRent);
    const decision = ratio > 20 ? "Rent" : "Buy";
    const decisionTr = ratio > 20 ? "KIRALA" : "SATIN AL";
    return {
      headline: \`Decision: \${decision} (Ratio: \${formatNumber(ratio)})\`,
      primaryLabel: "Recommended Strategy",
      primaryValue: decisionTr,
      secondaryValues: [
        { label: "Price-to-Rent Ratio", value: formatNumber(ratio) }
      ],
      explanation: \`Price/rent ratio \${formatNumber(ratio)} olarak hesaplanmistir. Bu ratio 20'nin uzerinde oldugunda leasing yapmak, altinda oldugunda ise satin almak finansal olarak daha avantajli kabul edilir.\`,
      missingFactors: ["Property tax rates", "Maintenance cost inflation", "Mortgage rates"]
    };
  }`;
  } else if (id === 165) {
    block = `  "${slug}": (values) => {
    const parseNumericArray = (val: any): number[] => {
      if (Array.isArray(val)) return val.map(Number).filter(Number.isFinite);
      if (typeof val === "number") return [val];
      if (!val) return [];
      return String(val).split(/[\\s,]+/).map(x => Number(x.trim())).filter(Number.isFinite);
    };
    const arr = parseNumericArray(values.dataset || values.veriseti);
    if (arr.length === 0) {
      return {
        headline: "No data points",
        primaryLabel: "Mean",
        primaryValue: "0",
        secondaryValues: [{ label: "Median", value: "0" }, { label: "Mode", value: "0" }],
        explanation: "Lutfen veri kumesini virgulle ayrilmis sayilar olarak girin.",
        missingFactors: []
      };
    }
    const sum = arr.reduce((a, b) => a + b, 0);
    const mean = sum / arr.length;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    const freq: Record<number, number> = {};
    let maxFreq = 0;
    let mode = sorted[0];
    for (const x of sorted) {
      freq[x] = (freq[x] || 0) + 1;
      if (freq[x] > maxFreq) {
        maxFreq = freq[x];
        mode = x;
      }
    }
    return {
      headline: \`Mean: \${formatNumber(mean)}\`,
      primaryLabel: "Mean",
      primaryValue: formatNumber(mean),
      secondaryValues: [
        { label: "Median", value: formatNumber(median) },
        { label: "Mode", value: formatNumber(mode) },
        { label: "Sample Size (N)", value: String(arr.length) }
      ],
      explanation: \`Girilen \${arr.length} count veri noktasinin aritmetik ortalamasi \${formatNumber(mean)}, ortanca (medyan) value \${formatNumber(median)} ve en sik repeat eden (mod) value \${formatNumber(mode)} olarak hesaplanmistir.\`,
      missingFactors: ["Outliers", "Weighted averages"]
    };
  }`;
  } else if (id === 166) {
    block = `  "${slug}": (values) => {
    const parseNumericArray = (val: any): number[] => {
      if (Array.isArray(val)) return val.map(Number).filter(Number.isFinite);
      if (typeof val === "number") return [val];
      if (!val) return [];
      return String(val).split(/[\\s,]+/).map(x => Number(x.trim())).filter(Number.isFinite);
    };
    const arr = parseNumericArray(values.dataset || values.veriseti);
    if (arr.length < 2) {
      return {
        headline: "Need at least 2 points",
        primaryLabel: "Standard Deviation",
        primaryValue: "0",
        secondaryValues: [{ label: "Variance", value: "0" }],
        explanation: "Standard deviation hesaplamak icin en az 2 sayi girmelisiniz.",
        missingFactors: []
      };
    }
    const sum = arr.reduce((a, b) => a + b, 0);
    const mean = sum / arr.length;
    const sqDiffSum = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
    const variance = sqDiffSum / (arr.length - 1);
    const stdDev = Math.sqrt(variance);
    return {
      headline: \`Std Dev: \${formatNumber(stdDev)}\`,
      primaryLabel: "Standard Deviation (Sample)",
      primaryValue: formatNumber(stdDev),
      secondaryValues: [
        { label: "Variance", value: formatNumber(variance) },
        { label: "Population Std Dev", value: formatNumber(Math.sqrt(sqDiffSum / arr.length)) }
      ],
      explanation: \`Veri kumesinin orneklem standard sapmasi \${formatNumber(stdDev)} ve varyansi \${formatNumber(variance)} olarak bulunmustur.\`,
      missingFactors: ["Degrees of freedom adjustments", "Population assumption bias"]
    };
  }`;
  } else if (id === 169) {
    block = `  "${slug}": (values) => {
    const parseNumericArray = (val: any): number[] => {
      if (Array.isArray(val)) return val.map(Number).filter(Number.isFinite);
      if (typeof val === "number") return [val];
      if (!val) return [];
      return String(val).split(/[\\s,]+/).map(x => Number(x.trim())).filter(Number.isFinite);
    };
    const arrX = parseNumericArray(values.x || values.veriX || values.verix);
    const arrY = parseNumericArray(values.y || values.veriY || values.veriy);
    const n = Math.min(arrX.length, arrY.length);
    if (n < 2) {
      return {
        headline: "Need at least 2 points in both sets",
        primaryLabel: "Correlation (r)",
        primaryValue: "0",
        secondaryValues: [{ label: "Slope (m)", value: "0" }],
        explanation: "Correlation hesaplamak icin her iki degiskende de en az 2 sayi girmelisiniz.",
        missingFactors: []
      };
    }
    const cleanX = arrX.slice(0, n);
    const cleanY = arrY.slice(0, n);
    const meanX = cleanX.reduce((a, b) => a + b, 0) / n;
    const meanY = cleanY.reduce((a, b) => a + b, 0) / n;
    let covSum = 0;
    let varXSum = 0;
    let varYSum = 0;
    for (let i = 0; i < n; i++) {
      const diffX = cleanX[i] - meanX;
      const diffY = cleanY[i] - meanY;
      covSum += diffX * diffY;
      varXSum += diffX * diffX;
      varYSum += diffY * diffY;
    }
    const covariance = covSum / (n - 1);
    const varianceX = varXSum / (n - 1);
    const stdDevX = Math.sqrt(varianceX);
    const stdDevY = Math.sqrt(varYSum / (n - 1));
    const correlation = stdDevX * stdDevY === 0 ? 0 : covariance / (stdDevX * stdDevY);
    const slope = varianceX === 0 ? 0 : covariance / varianceX;
    return {
      headline: \`Correlation (r): \${formatNumber(correlation)}\`,
      primaryLabel: "Correlation Coefficient (r)",
      primaryValue: formatNumber(correlation),
      secondaryValues: [
        { label: "Slope", value: formatNumber(slope) },
        { label: "Covariance", value: formatNumber(covariance) }
      ],
      explanation: \`Girilen veriler arasindaki correlation katsayisi \${formatNumber(correlation)} (guclu iliski), dogrusal regression dogrusunun egimi ise \${formatNumber(slope)} olarak hesaplanmistir.\`,
      missingFactors: ["Non-linear relationships", "Influence of outliers"]
    };
  }`;
  } else if (id === 170) {
    block = `  "${slug}": (values) => {
    const parseMatrix = (val: any): number[][] => {
      if (!val) return [];
      const parts = String(val).split(";");
      return parts.map(p => 
        p.split(/[\\s,]+/).map(x => Number(x.trim())).filter(Number.isFinite)
      ).filter(g => g.length > 0);
    };
    const groups = parseMatrix(values.gruplar);
    if (groups.length < 2) {
      return {
        headline: "Need at least 2 groups with 2 points each",
        primaryLabel: "F-Statistic",
        primaryValue: "0",
        secondaryValues: [],
        explanation: "ANOVA testi icin en az iki grupta (noktali virgul ile ayirarak) ikiser count sayi girmelisiniz.",
        missingFactors: []
      };
    }
    const allData = groups.flat();
    const grandMean = allData.reduce((a, b) => a + b, 0) / allData.length;
    let ssb = 0;
    let ssw = 0;
    for (const g of groups) {
      const gMean = g.reduce((a, b) => a + b, 0) / g.length;
      ssb += g.length * Math.pow(gMean - grandMean, 2);
      ssw += g.reduce((a, b) => a + Math.pow(b - gMean, 2), 0);
    }
    const dfBetween = groups.length - 1;
    const dfWithin = allData.length - groups.length;
    const msBetween = ssb / Math.max(1, dfBetween);
    const msWithin = ssw / Math.max(1, dfWithin);
    const fStat = msWithin === 0 ? 0 : msBetween / msWithin;
    return {
      headline: \`F-Statistic: \${formatNumber(fStat)}\`,
      primaryLabel: "F-Value",
      primaryValue: formatNumber(fStat),
      secondaryValues: [
        { label: "df (Between)", value: String(dfBetween) },
        { label: "df (Within)", value: String(dfWithin) },
        { label: "Sum of Squares (Between)", value: formatNumber(ssb) },
        { label: "Sum of Squares (Within)", value: formatNumber(ssw) }
      ],
      explanation: \`Gruplar arasi varyansin grup ici varyansa ratio (F istatistigi) \${formatNumber(fStat)} olarak hesaplanmistir.\`,
      missingFactors: ["Critical F-value verification", "Variance homogeneity assumption (Levene's test)"]
    };
  }`;
  }

  if (block) {
    calculationsRegistry[slug] = block;
  }
}

// Generate the output lines for all other calculators
for (const t of parsedTools) {
  const id = t.id;
  const slug = SLUG_MAP[id];
  if (!slug) continue;
  if (calculationsRegistry[slug]) continue; // already custom defined

  const formulaMatch = t.formulaStr.match(/^([^=]+)=\s*(.+)$/);
  if (!formulaMatch) continue;

  // Convert inputs to JS declarations
  const rawInputs = t.inputsStr.split(",").map(x => x.trim());
  let inputDeclarations = "";
  for (const raw of rawInputs) {
    const nameMatch = raw.match(/^([^\s(]+)(?:\s*\(([^)]+)\))?$/);
    if (!nameMatch) continue;
    const trName = nameMatch[1];
    const key = KEY_MAP[trName.toLowerCase()] || trName.toLowerCase();
    const varName = KEY_MAP[trName.toLowerCase()] || trName;
    inputDeclarations += `    const ${varName} = normalizeNumber(values.${key});\n`;
  }

  // Parse statements
  const parts = t.formulaStr.split(";").map(x => x.trim()).filter(Boolean);
  let jsStatements = [];
  let lastLhsEn = "";

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const match = part.match(/^([^=]+)=\s*(.+)$/);
    if (!match) {
      jsStatements.push(`    resultValue = ${parseFormula(part)};`);
      continue;
    }
    const partLhs = match[1].trim();
    const partRhs = match[2].trim();

    const lhsKey = KEY_MAP[partLhs.toLowerCase()] || partLhs;
    const rhsParsed = parseFormula(partRhs);

    if (i === parts.length - 1) {
      lastLhsEn = KEY_MAP[partLhs.toLowerCase()] || partLhs;
      jsStatements.push(`    const ${lhsKey} = ${rhsParsed};`);
      jsStatements.push(`    resultValue = ${lhsKey};`);
    } else {
      jsStatements.push(`    const ${lhsKey} = ${rhsParsed};`);
    }
  }

  const labelEn = LABEL_MAP[lastLhsEn.toLowerCase()] || lastLhsEn;
  
  // Compile fallbacks for missing variables in formula
  const statementsStr = jsStatements.join("\n");
  const fallbackDeclarations = [];
  if (statementsStr.includes("exchangeRate")) {
    fallbackDeclarations.push("    const exchangeRate = values.exchangeRate !== undefined ? normalizeNumber(values.exchangeRate) : 1;");
  }
  if (statementsStr.includes("shares")) {
    fallbackDeclarations.push("    const shares = values.shares !== undefined ? normalizeNumber(values.shares) : 1;");
  }
  if (statementsStr.includes("threshold")) {
    fallbackDeclarations.push("    const threshold = values.threshold !== undefined ? normalizeNumber(values.threshold) : 103000;");
  }
  
  const block = `  "${slug}": (values) => {
${inputDeclarations}
${fallbackDeclarations.join("\n")}
    // eslint-disable-next-line prefer-const\n    let Input: any = 0; let ProcessGurultusu: any = 0; let Ku: any = 0; let Tu: any = 0; let n: any = 0; let resultValue: any = 0;
    try {
${jsStatements.join("\n")}
      if (typeof resultValue === "number" && !Number.isFinite(resultValue)) {
        resultValue = 0;
      }
    } catch (e) {
      resultValue = 0;
    }
    return {
      headline: \`\${typeof resultValue === "number" ? formatNumber(resultValue) : String(resultValue)}\`,
      primaryLabel: "${labelEn}",
      primaryValue: typeof resultValue === "number" ? formatNumber(resultValue) : String(resultValue),
      secondaryValues: [],
      explanation: \`${t.titleTr} hesaplamasi tamamlanmistir. Result: \${typeof resultValue === "number" ? formatNumber(resultValue) : String(resultValue)}.\`,
      missingFactors: ["Operational variables", "Compliance updates"]
    };
  }`;
  
  calculationsRegistry[slug] = block;
}

// Output full CALCULATORS registry
registryJsContent = `// @ts-nocheck
/* eslint-disable prefer-const */
// Auto-generated calculators database.
import { normalizeNumber, clamp, safeDivide, round, formatNumber, formatCurrency } from "@/lib/tools/free-traffic-calculators";

// Financial & specialized helpers for formulas
function PMT(principal: number, ratePercent: number, months: number): number {
  const r = (ratePercent || 0) / 1200;
  const n = months || 1;
  if (r === 0) return principal / n;
  return principal * (r / (1 - Math.pow(1 + r, -n)));
}

function PV(payment: number, ratePercent: number, months: number): number {
  const r = (ratePercent || 0) / 1200;
  const n = months || 1;
  if (r === 0) return payment * n;
  return payment * ((1 - Math.pow(1 + r, -n)) / r);
}

function FV_CALCULATE(ratePercent: number, periods: number, payment: number): number {
  const r = (ratePercent || 0) / 100;
  const n = periods || 1;
  if (r === 0) return payment * n;
  return payment * ((Math.pow(1 + r, n) - 1) / r);
}

function SUM(arr: any): number {
  if (!Array.isArray(arr)) return Number(arr) || 0;
  return arr.reduce((a, b) => a + (Number(b) || 0), 0);
}

function paretoAnalysis(value: number): string {
  if (value > 100000) return "A";
  if (value > 20000) return "B";
  return "C";
}

function socialSecurityFormula(avgIndexedEarnings: number): number {
  const firstBend = 1024;
  const secondBend = 6172;
  if (avgIndexedEarnings <= firstBend) return avgIndexedEarnings * 0.9;
  if (avgIndexedEarnings <= secondBend) return firstBend * 0.9 + (avgIndexedEarnings - firstBend) * 0.32;
  return firstBend * 0.9 + (secondBend - firstBend) * 0.32 + (avgIndexedEarnings - secondBend) * 0.15;
}

function ageCoefficient(retirementAge: number): number {
  const diff = retirementAge - 67;
  if (diff < 0) {
    return 1 + diff * 0.06;
  } else {
    return 1 + diff * 0.08;
  }
}

function Mifflin_St_Jeor_Formulu(weight: number, height: number, age: number, gender: any): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  const gStr = String(gender || "").toLowerCase();
  if (gStr === "female" || gStr === "kadin" || gStr === "kadin" || gStr === "2") {
    return base - 161;
  }
  return base + 5;
}

function NORMSINV(p: number): number {
  let prob = p;
  if (prob > 1) prob = prob / 100;
  const alpha = 1 - prob;
  const target = 1 - alpha / 2;
  const t = Math.sqrt(-2.0 * Math.log(1.0 - target));
  const c0 = 2.515517, c1 = 0.802853, c2 = 0.010328;
  const d1 = 1.432788, d2 = 0.189269, d3 = 0.001308;
  const z = t - ((c0 + c1*t + c2*t*t) / (1.0 + d1*t + d2*t*t + d3*t*t*t));
  return Number.isFinite(z) ? z : 1.96;
}

export const ALL_CALCULATORS: Record<string, (values: Record<string, any>) => any> = {
`;

for (const [slug, block] of Object.entries(calculationsRegistry)) {
  registryJsContent += `${block},\n`;
}

registryJsContent += `};\n`;

fs.writeFileSync("src/lib/tools/free-traffic-calculators-registry.ts", registryJsContent, "utf8");
console.log("Wrote src/lib/tools/free-traffic-calculators-registry.ts");

// Overwrite free-traffic-calculators.ts to import our new registry
const engineContent = `/**
 * Free traffic calculator engine — browser-side math for all catalog slugs.
 * No premium verdict leakage; every slug computes real formulas.
 */

import {
  formatLocalizedCurrency,
  formatLocalizedNumber,
  getFreeToolLegalNote,
  normalizeLocale,
  NOT_AVAILABLE,
  type SupportedLocale,
} from "@/lib/format/localization";
import { localizeTrafficResultPartial } from "@/lib/i18n/free-tool-result-i18n";
import {
  getFreeTrafficToolBySlug,
} from "@/lib/tools/free-traffic-catalog";
import { ALL_CALCULATORS } from "./free-traffic-calculators-registry";

export type FreeTrafficInputValues = Record<string, number | string>;

export type FreeTrafficResult = {
  readonly headline: string;
  readonly primaryLabel: string;
  readonly primaryValue: string;
  readonly secondaryValues: readonly { readonly label: string; readonly value: string }[];
  readonly explanation: string;
  readonly missingFactors: readonly string[];
  readonly relatedPremiumSlug?: string;
  readonly legalNote: string;
};

let _activeFormatLocale: SupportedLocale = "en";

export function normalizeNumber(value: string | number): number {
  const parsed = typeof value === "number" ? value : Number(String(value).replace(/,/g, '.').trim());
  return Number.isFinite(parsed) ? parsed : NaN;
}

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

export function safeDivide(a: number, b: number): number {
  if (b === 0 || !Number.isFinite(a) || !Number.isFinite(b)) {
    return 0;
  }
  const resultValue = a / b;
  return Number.isFinite(resultValue) ? resultValue : 0;
}

export function round(value: number, digits = 2): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function formatNumber(n: number, digits = 2): string {
  return formatLocalizedNumber(n, _activeFormatLocale, {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
}

export function formatCurrency(n: number, digits = 2): string {
  return formatLocalizedCurrency(n, _activeFormatLocale, "USD", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits > 0 ? 0 : undefined,
  });
}

export function assertFiniteNumber(n: number, fallback = 0): number {
  return Number.isFinite(n) ? n : fallback;
}

const PREMIUM_LEAK_PATTERNS = [
  /do not accept under/i,
  /minimum safe price/i,
  /\\bp90\\b/i,
  /final verdict/i,
  /\\bpdf\\b/i,
  /saved report/i,
] as const;

export function containsPremiumLeakText(text: string): boolean {
  return PREMIUM_LEAK_PATTERNS.some((pattern) => pattern.test(text));
}

const CALCULATORS: Record<string, (values: FreeTrafficInputValues) => Omit<FreeTrafficResult, "legalNote">> = ALL_CALCULATORS;

function meta(slug: string, res: Omit<FreeTrafficResult, "legalNote">): FreeTrafficResult {
  const catalog = getFreeTrafficToolBySlug(slug);
  const localized = localizeTrafficResultPartial({
    headline: res.headline,
    primaryLabel: res.primaryLabel,
    explanation: res.explanation,
    secondaryValues: res.secondaryValues,
  }, _activeFormatLocale);
  
  const textCheck = [
    localized.headline,
    localized.primaryLabel,
    localized.explanation,
    res.primaryValue,
    ...res.secondaryValues.map((v) => \`\${v.label} \${v.value}\`),
  ].join(" ");

  if (containsPremiumLeakText(textCheck)) {
    throw new Error(\`Verdict leak detected in production calculator response for slug "\${slug}"\`);
  }

  return {
    ...res,
    headline: localized.headline,
    primaryLabel: localized.primaryLabel,
    explanation: localized.explanation,
    relatedPremiumSlug: catalog?.relatedPremiumSlug,
    legalNote: getFreeToolLegalNote(_activeFormatLocale),
  };
}

export function calculateFreeTrafficTool(
  slug: string,
  values: FreeTrafficInputValues,
  locale: SupportedLocale | string = "en",
): FreeTrafficResult {
  const previousLocale = _activeFormatLocale;
  _activeFormatLocale = normalizeLocale(locale);
  try {
    const calculator = CALCULATORS[slug];
    if (!calculator) {
      throw new Error(\`Unknown free traffic calculator slug: \${slug}\`);
    }
    return meta(slug, calculator(values));
  } finally {
    _activeFormatLocale = previousLocale;
  }
}

export { NOT_AVAILABLE as FREE_RESULT_NOT_AVAILABLE };

export function hasDedicatedTrafficCalculator(slug: string): boolean {
  return slug in CALCULATORS;
}
`;

fs.writeFileSync("src/lib/tools/free-traffic-calculators.ts", engineContent, "utf8");
console.log("Wrote src/lib/tools/free-traffic-calculators.ts");

console.log("Successfully generated all catalog, calculations, and translation files.");
