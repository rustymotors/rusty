import { Sequelize } from "sequelize";

import { User, type UserAttributes } from "../models/User.js";
import type { parsedHttpRequestData, RequestResponse } from "../types.js";
import { db } from "../db.js";
import { log } from "@rusty/util";

export class AuthLogin {
  private sequelize: Sequelize;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }

  async create(username: string, password: string): Promise<void> {
    log.debug("AuthLogin.create");
    log.debug(`Creating user: ${username}`);
    try {
      const user = await User.create({
        username,
        password,
      });
      log.debug(`User created: ${user ? user.username : "null"}`);
    } catch (error: unknown) {
      log.error(`Error creating user: ${(error as Error).message}`);
      throw error;
    }
  }

  async login(
    username: string,
    password: string
  ): Promise<Omit<UserAttributes, "id"> | null> {
    log.debug("AuthLogin.login");
    log.debug(`Searching for user: ${username}`);
    const user = await User.findOne({
      where: {
        username,
        password,
      },
    });

    if (!user) {
      log.debug("User not found");
      return null;
    }

    log.debug("User found");
    return {
      username: user.username,
      password: user.password,
    };
  }
}

export async function handleAuthLogin(
  info: parsedHttpRequestData
): Promise<RequestResponse> {
  const username = (info.searchParams.get("username") as string) || "";
  const password = (info.searchParams.get("password") as string) || "";

  if (username === "" || password === "") {
    return generateLoginError("INV-200", "Unable to login", "https://rusty-motors.com");
  }

  const authLogin = new AuthLogin(db);
  const user = await authLogin.login(username, password);

  if (!user) {
    return generateLoginError("INV-200", "Unable to login", "https://rusty-motors.com");
  }

  const token = "abc123";

  return constructLoginResponse(`Valid=TRUE\nTicket=${token}`)
}

function constructLoginResponse(body = ""): RequestResponse {
  return {
    statusCode: 200,
    body,
    headers: { "Content-Type": "text/plain" },
  };
}

function generateLoginError(
  errorCode = "INV-200",
  errorText = "Unable to login",
  errorUrl = "https://rusty-motors.com"
): RequestResponse | PromiseLike<RequestResponse> {
  return {
    statusCode: 200,
    body: `reasoncode=${errorCode}\nreasontext=${errorText}\nreasonurl=${errorUrl}`,
    headers: { "Content-Type": "text/plain" },
  };
}

export async function createUser(
  username: string,
  password: string
): Promise<void> {
  const authLogin = new AuthLogin(db);
  await authLogin.create(username, password);
}
