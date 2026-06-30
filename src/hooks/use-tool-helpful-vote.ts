"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  applyToolHelpfulVote,
  clampHelpfulCount,
  clearToolHelpfulVote,
  getToolHelpfulVoteStorageKey,
  resolveToolHelpfulCount,
  type ToolHelpfulCountTier,
  type ToolHelpfulVote,
} from "@/lib/features/tools/tool-helpful-count";

type ToolHelpfulVoteState = {
  readonly vote: ToolHelpfulVote;
  readonly count: number;
};

function readStoredVoteState(slug: string, baseCount: number): ToolHelpfulVoteState {
  if (typeof window === "undefined") {
    return { vote: null, count: baseCount };
  }

  try {
    const raw = window.localStorage.getItem(getToolHelpfulVoteStorageKey(slug));
    if (!raw) {
      return { vote: null, count: baseCount };
    }

    const parsed = JSON.parse(raw) as Partial<ToolHelpfulVoteState>;
    const vote = parsed.vote === "up" || parsed.vote === "down" ? parsed.vote : null;
    const count =
      typeof parsed.count === "number" && Number.isFinite(parsed.count)
        ? clampHelpfulCount(parsed.count)
        : baseCount;

    return { vote, count };
  } catch {
    return { vote: null, count: baseCount };
  }
}

function writeStoredVoteState(slug: string, state: ToolHelpfulVoteState): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(getToolHelpfulVoteStorageKey(slug), JSON.stringify(state));
  } catch {
    // Ignore quota / private mode errors.
  }
}

export function useToolHelpfulVote(slug: string, tier: ToolHelpfulCountTier) {
  const baseCount = useMemo(() => resolveToolHelpfulCount(slug, tier), [slug, tier]);
  const [state, setState] = useState<ToolHelpfulVoteState>(() => ({
    vote: null,
    count: baseCount,
  }));

  useEffect(() => {
    setState(readStoredVoteState(slug, baseCount));
  }, [slug, baseCount]);

  useEffect(() => {
    writeStoredVoteState(slug, state);
  }, [slug, state]);

  const applyVote = useCallback((nextVote: "up" | "down") => {
    setState((current) => {
      const next = applyToolHelpfulVote(current.count, current.vote, nextVote);
      return {
        vote: next.vote,
        count: clampHelpfulCount(next.count),
      };
    });
  }, []);

  const clearVote = useCallback(() => {
    setState((current) => {
      const next = clearToolHelpfulVote(current.count, current.vote);
      return {
        vote: next.vote,
        count: clampHelpfulCount(next.count),
      };
    });
  }, []);

  return {
    helpfulCount: state.count,
    vote: state.vote,
    applyVote,
    clearVote,
  };
}
