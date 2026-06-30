import { buildGeoLocaleBootstrapScript } from "@/lib/infrastructure/i18n/geo-locale-bootstrap";

/**
 * Synchronous head redirect — Apple-style geo locale routing before first paint.
 * Only rendered on English-root pages (`locale === "en"`).
 */
export function GeoLocaleBootstrapScript() {
  return (
    <script
      id="sc-geo-locale-bootstrap"
      dangerouslySetInnerHTML={{ __html: buildGeoLocaleBootstrapScript() }}
    />
  );
}
