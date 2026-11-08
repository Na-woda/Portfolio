import { LoaderCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { profile } from "../data/portfolio";
import { Reveal } from "./Reveal";

type FieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

export function Contact() {
  const reduceMotion = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submissionState, setSubmissionState] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [submissionMessage, setSubmissionMessage] = useState("");

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

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmissionState("sending");
    setSubmissionMessage("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          website,
        }),
      });

      if (!response.ok) {
        throw new Error("The contact request was not accepted.");
      }

      setName("");
      setEmail("");
      setMessage("");
      setWebsite("");
      setErrors({});
      setSubmissionState("success");
      setSubmissionMessage("Thanks for reaching out. Your message has been sent.");
    } catch {
      setSubmissionState("error");
      setSubmissionMessage(
        "Your message could not be sent. Please check your connection and try again.",
      );
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-24">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.28em] text-sage-deep">
            04 / Contact
          </p>
          <h2 className="mt-3 max-w-lg font-serif text-4xl tracking-tight text-ink">
            If you are hiring, write to me
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            I am open to software engineering internships and collaboration on
            web or mobile work. Email is the most reliable way to reach me.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            <li>
              <span className="text-ink">
                {profile.email}
              </span>
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
                data-guide-target="contact-linkedin"
                data-guide-kind="linkedin"
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
                data-guide-target="contact-github"
                data-guide-kind="github"
                target="_blank"
                rel="noreferrer"
                className="text-muted hover:text-ink"
              >
                GitHub
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal>
        <form
          data-guide-target="contact-form"
          data-guide-kind="contact-form"
          className="relative border border-line bg-card p-5 sm:p-7 md:p-8"
          onSubmit={onSubmit}
          aria-busy={submissionState === "sending"}
          noValidate
        >
          <p className="text-sm text-muted">
            Send a message directly. I’ll get back to you as soon as I can.
          </p>
          <div
            aria-hidden="true"
            className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
          >
            <label htmlFor="website">Leave this field empty</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </div>
          <div className="mt-6 grid gap-5">
            <div>
              <label htmlFor="name" className="text-sm text-ink">
                Name
              </label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                disabled={submissionState === "sending"}
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setErrors((current) => ({ ...current, name: undefined }));
                  setSubmissionState("idle");
                  setSubmissionMessage("");
                }}
                className="mt-2 w-full border border-line bg-cream px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-sage-deep focus:outline-none"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name ? (
                <p id="name-error" role="alert" className="mt-1 text-sm text-rose-500">
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
                disabled={submissionState === "sending"}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrors((current) => ({ ...current, email: undefined }));
                  setSubmissionState("idle");
                  setSubmissionMessage("");
                }}
                className="mt-2 w-full border border-line bg-cream px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-sage-deep focus:outline-none"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email ? (
                <p id="email-error" role="alert" className="mt-1 text-sm text-rose-500">
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
                disabled={submissionState === "sending"}
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  setErrors((current) => ({ ...current, message: undefined }));
                  setSubmissionState("idle");
                  setSubmissionMessage("");
                }}
                className="mt-2 w-full resize-y border border-line bg-cream px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-sage-deep focus:outline-none"
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message ? (
                <p id="message-error" role="alert" className="mt-1 text-sm text-rose-500">
                  {errors.message}
                </p>
              ) : null}
            </div>
            <motion.button
              type="submit"
              data-guide-target="contact-send"
              data-guide-kind="contact-send"
              whileHover={reduceMotion ? undefined : { y: -2 }}
              disabled={submissionState === "sending" || submissionState === "success"}
              className="button-primary inline-flex min-h-12 items-center justify-center gap-2 justify-self-start px-5 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submissionState === "sending" ? (
                <>
                  <LoaderCircle
                    className="size-4 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  Sending...
                </>
              ) : submissionState === "success" ? (
                "Message Sent!"
              ) : submissionState === "error" ? (
                "Try Again"
              ) : (
                "Send Message"
              )}
            </motion.button>
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className={`min-h-5 text-sm ${
                submissionState === "error" ? "text-rose-500" : "text-sage-deep"
              }`}
            >
              {submissionMessage}
            </p>
          </div>
        </form>
        </Reveal>
      </div>
    </section>
  );
}
