import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sendMail: vi.fn(),
  createTransport: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: mocks.createTransport,
  },
}));

import sendEmail, { _resetRateLimits } from "./send-email.js";

type Request = Parameters<typeof sendEmail>[0];
type Response = Parameters<typeof sendEmail>[1];

function createRequest(
  body: unknown,
  options: {
    method?: string;
    contentType?: string;
    contentLength?: string;
    ip?: string;
  } = {},
) {
  return {
    method: options.method ?? "POST",
    headers: {
      "content-type": options.contentType ?? "application/json",
      "content-length": options.contentLength,
      "x-forwarded-for": options.ip ?? "203.0.113.42",
    },
    body,
    socket: { remoteAddress: "127.0.0.1" },
  } as unknown as Request;
}

function createResponse() {
  const result: {
    statusCode: number;
    body?: Record<string, string>;
    headers: Record<string, string>;
    status: (statusCode: number) => typeof result;
    json: (body: Record<string, string>) => typeof result;
    setHeader: (name: string, value: string) => typeof result;
  } = {
    statusCode: 0,
    headers: {},
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
  };
  return result as unknown as Response & typeof result;
}

const validMessage = {
  name: "Nawoda",
  email: "visitor@example.com",
  message: "Hello, I would like to connect.",
};

async function submit(
  body: unknown,
  options?: Parameters<typeof createRequest>[1],
) {
  const response = createResponse();
  await sendEmail(createRequest(body, options), response);
  return response;
}

describe("POST /api/send-email", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    _resetRateLimits();
    process.env.GMAIL_USER = "sender@gmail.com";
    process.env.GMAIL_APP_PASSWORD = "abcd efgh ijkl mnop";
    process.env.CONTACT_RECEIVER_EMAIL = "owner@example.com";
    mocks.createTransport.mockReturnValue({
      sendMail: mocks.sendMail,
    });
    mocks.sendMail.mockResolvedValue({ messageId: "test-message-id" });
  });

  it("sends a validated message to the configured recipient with the visitor as reply-to via Gmail SMTP", async () => {
    const response = await submit(validMessage);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Message sent." });

    expect(mocks.createTransport).toHaveBeenCalledWith({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "sender@gmail.com",
        pass: "abcdefghijklmnop",
      },
    });

    expect(mocks.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: '"Portfolio Contact" <sender@gmail.com>',
        to: "owner@example.com",
        replyTo: "visitor@example.com",
        subject: "New message from your portfolio",
        text: `Name: Nawoda\nEmail: visitor@example.com\n\nHello, I would like to connect.`,
      }),
    );
  });

  it("escapes untrusted text before building the HTML email", async () => {
    await submit({
      ...validMessage,
      name: "<img src=x onerror=alert(1)>",
      message: "<script>alert(1)</script>",
    });

    const [email] = mocks.sendMail.mock.calls[0] as [{ html: string }];
    expect(email.html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(email.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(email.html).not.toContain("<script>");
  });

  it.each([
    [{ ...validMessage, name: " " }, "empty name"],
    [{ ...validMessage, email: "not-an-email" }, "invalid email"],
    [{ ...validMessage, message: "\n " }, "empty message"],
    [{ ...validMessage, email: "a".repeat(250) + "@example.com" }, "long email"],
  ])("rejects %s", async (body) => {
    const response = await submit(body);

    expect(response.statusCode).toBe(400);
    expect(mocks.sendMail).not.toHaveBeenCalled();
  });

  it.each([
    [{ ...validMessage, name: "Nawoda\r\nBcc: spam@example.com" }, "newline in name"],
    [{ ...validMessage, email: "visitor@example.com\r\nBcc: spam@example.com" }, "newline in email"],
  ])("rejects header injection attempt with %s", async (body) => {
    const response = await submit(body);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Invalid input characters." });
    expect(mocks.sendMail).not.toHaveBeenCalled();
  });

  it("rejects non-POST requests and unsupported content types", async () => {
    const methodResponse = await submit(validMessage, { method: "GET" });
    const contentTypeResponse = await submit(validMessage, {
      contentType: "text/plain",
    });

    expect(methodResponse.statusCode).toBe(405);
    expect(methodResponse.headers.allow).toBe("POST");
    expect(contentTypeResponse.statusCode).toBe(415);
    expect(mocks.sendMail).not.toHaveBeenCalled();
  });

  it("rejects oversized and malformed JSON requests", async () => {
    const oversized = await submit(validMessage, { contentLength: "20000" });
    const malformed = await submit("{");

    expect(oversized.statusCode).toBe(413);
    expect(malformed.statusCode).toBe(400);
    expect(mocks.sendMail).not.toHaveBeenCalled();
  });

  it("silently accepts a honeypot submission without sending email", async () => {
    const response = await submit({ ...validMessage, website: "spam.example" });

    expect(response.statusCode).toBe(200);
    expect(mocks.sendMail).not.toHaveBeenCalled();
  });

  it.each([
    ["missing GMAIL_USER", () => { delete process.env.GMAIL_USER; }],
    ["invalid GMAIL_USER", () => { process.env.GMAIL_USER = "not-an-email"; }],
    ["missing GMAIL_APP_PASSWORD", () => { delete process.env.GMAIL_APP_PASSWORD; }],
    ["empty GMAIL_APP_PASSWORD", () => { process.env.GMAIL_APP_PASSWORD = "   "; }],
    ["missing CONTACT_RECEIVER_EMAIL", () => { delete process.env.CONTACT_RECEIVER_EMAIL; }],
    ["invalid CONTACT_RECEIVER_EMAIL", () => { process.env.CONTACT_RECEIVER_EMAIL = "not-an-email"; }],
  ])("fails closed when email delivery configuration has %s", async (_, mutateEnv) => {
    mutateEnv();
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await submit(validMessage);

    expect(response.statusCode).toBe(503);
    expect(response.body).toEqual({ error: "Contact service is not configured." });
    expect(mocks.sendMail).not.toHaveBeenCalled();
  });

  it("returns a generic server error when Nodemailer fails to send", async () => {
    mocks.sendMail.mockRejectedValueOnce(new Error("SMTP connection failed: sensitive host info"));
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await submit(validMessage);

    expect(response.statusCode).toBe(502);
    expect(response.body).toEqual({ error: "Your message could not be sent." });
    expect(JSON.stringify(response.body)).not.toContain("sensitive host info");
  });

  it("enforces rate limiting per IP address", async () => {
    const clientOptions = { ip: "198.51.100.10" };

    for (let i = 0; i < 5; i++) {
      const res = await submit(validMessage, clientOptions);
      expect(res.statusCode).toBe(200);
    }

    const rateLimitedResponse = await submit(validMessage, clientOptions);
    expect(rateLimitedResponse.statusCode).toBe(429);
    expect(rateLimitedResponse.body).toEqual({
      error: "Too many requests. Please try again later.",
    });
    expect(rateLimitedResponse.headers["retry-after"]).toBeDefined();

    // Requests from a different IP should still succeed
    const otherIpResponse = await submit(validMessage, { ip: "198.51.100.11" });
    expect(otherIpResponse.statusCode).toBe(200);
  });
});
