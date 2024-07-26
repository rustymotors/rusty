import { ErrorMissingCredentials } from "./errors.js";
import type { parsedHttpRequestData } from "./types.js";

/**
 * Extracts the username and password from the parsed HTTP request data.
 * @param info - The parsed HTTP request data.
 * @returns An object containing the extracted username and password.
 */
export function extractCredentials(info: parsedHttpRequestData): {
    username: string;
    password: string;
  } {
    const username = (info.searchParams.get("username") as string) || "";
    const password = (info.searchParams.get("password") as string) || "";
    return { username, password };
  }

/**
 * Validates the provided username and password.
 * @param {string} username - The username to validate.
 * @param {string} password - The password to validate.
 * @throws {ErrorMissingCredentials} If either the username or password is empty.
 */
  export function validateCredentials(username: string, password: string): void {
    if (username === "") {
      throw new ErrorMissingCredentials("Username is required");
    }
  
    if (password === "") {
      throw new ErrorMissingCredentials("Password is required");
    }
  }