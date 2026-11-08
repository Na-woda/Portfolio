import type { IncomingMessage, ServerResponse } from "node:http";
import nodemailer from "nodemailer";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 10_240;
const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 5_000;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;
const ipRequests = new Map<string, number[]>();

export function _resetRateLimits(): void {
  ipRequests.clear();
}

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

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getClientIp(request: VercelRequest): string {
  const forwarded = request.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].split(",")[0].trim();
  }
  const realIp = request.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) {
    return realIp.trim();
  }
  return request.socket?.remoteAddress || "127.0.0.1";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipRequests.get(ip) ?? [];

  const activeTimestamps = timestamps.filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS,
  );

  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequests.set(ip, activeTimestamps);
    return true;
  }

  activeTimestamps.push(now);
  ipRequests.set(ip, activeTimestamps);

  if (ipRequests.size > 1000) {
    for (const [key, times] of ipRequests.entries()) {
      const remaining = times.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (remaining.length === 0) {
        ipRequests.delete(key);
      } else {
        ipRequests.set(key, remaining);
      }
    }
  }

  return false;
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

  // Honeypot spam check - silently return 200 without sending email
  if (typeof body.website === "string" && body.website.trim()) {
    return respond(response, 200, { message: "Message received." });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  // Prevent email header injection by rejecting carriage return / newline characters in header fields
  if (/[\r\n]/.test(name) || /[\r\n]/.test(email)) {
    return respond(response, 400, { error: "Invalid input characters." });
  }

  if (!name || name.length > MAX_NAME_LENGTH) {
    return respond(response, 400, { error: "Enter a name of 1 to 100 characters." });
  }
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return respond(response, 400, { error: "Enter a valid email address." });
  }
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return respond(response, 400, { error: "Enter a message of 1 to 5000 characters." });
  }

  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp)) {
    response.setHeader(
      "Retry-After",
      Math.ceil(RATE_LIMIT_WINDOW_MS / 1000).toString(),
    );
    return respond(response, 429, {
      error: "Too many requests. Please try again later.",
    });
  }

  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.trim().replace(/\s+/g, "");
  const receiver = process.env.CONTACT_RECEIVER_EMAIL?.trim();

  if (
    !gmailUser ||
    !EMAIL_PATTERN.test(gmailUser) ||
    !gmailAppPassword ||
    !receiver ||
    !EMAIL_PATTERN.test(receiver)
  ) {
    console.error("Contact email environment variables are not configured.");
    return respond(response, 503, { error: "Contact service is not configured." });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${gmailUser}>`,
      to: receiver,
      replyTo: email,
      subject: "New message from your portfolio",
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Message:</strong><br>${safeMessage}</p>`,
    });

    return respond(response, 200, { message: "Message sent." });
  } catch (error) {
    console.error("Failed to send contact email.", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return respond(response, 502, { error: "Your message could not be sent." });
  }
}
