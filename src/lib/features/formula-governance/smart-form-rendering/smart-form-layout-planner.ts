/**
 * Smart form layout planner - Phase 5H-G-B governance layout (no UI components).
 */

import type {
  SmartFormDesktopLayout,
  SmartFormLayoutSectionPlacement,
  SmartFormMobileLayout,
  SmartFormRenderPlan,
  SmartFormRenderSection,
} from "@/lib/features/formula-governance/smart-form-rendering/smart-form-render-types";

function sortSectionsForLayout(sections: readonly SmartFormRenderSection[]): SmartFormRenderSection[] {
  const priority: Record<string, number> = {
    decision_goal: 0,
    required_inputs: 1,
    optional_refinements: 2,
    advanced_professional_inputs: 3,
    default_assumptions: 4,
    derived_values: 5,
    result_preview: 6,
    validation_messages: 7,
    trust_trace: 8,
  };

  return [...sections].sort((left, right) => {
    const leftPriority = priority[left.sectionType] ?? left.order;
    const rightPriority = priority[right.sectionType] ?? right.order;
    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }
    return left.order - right.order;
  });
}

function buildMobilePlacements(
  orderedSections: readonly SmartFormRenderSection[],
): SmartFormLayoutSectionPlacement[] {
  return orderedSections.map((section, index) => ({
    sectionId: section.id,
    columnIndex: 0,
    rowOrder: index,
  }));
}

function buildDesktopPlacements(
  orderedSections: readonly SmartFormRenderSection[],
): SmartFormLayoutSectionPlacement[] {
  const placements: SmartFormLayoutSectionPlacement[] = [];
  let rowOrder = 0;

  for (const section of orderedSections) {
    const isTrustOrDerived =
      section.sectionType === "trust_trace" ||
      section.sectionType === "derived_values" ||
      section.sectionType === "result_preview";

    placements.push({
      sectionId: section.id,
      columnIndex: isTrustOrDerived ? 0 : rowOrder % 2,
      rowOrder,
    });
    rowOrder += 1;
  }

  return placements;
}

export function buildSmartFormLayoutPlan(renderPlan: SmartFormRenderPlan): {
  readonly mobileLayout: SmartFormMobileLayout;
  readonly desktopLayout: SmartFormDesktopLayout;
} {
  const orderedSections = sortSectionsForLayout(renderPlan.sections);
  const sectionOrder = orderedSections.map((section) => section.id);

  return {
    mobileLayout: {
      columns: 1,
      sectionOrder,
      placements: buildMobilePlacements(orderedSections),
    },
    desktopLayout: {
      maxColumns: 2,
      sectionOrder,
      placements: buildDesktopPlacements(orderedSections),
    },
  };
}
