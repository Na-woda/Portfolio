import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  send: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.send };
  },
}));

import sendEmail from "./send-email.js";

type Request = Parameters<typeof sendEmail>[0];
type Response = Parameters<typeof sendEmail>[1];

function createRequest(
  body: unknown,
  options: { method?: string; contentType?: string; contentLength?: string } = {},
) {
  return {
    method: options.method ?? "POST",
    headers: {
      "content-type": options.contentType ?? "application/json",
      "content-length": options.contentLength,
      "x-forwarded-for": "203.0.113.42",
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
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.CONTACT_RECEIVER_EMAIL = "owner@example.com";
    process.env.CONTACT_SENDER_EMAIL = "Portfolio <verified@example.com>";
    mocks.send.mockResolvedValue({ data: { id: "email-id" }, error: null });
  });

  it("sends a validated message to the configured recipient with the visitor as reply-to", async () => {
    const response = await submit(validMessage);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Message sent." });
    expect(mocks.send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Portfolio <verified@example.com>",
        to: "owner@example.com",
        replyTo: "visitor@example.com",
        subject: "New message from your portfolio",
      }),
    );
  });

  it("escapes untrusted text before building the HTML email", async () => {
    await submit({
      ...validMessage,
      name: "<img src=x onerror=alert(1)>",
      message: "<script>alert(1)</script>",
    });

    const [email] = mocks.send.mock.calls[0] as [
      { html: string },
    ];
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
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("rejects non-POST requests and unsupported content types", async () => {
    const methodResponse = await submit(validMessage, { method: "GET" });
    const contentTypeResponse = await submit(validMessage, {
      contentType: "text/plain",
    });

    expect(methodResponse.statusCode).toBe(405);
    expect(methodResponse.headers.allow).toBe("POST");
    expect(contentTypeResponse.statusCode).toBe(415);
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("rejects oversized and malformed JSON requests", async () => {
    const oversized = await submit(validMessage, { contentLength: "20000" });
    const malformed = await submit("{");

    expect(oversized.statusCode).toBe(413);
    expect(malformed.statusCode).toBe(400);
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("silently accepts a honeypot submission without sending email", async () => {
    const response = await submit({ ...validMessage, website: "spam.example" });

    expect(response.statusCode).toBe(200);
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("fails closed when email delivery configuration is invalid", async () => {
    process.env.CONTACT_SENDER_EMAIL = "not a sender";
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await submit(validMessage);

    expect(response.statusCode).toBe(503);
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("returns a generic server error when Resend rejects the message", async () => {
    mocks.send.mockResolvedValueOnce({
      data: null,
      error: { name: "validation_error", message: "private provider detail" },
    });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await submit(validMessage);

    expect(response.statusCode).toBe(502);
    expect(response.body).toEqual({ error: "Your message could not be sent." });
    expect(JSON.stringify(response.body)).not.toContain("private provider detail");
  });

  it("returns a generic server error when the Resend request fails", async () => {
    mocks.send.mockRejectedValueOnce(new Error("network details"));
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await submit(validMessage);

    expect(response.statusCode).toBe(502);
    expect(JSON.stringify(response.body)).not.toContain("network details");
  });
});
