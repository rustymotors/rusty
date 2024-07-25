import * as http from "node:http";
import * as net from "node:net";
import { ConsoleThread } from "./ConsoleThread.js";
import { WrappedServer } from "./WrappedServer.js";
import { exit } from "node:process";
import { log } from "@rusty/util";
import { handleWebRequests } from "@rusty/web";
import { headerstoRecords } from "./headerstoRecords.js";

/**
 *
 * @param {import("node:http").IncomingMessage} req
 * @param {import("node:http").ServerResponse} res
 */
async function handleIncomingRequest(
  req: import("node:http").IncomingMessage,
  res: import("node:http").ServerResponse
) {
  const response = await handleWebRequests({
    headers: headerstoRecords(req.headers),
    remoteAddress: req.socket.remoteAddress || "",
    method: req.method || "",
    url: req.url || "",
  });

  res.writeHead(response.statusCode, response.headers);
  res.end(response.body);
}

/**
 * Handles a connection from a socket.
 *
 * @param {import("node:net").Socket} socket - The socket object representing the connection.
 * @returns {void}
 */
function handleSocketConnection(socket: import("node:net").Socket): void {
  log.debug("LoginController.handleConnection");
  socket.on("data", (data) => {
    log.debug(data.toString());
    socket.end();
  });
}

export class ServerController {
  private _httpServer: WrappedServer;
  private _loginServer: WrappedServer;
  private _personaServer: WrappedServer;
  private _lobbyServer: WrappedServer;
  private _databaseServer: WrappedServer;
  private _readThread: ConsoleThread;

  _status = "stopped";

  constructor() {
    log.debug("ServerController");
    this._httpServer = new WrappedServer(
      http.createServer((req, res) => {
        handleIncomingRequest(req, res).catch((err) => {
          log.error((err as Error).message);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error\n");
        });
      })
    );
    this._loginServer = new WrappedServer(
      net.createServer(handleSocketConnection)
    );
    this._personaServer = new WrappedServer(
      net.createServer(handleSocketConnection)
    );
    this._lobbyServer = new WrappedServer(
      net.createServer(handleSocketConnection)
    );
    this._databaseServer = new WrappedServer(
      net.createServer(handleSocketConnection)
    );

    this._readThread = new ConsoleThread();
    this._readThread.on("userExit", () => {
      void this.handleReadThreadEvent("userExit");
    });
    this._readThread.on("userRestart", () => {
      void this.handleReadThreadEvent("userRestart");
    });
    this._readThread.on("userHelp", () => {
      void this.handleReadThreadEvent("userHelp");
    });
  }

  /**
   * Displays the help menu with available commands.
   */
  help() {
    log.info("=== Help ===");
    log.info("x: Exit");
    log.info("r: Restart");
    log.info("?: Help");
    log.info("============");
  }

  /**
   * Stops the GatewayServer and exits the process.
   * @returns {Promise<void>} A promise that resolves when the server is stopped and the process is exited.
   */
  async exit(): Promise<void> {
    // Stop the GatewayServer
    await this.stop();

    // Exit the process
    exit(0);
  }

  /**
   * Handles the read thread event.
   *
   * @param {string} event - The event to handle.
   * @returns {Promise<void>} - A promise that resolves when the event is handled.
   */
  async handleReadThreadEvent(event: string): Promise<void> {
    if (event === "userExit") {
      await this.exit();
    }
    if (event === "userRestart") {
      await this.restart();
    }
    if (event === "userHelp") {
      this.help();
    }
  }

  /**
   * Starts the server and listens on the specified ports.
   * @returns {Promise<void>} A promise that resolves when the server has started.
   */
  async start(): Promise<void> {
    log.debug("ServerController.start");
    this._status = "started";
    await this._httpServer.listen(3000);
    log.info("HTTP Server started");
    await this._loginServer.listen(8226);
    log.info("Login Server started");
    await this._personaServer.listen(8228);
    log.info("Persona Server started");
    await this._lobbyServer.listen(7003);
    log.info("Lobby Server started");
    await this._databaseServer.listen(43300);
    log.info("Database Server started");
    log.info("Servers started");
  }

  /**
   * Stops the server and closes all associated servers.
   * @returns {Promise<void>} A promise that resolves when the server is stopped.
   */
  async stop(): Promise<void> {
    log.debug("ServerController.stop");
    this._status = "stopped";
    await this._httpServer.close();
    log.info("HTTP Server stopped");
    await this._loginServer.close();
    log.info("Login Server stopped");
    await this._personaServer.close();
    log.info("Persona Server stopped");
    await this._lobbyServer.close();
    log.info("Lobby Server stopped");
    await this._databaseServer.close();
    log.info("Database Server stopped");
    log.info("Servers stopped");
  }

  /**
   * Restarts the server by stopping and then starting the GatewayServer.
   * @returns {Promise<void>} A promise that resolves when the server has been restarted.
   */
  async restart(): Promise<void> {
    // Stop the GatewayServer
    await this.stop();

    log.info("=== Restarting... ===");

    // Start the GatewayServer
    await this.start();
  }
}
