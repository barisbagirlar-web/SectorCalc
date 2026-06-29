import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

const REFERENCE_LOGO_PATH = "/img/home/industry-reference-logos.png";
const REFERENCE_LOGO_WIDTH = 1024;
const REFERENCE_LOGO_HEIGHT = 571;

const REFERENCE_NAMES = [
  "Bosch",
  "MIT",
  "3M",
  "Bloomberg",
  "Reuters",
  "Caterpillar",
  "Imperial College London",
  "Parker",
  "AP News",
  "AFP",
  "ETH Zurich",
  "Honeywell",
  "Festo",
  "Manufacturing.net",
  "Tsinghua University",
  "ABB",
  "Schneider Electric",
  "UPI",
  "Industry Week",
  "KUKA",
  "Fanuc",
  "ThomasNet",
  "Siemens",
  "Rockwell Automation",
  "Delft University of Technology",
  "Engineering.com",
  "Machine Design",
  "Nanyang Technological University (NTU)",
  "Mitsubishi Electric",
] as const;

export async function HomepageCredibilitySection() {
  const t = await getTranslations("homepageHybrid");

  return (
    <section
      className="sc-home-hybrid__credibility sc-home-hybrid__section"
      aria-labelledby="home-references-heading"
    >
      <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
        <div className="sc-home-hybrid__references" aria-labelledby="home-references-heading">
          <p id="home-references-heading" className="sc-home-hybrid__references-eyebrow">
            {t("references.eyebrow")}
          </p>
          <figure className="sc-home-hybrid__references-figure">
            <Image
              src={REFERENCE_LOGO_PATH}
              alt={t("references.imageAlt")}
              width={REFERENCE_LOGO_WIDTH}
              height={REFERENCE_LOGO_HEIGHT}
              className="sc-home-hybrid__references-img"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 960px"
              unoptimized
            />
            <figcaption className="sr-only">
              {t("references.ariaLabel")}: {REFERENCE_NAMES.join(", ")}
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
