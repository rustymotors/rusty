import { log } from "@rusty/util";

export function handleWebRequests({
    headers,
    remoteAddress,
    method,
    url,
    query,
}: {
    headers: Record<string, string>;
    remoteAddress: string;
    method: string;
    url: string;
    query: Record<string, string>;
}): {
    statusCode: number;
    body: string;
    headers: Record<string, string>;
} {
    log.debug("AuthController.handleConnection");
    log.debug(`${method} ${url} ${remoteAddress}`);
    return {
        statusCode: 200,
        body: "Hello, World4!\n",
        headers: { "Content-Type": "text/plain" },
    };
}
