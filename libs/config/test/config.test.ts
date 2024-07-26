import { describe, expect, it } from "vitest";
import { getServerURL } from "@rusty/config";

describe("config", () => {
  it("should have a default serverURL if SERVER_URL environment variable is not set", () => {
    expect(getServerURL()).toBe("https://rusty-motors.com");
  });

  it("should use the SERVER_URL environment variable if set", () => {
    process.env.SERVER_URL = "https://example.com";
    expect(getServerURL()).toBe("https://example.com");
  });
});
