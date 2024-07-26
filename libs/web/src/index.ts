import { log } from "@rusty/util";
import type { rawHttpRequestData, RequestResponse } from "./types.js";
import { RouteHandlers } from "./processors/index.js";
export { User } from "./models/User.js";
export type { UserAttributes } from "./models/User.js";

export async function processWebRequests({
  headers,
  remoteAddress,
  method,
  url,
}: rawHttpRequestData): Promise<RequestResponse> {
  log.debug("web.handleWebRequests");

  const { pathname, searchParams } = new URL(url, "http://localhost");

  log.debug(
    `method: ${method} pathname: ${pathname} searchParams: ${searchParams.toString()}`
  );

  const handler = RouteHandlers[pathname];

  if (handler) {
    log.debug(`handler: ${handler.name}`);
    return await handler({
      headers,
      remoteAddress,
      method,
      pathname,
      searchParams,
    });
  }

  log.debug("handler not found");
  return new Promise((resolve) => {
    resolve({
      statusCode: 404,
      body: "Not Found\n",
      headers: { "Content-Type": "text/plain" },
    });
  });
}
