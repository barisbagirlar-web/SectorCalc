import type { IndustrySlug } from "@/lib/tools/industry-registry";
import {
 getRevenueToolBySector,
 type RevenueTool,
} from "@/lib/tools/revenue-tools";
import {
 getFreeToolHref,
 getPremiumToolHref,
 getPricingHref,
} from "@/lib/tools/tool-links";

export interface SectorLandingFaq {
 question: string;
 answer: string;
}

export interface SectorLandingSampleVerdict {
 title: string;
 verdict: string;
 marginRisk: string;
 mainLeak: string;
 suggestedAction: string;
}

export interface SectorLandingPageConfig {
 path: string;
 sectorSlug: string;
 eyebrow: string;
 h1: string;
 subhead: string;
 painPoints: readonly string[];
 marginLeaks: readonly string[];
 sampleVerdict: SectorLandingSampleVerdict;
 faq: readonly SectorLandingFaq[];
 freeToolHref: string;
 freeToolCta: string;
 premiumToolHref: string;
 premiumToolCta: string;
 pricingHref: string;
}

function buildConfig(
 sectorSlug: string,
 path: string,
 overrides: Omit<
 SectorLandingPageConfig,
 "freeToolHref" | "premiumToolHref" | "pricingHref" | "sectorSlug" | "path"
 >
): SectorLandingPageConfig {
 const tool = getRevenueToolBySector(sectorSlug as IndustrySlug);
 if (!tool) {
 throw new Error(`No revenue tool for sector: ${sectorSlug}`);
 }
 return {
 path,
 sectorSlug,
 freeToolHref: getFreeToolHref(tool),
 premiumToolHref: getPremiumToolHref(tool),
 pricingHref: getPricingHref(tool),
 ...overrides,
 };
}

export const CNC_QUOTE_RISK_LANDING = buildConfig("cnc-manufacturing", "/cnc-quote-risk", {
 eyebrow: "CNC / Manufacturing Quote Risk",
 h1: "Stop Underpriced CNC Jobs Before They Kill Your Margin.",
 subhead:
 "Setup time, tooling and one-off quantities can turn a normal quote into a loss. SectorCalc helps you spot quote risk before you accept the job.",
 painPoints: [
 "Setup time gets ignored in quick quotes",
 "Tooling cost is treated like overhead",
 "Quantity-of-one runs destroy margin",
 "Rush pressure hides real machine cost",
 ],
 marginLeaks: [
 "Setup time concentration on small batches",
 "Tool changes and prove-out not in quote",
 "Scrap allowance missing on tight work",
 "Machine rate does not reflect burden",
 ],
 sampleVerdict: {
 title: "CNC Quote Risk Report",
 verdict: "DO NOT ACCEPT UNDER $1,840",
 marginRisk: "HIGH",
 mainLeak: "Setup time + tooling buffer",
 suggestedAction: "Reprice or reduce scope before sending the quote.",
 },
 freeToolCta: "Run Free CNC Margin Check",
 premiumToolCta: "Unlock CNC Quote Risk Calculator",
 faq: [
 {
 question: "What does the free CNC check show?",
 answer:
 "Visible risk level and cost exposure signals from machine time, material and setup inputs — not a minimum safe price or final verdict.",
 },
 {
 question: "What does the premium calculator add?",
 answer:
 "Minimum safe price, margin leak breakdown, accept / reprice verdict and PDF-ready report output.",
 },
 {
 question: "Do I need an ERP?",
 answer: "No. Free checks run in your browser without enterprise setup.",
 },
 {
 question: "Can I buy one report instead of Pro?",
 answer:
 "Single Verdict ($9) covers one premium calculator run. Pro ($19/month) unlocks all sector calculators.",
 },
 ],
});

