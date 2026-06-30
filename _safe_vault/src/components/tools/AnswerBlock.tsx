export type AnswerBlockProps = {
  readonly question: string;
  readonly answer: string;
};

/** Featured-snippet oriented direct-answer block (pairs with Speakable schema). */
export function AnswerBlock({ question, answer }: AnswerBlockProps) {
  return (
    <div className="answer-block sc-featured-answer sc-industrial-panel sc-ledger-letterpress my-4 border-l-4 border-premium-copper">
      <h2 className="sc-featured-answer__question text-sm font-semibold text-body-charcoal">
        {question}
      </h2>
      <p className="sc-featured-answer__answer tool-description mt-1 text-premium-velvet">
        {answer}
      </p>
    </div>
  );
}
