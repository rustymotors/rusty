import { describe, expect, it } from "vitest";
import { handleAuthLogin, createUser } from "../src/services/AuthLogin.js";
import {
  ErrorMissingCredentials,
  ErrorUserExists,
} from "../src/errors.js";
import { deleteUser } from "../src/services/AuthLogin.js";

describe("handleAuthLogin -> User Login", () => {
  it("When either username or password is not supplied, expect a generic error", async () => {
    // Arrange
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

    // Act
    const response = await handleAuthLogin(info);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(
      "reasoncode=INV-200\nreasontext=Unable to login\nreasonurl=https://rusty-motors.com"
    );
    expect(response.headers).toEqual({ "Content-Type": "text/plain" });
  });

  it("When user is not found, expect a generic error", async () => {
    // Arrange
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

    // Act
    const response = await handleAuthLogin(info);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(
      "reasoncode=INV-200\nreasontext=Unable to login\nreasonurl=https://rusty-motors.com"
    );
    expect(response.headers).toEqual({ "Content-Type": "text/plain" });
  });

  it("should return 200 with user data if login is successful", async () => {
    // Arrange
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

    // Act
    const response = await handleAuthLogin(info);

    // Assert
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

    // Act & Assert
    await expect(createUser(user, password)).rejects.toThrow(
      ErrorMissingCredentials
    );
  });

  it("when password is blank, expect an ErrorMissingCredentials to be thrown", async () => {
    // Arrange
    const user = "validuser";
    const password = "";

    // Act & Assert
    await expect(createUser(user, password)).rejects.toThrow(
      ErrorMissingCredentials
    );
  });

  it("when user already exists, expect an ErrorUserExists to be thrown", async () => {
    // Arrange
    const user = "validuser";
    const password = "password";
    await deleteUser(user);
    await createUser(user, password);

    // Act & Assert
    await expect(createUser(user, password)).rejects.toThrow(ErrorUserExists);
  });

  it("when user is created, expect a promise to be resolved with the user", async () => {
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
