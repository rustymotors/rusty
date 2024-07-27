import { log } from "@rusty/util";
import { RouteHandlers } from "./index.js";
import type { rawHttpRequestData, RequestResponse } from "../types.js";

export async function processWebRequests({
  headers,
  remoteAddress,
  method,
  url,
}: rawHttpRequestData): Promise<RequestResponse> {
  log.debug("processWebRequests");

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
  return {
    statusCode: 404,
    body: "Not Found\n",
    headers: { "Content-Type": "text/plain" },
  };
}
