import { log } from "@rusty/util";

export class ErrorMissingCredentials extends Error {
  name = "ErrorMissingCredentials";

  constructor(message: string) {
    super(message);
    this.name = "ErrorMissingCredentials";
  }
}

export class ErrorUserExists extends Error {
  name = "ErrorUserExists";

  constructor(message: string) {
    super(message);
    this.name = "ErrorUserExists";
  }
}

export class ErrorUserNotFound extends Error {
  name = "ErrorUserNotFound";

  constructor(message: string) {
    super(message);
    this.name = "ErrorUserNotFound";
  }
}
/**
 * Handles the error that occurs when creating a user.
 * If the error message indicates that the username must be unique,
 * it throws an ErrorUserExists with the original error as the cause.
 * Otherwise, it throws a generic Error with the original error as the cause.
 *
 * @param error - The error that occurred during user creation.
 * @throws {ErrorUserExists} - If the error message indicates that the username must be unique.
 * @throws {Error} - If the error message does not indicate that the username must be unique.
 * @returns {never} - This function never returns a value.
 */
export function handleCreateUserError(error: unknown): never {
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
