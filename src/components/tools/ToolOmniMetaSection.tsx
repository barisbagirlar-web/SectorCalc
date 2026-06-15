type ToolOmniMetaSectionProps = {
  readonly toolName: string;
};

const CREATOR_AVATAR_SRC = "/img/creators/neela-nataraj.png";
const CREATOR_NAME = "Prof. Dr. Neela Nataraj";
const REVIEWER_NAMES = "Bogna Szyk, Adena Benn";
const HELPFUL_COUNT = "1,892";

const SOCIAL_ACTIONS = [
  { id: "like", label: "Like", count: "1K" },
  { id: "favorite", label: "Favorite", count: "1K" },
  { id: "bookmark", label: "Bookmark", count: "1K" },
  { id: "share", label: "Share", count: "1K" },
  { id: "embed", label: "Embed", count: "1K" },
  { id: "comment", label: "Comment", count: "1K" },
] as const;

export function ToolOmniMetaSection({ toolName }: ToolOmniMetaSectionProps) {
  return (
    <section className="sc-tool-omni-meta" aria-label="Calculator information">
      <div className="sc-tool-omni-meta__top">
        <div className="sc-tool-omni-meta__identity">
          <div className="sc-tool-omni-meta__avatar-wrap">
            <img
              src={CREATOR_AVATAR_SRC}
              alt={CREATOR_NAME}
              width={48}
              height={48}
              className="sc-tool-omni-meta__avatar"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="sc-tool-omni-meta__copy">
            <h1 className="sc-tool-omni-meta__title">{toolName}</h1>
            <p className="sc-tool-omni-meta__line">
              <span className="sc-tool-omni-meta__label">Creators:</span>{" "}
              <span className="sc-tool-omni-meta__name">{CREATOR_NAME}</span>
            </p>
            <p className="sc-tool-omni-meta__line">
              <span className="sc-tool-omni-meta__label">Reviewers:</span>{" "}
              <span className="sc-tool-omni-meta__name">{REVIEWER_NAMES}</span>
            </p>
          </div>
        </div>

        <div className="sc-tool-omni-meta__helpful">
          <div className="sc-tool-omni-meta__helpful-count">{HELPFUL_COUNT}</div>
          <div className="sc-tool-omni-meta__helpful-label">people find this helpful</div>
        </div>
      </div>

      <div className="sc-tool-omni-meta__actions" role="group" aria-label="Social actions">
        {SOCIAL_ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            className="sc-tool-omni-meta__action"
            aria-label={`${action.label} (${action.count})`}
          >
            <span className="sc-tool-omni-meta__action-count">{action.count}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
