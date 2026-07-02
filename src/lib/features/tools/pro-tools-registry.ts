/**
 * SectorCalc - Static Pro Tools Registry
 * Generated automatically. Do not edit manually.
 */

import PRO_001 from "../../../../data/pro-tools/PRO_001.json";
import PRO_002 from "../../../../data/pro-tools/PRO_002.json";
import PRO_003 from "../../../../data/pro-tools/PRO_003.json";
import PRO_004 from "../../../../data/pro-tools/PRO_004.json";
import PRO_005 from "../../../../data/pro-tools/PRO_005.json";
import PRO_006 from "../../../../data/pro-tools/PRO_006.json";
import PRO_007 from "../../../../data/pro-tools/PRO_007.json";
import PRO_008 from "../../../../data/pro-tools/PRO_008.json";
import PRO_009 from "../../../../data/pro-tools/PRO_009.json";
import PRO_010 from "../../../../data/pro-tools/PRO_010.json";
import PRO_011 from "../../../../data/pro-tools/PRO_011.json";
import PRO_012 from "../../../../data/pro-tools/PRO_012.json";
import PRO_013 from "../../../../data/pro-tools/PRO_013.json";
import PRO_014 from "../../../../data/pro-tools/PRO_014.json";
import PRO_015 from "../../../../data/pro-tools/PRO_015.json";
import PRO_016 from "../../../../data/pro-tools/PRO_016.json";

import type { ToolSchema, StandardVariant } from "../tool-schemas/types";

type ToolSchemaJson = Record<string, any>;

const withType = <T>(data: ToolSchemaJson): T => data as unknown as T;

export const PRO_TOOLS_MAP: Record<string, ToolSchema> = {
  "PRO_001": withType<ToolSchema>(PRO_001),
  "PRO_002": withType<ToolSchema>(PRO_002),
  "PRO_003": withType<ToolSchema>(PRO_003),
  "PRO_004": withType<ToolSchema>(PRO_004),
  "PRO_005": withType<ToolSchema>(PRO_005),
  "PRO_006": withType<ToolSchema>(PRO_006),
  "PRO_007": withType<ToolSchema>(PRO_007),
  "PRO_008": withType<ToolSchema>(PRO_008),
  "PRO_009": withType<ToolSchema>(PRO_009),
  "PRO_010": withType<ToolSchema>(PRO_010),
  "PRO_011": withType<ToolSchema>(PRO_011),
  "PRO_012": withType<ToolSchema>(PRO_012),
  "PRO_013": withType<ToolSchema>(PRO_013),
  "PRO_014": withType<ToolSchema>(PRO_014),
  "PRO_015": withType<ToolSchema>(PRO_015),
  "PRO_016": withType<ToolSchema>(PRO_016),
};

export const PRO_TOOLS_LIST: ToolSchema[] = Object.values(PRO_TOOLS_MAP);

/** Get all distinct sector paths from all tools */
export function getAllSectorPaths(): string[][] {
  return PRO_TOOLS_LIST.map(t => t.sectorPath);
}

/** Get all unique sector names (first path segment) */
export function getAllSectors(): string[] {
  return [...new Set(PRO_TOOLS_LIST.map(t => t.sectorPath[0] || "General"))];
}
