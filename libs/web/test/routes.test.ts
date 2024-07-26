import { describe, expect, it, test } from "vitest";
import { RouteHandlers, User } from "#internal";

describe("RouteHandlers", () => {
  it("should have a handler for /AuthLogin", () => {
    expect(RouteHandlers["/AuthLogin"]).toBeDefined();
  });

  test("when /AuthLogin is called with a missing username, expect a generic error", async () => {
    // Arrange
    const searchParams = new URLSearchParams();
    searchParams.set("password", "password");
    const info = {
      headers: {},
      remoteAddress: "",
      method: "",
      pathname: "/AuthLogin",
      searchParams,
    };

    // Act
    const response = await RouteHandlers["/AuthLogin"](info);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(
      "reasoncode=INV-200\nreasontext=Unable to login\nreasonurl=https://rusty-motors.com"
    );
    expect(response.headers).toEqual({ "Content-Type": "text/plain" });
  });

  test("when /AuthLogin is called with a missing password, expect a generic error", async () => {
    // Arrange
    const searchParams = new URLSearchParams();
    searchParams.set("username", "validuser");
    const info = {
      headers: {},
      remoteAddress: "",
      method: "",
      pathname: "/AuthLogin",
      searchParams,
    };

    // Act
    const response = await RouteHandlers["/AuthLogin"](info);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(
      "reasoncode=INV-200\nreasontext=Unable to login\nreasonurl=https://rusty-motors.com"
    );
    expect(response.headers).toEqual({ "Content-Type": "text/plain" });
  });

  test("when /AuthLogin is called with a valid username and password, expect a login response", async () => {
    // Arrange
    const searchParams = new URLSearchParams();
    searchParams.set("username", "validuser");
    searchParams.set("password", "password");
    const info = {
      headers: {},
      remoteAddress: "",
      method: "",
      pathname: "/AuthLogin",
      searchParams,
    };
    await User.sync({ force: true });
    await User.findOrCreate({
      where: { username: "validuser", password: "password", customerId: 1 },
    }).catch((error: unknown) => {
      console.error((error as Error).message);
      expect(true).toBe(false);
    });

    // Act
    const response = await RouteHandlers["/AuthLogin"](info);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toContain(`Valid=TRUE\nTicket=`);
    expect(response.headers).toEqual({ "Content-Type": "text/plain" });
  });
});
