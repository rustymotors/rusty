import type { parsedHttpRequestData } from "../types.js";
import { authenticateUser } from "./processLogin.js";

export const RouteHandlers: Record<
  string,
  (info: parsedHttpRequestData) => Promise<{
    statusCode: number;
    body: string;
    headers: Record<string, string>;
  }>
> = {
  "/AuthLogin": authenticateUser,
};
