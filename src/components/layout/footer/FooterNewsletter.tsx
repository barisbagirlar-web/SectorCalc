"use client";

import { useState, type FormEvent } from "react";
import { SITE } from "@/config/site";

type FooterNewsletterProps = {
  readonly title: string;
  readonly placeholder: string;
  readonly buttonLabel: string;
  readonly note: string;
};

export function FooterNewsletter({
  title,
  placeholder,
  buttonLabel,
  note,
}: FooterNewsletterProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      return;
    }

    const subject = encodeURIComponent("SectorCalc newsletter");
    const body = encodeURIComponent(`Please subscribe this email to weekly industry insights:\n\n${trimmed}`);
    window.location.href = `mailto:${SITE.contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <form className="footer-newsletter" onSubmit={handleSubmit}>
      <p className="footer-newsletter__title">{title}</p>
      <div className="footer-newsletter__row">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={placeholder}
          className="footer-newsletter__input"
          autoComplete="email"
        />
        <button type="submit" className="footer-newsletter__button">
          {buttonLabel}
        </button>
      </div>
      <p className="footer-newsletter__note">{note}</p>
    </form>
  );
}
