import { User, type UserAttributes } from "../models/User.js";
import { log } from "@rusty/util";

/**
 * Authenticates a user by their username and password.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Omit<UserAttributes, "id">>} - A promise that resolves to the user attributes (excluding the "id" field).
 * @throws {Error} - If the user is not found.
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
    throw new Error("User not found");
  }

  log.debug("User found");
  return {
    username: user.username,
    password: user.password,
    customerId: user.customerId,
  };
}
