import { describe, expect, it } from "vitest";

import { handleAuthLogin, createUser } from "../src/services/AuthLogin.js";

describe("handleAuthLogin -> User Login", () => {
  it("When either username or passwand is not supplied, expect a generic error", async () => {
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

    expect(response.statusCode).toBe(401); // Client expects all responses to be 200
    expect(response.body).toBe("reasoncode=INV-200\nreasontext=Unable to login\nreasonurl=https://rusty-motors.com");
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
    expect(response.body).toBe("reasoncode=INV-200\nreasontext=Unable to login\nreasonurl=https://rusty-motors.com");
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
