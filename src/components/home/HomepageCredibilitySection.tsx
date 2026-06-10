import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

const REFERENCE_LOGO_PATH = "/img/home/industry-reference-logos.png";

const REFERENCE_NAMES = [
  "Bosch",
  "Caterpillar",
  "3M",
  "Bloomberg",
  "Reuters",
  "Honeywell",
  "Parker",
  "Festo",
  "AP News",
  "AFP",
  "Schneider Electric",
  "UPI",
  "Manufacturing.net",
  "ABB",
  "KUKA",
  "Fanuc",
  "Industry Week",
  "ThomasNet",
  "Siemens",
  "Rockwell Automation",
  "Mitsubishi Electric",
  "Engineering.com",
  "Machine Design",
] as const;

export async function HomepageCredibilitySection() {
  const t = await getTranslations("homepageHybrid");

  return (
    <>
      <section
        className="sc-home-hybrid__references"
        aria-labelledby="home-references-heading"
      >
        <Container size="wide" className="sc-pro-container sc-pro-container--wide min-w-0">
          <p id="home-references-heading" className="sc-home-hybrid__references-eyebrow">
            {t("references.eyebrow")}
          </p>
          <figure className="sc-home-hybrid__references-figure">
            <Image
              src={REFERENCE_LOGO_PATH}
              alt=""
              width={1200}
              height={720}
              className="sc-home-hybrid__references-img"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 92vw, 1100px"
              priority={false}
            />
            <figcaption className="sr-only">
              {t("references.ariaLabel")}: {REFERENCE_NAMES.join(", ")}
            </figcaption>
          </figure>
        </Container>
      </section>

      <hr className="sc-ledger-separator" />

      <section
        className="sc-home-hybrid__about"
        aria-labelledby="home-about-heading"
      >
        <Container className="sc-pro-container">
          <div className="sc-home-hybrid__about-inner">
            <p className="sc-pro-eyebrow sc-home-hybrid__about-eyebrow">
              {t("aboutUs.eyebrow")}
            </p>
            <h2 id="home-about-heading" className="sr-only">
              {t("aboutUs.eyebrow")}
            </h2>
            <p className="sc-home-hybrid__about-opening">{t("aboutUs.opening")}</p>
            <p className="sc-home-hybrid__about-question">{t("aboutUs.question")}</p>
            <p className="sc-home-hybrid__about-punchline">{t("aboutUs.punchline")}</p>
            <p className="sc-home-hybrid__about-body">{t("aboutUs.mission")}</p>
            <p className="sc-home-hybrid__about-body">{t("aboutUs.vision")}</p>
          </div>
        </Container>
      </section>
    </>
  );
}
