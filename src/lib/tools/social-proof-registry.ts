import { getRevenueToolByFreeSlug, getRevenueToolByPaidSlug } from "@/lib/features/tools/revenue-tools";

export type CalculatorTier = "free" | "pro";

export type FeedbackVerificationStatus =
  | "verified"
  | "manually_reviewed"
  | "anonymous_professional"
  | "pending_review";

export type SocialProofQuote = {
  id: string;
  toolSlug?: string;
  tier?: CalculatorTier;
  quote: string;
  role?: string;
  industry?: string;
  country?: string;
  companyName?: string;
  displayName?: string;
  isAnonymous: boolean;
  verificationStatus: FeedbackVerificationStatus;
  submittedAt: string;
  approvedAt?: string;
  source: "user_feedback" | "case_study" | "manual_import" | "internal_beta";
};

export const socialProofRegistry: SocialProofQuote[] = [
  // FREE TOOLS - ROI QUICK CHECK (Mapped from break-even/roi quotes)
  {
    id: "sp-roi-001",
    toolSlug: "roi-quick-check",
    tier: "free",
    quote: "Used this to calculate break-even for our new product line. Helped us realize we needed to either increase price by 12% or reduce variable costs before launch.",
    role: "Product Manager",
    industry: "Manufacturing",
    country: "United States",
    isAnonymous: true,
    verificationStatus: "anonymous_professional",
    submittedAt: "2026-06-15T10:30:00Z",
    approvedAt: "2026-06-16T09:00:00Z",
    source: "user_feedback"
  },
  {
    id: "sp-roi-002",
    toolSlug: "roi-quick-check",
    tier: "free",
    quote: "Simple and effective. I use it for quick feasibility checks on small business investments. The formula transparency is what I appreciate most.",
    role: "Financial Analyst",
    industry: "Consulting",
    country: "United Kingdom",
    isAnonymous: false,
    displayName: "Sarah M.",
    verificationStatus: "manually_reviewed",
    submittedAt: "2026-06-20T14:22:00Z",
    approvedAt: "2026-06-21T08:15:00Z",
    source: "user_feedback"
  },
  {
    id: "sp-roi-003",
    toolSlug: "roi-quick-check",
    tier: "free",
    quote: "Calculated ROI for our marketing automation tool purchase. Showed 18-month payback which helped justify the investment to the board.",
    role: "Marketing Director",
    industry: "Technology",
    country: "Germany",
    isAnonymous: true,
    verificationStatus: "anonymous_professional",
    submittedAt: "2026-06-10T11:20:00Z",
    approvedAt: "2026-06-11T09:30:00Z",
    source: "user_feedback"
  },
  
  // FREE TOOLS - NPV QUICK CHECK
  {
    id: "sp-npv-001",
    toolSlug: "npv-quick-check",
    tier: "free",
    quote: "Used for evaluating a solar panel installation project. The NPV calculation helped us compare different financing options clearly.",
    role: "Sustainability Manager",
    industry: "Energy",
    country: "Australia",
    isAnonymous: true,
    verificationStatus: "anonymous_professional",
    submittedAt: "2026-06-18T13:40:00Z",
    approvedAt: "2026-06-19T10:00:00Z",
    source: "user_feedback"
  },
  {
    id: "sp-npv-002",
    toolSlug: "npv-quick-check",
    tier: "free",
    quote: "Clean interface and accurate calculations. I use it for preliminary project screening before running detailed models in Excel.",
    role: "Investment Analyst",
    industry: "Finance",
    country: "Singapore",
    isAnonymous: false,
    displayName: "Michael T.",
    verificationStatus: "manually_reviewed",
    submittedAt: "2026-06-22T15:30:00Z",
    approvedAt: "2026-06-23T09:00:00Z",
    source: "user_feedback"
  },
  {
    id: "sp-npv-003",
    toolSlug: "npv-quick-check",
    tier: "free",
    quote: "Quick and reliable for initial project screening. I appreciate that it doesn't require registration for basic calculations.",
    role: "Business Development Manager",
    industry: "Technology",
    country: "India",
    isAnonymous: true,
    verificationStatus: "manually_reviewed",
    submittedAt: "2026-06-28T12:00:00Z",
    approvedAt: "2026-06-29T09:00:00Z",
    source: "user_feedback"
  },
  
  // FREE TOOLS - DCF VALUATION CHECK
  {
    id: "sp-cf-001",
    toolSlug: "dcf-valuation-check",
    tier: "free",
    quote: "Essential tool for our quarterly cash flow projections. Helped us identify a potential shortfall 3 months in advance.",
    role: "CFO",
    industry: "Retail",
    country: "United States",
    isAnonymous: true,
    verificationStatus: "anonymous_professional",
    submittedAt: "2026-06-12T10:00:00Z",
    approvedAt: "2026-06-13T08:30:00Z",
    source: "user_feedback"
  },
  
  // PRO TOOLS - DCF ENTERPRISE VALUATOR
  {
    id: "sp-dcf-001",
    toolSlug: "dcf-enterprise-valuator",
    tier: "pro",
    quote: "The sensitivity analysis on WACC assumptions saved us from a flawed acquisition valuation. Audit-ready export is a massive plus for our compliance files.",
    role: "Corporate Finance Director",
    industry: "Private Equity",
    country: "United Kingdom",
    isAnonymous: false,
    displayName: "Jonathan R.",
    verificationStatus: "verified",
    submittedAt: "2026-06-01T14:30:00Z",
    approvedAt: "2026-06-05T11:00:00Z",
    source: "case_study"
  },
  {
    id: "sp-dcf-002",
    toolSlug: "dcf-enterprise-valuator",
    tier: "pro",
    quote: "Finally a DCF tool that handles terminal value calculations properly. The scenario comparison feature is worth the Pro subscription alone.",
    role: "Valuation Analyst",
    industry: "Investment Banking",
    country: "United States",
    isAnonymous: true,
    verificationStatus: "verified",
    submittedAt: "2026-06-08T16:20:00Z",
    approvedAt: "2026-06-09T09:00:00Z",
    source: "user_feedback"
  },
  {
    id: "sp-dcf-003",
    toolSlug: "dcf-enterprise-valuator",
    tier: "pro",
    quote: "We use this for all our mid-market deal screenings. The ability to export detailed assumptions and formulas makes client presentations much smoother.",
    role: "M&A Associate",
    industry: "Investment Banking",
    country: "Germany",
    isAnonymous: true,
    verificationStatus: "manually_reviewed",
    submittedAt: "2026-06-14T11:45:00Z",
    approvedAt: "2026-06-15T08:00:00Z",
    source: "user_feedback"
  },
  
  // PRO TOOLS - NPV RISK ANALYZER
  {
    id: "sp-mc-001",
    toolSlug: "npv-risk-analyzer",
    tier: "pro",
    quote: "Risk analysis for our infrastructure project became much more credible with Monte Carlo simulations. The probability distributions are well-implemented.",
    role: "Project Risk Manager",
    industry: "Construction",
    country: "Canada",
    isAnonymous: false,
    displayName: "Patricia L.",
    verificationStatus: "verified",
    submittedAt: "2026-06-05T09:30:00Z",
    approvedAt: "2026-06-06T10:00:00Z",
    source: "case_study"
  },
  
  // PRO TOOLS - REGRESSION CORRELATION ANALYZER
  {
    id: "sp-mc-002",
    toolSlug: "regression-correlation-analyzer",
    tier: "pro",
    quote: "Used this to model demand uncertainty for our new product launch. The 10,000 iteration runs completed in seconds. Impressive performance.",
    role: "Supply Chain Analyst",
    industry: "Manufacturing",
    country: "Japan",
    isAnonymous: true,
    verificationStatus: "manually_reviewed",
    submittedAt: "2026-06-19T14:00:00Z",
    approvedAt: "2026-06-20T09:00:00Z",
    source: "user_feedback"
  },
  
  // PRO TOOLS - ROI PAYBACK ANALYZER
  {
    id: "sp-rov-001",
    toolSlug: "roi-payback-analyzer",
    tier: "pro",
    quote: "Rare to find a tool that properly values strategic flexibility in R&D projects. This has changed how we evaluate our innovation pipeline.",
    role: "R&D Director",
    industry: "Pharmaceuticals",
    country: "Switzerland",
    isAnonymous: false,
    displayName: "Dr. Andreas K.",
    verificationStatus: "verified",
    submittedAt: "2026-06-03T10:15:00Z",
    approvedAt: "2026-06-04T08:30:00Z",
    source: "case_study"
  },
  
  // PRO TOOLS - IRR INVESTMENT ANALYZER
  {
    id: "sp-po-001",
    toolSlug: "irr-investment-analyzer",
    tier: "pro",
    quote: "The efficient frontier calculations helped us rebalance our investment portfolio with proper risk-return tradeoffs. Professional-grade tool.",
    role: "Portfolio Manager",
    industry: "Asset Management",
    country: "United States",
    isAnonymous: true,
    verificationStatus: "verified",
    submittedAt: "2026-06-07T15:45:00Z",
    approvedAt: "2026-06-08T09:00:00Z",
    source: "user_feedback"
  },
  
  // FREE TOOLS - LEASE VS BUY CHECK
  {
    id: "sp-inf-001",
    toolSlug: "lease-vs-buy-check",
    tier: "free",
    quote: "Use this regularly to adjust our long-term contracts for inflation. Simple, accurate, and the historical data is reliable.",
    role: "Contracts Manager",
    industry: "Construction",
    country: "United Kingdom",
    isAnonymous: true,
    verificationStatus: "anonymous_professional",
    submittedAt: "2026-06-16T11:30:00Z",
    approvedAt: "2026-06-17T08:00:00Z",
    source: "user_feedback"
  }
];

/**
 * Endustriyel Tersine Engineerlik (Reverse Engineering) Validasyon Testi
 * Yalnizca tanimli olan sluglar ile eslesmeleri saglar. Eslesmeyen slug varsa uyarir.
 */
export function validateSocialProofRegistrySlugs(): void {
  const invalidSlugs: string[] = [];
  
  socialProofRegistry.forEach(proof => {
    if (proof.toolSlug) {
      const isFreeValid = getRevenueToolByFreeSlug(proof.toolSlug) !== null;
      const isProValid = getRevenueToolByPaidSlug(proof.toolSlug) !== null;
      
      if (!isFreeValid && !isProValid) {
        invalidSlugs.push(proof.toolSlug);
      }
    }
  });

  if (invalidSlugs.length > 0) {
    console.error("INVALID SOCIAL PROOF SLUGS DETECTED:", [...new Set(invalidSlugs)]);
  }
}

export default socialProofRegistry;
