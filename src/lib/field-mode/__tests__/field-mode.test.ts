import { describe, expect, it } from "vitest";
import { addRecentToolToList } from "@/lib/field-mode/recent-tools";
import { addDraftToList } from "@/lib/field-mode/saved-drafts";
import type { RecentToolEntry, SavedDraft } from "@/lib/field-mode/types";

const tool = (slug: string, visitedAt: number): RecentToolEntry => ({
  slug,
  title: slug,
  href: `/tools/premium/${slug}`,
  visitedAt,
});

const draft = (id: string): SavedDraft => ({
  id,
  toolSlug: "cnc",
  label: id,
  savedAt: 1,
  fields: { a: 1 },
});

describe("addRecentToolToList", () => {
  it("prepends and dedupes by slug", () => {
    const list = addRecentToolToList([tool("a", 1), tool("b", 2)], tool("a", 3));
    expect(list.map((t) => t.slug)).toEqual(["a", "b"]);
    expect(list[0].visitedAt).toBe(3);
  });

  it("caps to max", () => {
    const list = addRecentToolToList([tool("a", 1), tool("b", 2), tool("c", 3)], tool("d", 4), 2);
    expect(list.map((t) => t.slug)).toEqual(["d", "a"]);
  });
});

describe("addDraftToList", () => {
  it("prepends and dedupes by id", () => {
    const list = addDraftToList([draft("x"), draft("y")], draft("x"));
    expect(list.map((d) => d.id)).toEqual(["x", "y"]);
  });

  it("caps to max", () => {
    const list = addDraftToList([draft("a"), draft("b")], draft("c"), 2);
    expect(list.map((d) => d.id)).toEqual(["c", "a"]);
  });
});
