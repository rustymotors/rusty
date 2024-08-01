import { log } from "@rusty/util";
import { extractCredentials, validateCredentials } from "../helpers.js";
import { userLogin } from "../services/AuthLogin.js";
import type { parsedHttpRequestData, RequestResponse } from "../types.js";
import { getServerURL } from "@rusty/config";

/**
 * Handles the authentication login process.
 *
 * @param info - The parsed HTTP request data.
 * @returns A promise that resolves to the request response.
 */
export async function authenticateUser(
  info: parsedHttpRequestData
): Promise<RequestResponse> {
  const { username, password } = extractCredentials(info);

  try {
    validateCredentials(username, password);

    await userLogin(username, password);

    // TODO: Implement token generation
    const token = "abc123";

    return constructLoginResponse(`Valid=TRUE\nTicket=${token}`);
  } catch (error: unknown) {
    log.error(`Error validating credentials: ${(error as Error).message}`);
    return generateLoginError("INV-200", "Unable to login", getServerURL());
  }
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
