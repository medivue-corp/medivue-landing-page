"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("fullName") ?? "");
    const email = String(form.get("email") ?? "");
    const message = String(form.get("message") ?? "");
    const subject = encodeURIComponent(`Medivue inquiry from ${fullName}`);
    const body = encodeURIComponent(`Full name: ${fullName}\nEmail: ${email}\n\n${message}`);

    setStatus("Opening your email app…");
    window.location.href = `mailto:contact@medivue.com?subject=${subject}&body=${body}`;
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__field">
        <label htmlFor="contact-full-name">Full name</label>
        <input id="contact-full-name" name="fullName" type="text" autoComplete="name" required placeholder="Your name" />
      </div>
      <div className="contact-form__field">
        <label htmlFor="contact-email">Email address</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
      </div>
      <div className="contact-form__field contact-form__field--message">
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" rows={5} required placeholder="Tell us what you would like to explore with Medivue." />
      </div>
      <div className="contact-form__footer">
        <p aria-live="polite">{status || "We’ll prepare this message in your email app."}</p>
        <button className="button button--dark" type="submit">Send message <span aria-hidden="true">→</span></button>
      </div>
    </form>
  );
}
