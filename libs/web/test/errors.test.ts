import { describe, expect, it } from "vitest";
import { ErrorMissingCredentials, ErrorUserExists } from "@rusty/web";

describe("Errors", () => {
  it("should have an ErrorMissingCredentials class", () => {
    expect(ErrorMissingCredentials).toBeDefined();
  });

  it("should have an ErrorUserExists class", () => {
    expect(ErrorUserExists).toBeDefined();
  });
});
