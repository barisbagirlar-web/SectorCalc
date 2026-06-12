import {
  CATEGORY_ICON_MAP,
  listCategoryIconSlugs,
} from "../src/lib/catalog/category-icon-map";

const slugs = listCategoryIconSlugs();
const mappedSlugs = Object.keys(CATEGORY_ICON_MAP);
const iconRefs = Object.values(CATEGORY_ICON_MAP);
const duplicateIcons = iconRefs.filter((icon, index) => iconRefs.indexOf(icon) !== index);

const checks = [
  {
    name: "icon map covers every registry category slug",
    pass: slugs.every((slug) => slug in CATEGORY_ICON_MAP),
  },
  {
    name: "icon map has no extra unknown slugs",
    pass: mappedSlugs.every((slug) => slugs.includes(slug as (typeof slugs)[number])),
  },
  {
    name: "no duplicate category icons",
    pass: duplicateIcons.length === 0,
  },
  {
    name: "registry has 20 categories",
    pass: slugs.length === 20 && mappedSlugs.length === 20,
  },
];

console.log(
  JSON.stringify({
    checks,
    slugCount: slugs.length,
    mappedCount: mappedSlugs.length,
    duplicateCount: duplicateIcons.length,
  }),
);
