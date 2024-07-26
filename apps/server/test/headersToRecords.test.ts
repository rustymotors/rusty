import { describe, expect, test } from "vitest";
import { headersToRecords } from "../src/headersToRecords.js";
import type { IncomingHttpHeaders } from "node:http";

describe("headersToRecords", () => {
  test("should convert headers to records", () => {
    const headers: IncomingHttpHeaders = {
      "content-type": "application/json",
      "x-auth-token": "abc123",
      accept: "application/json, text/html",
    };

    const expected = {
      "content-type": "application/json",
      "x-auth-token": "abc123",
      accept: "application/json, text/html",
    };

    const result = headersToRecords(headers);

    expect(result).toEqual(expected);
  });

  test("should handle empty headers", () => {
    const headers = {};

    const expected = {};

    const result = headersToRecords(headers);

    expect(result).toEqual(expected);
  });
});
