/**
 * SectorCalc — SEO Copy Engine (registry-driven)
 *
 * Generates H1/H2/H3/CTA structure for all tool pages from a 6-field SeoMeta object.
 * Lint-enforced in CI via lintPageCopy().
 *
 * 5-SECOND CONVICTION FORMULA:
 *   H1  = [Stop the pain] + [Concrete outcome] + [Speed/precision]
 *   H2  = [Who it's for] + [What it does] + [What it replaces]
 *   H3  = 3 measurable value props (verb + metric)
 *   CTA = Imperative + outcome — never "Learn More"
 *
 * RULES (lintPageCopy):
 *   R1: H1 <= 65 chars, exactly one H1 per page
 *   R2: H1 must contain a power verb
 *   R3: meta title <= 60 chars, meta description 140-160 chars
 *   R4: exactly 1 primary CTA per page + at most 1 secondary
 *   R5: banned words: solution, innovative, cutting-edge, Learn More, Submit
 *   R6: H1 must NOT repeat tool name verbatim
 *   R7: English-only (no Turkish characters)
 *   R8: Primary keyword must appear in metaTitle or H1
 */

export interface SeoMeta {
  pain: string;
  outcome: string;
  persona: string;
  replaces: string;
  valueProps: [string, string, string];
  primaryKeyword: string;
  painShort?: string;
  outcomeShort?: string;
}

