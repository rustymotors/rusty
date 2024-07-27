import { describe, expect, test } from "vitest";
import { extractCredentials, validateCredentials } from "../src/helpers.js";

describe("extractCredentials", () => {
  test("should extract username and password from parsed HTTP request data", () => {
    // Arrange
    const info = {
      headers: {},
      remoteAddress: "",
      method: "",
      pathname: "",
      searchParams: new URLSearchParams(
        "username=testuser&password=testpassword"
      ),
    };

    // Act
    const result = extractCredentials(info);

    // Assert
    expect(result).toEqual({ username: "testuser", password: "testpassword" });
  });

  test("should return empty strings if username and password are missing", () => {
    // Arrange
    const info = {
      headers: {},
      remoteAddress: "",
      method: "",
      pathname: "",
      searchParams: new URLSearchParams(),
    };

    // Act
    const result = extractCredentials(info);

    // Assert
    expect(result).toEqual({ username: "", password: "" });
  });
});

describe("validateCredentials", () => {
  test("should throw an error if username is empty", () => {
    // Arrange
    const username = "";
    const password = "testpassword";

    // Act & Assert
    expect(() => validateCredentials(username, password)).toThrow(
      "Username is required"
    );
  });

  test("should throw an error if password is empty", () => {
    // Arrange
    const username = "testuser";
    const password = "";

    // Act & Assert
    expect(() => validateCredentials(username, password)).toThrow(
      "Password is required"
    );
  });

  test("should not throw an error if both username and password are provided", () => {
    // Arrange
    const username = "testuser";
    const password = "testpassword";

    // Act & Assert
    expect(() => validateCredentials(username, password)).not.toThrow();
  });
});
