import { log } from "@rusty/util";
import type { parsedHttpRequestData, rawHttpRequestData, RequestResponse } from "./types.js";
import { handleAuthLogin } from "./services/AuthLogin.js";

const RouteHandlers: Record<
  string,
  (info: parsedHttpRequestData) => Promise<{
    statusCode: number;
    body: string;
    headers: Record<string, string>;
  }>
> = {
  "/AuthLogin": handleAuthLogin,
};

export async function handleWebRequests({
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
