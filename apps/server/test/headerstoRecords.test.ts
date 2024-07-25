import { describe, expect, test } from "vitest";
import { headerstoRecords } from "../src/headerstoRecords.js";
import type { IncomingHttpHeaders } from "node:http";

describe("headerstoRecords", () => {
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

    const result = headerstoRecords(headers);

    expect(result).toEqual(expected);
  });

  test("should handle empty headers", () => {
    const headers = {};

    const expected = {};

    const result = headerstoRecords(headers);

    expect(result).toEqual(expected);
  });
});
