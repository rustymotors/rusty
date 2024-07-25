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
    const user = await User.create({
      username,
      password,
    });

    log.debug(`User created: ${user ? user.username : "null"}`);    
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
    return Promise.resolve({
      statusCode: 400,
      body: "Bad Request\n",
      headers: { "Content-Type": "text/plain" },
    });
  }

  const authLogin = new AuthLogin(db);
  const user = await authLogin.login(username, password);

  if (!user) {
    return {
      statusCode: 401,
      body: "Unauthorized\n",
      headers: { "Content-Type": "text/plain" },
    };
  }

  return {
    statusCode: 200,
    body: `Valid=TRUE\nTicket=`,
    headers: { "Content-Type": "text/plain" },
  };
}

export async function createUser(username: string, password: string): Promise<void> {
  const authLogin = new AuthLogin(db);
  await authLogin.create(username, password);
}
