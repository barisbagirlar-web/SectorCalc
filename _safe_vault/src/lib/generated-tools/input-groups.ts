import type { GeneratedInputGroup, GeneratedToolInput } from "@/lib/generated-tools/types";

const GROUP_KEYWORDS: Readonly<Record<string, readonly string[]>> = {
  waste: ["waste", "israf", "scrap", "defect", "fire"],
  time: ["day", "period", "frequency", "hour", "time", "gun", "sure", "vade"],
  cost: ["cost", "price", "maliyet", "fiyat", "ucret", "currency", "kur"],
  confidence: ["confidence", "guven", "quality", "kalite"],
};

function inferGroupId(input: GeneratedToolInput): string {
  if (input.group) {
    return input.group;
  }
  const haystack = `${input.id} ${input.label} ${input.businessContext}`.toLowerCase();
  for (const [groupId, keywords] of Object.entries(GROUP_KEYWORDS)) {
    if (keywords.some((keyword) => haystack.includes(keyword))) {
      return groupId;
    }
  }
  return "general";
}

const GROUP_TITLES: Readonly<Record<string, string>> = {
  waste: "waste",
  time: "time",
  cost: "cost",
  confidence: "confidence",
  general: "general",
};

export function buildGeneratedInputGroups(inputs: readonly GeneratedToolInput[]): GeneratedInputGroup[] {
  const grouped = new Map<string, string[]>();
  for (const input of inputs) {
    const groupId = inferGroupId(input);
    const existing = grouped.get(groupId) ?? [];
    existing.push(input.id);
    grouped.set(groupId, existing);
  }

  const order = ["waste", "cost", "time", "confidence", "general"];
  const groups: GeneratedInputGroup[] = [];
  for (const groupId of order) {
    const inputIds = grouped.get(groupId);
    if (!inputIds || inputIds.length === 0) {
      continue;
    }
    groups.push({
      id: groupId,
      title: GROUP_TITLES[groupId] ?? GROUP_TITLES.general,
      inputIds,
    });
    grouped.delete(groupId);
  }

  for (const [groupId, inputIds] of grouped.entries()) {
    groups.push({
      id: groupId,
      title: GROUP_TITLES[groupId] ?? GROUP_TITLES.general,
      inputIds,
    });
  }

  return groups;
}
