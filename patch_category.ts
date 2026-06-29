import fs from 'fs';

let content = fs.readFileSync('src/lib/catalog/resolve-tool-category.ts', 'utf8');

// Move resolveByKeywords check before the others
content = content.replace(
`  if (input.industrySlug && INDUSTRY_SLUG_TO_GLOBAL[input.industrySlug]) {`,
`  const keywordMatch = resolveByKeywords(input);
  if (keywordMatch) {
    return keywordMatch;
  }

  if (input.industrySlug && INDUSTRY_SLUG_TO_GLOBAL[input.industrySlug]) {`
);

content = content.replace(
`  const keywordMatch = resolveByKeywords(input);
  if (keywordMatch) {
    return keywordMatch;
  }

  if (input.seedCategorySlug && !FORBIDDEN_CATEGORY_SLUGS.has(input.seedCategorySlug)) {`,
`  if (input.seedCategorySlug && !FORBIDDEN_CATEGORY_SLUGS.has(input.seedCategorySlug)) {`
);

fs.writeFileSync('src/lib/catalog/resolve-tool-category.ts', content);
