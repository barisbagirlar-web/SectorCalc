import { LEGAL_ENTITY } from "@/config/legal-entity";

export function LegalContactBlock() {
  return (
    <p>
      {LEGAL_ENTITY.companyName}
      <br />
      Tax ID: {LEGAL_ENTITY.taxId}
      <br />
      Address: {LEGAL_ENTITY.address}
      <br />
      Phone: {LEGAL_ENTITY.phone}
      <br />
      Email:{" "}
      <a
        href={`mailto:${LEGAL_ENTITY.email}`}
        className="font-semibold text-deep-navy hover:underline"
      >
        {LEGAL_ENTITY.email}
      </a>
    </p>
  );
}
