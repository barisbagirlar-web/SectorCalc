type CaseStudyFeaturedAnswerProps = {
  readonly question: string;
  readonly answer: string;
  readonly bullets: readonly string[];
};

/** Featured-snippet block - keeps speakable CSS selectors used in JSON-LD. */
export function CaseStudyFeaturedAnswer({
  question,
  answer,
  bullets,
}: CaseStudyFeaturedAnswerProps) {
  return (
    <section
      className="record-snippet sc-featured-answer"
      aria-labelledby="case-study-snippet-heading"
    >
      <h2 id="case-study-snippet-heading" className="sc-featured-answer__question record-snippet-question">
        {question}
      </h2>
      <p className="sc-featured-answer__answer record-snippet-answer">{answer}</p>
      {bullets.length > 0 ? (
        <ul className="sc-featured-answer__list record-snippet-list">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
