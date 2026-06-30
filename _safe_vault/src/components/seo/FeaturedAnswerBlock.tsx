export type FeaturedAnswerBlockProps = {
  readonly question: string;
  readonly answer: string;
  readonly bullets?: readonly string[];
  readonly steps?: readonly string[];
  readonly id?: string;
};

export function FeaturedAnswerBlock({
  question,
  answer,
  bullets,
  steps,
  id,
}: FeaturedAnswerBlockProps) {
  const headingId = id ?? "featured-answer-heading";

  return (
    <section className="sc-featured-answer sc-industrial-panel sc-ledger-letterpress" aria-labelledby={headingId}>
      <h2 id={headingId} className="sc-featured-answer__question">
        {question}
      </h2>
      <p className="sc-featured-answer__answer">{answer}</p>
      {bullets && bullets.length > 0 ? (
        <ul className="sc-featured-answer__list">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
      {steps && steps.length > 0 ? (
        <ol className="sc-featured-answer__steps">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