export const CONSTRUCTION_BID_MARGIN_LANDING = buildConfig(
 "construction",
 "/construction-bid-margin",
 {
 eyebrow: "Construction Bid Margin",
 h1: "Protect Project Margin Before You Sign the Change Order.",
 subhead:
 "Small scope changes, crew delays and deadline pressure can erase margin on otherwise healthy jobs. Check bid risk before you commit.",
 painPoints: [
 "Change orders priced without delay cost",
 "Crew standby not in the estimate",
 "Original margin already thin on the base contract",
 "GC pressure to absorb extras",
 ],
 marginLeaks: [
 "Unpriced delay and mobilization days",
 "Overhead not allocated to change work",
 "Material escalation between bid and install",
 "Supervision time missing from crew cost",
 ],
 sampleVerdict: {
 title: "Change Order Impact Report",
 verdict: "DO NOT ACCEPT WITHOUT PRICE ADJUSTMENT",
 marginRisk: "HIGH",
 mainLeak: "Delay days + crew standby cost",
 suggestedAction: "Renegotiate change price before crew remobilizes.",
 },
 freeToolCta: "Run Free Project Cost Check",
 premiumToolCta: "Unlock Change Order Analyzer",
 faq: [
 {
 question: "What does the free construction check show?",
 answer:
 "Visible cost exposure from budget and change estimate inputs — not a full change-order verdict or safe price floor.",
 },
 {
 question: "What does the premium calculator add?",
 answer:
 "Delay cost, crew impact, margin risk and accept / renegotiate / reject verdict with exportable report.",
 },
 {
 question: "Is this a replacement for estimating software?",
 answer:
 "No. SectorCalc is a decision-support layer for margin risk — verify all numbers with your estimating process.",
 },
 {
 question: "How is pricing structured?",
 answer:
 "Start free. Single Verdict ($9) for one report, or Pro ($19/month) for all sector calculators.",
 },
 ],
 }
);

export const CLEANING_CONTRACT_MARGIN_LANDING = buildConfig(
 "cleaning",
 "/cleaning-contract-margin",
 {
 eyebrow: "Cleaning Contract Margin",
 h1: "Stop Cleaning Contracts That Look Fine and Lose Every Month.",
 subhead:
 "Labor hours, visit frequency and supply cost are easy to underbid. SectorCalc surfaces contract margin risk before you sign.",
 painPoints: [
 "Square footage quotes ignore walk time",
 "Supply cost treated as negligible",
 "Frequency discounts erode margin",
 "Scope creep without repricing",
 ],
 marginLeaks: [
 "Labor hours underestimated per visit",
 "Travel and mobilization not in bid",
 "Consumables and chemicals underpriced",
 "Low-frequency accounts with high setup cost",
 ],
 sampleVerdict: {
 title: "Office Cleaning Bid Report",
 verdict: "REPRICE REQUIRED — MINIMUM $2,180/MONTH",
 marginRisk: "HIGH",
 mainLeak: "Labor hours + supply buffer",
 suggestedAction: "Raise monthly bid or reduce scope before contract start.",
 },
 freeToolCta: "Run Free Cleaning Cost Check",
 premiumToolCta: "Unlock Office Cleaning Bid Optimizer",
 faq: [
 {
 question: "What does the free cleaning check show?",
 answer:
 "Basic labor and visit cost exposure with visible risk signal — not minimum monthly bid or final verdict.",
 },
 {
 question: "What does the premium optimizer add?",
 answer:
 "Minimum safe monthly bid, margin leak drivers, suggested action and PDF-ready verdict report.",
 },
 {
 question: "Does SectorCalc store my client data?",
 answer:
 "Free checks run without account setup. Business data is not sold — see privacy policy for details.",
 },
 {
 question: "Can I preview a full report?",
 answer:
 "Yes — view the sample verdict report to see premium output structure before purchasing.",
 },
 ],
 }
);

export const SECTOR_LANDING_PAGES: SectorLandingPageConfig[] = [
 CNC_QUOTE_RISK_LANDING,
 CONSTRUCTION_BID_MARGIN_LANDING,
 CLEANING_CONTRACT_MARGIN_LANDING,
];

export function getSectorLandingByPath(path: string): SectorLandingPageConfig | undefined {
 return SECTOR_LANDING_PAGES.find((page) => page.path === path);
}

export function getSectorLandingTool(path: string): RevenueTool | null {
 const page = getSectorLandingByPath(path);
 if (!page) {
 return null;
 }
 return getRevenueToolBySector(page.sectorSlug as IndustrySlug);
}
