import { User, type UserAttributes } from "../models/User.js";
import type { parsedHttpRequestData, RequestResponse } from "../types.js";
import { log } from "@rusty/util";
import { ErrorMissingCredentials, ErrorUserExists } from "./errors.js";

function validateCredentials(username: string, password: string): void {
  if (username === "") {
    throw new ErrorMissingCredentials("Username is required");
  }

  if (password === "") {
    throw new ErrorMissingCredentials("Password is required");
  }
}

export async function createUser(
  username: string,
  password: string
): Promise<Omit<UserAttributes, "id">> {
  log.debug("AuthLogin.create");

  validateCredentials(username, password);

  log.debug(`Creating user: ${username}`);
  try {
    const user = await createUserInDatabase(username, password);
    log.debug(`User created: ${user ? user.username : "null"}`);
    return { username: user.username, password: user.password };
  } catch (error: unknown) {
    handleCreateUserError(error);
  }
}

async function createUserInDatabase(username: string, password: string): Promise<UserAttributes> {
  return await User.create({ username, password });
}

function handleCreateUserError(error: unknown): never {
  if ((error as Error).message.includes("username must be unique")) {
    const err = new Error("Error creating user");
    err.name = "ErrorUserExists";
    err.cause = error;
    log.error(`Error creating user: ${(error as Error).message}`);
    throw err;
  }
  const err = new ErrorUserExists("Error creating user");
  err.cause = error;
  log.error(`Error creating user: ${(error as Error).message}`);
  throw err;
}

export async function userLogin(
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
export async function handleAuthLogin(
  info: parsedHttpRequestData
): Promise<RequestResponse> {
  const username = (info.searchParams.get("username") as string) || "";
  const password = (info.searchParams.get("password") as string) || "";

  if (username === "" || password === "") {
    return generateLoginError(
      "INV-200",
      "Unable to login",
      "https://rusty-motors.com"
    );
  }

  const user = await userLogin(username, password);

  if (!user) {
    return generateLoginError(
      "INV-200",
      "Unable to login",
      "https://rusty-motors.com"
    );
  }

  const token = "abc123";

  return constructLoginResponse(`Valid=TRUE\nTicket=${token}`);
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

export async function deleteUser(username: string): Promise<void> {
  log.debug("Deleting user");
  try {
    await User.destroy({
      where: {
        username,
      },
    });
    log.debug("User deleted");
  } catch (error: unknown) {
    log.error(`Error deleting user: ${(error as Error).message}`);
    throw error;
  }
}
