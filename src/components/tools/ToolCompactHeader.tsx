import type { LucideIcon } from "lucide-react";

export type ToolCompactHeaderProps = {
  readonly toolName: string;
  readonly summary: string;
  readonly keywordTags: readonly string[];
  readonly icon: LucideIcon;
};

export function ToolCompactHeader({
  toolName,
  summary,
  keywordTags,
  icon: Icon,
}: ToolCompactHeaderProps) {
  return (
    <div className="sc-tool-compact-header">
      <div className="sc-tool-compact-header__icon-wrap" aria-hidden="true">
        <Icon className="sc-tool-compact-header__icon" strokeWidth={1.5} />
      </div>
      <div className="sc-tool-compact-header__copy">
        <h1 className="sc-tool-compact-header__title">{toolName}</h1>
        {summary ? <p className="sc-tool-compact-header__summary tool-description">{summary}</p> : null}
        {keywordTags.length > 0 ? (
          <div className="sc-tool-compact-header__tags">
            {keywordTags.map((tag) => (
              <span key={tag} className="sc-tool-compact-header__tag">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
