import { User, type UserAttributes } from "../models/User.js";
import { log } from "@rusty/util";
import {
  ErrorUserNotFound,
  handleCreateUserError,
} from "../errors.js";
import { validateCredentials } from "../helpers.js";



export async function createUser(
  username: string,
  password: string,
  customerId: number
): Promise<Omit<UserAttributes, "id">> {
  log.debug("AuthLogin.create");

  validateCredentials(username, password);

  log.debug(`Creating user: ${username}`);
  try {
    const user = await User.create({ username, password, customerId });
    log.debug(`User created: ${user ? user.username : "null"}`);
    return { username: user.username, password: user.password, customerId: user.customerId };
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
    customerId: user.customerId,
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
