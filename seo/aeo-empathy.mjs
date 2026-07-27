/**
 * AEO empathy leads — problem-first lines shown above the direct answer.
 * Keep short, specific, engineer-to-engineer. No certification claims.
 */
export const AEO_EMPATHY = {
  'tolerance-stack-up': {
    problem:
      'You are about to freeze tolerances on a drawing — and the only question that matters is whether the gap still closes when every contributor hits its legal extreme.',
    promise: 'Get a defendable stack prediction before steel is cut.',
  },
  'cnc-feeds-speeds': {
    problem:
      'A catalog Vc looks fine on paper until the spindle runs out of torque mid-cut and you lose a tool — and a shift.',
    promise: 'Check speed, feed, chip load, and power demand against the machine you actually own.',
  },
  'machine-hour-rate': {
    problem:
      'If the shop rate was built on wishful annual hours, every quote that uses it is already underwater.',
    promise: 'Build an honest €/h from ownership, energy, labor share, and real utilization.',
  },
  'quote-pricing': {
    problem:
      'A sell price that ignores scrap, setup amortization, or payment float feels competitive — until the job ships and the margin vanishes.',
    promise: 'Recover true manufactured cost before you lock the customer promise.',
  },
  'true-labor-cost': {
    problem:
      'Net wage is not what the employer pays. Quoting on payslip numbers understates cost by the hidden burden you never wrote down.',
    promise: 'Convert net pay into a fully loaded true hourly cost you can defend to finance.',
  },
  'oee-teep': {
    problem:
      'A single “efficiency” percentage hides whether you are losing the shift to downtime, speed loss, or scrap.',
    promise: 'Split availability, performance, and quality so improvement work hits the real loss bucket.',
  },
  'bearing-life-l10': {
    problem:
      'Catalog capacity looks generous until equivalent load, speed, and dirty oil collapse L10 into a maintenance surprise.',
    promise: 'Screen ISO 281 basic and modified life before the housing is cast.',
  },
  'bolt-torque-preload': {
    problem:
      'Torque on a wrench is not preload in the joint — friction scatter can leave you clamped on hope.',
    promise: 'Estimate preload from torque with explicit friction assumptions you can audit.',
  },
  'bolted-joint': {
    problem:
      'A joint that looks fine at assembly can lose clamp under working load if stiffness and embedment were never checked.',
    promise: 'Screen VDI-style joint behavior before the pattern is released.',
  },
  'pipe-wall-thickness': {
    problem:
      'Buying the schedule by habit is how projects discover under-thickness after the mill run.',
    promise: 'Screen ASME B31.3-style wall need — including mill tolerance — before purchase.',
  },
  'pressure-vessel-shell': {
    problem:
      'Shell thickness mistakes are expensive once plate is ordered and the AI stamp conversation starts.',
    promise: 'Screen internal-pressure shell thickness in the stated ASME VIII scope before detailing.',
  },
  'weld-heat-input': {
    problem:
      'Heat input and t8/5 decide HAZ behavior — guessing from “we always run it this way” is how procedures fail review.',
    promise: 'Compute heat input and cooling estimate with inputs you can put on the traveler.',
  },
};