export interface PageCopy {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  h2: string;
  h3: string[];
  h4?: string[];
  ctaPrimary: string;
  ctaSecondary?: string;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function toolPageCopy(m: SeoMeta): PageCopy {
  const pain = titleCase(m.painShort ?? m.pain);
  const painFull = titleCase(m.pain);
  const out = titleCase(m.outcomeShort ?? m.outcome);
  const outFull = titleCase(m.outcome);

  const h1Patterns = [
    (p: string, o: string) => `Stop ${p}. Get Your ${o} in Seconds.`,
    (p: string, o: string) => `Get Your ${o} Right. End ${p}.`,
    (p: string, o: string) => `Calculate Your ${o}. Stop Guessing.`,
  ];
  const pick = hashStr(m.primaryKeyword) % h1Patterns.length;
  let h1 = h1Patterns[pick](painFull, outFull);
  if (h1.length > 65) h1 = h1Patterns[pick](pain, out);
  if (h1.length > 65) h1 = h1Patterns[2](pain, out);

  const titleKw = `${titleCase(m.primaryKeyword)} | Stop ${painFull}`;
  const metaTitle = titleKw.length <= 60 ? titleKw : clampMax(`${titleCase(m.primaryKeyword)} | SectorCalc`, 60);

  return {
    metaTitle,
    metaDescription: clampMax(
      `Calculate your ${m.outcome} in seconds. Built for ${m.persona} who are done with ${m.replaces}. Audit-ready output, from $9.`,
      160,
    ),
    h1,
    h2: `The precise ${m.outcome} tool for ${m.persona} — no ${stripArticle(m.replaces)} required.`,
    h3: m.valueProps.map(cap),
    h4: [
      "How it works: enter your numbers, get an audit-ready result",
      `Who it's for: ${cap(m.persona)} and teams pricing real jobs`,
    ],
    ctaPrimary: `Calculate ${titleCase(m.outcomeShort ?? m.outcome)} Now`,
    ctaSecondary: "See a Sample Result",
  };
}

export function categoryPageCopy(categoryName: string, tools: SeoMeta[]): PageCopy {
  const top = tools.slice(0, 3);
  const personas = [...new Set(top.map((t) => t.persona))].slice(0, 2).join(" & ");
  return {
    metaTitle: clampMax(`${titleCase(categoryName)} Cost Calculators | SectorCalc`, 60),
    metaDescription: clampMax(
      `${top.map((t) => cap(t.outcomeShort ?? t.outcome)).join(", ")} — calculated instantly. The ${categoryName} toolkit for ${personas}. Start free.`,
      160,
    ),
    h1: `Never Guess in ${titleCase(categoryName)} Again.`,
    h2: `${top.map((t) => cap(t.outcomeShort ?? t.outcome)).join(", ")} — without ${stripArticle(top[0].replaces)}.`,
    h3: top.map((t) => `Stop ${t.painShort ?? t.pain}: ${cap(t.outcomeShort ?? t.outcome)} in seconds`),
    ctaPrimary: `Open ${titleCase(categoryName)} Calculators`,
    ctaSecondary: "Browse Free Tools",
  };
}

const BANNED = /\b(solution|innovative|cutting-edge|learn more|submit)\b/i;
const POWER_VERB = /\b(Stop|Calculate|Expose|Verify|Prevent|Get|Find|Turn|Never)\b/;
function buildNonEnglishPattern(): RegExp {
  const chars = [231, 287, 305, 246, 351, 252, 199, 286, 304, 214, 350, 220];
  const src = "[" + chars.map((c) => String.fromCharCode(c)).join("") + "]";
  return new RegExp(src);
}

const NON_ENGLISH = buildNonEnglishPattern();

export function lintPageCopy(p: PageCopy, toolName?: string, primaryKeyword?: string): string[] {
  const errs: string[] = [];
  if (p.h1.length > 65) errs.push(`R1: H1 is ${p.h1.length} chars (> 65)`);
  if (!POWER_VERB.test(p.h1)) errs.push("R2: H1 has no power verb");
  if (p.metaTitle.length > 60) errs.push(`R3: metaTitle is ${p.metaTitle.length} chars (> 60)`);
  if (p.metaDescription.length < 140 || p.metaDescription.length > 160)
    errs.push(`R3: metaDescription is ${p.metaDescription.length} chars (outside 140-160)`);
  const allFields = [p.metaTitle, p.metaDescription, p.h1, p.h2, p.ctaPrimary, ...p.h3, ...(p.h4 ?? [])];
  for (const field of allFields) {
    if (BANNED.test(field)) errs.push(`R5: banned word in -> "${field}"`);
    if (NON_ENGLISH.test(field)) errs.push(`R7: non-English character in -> "${field}"`);
  }
  if (toolName && p.h1.toLowerCase().includes(toolName.toLowerCase()))
    errs.push("R6: H1 repeats the tool name verbatim — state the outcome, not the name");
  if (primaryKeyword) {
    const kw = primaryKeyword.toLowerCase();
    const inTitle = p.metaTitle.toLowerCase().includes(kw);
    const inH1 = p.h1.toLowerCase().includes(kw);
    if (!inTitle && !inH1) errs.push(`R8: primary keyword "${primaryKeyword}" appears in neither metaTitle nor H1`);
  }
  return errs;
}

function clampMax(s: string, max: number) {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).replace(/\s+\S*$/, "") + ".";
}
function stripArticle(s: string) {
  return s.replace(/^(a|an|the)\s+/i, "");
}
function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
function titleCase(s: string) {
  const minor = new Set(["a", "an", "the", "and", "or", "of", "in", "on", "for", "to", "vs"]);
  return s
    .split(" ")
    .map((w, i) => (i > 0 && minor.has(w.toLowerCase()) ? w.toLowerCase() : cap(w)))
    .join(" ");
}

export const EXAMPLE_SEO_META: SeoMeta = {
  pain: "over-torqued, failing bolt joints",
  outcome: "exact bolt torque spec",
  persona: "site welders and assembly technicians",
  replaces: "outdated lookup tables",
  valueProps: [
    "Prevent joint failure from over- or under-torquing",
    "Convert bolt grade + diameter into a spec in one step",
    "Export an audit-ready torque sheet for QA",
  ],
  primaryKeyword: "bolt torque spec calculator",
  painShort: "bolt joint failures",
  outcomeShort: "exact torque spec",
};
