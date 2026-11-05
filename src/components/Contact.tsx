import { useState, type FormEvent } from "react";
import { profile } from "../data/portfolio";

type FieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!email.trim()) next.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (!message.trim()) next.message = "Please include a short message.";
    return next;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const subject = encodeURIComponent(`Portfolio enquiry from ${name.trim()}`);
    const body = encodeURIComponent(`${message.trim()}\n\nFrom: ${name.trim()} <${email.trim()}>`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-24">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-sage-deep">
            04 / Contact
          </p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight text-ink">
            If you are hiring, write to me
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            I am open to software engineering internships and collaboration on
            web or mobile work. Email is the most reliable way to reach me.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="text-ink underline decoration-sage underline-offset-4 hover:text-sage-deep"
              >
                {profile.email}
              </a>
            </li>
            <li>
              <a
                href={profile.phoneHref}
                className="text-muted hover:text-ink"
              >
                {profile.phone}
              </a>
            </li>
            <li>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-muted hover:text-ink"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="text-muted hover:text-ink"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>

        <form
          className="border border-line bg-card p-6 md:p-8"
          onSubmit={onSubmit}
          noValidate
        >
          <p className="text-sm text-muted">
            This form opens your email client with a drafted message. Nothing is
            sent until you send the email.
          </p>
          <div className="mt-6 grid gap-5">
            <div>
              <label htmlFor="name" className="text-sm text-ink">
                Name
              </label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full border border-line bg-cream px-3 py-2.5 text-sm text-ink"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name ? (
                <p id="name-error" className="mt-1 text-sm text-sage-deep">
                  {errors.name}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="email" className="text-sm text-ink">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full border border-line bg-cream px-3 py-2.5 text-sm text-ink"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email ? (
                <p id="email-error" className="mt-1 text-sm text-sage-deep">
                  {errors.email}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="message" className="text-sm text-ink">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="mt-2 w-full resize-y border border-line bg-cream px-3 py-2.5 text-sm text-ink"
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message ? (
                <p id="message-error" className="mt-1 text-sm text-sage-deep">
                  {errors.message}
                </p>
              ) : null}
            </div>
            <button
              type="submit"
              className="justify-self-start bg-sage-deep px-5 py-3 text-sm text-cream hover:bg-ink"
            >
              Open email draft
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
