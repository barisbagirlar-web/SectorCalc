import { describe, expect, test } from "vitest";
import {
  HOMEPAGE_AUDIENCE_ICON_MAP,
  HOMEPAGE_COVERAGE_ICON_MAP,
  HOMEPAGE_EXCEL_ICON_MAP,
  HOMEPAGE_LOSS_ICON_MAP,
  HOMEPAGE_POPULAR_TOOL_ICON_MAP,
} from "@/lib/ui-shared/home/homepage-icon-map";
import {
  HOMEPAGE_AUDIENCE_IDS,
  HOMEPAGE_COVERAGE_IDS,
  HOMEPAGE_EXCEL_IDS,
  HOMEPAGE_LOSS_IDS,
  HOMEPAGE_POPULAR_TOOLS,
} from "@/lib/ui-shared/home/homepage-positioning-data";

describe("homepage-icon-map", () => {
  test("coverage icons cover every homepage coverage id", () => {
    for (const id of HOMEPAGE_COVERAGE_IDS) {
      expect(HOMEPAGE_COVERAGE_ICON_MAP[id]).toBeDefined();
    }
  });

  test("loss icons cover every homepage loss id", () => {
    for (const id of HOMEPAGE_LOSS_IDS) {
      expect(HOMEPAGE_LOSS_ICON_MAP[id]).toBeDefined();
    }
  });

  test("audience icons cover every homepage audience id", () => {
    for (const id of HOMEPAGE_AUDIENCE_IDS) {
      expect(HOMEPAGE_AUDIENCE_ICON_MAP[id]).toBeDefined();
    }
  });

  test("excel icons cover every homepage excel id", () => {
    for (const id of HOMEPAGE_EXCEL_IDS) {
      expect(HOMEPAGE_EXCEL_ICON_MAP[id]).toBeDefined();
    }
  });

  test("popular tool icons cover every featured homepage tool", () => {
    for (const entry of HOMEPAGE_POPULAR_TOOLS) {
      expect(HOMEPAGE_POPULAR_TOOL_ICON_MAP[entry.tool.id]).toBeDefined();
    }
  });
});
