import { describe, expect, test } from "vitest";
import { Session, type SessionCreationAttributes } from "@rusty/web";

describe("Session model", () => {
  test("should create a new session", () => {
    const sessionData: SessionCreationAttributes = {
      customerId: 1,
      sessionToken: "abc123",
      createdAt: new Date(),
    };

    const session = new Session(sessionData);

    expect(session.customerId).toEqual(sessionData.customerId);
    expect(session.sessionToken).toEqual(sessionData.sessionToken);
    expect(session.createdAt).toEqual(sessionData.createdAt);
  });

  test("should have correct default values", () => {
    const session = new Session();

    expect(session.customerId).toBeUndefined();
    expect(session.sessionToken).toBeUndefined();
    expect(session.createdAt).not.toBeUndefined();
  });
});
