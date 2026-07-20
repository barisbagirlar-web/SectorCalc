/**
 * Strip server-only schema payloads before they cross the RSC → client boundary.
 *
 * Live CWV diagnosis (2026-07-20): von-mises free-tool HTML was ~329KB because the
 * full V531 schema was serialized into `self.__next_f` flight props. `test_plan`
 * alone was ~102KB and `red_team_review` ~24KB — neither is rendered by
 * UniversalIndustrialDecisionForm (Advanced details uses static copy).
 *
 * Stubs keep SuperV4Schema structural shape for client contract checks without
 * shipping QA/red-team corpora to the browser. Execute continues to load the
 * full schema server-side.
 */

import type { SuperV4Schema } from "./contract-types";

const EMPTY_TEST_PLAN: SuperV4Schema["test_plan"] = {
  test_cases: [],
  coverage_requirement: "NONE",
};

const EMPTY_RED_TEAM: SuperV4Schema["red_team_review"] = {
  review_status: "NOT_REVIEWED",
  issues: [],
};

export function toClientRenderableSchema(schema: SuperV4Schema): SuperV4Schema {
  return {
    ...schema,
    test_plan: EMPTY_TEST_PLAN,
    red_team_review: EMPTY_RED_TEAM,
  };
}
