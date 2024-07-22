import { log } from "./Logger.js";

export class AuthController {
  /** @type {AuthController} */
  static _instance: AuthController;

  static getInstance() {
    if (!this._instance) {
      this._instance = new AuthController();
    }
    return this._instance;
  }

  /**
   *
   * @param {import("node:http").IncomingMessage} req
   * @param {import("node:http").ServerResponse} res
   */
  handleRequest(
    req: import("node:http").IncomingMessage,
    res: import("node:http").ServerResponse
  ) {
    log.debug("AuthController.handleConnection");
    log.debug(
      `${req.method} ${req.url} HTTP/${req.httpVersion} ${req.socket.remoteAddress}`
    );
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello, World2!\n");
  }

  /**
   * Handles the incoming HTTP request.
   *
   * @param {import("node:http").IncomingMessage} req - The incoming request object.
   * @param {import("node:http").ServerResponse} res - The server response object.
   */
  static handleRequest(
    req: import("node:http").IncomingMessage,
    res: import("node:http").ServerResponse
  ) {
    return new AuthController().handleRequest(req, res);
  }
}
