import { describe, expect, it, test } from "vitest";

import {
  handleAuthLogin,
  createUser,
  deleteUser,
} from "../src/services/AuthLogin.js";
import {
  ErrorMissingCredentials,
  ErrorUserExists,
} from "../src/services/errors.js";

describe("handleAuthLogin -> User Login", () => {
  it("When either username or password is not supplied, expect a generic error", async () => {
    const searchParams = new URLSearchParams();
    searchParams.set("username", "validuser");
    searchParams.set("password", "");
    const info = {
      headers: {},
      remoteAddress: "",
      method: "",
      pathname: "",
      searchParams,
    };

    const response = await handleAuthLogin(info);

    expect(response.statusCode).toBe(200); // Client expects all responses to be 200
    expect(response.body).toBe(
      "reasoncode=INV-200\nreasontext=Unable to login\nreasonurl=https://rusty-motors.com"
    );
    expect(response.headers).toEqual({ "Content-Type": "text/plain" });
  });

  it("When user is not found, expect a generic error", async () => {
    const searchParams = new URLSearchParams();
    searchParams.set("username", "nonexistent");
    searchParams.set("password", "password");
    const info = {
      headers: {},
      remoteAddress: "",
      method: "",
      pathname: "",
      searchParams,
    };

    const response = await handleAuthLogin(info);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(
      "reasoncode=INV-200\nreasontext=Unable to login\nreasonurl=https://rusty-motors.com"
    );
    expect(response.headers).toEqual({ "Content-Type": "text/plain" });
  });

  it("should return 200 with user data if login is successful", async () => {
    const searchParams = new URLSearchParams();
    searchParams.set("username", "validuser");
    searchParams.set("password", "password");
    const info = {
      headers: {},
      remoteAddress: "",
      method: "",
      pathname: "",
      searchParams,
    };

    await createUser("validuser", "password");

    const response = await handleAuthLogin(info);

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain(`Valid=TRUE\nTicket=`);
    expect(response.headers).toEqual({ "Content-Type": "text/plain" });
  });
});

describe("AuthLogin -> createUser", () => {
  it("when username is blank, expect an ErrorMissingCredentials to be thrown", async () => {
    // Arrange
    const user = "";
    const password = "password";

    // Assert
    try {
      await createUser(user, password);
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(ErrorMissingCredentials);
      expect((error as Error).message).toBe("Username is required");
    }
  });

  it("when password is blank, expect an ErrorMissingCredentials to be thrown", async () => {
    // Arrange
    const user = "validuser";
    const password = "";

    // Assert
    try {
      await createUser(user, password);
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(ErrorMissingCredentials);
      expect((error as Error).message).toBe("Password is required");
    }
  });

  it("when user already exists, expect an ErrorUserExists to be thrown", async () => {
    // Arrange
    const user = "validuser";
    const password = "password";
    await deleteUser(user);
    await createUser(user, password);

    // Assert
    try {
      await createUser(user, password);
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(ErrorUserExists);
    }
  });

  test("when user is created, expect a promise to be resolved with the user", async () => {
    // Arrange
    const user = "validuser";
    const password = "password";
    await deleteUser(user);

    // Act
    const result = createUser(user, password);

    // Assert
    await expect(result).resolves.toEqual({ username: user, password });
  });
});
