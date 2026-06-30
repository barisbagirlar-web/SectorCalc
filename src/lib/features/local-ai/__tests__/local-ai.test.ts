import { describe, expect, test } from "vitest";
import { buildLocalAiAnswer } from "@/lib/features/local-ai/answer-builder";
import { containsForbiddenClaim } from "@/lib/features/local-ai/safety-filter";
import { routeIntent } from "@/lib/features/local-ai/intent-router";
import { getDefaultKnowledgeItems } from "@/lib/features/local-ai/knowledge";

describe("local-ai answer builder", () => {
  test("routes free tool questions with a disclaimer", () => {
    const result = buildLocalAiAnswer({
      input: "free calculator for manufacturing",
      locale: "en",
      routeResult: routeIntent(
        "free calculator for manufacturing",
        getDefaultKnowledgeItems("en"),
        "en",
      ),
    });

    expect(result.answer.length).toBeGreaterThan(0);
    expect(result.disclaimer).toContain("technical simulation");
    expect(result.confidence).toBeGreaterThan(0);
  });

  test("declines forbidden overconfident claims in knowledge copy", () => {
    expect(containsForbiddenClaim("This is financial advice")).toBe(true);
    expect(containsForbiddenClaim("Browse free calculators")).toBe(false);
  });


});
