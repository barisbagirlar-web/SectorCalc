import type { IndustrySlug } from "@/data/industries";
import {
  buildIndustrySeoDescription,
  buildIndustrySeoTitle,
  getIndustryRegistryEntry,
} from "@/lib/tools/industry-registry";
import { getRevenueToolBySector } from "@/lib/tools/revenue-tools";

export interface IndustryHubContent {
  hubTitle: string;
  seoDescription: string;
  painStatement: string;
  freeToolExplanation: string;
  premiumToolExplanation: string;
  whoItsFor: string;
  decisionHelp: string;
}

export function getIndustryHubContent(slug: IndustrySlug): IndustryHubContent {
  const entry = getIndustryRegistryEntry(slug);
  const tool = getRevenueToolBySector(slug);

  if (!entry || !tool) {
    return {
      hubTitle: "Industry decision tools",
      seoDescription: buildIndustrySeoDescription("your sector"),
      painStatement: "Hidden cost and margin leaks can turn accepted work into a loss.",
      freeToolExplanation: "Start with a free quick check for visible risk signals.",
      premiumToolExplanation: "Unlock the premium analyzer for safe price and bid verdicts.",
      whoItsFor: "Business owners, estimators and operators making pricing decisions.",
      decisionHelp: "Decide whether to accept, reprice or reject work before committing.",
    };
  }

  return {
    hubTitle: buildIndustrySeoTitle(entry.name),
    seoDescription: buildIndustrySeoDescription(entry.name),
    painStatement: entry.painStatement,
    freeToolExplanation: `${tool.freeTitle}: ${tool.freeValue}`,
    premiumToolExplanation: `${tool.paidTitle}: ${tool.paidValue}`,
    whoItsFor: `${entry.name} owners, estimators, operators and consultants pricing jobs or contracts.`,
    decisionHelp:
      "Decide whether to accept the job, reprice the bid or adjust scope before committing.",
  };
}
