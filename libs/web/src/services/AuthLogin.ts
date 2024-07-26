import { User, type UserAttributes } from "../models/User.js";
import type { parsedHttpRequestData, RequestResponse } from "../types.js";
import { log } from "@rusty/util";
import {
  ErrorMissingCredentials,
  ErrorUserNotFound,
  handleCreateUserError,
} from "../errors.js";

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
    const user = await User.create({ username, password });
    log.debug(`User created: ${user ? user.username : "null"}`);
    return { username: user.username, password: user.password };
  } catch (error: unknown) {
    handleCreateUserError(error);
  }
}

/**
 * Authenticates a user by their username and password.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Omit<UserAttributes, "id">>} - A promise that resolves to the user attributes (excluding the "id" field).
 * @throws {ErrorUserNotFound} - If the user is not found.
 */
export async function userLogin(
  username: string,
  password: string
): Promise<Omit<UserAttributes, "id">> {
  log.debug("AuthLogin.login");
  log.debug(`Searching for user: ${username}`);
  const user = await User.findOne({
    where: {
      username,
      password,
    },
  });

  if (!user) {
    throw new ErrorUserNotFound("User not found");
  }

  log.debug("User found");
  return {
    username: user.username,
    password: user.password,
  };
}
/**
 * Handles the authentication login process.
 *
 * @param info - The parsed HTTP request data.
 * @returns A promise that resolves to the request response.
 */
export async function handleAuthLogin(
  info: parsedHttpRequestData
): Promise<RequestResponse> {
  const { username, password } = extractCredentials(info);

  try {
    validateCredentials(username, password);

    await userLogin(username, password);

    const token = "abc123";

    return constructLoginResponse(`Valid=TRUE\nTicket=${token}`);
  } catch (error: unknown) {
    log.error(`Error validating credentials: ${(error as Error).message}`);
    return generateLoginError(
      "INV-200",
      "Unable to login",
      "https://rusty-motors.com"
    );
  }
}

/**
 * Extracts the username and password from the parsed HTTP request data.
 * @param info - The parsed HTTP request data.
 * @returns An object containing the extracted username and password.
 */
function extractCredentials(info: parsedHttpRequestData): {
  username: string;
  password: string;
} {
  const username = (info.searchParams.get("username") as string) || "";
  const password = (info.searchParams.get("password") as string) || "";
  return { username, password };
}

/**
 * Constructs a login response object.
 * @param body - The response body.
 * @returns The constructed login response object.
 */
function constructLoginResponse(body = ""): RequestResponse {
  return {
    statusCode: 200,
    body,
    headers: { "Content-Type": "text/plain" },
  };
}

/**
 * Generates a login error response.
 *
 * @param errorCode - The error code. Default is "INV-200".
 * @param errorText - The error text. Default is "Unable to login".
 * @param errorUrl - The error URL. Default is "https://rusty-motors.com".
 * @returns The login error response.
 */
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

/**
 * Deletes a user from the database.
 *
 * @param username - The username of the user to delete.
 * @returns A Promise that resolves when the user is successfully deleted.
 * @throws If there is an error deleting the user.
 */
export async function deleteUser(username: string): Promise<number> {
  log.debug("Deleting user");
  return await User.destroy({
    where: {
      username,
    },
  });
}
