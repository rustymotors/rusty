import { describe, expect, it } from "vitest";
import { handleAuthLogin } from "../src/services/AuthLogin.js";

describe("handleAuthLogin", () => {
  it("should return 400 if username or password is empty", async () => {
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

    expect(response.statusCode).toBe(400);
    expect(response.body).toBe("Bad Request\n");
    expect(response.headers).toEqual({ "Content-Type": "text/plain" });
  });

  it("should return 401 if user is not found", async () => {
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

    expect(response.statusCode).toBe(401);
    expect(response.body).toBe("Unauthorized\n");
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

    const response = await handleAuthLogin(info);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(
      JSON.stringify({
        username: "validuser",
        password: "password",
      })
    );
    expect(response.headers).toEqual({ "Content-Type": "application/json" });
  });
});
