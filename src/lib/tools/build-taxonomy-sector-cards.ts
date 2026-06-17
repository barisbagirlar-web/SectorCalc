import {
  resolveTaxonomyProfessionDisplayLabel,
  resolveTaxonomySectorDisplayLabel,
} from "@/lib/i18n/taxonomy-display-labels";
import { ALL_TOOLS_SECTOR, OTHER_SECTOR, SECTORS, type Sector } from "@/lib/tools/taxonomy";

export type TaxonomySectorCard = {
  readonly sector: Sector;
  readonly label: string;
  readonly professionLabels: readonly string[];
  readonly count: number;
  readonly countLabel: string;
};

export function resolveTaxonomySectorLabel(
  locale: string,
  sectorId: string,
  label: string,
  labelEn: string,
): string {
  return (
    resolveTaxonomySectorDisplayLabel(sectorId, locale) ??
    (locale.startsWith("en") ? labelEn : label)
  );
}

export function buildTaxonomySectorCards(
  tools: readonly { sectorKey: string }[],
  locale: string,
  options?: { readonly allLabel?: string },
): TaxonomySectorCard[] {
  const sectorCounts = new Map<string, number>();
  for (const tool of tools) {
    sectorCounts.set(tool.sectorKey, (sectorCounts.get(tool.sectorKey) ?? 0) + 1);
  }

  const cards: TaxonomySectorCard[] = SECTORS.flatMap((sector) => {
    const count = sectorCounts.get(sector.id) ?? 0;
    if (count === 0) {
      return [];
    }
    return [
      {
        sector,
        label: resolveTaxonomySectorLabel(locale, sector.id, sector.label, sector.labelEn),
        professionLabels: sector.professions.map((profession) =>
          resolveTaxonomyProfessionDisplayLabel(profession, locale),
        ),
        count,
        countLabel: String(count),
      },
    ];
  });

  const otherCount = sectorCounts.get("diger") ?? 0;
  if (otherCount > 0) {
    cards.push({
      sector: OTHER_SECTOR,
      label: resolveTaxonomySectorLabel(
        locale,
        OTHER_SECTOR.id,
        OTHER_SECTOR.label,
        OTHER_SECTOR.labelEn,
      ),
      professionLabels: [],
      count: otherCount,
      countLabel: String(otherCount),
    });
  }

  if (tools.length === 0) {
    return cards;
  }

  const allLabel = options?.allLabel
    ? options.allLabel === ALL_TOOLS_SECTOR.label || options.allLabel === ALL_TOOLS_SECTOR.labelEn
      ? resolveTaxonomySectorLabel(
          locale,
          ALL_TOOLS_SECTOR.id,
          ALL_TOOLS_SECTOR.label,
          ALL_TOOLS_SECTOR.labelEn,
        )
      : options.allLabel
    : resolveTaxonomySectorLabel(
        locale,
        ALL_TOOLS_SECTOR.id,
        ALL_TOOLS_SECTOR.label,
        ALL_TOOLS_SECTOR.labelEn,
      );

  return [
    {
      sector: ALL_TOOLS_SECTOR,
      label: allLabel,
      professionLabels: [],
      count: tools.length,
      countLabel: String(tools.length),
    },
    ...cards,
  ];
}

export function withTaxonomyCountLabels(
  cards: readonly TaxonomySectorCard[],
  formatCountLabel: (count: number) => string,
): TaxonomySectorCard[] {
  return cards.map((card) => ({
    ...card,
    countLabel: formatCountLabel(card.count),
  }));
}
