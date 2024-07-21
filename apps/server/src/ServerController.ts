import * as http from "node:http";
import * as net from "node:net";
import type { NodeServer, TConsoleThread } from "./types.js";
import { emitKeypressEvents } from "node:readline";
import { ConsoleThread } from "./ConsoleThread.js";

class WrappedServer implements NodeServer {
  constructor(private server: net.Server) {}

  async listen(port: number) {
    return new Promise<void>((resolve, reject) => {
      this.server.listen(port, () => {
        resolve();
      });
    });
  }

  async close() {
    return new Promise<void>((resolve, reject) => {
      this.server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

async function httpListener(
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  console.log(
    `New request from ${req.socket.remoteAddress} for ${req.url} with method ${req.method}`
  );
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!\n");
}

async function tcpListener(socket: net.Socket) {
  console.log(
    `New connection from ${socket.remoteAddress} on port ${socket.remotePort} to port ${socket.localPort}`
  );
  socket.end("Hello, World!\n");
}

export class ServerController {
  private httpServer: NodeServer;
  private loginServer: NodeServer;
  private personaServer: NodeServer;
  private lobbyServer: NodeServer;
  private databaseServer: NodeServer;
  private readThread: TConsoleThread;

  private _status: string = "stopped";

  constructor() {
    console.log("ServerController");
    this.httpServer = new WrappedServer(http.createServer(httpListener));
    this.loginServer = new WrappedServer(net.createServer(tcpListener));
    this.personaServer = new WrappedServer(net.createServer(tcpListener));
    this.lobbyServer = new WrappedServer(net.createServer(tcpListener));
    this.databaseServer = new WrappedServer(net.createServer(tcpListener));

    this.readThread = new ConsoleThread();
    this.readThread.on("userExit", () =>
      this.handleReadThreadEvent("userExit")
    );
    this.readThread.on("userRestart", () =>
      this.handleReadThreadEvent("userRestart")
    );
    this.readThread.on("userHelp", () =>
      this.handleReadThreadEvent("userHelp")
    );
  }

  help() {
    console.info("=== Help ===");
    console.info("x: Exit");
    console.info("r: Restart");
    console.info("?: Help");
    console.info("============");
  }

  async exit() {
    // Stop the GatewayServer
    await this.stop();

    // Exit the process
    process.exit(0);
}

  async handleReadThreadEvent(event: string) {
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

  public async start() {
    console.log("ServerController.start");
    this._status = "started";
    await this.httpServer.listen(3000);
    await this.loginServer.listen(8226);
    await this.personaServer.listen(8228);
    await this.lobbyServer.listen(7003);
    await this.databaseServer.listen(43300);
    console.log("Servers started");
  }

  public async stop() {
    console.log("ServerController.stop");
    this._status = "stopped";
    await this.httpServer.close();
    await this.loginServer.close();
    await this.personaServer.close();
    await this.lobbyServer.close();
    await this.databaseServer.close();
    console.log("Servers stopped");
  }

  public async restart() {
        // Stop the GatewayServer
        await this.stop();

        console.info("=== Restarting... ===");

        // Start the GatewayServer
        await this.start();
  }

  public status() {
    console.log("ServerController.status");
    return this._status;
  }
}
