import type { IncomingMessage, ServerResponse } from "node:http";
import { Resend } from "resend";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENDER_PATTERN =
  /^(?:[^<>\r\n]*<[^<>\s@]+@[^<>\s@]+\.[^<>\s@]+>|[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+)$/;
const MAX_BODY_BYTES = 10_240;
const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 5_000;

type ContactBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown;
};

type VercelRequest = IncomingMessage & {
  method?: string;
  body: unknown;
};

type VercelResponse = ServerResponse & {
  status(statusCode: number): VercelResponse;
  json(body: Record<string, string>): VercelResponse;
};

function respond(
  response: VercelResponse,
  status: number,
  body: Record<string, string>,
) {
  return response.status(status).json(body);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function readBody(body: unknown): ContactBody | null {
  let parsed = body;

  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed) as unknown;
    } catch {
      return null;
    }
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return null;
  }

  return parsed as ContactBody;
}

export default async function sendEmail(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return respond(response, 405, { error: "Method not allowed." });
  }

  const contentType = request.headers["content-type"]?.split(";")[0].trim();
  if (contentType !== "application/json") {
    return respond(response, 415, { error: "Content-Type must be application/json." });
  }

  const contentLength = Number(request.headers["content-length"] ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return respond(response, 413, { error: "Request is too large." });
  }

  const body = readBody(request.body);
  if (!body) {
    return respond(response, 400, { error: "Invalid request body." });
  }
  if (Buffer.byteLength(JSON.stringify(body), "utf8") > MAX_BODY_BYTES) {
    return respond(response, 413, { error: "Request is too large." });
  }

  if (typeof body.website === "string" && body.website.trim()) {
    return respond(response, 200, { message: "Message received." });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > MAX_NAME_LENGTH) {
    return respond(response, 400, { error: "Enter a name of 1 to 100 characters." });
  }
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return respond(response, 400, { error: "Enter a valid email address." });
  }
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return respond(response, 400, { error: "Enter a message of 1 to 5000 characters." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const receiver = process.env.CONTACT_RECEIVER_EMAIL;
  const sender = process.env.CONTACT_SENDER_EMAIL;
  if (
    !apiKey ||
    !receiver ||
    !EMAIL_PATTERN.test(receiver) ||
    !sender ||
    sender.length > 254 ||
    !SENDER_PATTERN.test(sender)
  ) {
    console.error("Contact email environment variables are not configured.");
    return respond(response, 503, { error: "Contact service is not configured." });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: sender,
      to: receiver,
      replyTo: email,
      subject: "New message from your portfolio",
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Message:</strong><br>${safeMessage}</p>`,
    });

    if (result.error) {
      console.error("Resend rejected a portfolio contact message.", {
        name: result.error.name,
      });
      return respond(response, 502, { error: "Your message could not be sent." });
    }

    return respond(response, 200, { message: "Message sent." });
  } catch (error) {
    console.error("Resend request failed.", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return respond(response, 502, { error: "Your message could not be sent." });
  }
}
