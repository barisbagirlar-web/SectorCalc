"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "@/lib/i18n-stub";
import { ToolAlphaList } from "@/components/tools/ToolAlphaList";
import type { ToolListItem } from "@/lib/features/tools/getToolsByCategory";

export type CategorySectorData = {
  readonly slug: string;
  readonly title: string;
  readonly tools: readonly ToolListItem[];
};

type SectorFilteredToolSectionsProps = {
  readonly categorySections: readonly CategorySectorData[];
  readonly locale: string;
  readonly byCategoryTitle: string;
};

export function SectorFilteredToolSections({
  categorySections,
  locale,
  byCategoryTitle,
}: SectorFilteredToolSectionsProps) {
  const searchParams = useSearchParams();
  const t = useTranslations("freeTools");
  const rawSector = searchParams?.get("sector") ?? "";
  const selectedSector = rawSector === "all" || rawSector === "" ? null : rawSector;

  const filteredSections = selectedSector
    ? categorySections
        .map((sec) => ({
          ...sec,
          tools: sec.tools.filter((t) => t.sectorKey === selectedSector),
        }))
        .filter((sec) => sec.tools.length > 0)
    : categorySections;

  if (filteredSections.length === 0) {
    return (
      <div className="mt-4 text-center text-sm text-gray-400">
        {byCategoryTitle}
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-10">
      <h2 className="text-lg font-bold text-gray-900">
        {byCategoryTitle}
      </h2>

      {filteredSections.map((section) => (
        <section key={section.slug}>
          <h3
            id={`cat-${section.slug}`}
            className="mb-3 text-base font-semibold text-gray-800"
          >
            {section.title}
            <span className="ml-2 text-sm font-normal text-gray-400">
              {t("toolsCount", { count: section.tools.length })}
            </span>
          </h3>
          <ToolAlphaList
            tools={section.tools}
            locale={locale}
            categoryName={section.title}
          />
        </section>
      ))}
    </div>
  );
}
