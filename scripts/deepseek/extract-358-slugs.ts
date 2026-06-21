/**
 * Extract all 358 slug names from the defined sections and print them.
 */
import { section1 } from "./lib/359-section1";
import { section2 } from "./lib/359-section2";
import { section3 } from "./lib/359-section3";
import { section4 } from "./lib/359-section4";
import { section5 } from "./lib/359-section5";
import { section6 } from "./lib/359-section6";
import { section7 } from "./lib/359-section7";
import { section8 } from "./lib/359-section8";
import { section9 } from "./lib/359-section9";
import { section10 } from "./lib/359-section10";
import { section11 } from "./lib/359-section11";
import { section12 } from "./lib/359-section12";
import { section13 } from "./lib/359-section13";
import { section14 } from "./lib/359-section14";
import { section15 } from "./lib/359-section15";
import { section16 } from "./lib/359-section16";
import { section17 } from "./lib/359-section17";
import { section18 } from "./lib/359-section18";
import { section19 } from "./lib/359-section19";
import { section20 } from "./lib/359-section20";
import { section21 } from "./lib/359-section21";
import { section22 } from "./lib/359-section22";

const all = [
  ...section1, ...section2, ...section3, ...section4,
  ...section5, ...section6, ...section7, ...section8,
  ...section9, ...section10, ...section11, ...section12,
  ...section13, ...section14, ...section15, ...section16,
  ...section17, ...section18, ...section19, ...section20,
  ...section21, ...section22,
];

for (const t of all) {
  console.log(t.slug);
}

console.error("TOTAL_SLUGS=" + all.length);
