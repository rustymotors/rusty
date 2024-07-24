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

  async login(
    username: string,
    password: string
  ): Promise<Omit<UserAttributes, "id"> | null> {
    log.debug("AuthLogin.login");
    log.debug(`username: ${username} password: ${password}`);
    const user = await User.findOne({
      where: {
        username,
        password,
      },
    });

    if (!user) {
      return null;
    }

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
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" },
  };
}
